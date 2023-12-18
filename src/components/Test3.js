import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import "chartjs-plugin-zoom";

const ChartComponent = () => {
	const chartRef = useRef(null);

	useEffect(() => {
		// Generate dummy data for 1000 points
		const labels = Array.from(
			{ length: 8 },
			(_, index) => `Category ${index + 1}`
		);
		const data = Array.from(
			{ length: 1000 },
			() => Math.floor(Math.random() * 10) + 1
		);

		const groupedData = Array.from({ length: 8 }, (_, index) => {
			const start = index * 125;
			const end = (index + 1) * 125 - 1;
			return data.slice(start, end + 1);
		});

		const chartInstance = chartRef.current;
		if (chartInstance) {
			const myChart = new Chart(chartInstance, {
				type: "bar",
				data: {
					labels,
					datasets: [
						{
							label: "Data",
							data: groupedData[0], // Display data for the first category initially
							backgroundColor: "rgba(54, 162, 235, 0.5)",
							borderColor: "rgba(54, 162, 235, 1)",
							borderWidth: 1,
						},
					],
				},
				options: {
					scales: {
						x: {
							offset: true,
							categoryPercentage: 0.1, // Adjust the spacing between bars
						},
						y: {
							beginAtZero: true, // Start y-axis from zero
						},
					},
					plugins: {
						zoom: {
							pan: {
								enabled: true,
								mode: "x",
							},
							zoom: {
								wheel: {
									enabled: true,
								},
								pinch: {
									enabled: true,
								},
								mode: "x",
							},
						},
					},
				},
			});
			// Update chart data when panning
			chartInstance.updateChartData = (startIndex) => {
				myChart.data.datasets[0].data = groupedData[startIndex];
				myChart.update();
			};
		}
	}, []);

	return (
		<div>
			<canvas ref={chartRef} width={800} height={400}></canvas>
		</div>
	);
};

export default ChartComponent;
