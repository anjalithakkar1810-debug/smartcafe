import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SalesChart = ({ orders }) => {

    const revenueByDate = {};

    orders.forEach((order) => {

        if (order.status !== "served") return;

        const date = new Date(order.createdAt).toLocaleDateString();

        revenueByDate[date] =
            (revenueByDate[date] || 0) + order.totalAmount;
    });

    const labels = Object.keys(revenueByDate);

    const data = {
        labels,
        datasets: [
            {
                label: "Revenue (₹)",
                data: Object.values(revenueByDate),
                borderColor: "#f4b400",
                backgroundColor: "rgba(244,180,0,0.25)",
                tension: 0.4,
                fill: true,
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
                📈 Daily Revenue
            </h3>

            <Line data={data} />
        </div>
    );
};

export default SalesChart;