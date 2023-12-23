import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BarChart from "./BarChart";
import BarChartNew from "./DynamicChartV3";

export default function BarChartManager() {
	console.log("render barchart manager");
	const dispatch = useDispatch();
	const [chunkView, setChunkView] = useState(true);
	const chartTitle = useSelector((state) => state.genome.chartTitle);
	const chunkedData = useSelector((state) => state.genome.chunkedData);
	const data = useSelector((state) => state.genome.chartData);
	const isWholeSequenceSelected = useSelector(
		(state) => state.genome.isWholeSequenceSelected
	);

	const chunkedDatasets = [
		{
			label: "Average Data",
			data: chunkedData,
			backgroundColor: "rgba(0, 123, 255, 0.5)", // or any color you prefer
		},
	];

	const detailedDatasets = Object.keys(data[0].mutationPoss).map(
		(nucleotide) => ({
			label: nucleotide,
			data: data.map((entry) => entry.mutationPoss[nucleotide]),
			borderColor: getColorForNucleotide(nucleotide),
			backgroundColor: getColorForNucleotide(nucleotide),
			// stack: "stack",
		})
	);

	const labels = data.map((entry) => `${entry.pos}-${entry.nucleotide}`);
	const labels2 = data.map(
		(entry) => `${entry.pos}-${entry.nucleotide}-${entry.proteinRegion}`
	);

	const labels_chunk = chunkedData.map((chunk, idx) => `Chunk-${idx}`);
	return (
		<div className="w-[800px] h-[400px]">
			<BarChartNew data={chunkedDatasets} />
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
