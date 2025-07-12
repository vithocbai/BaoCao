import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const RevenueChart = ({ data }) => {
    return (
        <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => value.toLocaleString()} />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} ₫`} />
                    <Bar dataKey="revenue" fill="#3498db" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueChart;
