import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { useDispatch } from "react-redux";
import { resetChart } from "../features/genome/genomeSlice";
Chart.register(zoomPlugin);

function BarChart({ data }) {
	const chartRef = useRef();
	const dispatch = useDispatch();

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
								max: 4,
							},
						},
						responsive: true,
						maintainAspectRatio: true,
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
								pan: {
									enabled: true,
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

	const handleReset = () => {
		dispatch(resetChart());
	};
	return (
		<div>
			<button
				className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
				onClick={handleReset}
			>
				reset
			</button>
			<canvas ref={chartRef} />;
		</div>
	);
}

function getColorForNucleotide(nucleotide) {
	const colorMap = {
		A: "#FF5733",
		C: "#3399FF",
		T: "#33CC33",
		G: "#9966FF",
	};

	return colorMap[nucleotide] || "#000000";
}

export default BarChart;
