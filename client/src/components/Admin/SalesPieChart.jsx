import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const SalesPieChart = ({ orders }) => {

    const categorySales = {};

    orders.forEach(order => {

        if (order.status !== "served") return;

        order.items.forEach(item => {

            const category =
                item.menuItem?.category || "Others";

            categorySales[category] =
                (categorySales[category] || 0) +
                item.quantity;

        });

    });

    const data = {
        labels: Object.keys(categorySales),
        datasets: [
            {
                label: "Items Sold",
                data: Object.values(categorySales),
                backgroundColor: [
                    "#f4b400",
                    "#34a853",
                    "#4285f4",
                    "#ea4335",
                    "#9c27b0",
                    "#00bcd4",
                ],
            },
        ],
    };

    return (
        <div
            className="card"
            style={{
                marginTop: "30px",
                padding: "20px",
            }}
        >
            <h3 style={{ marginBottom: "20px" }}>
                🥧 Category Sales
            </h3>

            <Pie data={data} />
        </div>
    );
};

export default SalesPieChart;