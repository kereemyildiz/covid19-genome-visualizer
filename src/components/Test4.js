import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const MyChart = () => {
	// Generate random data points
	const dataPoints = Array.from(
		{ length: 365 },
		() => Math.floor(Math.random() * 10) + 1
	);

	// Labels for the months
	const monthLabels = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	// Map data to Chart.js format
	const data = {
		labels: monthLabels,
		datasets: [
			{
				label: "Daily Values",
				data: dataPoints,
				fill: false,
				borderColor: "rgb(75, 192, 192)",
				tension: 0.1,
			},
		],
	};

	// Options for Chart.js
	const options = {
		scales: {
			x: {
				type: "time",
				time: {
					unit: "month",
				},
			},
		},
	};

	return <Line data={data} options={options} />;
};

export default MyChart;
