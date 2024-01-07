import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { getColorForNucleotide, nucleotides } from "../helpers/helperFunctions";
import {
	determineProteinRegion,
	proteinMidPoints,
	proteinRegionLabels,
} from "../helpers/fooGenomeElements";
import { proteinRegions } from "../data/proteinRegions";
import {
	proteinRegionColorMap,
	proteinRegionColorMapAnnotations,
} from "../utils/proteinRegionColorMap";
import annotationPlugin from "chartjs-plugin-annotation";

Chart.register(annotationPlugin);

const GenomeChart = ({ genomeData, genomeSequence }) => {
	const chartRef = useRef(null);

	const decimateData = (data, factor) => {
		return data.map((dataset) =>
			dataset.reduce((acc, curr, index) => {
				if (index % factor === 0) {
					const slice = dataset.slice(index, index + factor);
					const sum = slice.reduce((sum, value) => sum + value, 0);
					acc.push(sum / factor);
				}
				return acc;
			}, [])
		);
	};

	useEffect(() => {
		const decimateFactor = 15;
		const decimatedData = decimateData(genomeData, decimateFactor);
		const allSequenceLabels = genomeSequence.split("").map((n) => n);
		const proteinRegionLabels = allSequenceLabels.map((_, idx) =>
			determineProteinRegion(idx)
		);
		const chunkViewLabels = decimatedData[0].map((_, idx) => `Chunk ${idx}`);

		const proteinRegionChunkViewLabels = chunkViewLabels.map((_, idx) =>
			determineProteinRegion(idx, decimateFactor)
		);
		const currentChartRef = chartRef.current;

		console.log("as", proteinRegionChunkViewLabels);
		console.log(proteinRegionLabels);
		console.log("pr mid:", proteinMidPoints);

		const annotations = Object.keys(proteinRegions).map((key) => {
			const range = proteinRegions[key];
			const [start, end] = range
				.split("-")
				.map((e) => parseInt(e / decimateFactor));

			return {
				display: true,
				type: "box",
				xMin: start,
				xMax: end,
				backgroundColor: proteinRegionColorMapAnnotations[key], // You can use different colors for each region
				borderColor: proteinRegionColorMap[key],
				borderWidth: 2,
				label: {
					content: key,
					enabled: true,
					position: "start",
				},
			};
		});
		console.log("ann:", annotations);
		if (currentChartRef) {
			const ctx = currentChartRef.getContext("2d");

			if (ctx) {
				const labels = chunkViewLabels;
				const datasets = decimatedData.map((dataset, idx) => ({
					label: nucleotides[idx],
					data: dataset,
					borderColor: getColorForNucleotide(nucleotides[idx]),
					backgroundColor: getColorForNucleotide(nucleotides[idx]),
				}));

				const data = {
					labels: labels,
					datasets: datasets,
				};

				const options = {
					animation: false,
					responsive: true,
					scales: {
						x: {
							stacked: true,
							ticks: {
								font: {
									weight: "bold",
								},
							},
						},
						x2: {
							type: "category",
							labels: proteinRegionChunkViewLabels,
							ticks: {
								callback: function (value, index, values) {
									return value;
								},
							},
							// ticks: {
							// 	maxTicksLimit: 10,
							// },
						},

						// x3: {
						// 	border: {
						// 		display: true,
						// 	},
						// 	grid: {
						// 		display: true,
						// 	},
						// 	labels: decimatedData[0]
						// 		.map((_, idx) => `AAA ${idx}`)
						// 		.slice(0, 10),
						// },

						y: {
							stacked: true,
						},
					},
					plugins: {
						annotation: {
							annotations: annotations,
						},
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
								onPan: () => {
									console.log("panned");
								},
							},
						},
					},
				};

				const config = {
					type: "bar",
					data: data,
					options: options,
				};

				const chart = new Chart(ctx, config);

				return () => chart.destroy();
			}
		}
	}, [genomeData]);

	return (
		<div className="container flex">
			<div className="chart-area w-[80vw] h-[80vh]">
				<canvas ref={chartRef} />
			</div>
		</div>
	);
};

// Add this to your chart options
// const options = {
// 	// ...
// 	plugins: {
// 		annotation: {
// 			annotations: annotations,
// 		},
// 	},
// };

export default GenomeChart;
