import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import "chartjs-plugin-zoom";

const LazyLoadingChart = () => {
	const chartContainer = useRef(null);
	const [chart, setChart] = useState(null);
	const totalDataPoints = 30000;
	const initialLoad = 1000;

	// Function to generate a subset of data
	const fetchData = (start, end) => {
		return Array.from({ length: end - start }, (_, i) => ({
			x: start + i,
			y: Math.random() * 10, // Replace with actual data logic
		}));
	};

	// Function to update the chart with new data
	const updateChartData = (chart, min, max) => {
		const newData = fetchData(min, Math.min(max, totalDataPoints));
		chart.data.datasets[0].data = newData;
		chart.update();
	};

	useEffect(() => {
		const zoomOptions = {
			pan: {
				enabled: true,
				mode: "x",
				onPan: ({ chart }) => {
					const { min, max } = chart.scales.x;
					updateChartData(chart, min, max);
				},
			},
			zoom: {
				wheel: { enabled: true },
				mode: "x",
				onZoom: ({ chart }) => {
					const { min, max } = chart.scales.x;
					updateChartData(chart, min, max);
				},
			},
		};

		const initialData = fetchData(0, initialLoad);

		const config = {
			type: "bar",
			data: {
				datasets: [
					{
						label: "Dataset",
						backgroundColor: "rgba(0, 123, 255, 0.5)",
						borderColor: "rgba(0, 123, 255, 1)",
						borderWidth: 1,
						data: initialData,
					},
				],
			},
			options: {
				scales: {
					x: {
						type: "linear",
						position: "bottom",
					},
					y: {
						beginAtZero: true,
					},
				},
				plugins: {
					zoom: zoomOptions,
				},
			},
		};

		const newChart = new Chart(chartContainer.current.getContext("2d"), config);
		setChart(newChart);

		return () => {
			newChart.destroy();
		};
	}, []);

	return (
		<div>
			<canvas ref={chartContainer} width="800" height="400"></canvas>
		</div>
	);
};

export default LazyLoadingChart;
