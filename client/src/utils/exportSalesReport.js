import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const exportSalesReport = (stats, orders) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("SmartCafe Sales Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`Total Revenue : Rs. ${stats.totalRevenue}`, 14, 35);
    doc.text(`Total Orders : ${stats.totalOrders}`, 14, 45);
    doc.text(`Average Rating : ${stats.averageRating}`, 14, 55);
    doc.text(`Top Selling Item : ${stats.topSellingItem}`, 14, 65);

    autoTable(doc, {
        startY: 80,
        head: [["Table", "Items", "Amount", "Status"]],
        body: orders.map(order => [
            order.tableNumber,
            order.items.length,
            `Rs. ${order.totalAmount}`,
            order.status
        ])
    });

    doc.save("SmartCafe-Sales-Report.pdf");
};

export default exportSalesReport;