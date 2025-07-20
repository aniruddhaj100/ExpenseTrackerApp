import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

function PieChart({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;
        if (!chartInstance.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }
        // Format data to 2 decimals
        const formattedData = (data || []).map(d => ({
            ...d,
            value: Number(d.value).toFixed(2)
        }));
        const option = {
            tooltip: {
                trigger: 'item',
                backgroundColor: '#222',
                borderColor: '#2563eb',
                textStyle: { color: '#fff', fontSize: 15 },
                formatter: function(params) {
                    return `<span style='color:#2563eb;font-weight:bold;'>${params.name}</span>: ₹${Number(params.value).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} (${params.percent}%)`;
                },
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                top: 'center',
                textStyle: { fontSize: 15, color: '#222', fontWeight: 600 },
                icon: 'circle',
            },
            series: [
                {
                    name: 'Expenses',
                    type: 'pie',
                    radius: ['45%', '80%'],
                    avoidLabelOverlap: false,
                    roseType: 'radius',
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 3,
                        shadowBlur: 18,
                        shadowColor: 'rgba(37,99,235,0.18)',
                    },
                    label: {
                        show: true,
                        position: 'outside',
                        formatter: function(params) {
                            return `${params.name}: ₹${Number(params.value).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
                        },
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#222',
                        shadowColor: '#fff',
                        shadowBlur: 2,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#2563eb',
                            formatter: function(params) {
                                return `${params.name}\n₹${Number(params.value).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
                            },
                        },
                    },
                    labelLine: {
                        show: true,
                        length: 18,
                        length2: 12,
                        lineStyle: {
                            color: '#2563eb',
                            width: 2,
                        },
                    },
                    data: formattedData,
                    // 3D effect simulation with shadow and roseType
                    zlevel: 2,
                },
            ],
            backgroundColor: 'rgba(248,250,252,0.7)',
        };
        chartInstance.current.setOption(option);
        return () => {
            chartInstance.current && chartInstance.current.dispose();
            chartInstance.current = null;
        };
    }, [data]);

    return <div ref={chartRef} style={{ width: '100%', height: 320 }} />;
}

export default PieChart;
