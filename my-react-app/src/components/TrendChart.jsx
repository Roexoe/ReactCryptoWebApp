import { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler);

const TrendChart = ({ sparklineData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Check if sparklineData is valid
    if (!sparklineData || sparklineData.length === 0) {
      console.error('Invalid sparkline data:', sparklineData);
      return;
    }
    
    console.log('Creating chart with data:', sparklineData);
    
    const ctx = chartRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(75,192,192,0.4)');
    gradient.addColorStop(1, 'rgba(75,192,192,0)');
    
    const isPositiveTrend = sparklineData[sparklineData.length - 1] > sparklineData[0];
    const borderColor = isPositiveTrend ? '#16c784' : '#ea3943'; // Green for positive, red for negative
    
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: sparklineData.map((_, index) => index),
        datasets: [
          {
            data: sparklineData,
            borderColor: borderColor,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4, // Smooth line
            borderWidth: 2, // Make the line more visible
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

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default TrendChart;