import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MarketShareChart = ({ cryptoData }) => {
  // Limit to top 5 for better visibility in small chart
  const top5Coins = cryptoData.slice(0, 5);
  const otherCoins = cryptoData.slice(5);
  
  // Calculate "Others" market cap if there are more than 5 coins
  const otherMarketCap = otherCoins.reduce((sum, coin) => sum + coin.market_cap, 0);
  
  // Theme-appropriate colors
  const themeColors = [
    '#58a6ff', // Primary blue
    '#16c784', // Green (from positive sentiment)
    '#ea3943', // Red (from negative sentiment)
    '#9966FF', // Purple
    '#FF9F40', // Orange
    '#30363d'  // Gray (for Others)
  ];

  const chartData = {
    labels: [
      ...top5Coins.map(coin => coin.symbol.toUpperCase()),
      otherMarketCap > 0 ? 'Others' : null
    ].filter(Boolean),
    
    datasets: [
      {
        label: 'Market Share',
        data: [
          ...top5Coins.map(coin => coin.market_cap),
          otherMarketCap > 0 ? otherMarketCap : null
        ].filter(Boolean),
        backgroundColor: themeColors,
        borderColor: '#0d1117',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          color: '#e6edf3',
          font: {
            size: 10
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return chart.data.labels.map((label, i) => {
              const coinData = i < top5Coins.length ? top5Coins[i] : null;
              
              // Calculate percentage
              const value = datasets[0].data[i];
              const total = datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              
              return {
                text: coinData ? 
                  `${label} (€${coinData.current_price.toFixed(2)}) (${percentage}%)` : 
                  `Others (${percentage}%)`,
                fillStyle: datasets[0].backgroundColor[i],
                hidden: false,
                index: i
              };
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return ` ${context.label}: €${(value/1000000000).toFixed(2)}B (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',
  };

  return (
    <div className="compact-chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default MarketShareChart;