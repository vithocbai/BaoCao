import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from './RevenueChart.module.scss';

const data = [
    { month: 'T1', revenue: 120 },
    { month: 'T2', revenue: 210 },
    { month: 'T3', revenue: 350 },
    { month: 'T4', revenue: 420 },
    { month: 'T5', revenue: 380 },
    { month: 'T6', revenue: 500 },
];

const RevenueChart = () => {
    return (
        <div className={styles.chartWrapper}>
            <h3>Doanh thu theo tháng</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis unit="tr" />
                    <Tooltip />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;
