import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import annotationPlugin from "chartjs-plugin-annotation";
import { getColorForNucleotide, nucleotides } from "../helpers/helperFunctions";
import { determineProteinRegion } from "../helpers/fooGenomeElements";
import { proteinRegions } from "../data/proteinRegions";
import {
	proteinRegionColorMap,
	proteinRegionColorMapAnnotations,
} from "../utils/proteinRegionColorMap";
import SidePanel from "./SidePanel";

Chart.register(annotationPlugin);

const GenomeChart = ({ genomeData, genomeSequence }) => {
	const chartRef = useRef(null);
	const [activeProtein, setActiveProtein] = useState(null);
	const [chart, setChart] = useState(null);

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

	useEffect(() => {
		const ctx = chartRef.current.getContext("2d");
		if (!ctx) return;

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
			plugins: {
				annotation: {
					annotations: createAnnotations(activeProtein),
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
	}, []);

	useEffect(() => {
		if (chart) {
			chart.options.plugins.annotation.annotations =
				createAnnotations(activeProtein);
			chart.update();
		}
	}, [activeProtein, chart]);

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

	return (
		<div className="chart-container flex">
			<SidePanel
				proteinRegions={proteinRegions}
				onProteinHover={handleProteinHover}
				onProteinLeave={handleProteinLeave}
			/>
			<div className="chart-area">
				<canvas ref={chartRef} />
			</div>
		</div>
	);
};

export default GenomeChart;
