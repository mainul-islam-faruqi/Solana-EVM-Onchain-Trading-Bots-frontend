import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  scales: {
    y: {
      grid: {
        color: 'rgba(139, 92, 246, 0.1)',
      },
      ticks: {
        color: 'rgba(139, 92, 246, 0.8)',
      }
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgba(139, 92, 246, 0.8)',
        maxRotation: 0,
      }
    }
  },
  plugins: {
    legend: {
      display: false,
    }
  }
}; 