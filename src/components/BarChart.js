import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { useDispatch, useSelector } from "react-redux";
import { resetChart } from "../features/genome/genomeSlice";
import { proteinRegionColorMap } from "../utils/proteinRegionColorMap";
import { proteinRegions } from "../data/proteinRegions";
Chart.register(zoomPlugin);

function BarChart({
	data,
	labels,
	labels2,
	isWholeSequenceSelected,
	setChunkView,
	chartTitle,
}) {
	// console.log("barchartdata: ", data);
	console.log("render barchart:", data[0].data);
	const a = data[0].data;
	const chartRef = useRef();
	const [_chart, setChart] = useState(null);
	const [change, setChange] = useState(false);
	const [wholeData, setWholeData] = useState(data[0].data);
	const [wholeLabels, setWholeLabels] = useState(labels);
	const [dataPoints, setDataPoints] = useState(data[0].data);

	const [viewWindow, setViewWindow] = useState({ start: 0, end: 1000 });
	const totalDataPoints = 30000;
	// const initialLoad = 1000;
	console.log("whole labels:", wholeLabels);

	useEffect(() => {
		const fetchData = () => {
			setDataPoints(data.slice(viewWindow.start, viewWindow.end));
		};
		fetchData();
	}, [viewWindow]);

	const dataset = {
		labels: dataPoints.map((_, i) => i + viewWindow.start),
		datasets: [
			{
				label: "Dataset",
				data: dataPoints,
				backgroundColor: "rgba(255, 99, 132, 0.2)",
				borderColor: "rgba(255, 99, 132, 1)",
				borderWidth: 1,
			},
		],
	};

	// const dispatch = useDispatch();
	// const [chunkView, setChunkView] = useState(true);
	// const chartTitle = useSelector((state) => state.genome.chartTitle);
	// const chunkedData = useSelector((state) => state.genome.chunkedData);
	// const data = useSelector((state) => state.genome.chartData);
	// console.log("chunkedData:", chunkedData);

	// const isWholeSequenceSelected = useSelector(
	// 	(state) => state.genome.isWholeSequenceSelected
	// );

	// const chunkedDatasets = [
	// 	{
	// 		label: "Average Data",
	// 		data: chunkedData,
	// 		backgroundColor: "rgba(0, 123, 255, 0.5)", // or any color you prefer
	// 	},
	// ];
	// console.log("chunked data: ", chunkedData);

	// const detailedDatasets = Object.keys(data[0].mutationPoss).map(
	// 	(nucleotide) => ({
	// 		label: nucleotide,
	// 		data: data.map((entry) => entry.mutationPoss[nucleotide]),
	// 		borderColor: getColorForNucleotide(nucleotide),
	// 		backgroundColor: getColorForNucleotide(nucleotide),
	// 		// stack: "stack",
	// 	})
	// );

	useEffect(() => {
		const currentChartRef = chartRef.current;
		console.log("work");

		if (currentChartRef) {
			const ctx = currentChartRef.getContext("2d");

			if (ctx) {
				// const labels = data.map((entry) => `${entry.pos}-${entry.nucleotide}`);
				// const labels2 = data.map(
				// 	(entry) => `${entry.pos}-${entry.nucleotide}-${entry.proteinRegion}`
				// );

				// const labels_chunk = chunkedData.map((chunk, idx) => `Chunk-${idx}`);

				// const datasets =

				// console.log("1111:");
				// console.log(labels);
				// console.log(datasets);
				const chart = new Chart(ctx, {
					type: "bar",
					data: {
						// labels: chunkView
						// 	? chunkedData.map((_, idx) => `Chunk ${idx + 1}`)
						// 	: labels,
						labels: labels,
						datasets: data,
					},
					options: {
						animation: false,
						scales: {
							x: {
								id: "xAxis1",
								type: "category",
								stacked: true,
								// labels: chunkView
								// 	? chunkedData.map((_, idx) => `Chunk ${idx + 1}`)
								// 	: labels,
								// labels: labels,
								// ticks: {
								// 	callback: function (val, index) {
								// 		// Hide the label of every 2nd dataset
								// 		const label = this.getLabelForValue(val);
								// 		return label.split("-")[1];
								// 	},
								// },
							},
							// x2: {
							// 	id: "xAxis2",
							// 	type: "category",
							// 	gridLines: {
							// 		display: false,
							// 	},
							// 	// labels: labels2,
							// 	// ticks: {
							// 	// 	autoSkip: true,
							// 	// 	callback: function (val, index) {
							// 	// 		// Hide the label of every 2nd dataset
							// 	// 		const pR = this.getLabelForValue(val).split("-")[2];
							// 	// 		// console.log("pR", pR);
							// 	// 		const index_ = parseInt(
							// 	// 			this.getLabelForValue(val).split("-")[0]
							// 	// 		);
							// 	// 		// console.log(proteinRegions[pR.split(" ")[0].split("-")]);
							// 	// 		const [start, end] =
							// 	// 			proteinRegions[pR.split(" ")[0].split("-")].split("-");
							// 	// 		const middle = parseInt(
							// 	// 			(parseInt(start) + parseInt(end)) / 2
							// 	// 		);
							// 	// 		if (isWholeSequenceSelected) {
							// 	// 			if (index_ % 100 === 0 && index_ !== 0) {
							// 	// 				// console.log("YES");
							// 	// 				return pR;
							// 	// 			}
							// 	// 		} else {
							// 	// 			if (index_ === middle) {
							// 	// 				return pR;
							// 	// 			}
							// 	// 		}
							// 	// 	},
							// 	// },
							// },

							y: {
								beginAtZero: true,
								stacked: true,
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
									onZoomStart: ({ chart, event, point }) => {
										console.log("chart.scales.x;");
										console.log(chart.scales.x);
									},
									onZoom: ({ chart }) => {
										console.log("on zoom");
										const { min, max } = chart.scales.x;
										console.log("min,max:", min, max);
										// updateScaleRange(chart);

										// updateChartData(chart, min, max);
										// console.log("AAAAAAAAAAAAAAAAA");
										// console.log(context.chart.getZoomLevel());
										// console.log(context.chart.zoom);
										// console.log(
										// 	"a:",
										// 	context.chart.scales.x.min,
										// 	context.chart.scales.x.max
										// );

										// context.chart.zoomScale(1, { min: 0, max: 100 }, "none");

										// if (context.chart.getZoomLevel() >= 1.4) {
										// 	setChunkView((_) => false); // Switch to detailed view

										// 	// context.chart.data.datasets = detailedDatasets;
										// 	// console.log("worked onzoomm");
										// 	// context.chart.update();
										// } else {
										// 	setChunkView((_) => true);
										// 	// context.chart.data.datasets = chunkedDatasets;
										// 	// context.chart.update();
										// }
									},
								},
								pan: {
									enabled: true,
									mode: "x",
									onPan: ({ chart }) => {
										console.log("on pan");
										const { min, max } = chart.scales.x;
										console.log("min,max:", min, max);
										// updateScaleRange(chart);

										// updateChartData(chart, min, max);
										// console.log("panned");
										// console.log(
										// 	"a:",
										// 	context.chart.scales.x.min,
										// 	context.chart.scales.x.max
										// );
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
				setChart(chart);

				return () => chart.destroy();
			}
		}
	}, [data]);

	// useEffect(() => {
	// 	console.log("Current range:", scaleRange);
	// 	console.log("Previous range:", prevScaleRange);
	// }, [scaleRange, prevScaleRange]);

	const handleReset = () => {
		setChunkView(true);
		// dispatch(resetChart());
	};

	return (
		<div>
			<button onClick={handleReset}>Reset</button>
			<canvas ref={chartRef} />
		</div>
	);
}

// function getColorForNucleotide(nucleotide) {
// 	const colorMap = {
// 		A: "#FF5733",
// 		C: "#3399FF",
// 		T: "#33CC33",
// 		G: "#9966FF",
// 	};

// 	return colorMap[nucleotide] || "#000000";
// }

export default BarChart;
