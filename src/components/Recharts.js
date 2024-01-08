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
import { Switch } from "@material-tailwind/react";
import { getRelativePosition } from "chart.js/helpers";

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

const subLabels = {
	id: "subLabels",
	afterDatasetsDraw(chart, args, pluginOptions) {
		const {
			ctx,
			chartArea: { left, right, top, bottom, width, height },
		} = chart;
		ctx.save();

		subLabelText("ORF1ab", (width / 100) * 40);
		subLabelText("S", (width / 100) * 78);
		// subLabelText("ORF3a", (width / 100) * 78);
		// subLabelText("ORF3a", (width / 100) * 78);
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
};
Chart.register(subLabels);
console.log(proteinRegionsSize);

const GenomeChart = ({ genomeData, genomeSequence }) => {
	const chartRef = useRef(null);
	const [activeProtein, setActiveProtein] = useState(null);
	const [chart, setChart] = useState(null);
	const [showFullAnnotation, setshowFullAnnotation] = useState(false);

	const decimateFactor = 15;
	const decimatedData = genomeData.map((dataset) =>
		dataset.reduce((acc, curr, index) => {
			if (index % decimateFactor === 0) {
				const slice = dataset.slice(index, index + decimateFactor);
				const sum = slice.reduce((sum, value) => sum + value, 0);
				acc.push(sum / decimateFactor);
			}
			return acc;
		}, [])
	);

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

			const labels = decimatedData[0].map((_, idx) => `Chunk ${idx}`);

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
	}, [genomeData]);

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
	return (
		<div className="chart-container flex">
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
