import { useEffect, useRef, useState } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { getCryptoList } from '../services/api';

// Register required Chart.js components
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const MarketShareChart = ({ title = "Market Capitalization Distribution" }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setIsLoading(true);
        const cryptoData = await getCryptoList();
        
        if (!cryptoData || cryptoData.length === 0) {
          throw new Error("No cryptocurrency data available");
        }
        
        // Sort data by market cap (descending)
        const sortedData = [...cryptoData].sort((a, b) => b.market_cap - a.market_cap);
        
        // Take top 9 coins
        const topCoins = sortedData.slice(0, 9);
        
        // Calculate market cap of all other coins
        const otherCoinsMarketCap = sortedData
          .slice(9)
          .reduce((sum, coin) => sum + coin.market_cap, 0);
        
        // Prepare data for chart
        const labels = [...topCoins.map(coin => coin.name), 'Others'];
        const marketCaps = [...topCoins.map(coin => coin.market_cap), otherCoinsMarketCap];
        
        // Generate color palette (matching your theme)
        const colorPalette = [
          '#58a6ff', '#16c784', '#ea3943', '#f2a900', '#8b949e', 
          '#d29922', '#844fba', '#00aeff', '#ff9900', '#30363d'
        ];

        // Create the chart
        createChart(labels, marketCaps, colorPalette);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching market cap data:', error);
        setError('Failed to load market capitalization data');
        setIsLoading(false);
      }
    };

    fetchCryptoData();

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const createChart = (labels, data, colors) => {
    const ctx = chartRef.current.getContext('2d');
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Format the market caps for display
    const formattedMarketCaps = data.map(cap => {
      if (cap >= 1000000000000) return `$${(cap / 1000000000000).toFixed(2)}T`;
      if (cap >= 1000000000) return `$${(cap / 1000000000).toFixed(2)}B`;
      if (cap >= 1000000) return `$${(cap / 1000000).toFixed(2)}M`;
      return `$${cap.toLocaleString()}`;
    });
    
    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            borderColor: '#0d1117',
            borderWidth: 3,
            hoverOffset: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#e6edf3',
              padding: 15,
              usePointStyle: true,
              font: {
                size: 12,
                family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto"
              }
            }
          },
          tooltip: {
            backgroundColor: '#161b22',
            titleColor: '#e6edf3',
            bodyColor: '#e6edf3',
            borderColor: '#30363d',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = formattedMarketCaps[context.dataIndex];
                const percentage = ((context.raw / data.reduce((a, b) => a + b, 0)) * 100).toFixed(2);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
  };

  return (
    <div className="market-share-chart-container">
      <h2>{title}</h2>
      <div className="chart-wrapper">
        {isLoading && <div className="chart-loader">Loading market data...</div>}
        {error && <div className="chart-error">{error}</div>}
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default MarketShareChart;