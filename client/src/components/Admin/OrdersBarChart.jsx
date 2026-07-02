import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const OrdersBarChart = ({ orders }) => {
    const data = {};

    orders.forEach((order) => {
        const day = new Date(order.createdAt).toLocaleDateString();

        data[day] = (data[day] || 0) + 1;
    });

    const chartData = Object.keys(data).map((day) => ({
        day,
        orders: data[day],
    }));

    return (
        <div className="card">
            <h3 style={{ marginBottom: 20 }}>📦 Orders Per Day</h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OrdersBarChart;