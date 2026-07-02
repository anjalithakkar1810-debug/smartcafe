import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoice = (order) => {
    const doc = new jsPDF();

    // ===== Title =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("SmartCafe Invoice", 14, 20);

    // ===== Order Details =====
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`Order ID: ${order._id.slice(-6).toUpperCase()}`, 14, 35);
    doc.text(`Table No: ${order.tableNumber}`, 14, 45);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 55);

    // ===== Items Table =====
    autoTable(doc, {
        startY: 60,
        head: [["Item", "Qty", "Price"]],

        body: order.items.map((item) => [
            item.menuItem?.name || "Item",
            item.quantity,
            `Rs. ${item.menuItem?.price * item.quantity}`,
        ]),

        theme: "grid",

        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            halign: "center",
        },

        bodyStyles: {
            halign: "center",
        },

        columnStyles: {
            0: { halign: "left" },     // Item
            1: { halign: "center" },   // Qty
            2: { halign: "center" },   // Price
        },
    });

    // ===== Grand Total =====
    const finalY = doc.lastAutoTable.finalY + 15;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Grand Total: Rs. ${order.totalAmount}`, 14, finalY);

    // ===== Footer =====
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text("Thank you for visiting SmartCafe!", 14, finalY + 15);
    doc.text("Visit Again!", 14, finalY + 23);

    // ===== Save =====
    doc.save(`Invoice-${order._id.slice(-6).toUpperCase()}.pdf`);
};

export default generateInvoice;