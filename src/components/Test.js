import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import "chartjs-plugin-zoom";

const ZoomChart = () => {
	const chartContainer = useRef(null);
	let timer;

	useEffect(() => {
		const zoomOptions = {
			limits: {
				x: { min: 0, max: 3000 },
			},
			pan: {
				enabled: true,
				mode: "x",
				modifierKey: "ctrl",
				onPanComplete: startFetch,
			},
			zoom: {
				wheel: {
					enabled: true,
				},
				pinch: {
					enabled: true,
				},
				mode: "x",
				onZoomComplete: startFetch,
			},
		};

		const generateData = () => {
			return Array.from({ length: 3000 }, (_, i) => ({
				x: i,
				y: Math.floor(Math.random() * 11),
			}));
		};
		const takeData = (min, max) => {
			console.log("min-max: ", min, max);
		};
		function startFetch({ chart }) {
			const { min, max } = chart.scales.x;
			console.log(chart.scales.x);
			clearTimeout(timer);
			timer = setTimeout(() => {
				console.log("Fetched data between " + min + " and " + max);
				// chart.data.datasets[0].data = takeData(min, max);
				// chart.stop(); // make sure animations are not running
				// chart.update("none");
			}, 500);
		}

		const config = {
			type: "bar",
			data: {
				datasets: [
					{
						label: "Random Data",
						backgroundColor: "rgba(75, 192, 192, 0.2)",
						borderColor: "rgba(75, 192, 192, 1)",
						borderWidth: 1,
						data: generateData(),
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

		const ctx = chartContainer.current.getContext("2d");
		new Chart(ctx, config);
	}, []);

	return (
		<div>
			<canvas ref={chartContainer} width="800" height="400"></canvas>
		</div>
	);
};

export default ZoomChart;
