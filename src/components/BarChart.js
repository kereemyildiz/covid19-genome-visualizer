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
				const labels = data.map((entry) => `${entry.pos}-${entry.nucleotide}`);
				const datasets = Object.keys(data[0].mutationPoss).map(
					(nucleotide) => ({
						label: nucleotide,
						data: data.map((entry) => entry.mutationPoss[nucleotide]),
						borderColor: getColorForNucleotide(nucleotide),
						backgroundColor: getColorForNucleotide(nucleotide),
						stack: "stack", // Add this line to stack the bars
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
								max: 3,
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

function getColorForNucleotide(nucleotide) {
	// Define colors for A, C, T, G
	const colorMap = {
		A: "#FF5733", // Replace with your color for A
		C: "#3399FF", // Replace with your color for C
		T: "#33CC33", // Replace with your color for T
		G: "#9966FF", // Replace with your color for G
	};

	// Return the color for the given nucleotide
	return colorMap[nucleotide] || "#000000"; // Default to black if color not found
}

export default BarChart;
