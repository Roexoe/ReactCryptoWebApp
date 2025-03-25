import { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler, Tooltip } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler, Tooltip);

// Voeg een "compact" prop toe die standaard op false staat
const TrendChart = ({ sparklineData, timestamps, timeframe, compact = false }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Check if sparklineData is valid
    if (!sparklineData || sparklineData.length === 0) {
      console.error('Invalid sparkline data:', sparklineData);
      return;
    }
    
    const ctx = chartRef.current.getContext('2d');
    
    // Bepaal of de trend positief of negatief is
    const isPositiveTrend = sparklineData[sparklineData.length - 1] > sparklineData[0];
    const lineColor = isPositiveTrend ? '#16c784' : '#ea3943'; // Groen voor positief, rood voor negatief
    
    // Maak een gradient voor onder de lijn
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    if (isPositiveTrend) {
      // Groene gradient voor positieve trend
      gradient.addColorStop(0, 'rgba(22, 199, 132, 0.3)');
      gradient.addColorStop(1, 'rgba(22, 199, 132, 0)');
    } else {
      // Rode gradient voor negatieve trend
      gradient.addColorStop(0, 'rgba(234, 57, 67, 0.3)');
      gradient.addColorStop(1, 'rgba(234, 57, 67, 0)');
    }
    
    // Genereer gesimplificeerde labels voor de x-as
    const generateSimplifiedLabels = (dataLength, timeframe) => {
      const labels = [];
      
      if (timeframe === '7d') {
        // Voor 7 dagen grafiek, toon dagen
        for (let i = 0; i < dataLength; i++) {
          const day = 7 - Math.floor((i / dataLength) * 7);
          if (i === 0) labels.push(`7d geleden`);
          else if (i === Math.floor(dataLength / 2)) labels.push(`${day}d geleden`);
          else if (i === dataLength - 1) labels.push('Nu');
          else labels.push('');
        }
      } else {
        // Voor 30 dagen grafiek, toon weken
        for (let i = 0; i < dataLength; i++) {
          const day = 30 - Math.floor((i / dataLength) * 30);
          if (i === 0) labels.push(`30d geleden`);
          else if (i === Math.floor(dataLength / 4)) labels.push(`${day}d geleden`);
          else if (i === Math.floor(dataLength / 2)) labels.push(`${day}d geleden`);
          else if (i === Math.floor(dataLength * 3 / 4)) labels.push(`${day}d geleden`);
          else if (i === dataLength - 1) labels.push('Nu');
          else labels.push('');
        }
      }
      
      return labels;
    };
    
    const simplifiedLabels = generateSimplifiedLabels(sparklineData.length, sparklineData.length <= 200 ? '7d' : '30d');
    
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: simplifiedLabels,
        datasets: [
          {
            data: sparklineData,
            borderColor: lineColor,
            backgroundColor: gradient,
            fill: true,
            tension: 0.01,
            borderWidth: compact ? 1.5 : 2, // Dunnere lijn in compact mode
            pointRadius: 0,
            pointHoverRadius: compact ? 0 : 5, // Geen hover punten in compact mode
            pointHoverBackgroundColor: lineColor,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // Vergroot de padding voor compact modus om meer ruimte voor de grafiek te maken
        layout: {
          padding: compact ? 0 : 8
        },
        scales: {
          x: {
            display: !compact, // Verberg x-as in compact mode
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: '#8b949e',
              font: {
                size: 10
              },
              maxRotation: 0
            }
          },
          y: {
            display: !compact, // Verberg y-as in compact mode
            position: 'right',
            grid: {
              color: 'rgba(48, 54, 61, 0.5)',
              drawBorder: false,
            },
            ticks: {
              color: '#8b949e',
              font: {
                size: 10
              },
              callback: function(value) {
                return '€' + value.toLocaleString();
              }
            }
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: !compact, // Verberg tooltips in compact mode
            mode: 'index',
            intersect: false,
            backgroundColor: '#21262d',
            titleColor: '#e6edf3',
            bodyColor: '#e6edf3',
            borderColor: '#30363d',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: function(tooltipItems) {
                return `Prijs`;
              },
              label: function(context) {
                return '€' + context.parsed.y.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6
                });
              }
            }
          }
        },
        // Verberg interacties in compact mode
        interaction: {
          mode: compact ? 'nearest' : 'index',
          intersect: compact,
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [sparklineData, timestamps, timeframe, compact]);

  return <canvas ref={chartRef} />;
};

export default TrendChart;