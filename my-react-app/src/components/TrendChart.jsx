import { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const TrendChart = ({ sparklineData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(75,192,192,1)');
    gradient.addColorStop(1, 'rgba(75,192,192,0)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sparklineData.map((_, index) => index),
        datasets: [
          {
            data: sparklineData,
            borderColor: sparklineData[sparklineData.length - 1] > sparklineData[0] ? 'green' : 'red',
            backgroundColor: gradient,
            fill: false,
            tension: 1, // Smooth line
            borderWidth: 2, // Make the line thinner
            pointRadius: 0, // Remove the points
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [sparklineData]);

  return <canvas ref={chartRef} />;
};

export default TrendChart;