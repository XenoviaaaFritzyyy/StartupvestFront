import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { CircularProgress, Box, Typography } from '@mui/material';

// Register chart elements
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserRegistrationChart = () => {
  const currentYear = new Date().getFullYear();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(currentYear);

  // Years for the dropdown from current year to 4 years back
  const availableYears = Array.from({ length: 5 }, (val, index) => currentYear - index);

  useEffect(() => {
    const fetchUserRegistrations = async () => {
      try {
        const url = `${process.env.API_URL}/users/registrations-by-month?year=${year}`; // Adjust the API URL as necessary

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = response.data;
        const labels = data.map(item => {
          const date = new Date(item.month);
          return date.toLocaleString('default', { month: 'short', year: 'numeric' });
        });
        const counts = data.map(item => item.count); // Assuming your API returns a count of registrations

        setChartData({
          labels,
          datasets: [
            {
              label: `User Registrations for ${year}`,
              data: counts,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: (ctx) => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(75, 192, 192, 0.5)');
                gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');
                return gradient;
              },
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointHoverRadius: 7,
              pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
              pointHoverBackgroundColor: '#fff',
            },
          ],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user registration data:', error);
        setLoading(false);
      }
    };

    fetchUserRegistrations();
  }, [year]); // Add year to the dependency array if you implement year selection later

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>Loading data...</Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
              },
              title: {
                display: true,
                text: 'Months',
                font: {
                  size: 14,
                },
              },
            },
            y: {
              grid: {
                color: 'rgba(200, 200, 200, 0.2)',
              },
              title: {
                display: true,
                text: 'Number of Registrations',
                font: {
                  size: 14,
                },
              },
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 20,
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                },
              },
              backgroundColor: 'rgba(75, 192, 192, 0.8)',
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 12,
              },
              padding: 10,
              borderColor: '#fff',
              borderWidth: 1,
            },
          },
          layout: {
            padding: {
              left: 20,
              right: 40,
            },
          },
        }}
      />
    </Box>
  );
};

export default UserRegistrationChart;
