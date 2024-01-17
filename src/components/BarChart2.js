import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";
import { getColorForNucleotide, nucleotides } from "../helpers/helperFunctions";
import { determineProteinRegion } from "../helpers/fooGenomeElements";
import { proteinRegions, proteinRegionsSize } from "../data/proteinRegions";
import {
	proteinRegionColorMap,
	proteinRegionColorMapAnnotations,
} from "../utils/proteinRegionColorMap";
import SidePanel from "./SidePanel";
import { Switch, Button } from "@material-tailwind/react";
import { getRelativePosition } from "chart.js/helpers";
import zoomPlugin from "chartjs-plugin-zoom";
import { useDispatch, useSelector } from "react-redux";
import { resetChart } from "../features/genome/genomeSlice";
import { GrPowerReset } from "react-icons/gr";
import ZoomSlider from "./ZoomSlider";

let chunkView = true;

Chart.register(annotationPlugin);
function proteinRegionByPercentage() {
	const total = Object.values(proteinRegionsSize).reduce(
		(acc, curr) => acc + curr,
		0
	);
	console.log("total: ", total);
	return Object.entries(proteinRegionsSize).map((item) => {
		const [protein, length] = item;
		const percentage = (length / total) * 100;
		console.log("percentage:", percentage);
		return {
			protein,
			percentage,
		};
	});
}
console.log("asd:", proteinRegionByPercentage());

const subLabels = chunkView
	? {
			id: "subLabels",
			afterDatasetsDraw(chart, args, pluginOptions) {
				const {
					ctx,
					chartArea: { left, right, top, bottom, width, height },
				} = chart;
				ctx.save();

				subLabelText("ORF1ab", (width / 100) * 40);
				subLabelText("S", (width / 100) * 78);
				subLabelText("ORF3a", (width / 100) * 86);
				// subLabelText("E", (width / 100) * 78);
				// subLabelText("M", (width / 100) * 78);
				// subLabelText("ORF6", (width / 100) * 78);
				// subLabelText("ORF7a", (width / 100) * 78);
				// subLabelText("ORF7b", (width / 100) * 78);
				// subLabelText("ORF8", (width / 100) * 78);
				// subLabelText("N", (width / 100) * 78);
				subLabelText("ORF10", (width / 100) * 97);

				function subLabelText(text, x, y = 100) {
					ctx.font = "bolder 12px sans-serif";
					ctx.fillStyle = "rgba(102, 102, 102, 1)";
					ctx.textAlign = "center";
					ctx.fillText(text, x + left, bottom + y);
				}
			},
	  }
	: "";
// Chart.register(subLabels);
console.log(proteinRegionsSize);

const GenomeChart = ({ data, seq }) => {
	const chartRef = useRef(null);
	const dispatch = useDispatch();
	const [activeProtein, setActiveProtein] = useState(null);
	const [chart, setChart] = useState(null);
	const [showFullAnnotation, setshowFullAnnotation] = useState(false);

	const decimateFactor = 15;
	const decimatedData = data.map((dataset) =>
		dataset.reduce((acc, curr, index) => {
			if (index % decimateFactor === 0) {
				const slice = dataset.slice(index, index + decimateFactor);
				const sum = slice.reduce((sum, value) => sum + value, 0);
				acc.push(sum / decimateFactor);
			}
			return acc;
		}, [])
	);

	const startFetch = ({ chart }) => {
		console.log("AAAAAAAAAAAAAAAAAAAAAA");
		let { min, max } = chart.scales.x;
		console.log(min, max);
	};

	const fetchData = (min, max) => {
		return data.map((dataset, idx) => ({
			label: nucleotides[idx],
			data: dataset.slice(min, max),
			borderColor: getColorForNucleotide(nucleotides[idx]),
			backgroundColor: getColorForNucleotide(nucleotides[idx]),
		}));
	};

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

	useEffect(() => {
		const timer = setTimeout(() => {
			const ctx = chartRef.current.getContext("2d");
			if (!ctx) return;

			if (chart) {
				chart.destroy(); // Destroy existing chart instance before creating a new one
			}
			console.log("rendered");

			const decimatedLabels = decimatedData[0].map((_, idx) => `Chunk ${idx}`);

			const decimatedDatasets = decimatedData.map((dataset, idx) => ({
				label: nucleotides[idx],
				data: dataset,
				borderColor: getColorForNucleotide(nucleotides[idx]),
				backgroundColor: getColorForNucleotide(nucleotides[idx]),
			}));

			const data = {
				labels: decimatedLabels,
				datasets: decimatedDatasets,
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
						ticks: {
							grid: {
								display: false,
							},

							callback: function (val, index) {
								const label = this.getLabelForValue(val);
								return !chunkView ? seq[label] : "";
							},
						},
					},
					y: {
						stacked: true,
					},
				},
				layout: {
					padding: {
						bottom: 30,
					},
				},
				plugins: {
					annotation: {
						annotations: showFullAnnotation
							? annotations
							: createAnnotations(activeProtein),
					},

					tooltip: {
						enabled: false,
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
							onZoomComplete: ({ chart }) => {
								console.log("AAA");
								console.log(chart.getZoomLevel());
								console.log("BBB");
								let { min, max } = chart.scales.x;
								console.log(min, max);
								if (chart.getZoomLevel() > 2.5) {
									chunkView = false;
									chart.data.datasets = fetchData(min * 15, (min + 100) * 15);
									chart.data.labels = seq
										.split("")
										.map((_, idx) => idx)
										.slice(min * 15, (min + 100) * 15);
									chart.update();
								} else {
									if (!chunkView) {
										chunkView = true;
										console.log("CCC");
										chart.data.datasets = decimatedDatasets;
										chart.data.labels = decimatedLabels;

										chart.update();
									}
								}
							},
						},
						pan: {
							enabled: true,
							mode: "x",
							onPanComplete: startFetch,
						},
					},
				},
			};

			const chartInstance = new Chart(ctx, {
				type: "bar",
				data: data,
				options: options,
			});

			setChart(chartInstance);

			return () => chartInstance.destroy();
		}, 100); // delay in milliseconds

		return () => {
			clearTimeout(timer);
			if (chart) {
				chart.destroy(); // Ensure cleanup if component unmounts
			}
		};
	}, [data]);

	useEffect(() => {
		if (chart) {
			if (showFullAnnotation) {
				chart.options.plugins.annotation.annotations = annotations;
			} else {
				chart.options.plugins.annotation.annotations =
					createAnnotations(activeProtein);
			}
			chart.update();
		}
	}, [activeProtein, showFullAnnotation]);

	const createAnnotations = (activeProtein) => {
		return Object.keys(proteinRegions).map((key) => {
			const range = proteinRegions[key];
			const [start, end] = range
				.split("-")
				.map((e) => parseInt(e / decimateFactor));

			return {
				display: activeProtein === key,
				type: "box",
				xMin: start,
				xMax: end,
				backgroundColor: proteinRegionColorMap[key],
				borderColor: proteinRegionColorMap[key],
				borderWidth: 2,
				label: {
					content: key,
					enabled: true,
					position: "start",
				},
			};
		});
	};

	const handleProteinHover = (protein) => {
		setActiveProtein(protein);
	};

	const handleProteinLeave = () => {
		setActiveProtein(null);
	};

	const handleshowFullAnnotation = () => {
		setshowFullAnnotation((prev) => !prev);
	};
	const handleReset = () => {
		dispatch(resetChart());
	};
	return (
		<div className="flex">
			{/* <div className="flex items-center justify-center chart-container">
				<ZoomSlider handleZoom={handleZoom} />
			</div> */}
			<div className="">
				<SidePanel
					proteinRegions={proteinRegions}
					onProteinHover={handleProteinHover}
					onProteinLeave={handleProteinLeave}
					handleshowFullAnnotation={handleshowFullAnnotation}
				/>
			</div>

			<div
				className="chart-container bg-green-200"
				style={{ height: "60vh", width: "60vw" }}
			>
				<div className=" ml-12">
					<Button
						color="blue"
						variant="gradient"
						type="submit"
						className="flex gap-2 justify-center items-center"
						onClick={handleReset}
					>
						<div>Reset Chart</div>
						<GrPowerReset size={20} color="white" />
					</Button>
				</div>

				<div className=" w-[50vw] h-[50vh]">
					<canvas ref={chartRef} />
				</div>
				{/* <div className="flex">
				<button
					className="border-4 border-gray-400 m-2 p-2"
					onClick={(e) => {
						console.log(_chart);
						_chart.zoom(1.1);
					}}
				>
					{" "}
					+
				</button>
				<button
					className="border-4 border-gray-400 m-2 p-2"
					onClick={(e) => {
						console.log(_chart);
						_chart.zoom(0.9);
					}}
				>
					{" "}
					-
				</button>
			</div> */}
			</div>
		</div>
	);
	return (
		<div className="chart-container  flex">
			<div className=" w-[100vw] h-[80vh]">
				<canvas ref={chartRef} />
			</div>
			<div>
				<SidePanel
					proteinRegions={proteinRegions}
					onProteinHover={handleProteinHover}
					onProteinLeave={handleProteinLeave}
					handleshowFullAnnotation={handleshowFullAnnotation}
				/>
			</div>
		</div>
	);
};

export default GenomeChart;
