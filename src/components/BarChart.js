import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { useDispatch, useSelector } from "react-redux";
import { resetChart } from "../features/genome/genomeSlice";
import { proteinRegionColorMap } from "../utils/proteinRegionColorMap";
import { proteinRegions } from "../data/proteinRegions";
Chart.register(zoomPlugin);

function chunkAndAverageData(data, chunkSize) {
	const chunkedData = [];
	for (let i = 0; i < data.length; i += chunkSize) {
		let chunk = data.slice(i, i + chunkSize);
		let sum = chunk.reduce((acc, { A, T, G, C }) => acc + A + T + G + C, 0);
		let avg = sum / chunkSize;
		chunkedData.push(avg);
	}
	return chunkedData;
}

function BarChart({ data }) {
	const chartRef = useRef();
	const dispatch = useDispatch();
	const chartTitle = useSelector((state) => state.genome.chartTitle);
	const isWholeSequenceSelected = useSelector(
		(state) => state.genome.isWholeSequenceSelected
	);

	useEffect(() => {
		const currentChartRef = chartRef.current;
		const chunkSize = 30;
		const chunkedData = chunkAndAverageData(data, chunkSize);

		if (currentChartRef) {
			const ctx = currentChartRef.getContext("2d");

			if (ctx) {
				const labels = data.map((entry) => `${entry.pos}-${entry.nucleotide}`);
				const labels2 = data.map(
					(entry) => `${entry.pos}-${entry.nucleotide}-${entry.proteinRegion}`
				);

				const datasets = Object.keys(data[0].mutationPoss).map(
					(nucleotide) => ({
						label: nucleotide,
						data: data.map((entry) => entry.mutationPoss[nucleotide]),
						borderColor: getColorForNucleotide(nucleotide),
						backgroundColor: getColorForNucleotide(nucleotide),
						stack: "stack",
					})
				);

				// console.log("1111:");
				// console.log(labels);
				// console.log(datasets);
				const chart = new Chart(ctx, {
					type: "bar",
					data: {
						labels,
						datasets,
					},
					options: {
						scales: {
							x: {
								id: "xAxis1",
								type: "category",
								ticks: {
									callback: function (val, index) {
										// Hide the label of every 2nd dataset
										const label = this.getLabelForValue(val);
										return label.split("-")[1];
									},
								},
							},
							x2: {
								id: "xAxis2",
								type: "category",
								gridLines: {
									display: false,
								},
								labels: labels2,
								ticks: {
									autoSkip: true,
									callback: function (val, index) {
										// Hide the label of every 2nd dataset
										const pR = this.getLabelForValue(val).split("-")[2];
										const index_ = this.getLabelForValue(val).split("-")[0];
										// console.log(proteinRegions[pR.split(" ")[0].split("-")]);
										const [start, end] =
											proteinRegions[pR.split(" ")[0].split("-")].split("-");
										const middle = parseInt(
											(parseInt(start) + parseInt(end)) / 2
										);
										if (isWholeSequenceSelected) {
											if (parseInt(index_) % 100 === 0) {
												// console.log("YES");
												return pR;
											}
										} else {
											if (parseInt(index_) === middle) {
												return pR;
											}
										}
									},
								},
							},

							y: {
								beginAtZero: true,
								max: 4,
							},
						},
						tooltips: {
							mode: "index",
							intersect: false,
						},
						hover: {
							mode: "index",
							intersect: false,
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
									onZoomComplete: (context) => {
										console.log("AAAAAAAAAAAAAAAAA");
										console.log(context.chart.getZoomLevel());
										if (context.chart.getZoomLevel() >= 1.2) {
											context.chart.data.datasets = datasets;
											console.log("worked onzoomm");
											context.chart.update();
										}
									},
								},
								pan: {
									enabled: true,
									mode: "x",
									onPan: () => {
										console.log("panned");
										// const leftEnd =
										// 	chart.getDatasetMeta(0).dataset._scale.chart.scales["x"]
										// 		._table[0];
										// console.log(chart.getDatasetMeta(0));
									},
								},
							},
							title: {
								display: true,
								color: proteinRegionColorMap[chartTitle],
								position: "bottom",
								text: chartTitle,
								font: {
									size: 16,
								},
							},
						},
					},
				});

				return () => chart.destroy();
			}
		}
	}, [data]);

	const handleReset = () => {
		dispatch(resetChart());
	};

	return (
		<div>
			<button onClick={handleReset}>Reset</button>
			<canvas ref={chartRef} />
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
