import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin);

function BarChart({ data }) {
	const chartRef = useRef();

	useEffect(() => {
		const currentChartRef = chartRef.current;

		if (currentChartRef) {
			const ctx = currentChartRef.getContext("2d");

			if (ctx) {
				const labels = data.map((entry) => entry.pos);
				const datasets = Object.keys(data[0].mutationPoss).map(
					(nucleotide) => ({
						label: nucleotide,
						data: data.map((entry) => entry.mutationPoss[nucleotide]),
						borderColor: getRandomColor(),
						backgroundColor: getRandomColor(),
					})
				);

				const chart = new Chart(ctx, {
					type: "bar",
					data: {
						labels,
						datasets,
					},
					options: {
						scales: {
							y: {
								beginAtZero: true,
								max: 1,
							},
						},
						plugins: {
							zoom: {
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

				// Dispose of the chart when the component is unmounted
				return () => chart.destroy();
			} else {
				console.error("getContext() returned null.");
			}
		} else {
			console.error("chartRef.current is null or undefined.");
		}
	}, [data]);

	return <canvas ref={chartRef} />;
}

function getRandomColor() {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

export default BarChart;
