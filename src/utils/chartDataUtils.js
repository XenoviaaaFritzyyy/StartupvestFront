export const createChartData = (data) => {
    const labels = data.map((item) => item.month);
    const totals = data.map((item) => item.total);

    return {
        labels,
        datasets: [
            {
                label: 'Total Funding Raised',
                data: totals,
                borderColor: '#36a2eb',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: '#ff6384',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#ff6384',
                pointHoverBorderColor: '#fff',
                tension: 0.4,
            },
        ],
    };
};
