import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const GenomeChart = ({ genomeData, genomeSequence }) => {
	const [decimatedData, setDecimatedData] = useState([]);
	const [currentView, setCurrentView] = useState({ start: 0, end: 1000 }); // Default view
	const decimationFactor = 30; // Define the decimation factor
	const zoomThreshold = 10; // Define a zoom threshold for switching between raw and decimated data

	useEffect(() => {
		if (genomeData && genomeData.length > 0 && genomeSequence) {
			const decimated = decimateData(genomeData, decimationFactor);
			setDecimatedData(decimated);
		}
	}, [genomeData, genomeSequence]);

	const decimateData = (data, factor) => {
		const decimated = [];
		for (let i = 0; i < data[0].length; i += factor) {
			const chunk = data.map((d) => d.slice(i, i + factor));
			const averagedChunk = chunk.map(
				(d) => d.reduce((a, b) => a + b, 0) / factor
			);
			decimated.push(averagedChunk);
		}
		return decimated;
	};

	const handleZoom = (event) => {
		const xAxis = event["xaxis.range[0]"]
			? Math.max(Math.floor(event["xaxis.range[0]"]), 0)
			: 0;
		const xAxisEnd = event["xaxis.range[1]"]
			? Math.min(Math.ceil(event["xaxis.range[1]"]), genomeSequence.length)
			: genomeSequence.length;
		const zoomLevel = genomeSequence.length / (xAxisEnd - xAxis);

		if (zoomLevel > zoomThreshold && xAxisEnd - xAxis < genomeSequence.length) {
			setCurrentView({ start: xAxis, end: xAxisEnd });
		} else {
			setCurrentView({
				start: 0,
				end: genomeSequence.length / decimationFactor,
			});
		}
	};
	const traces =
		genomeData && genomeSequence && decimatedData.length > 0
			? getTraces(currentView, genomeData, decimatedData, genomeSequence)
			: [];

	const layout = {
		title: "Genome Sequence Mutation Visualization",
		barmode: "stack",
		xaxis: {
			title: "Position",
			rangeselector: {
				buttons: [
					{
						count: 1,
						label: "1m",
						step: "month",
						stepmode: "backward",
					},
					{
						step: "all",
					},
				],
			},
			rangeslider: { range: [0, 1000] }, // Initial range for x-axis
			type: "linear",
		},
		yaxis: {
			fixedrange: false, // Allow y-axis range to change (enables vertical panning)
			title: "Mutation Probability",
		},
		dragmode: "pan", // Enable panning by dragging
	};
	return (
		<Plot
			data={traces}
			layout={layout}
			onRelayout={handleZoom}
			style={{ width: "100%", height: "100%" }}
		/>
	);
};

const getTraces = (view, rawGenomeData, decimatedData, genomeSequence) => {
	if (!rawGenomeData || !decimatedData || !genomeSequence) {
		return []; // Ensure that data is available
	}

	const nucleotides = ["A", "C", "G", "T"];
	const useRawData = view.end - view.start < genomeSequence.length;
	const data = useRawData ? rawGenomeData : decimatedData;
	const xValues = useRawData
		? Array.from(
				{ length: view.end - view.start },
				(_, i) => i + view.start + 1
		  )
		: Array.from({ length: data[0].length }, (_, i) => i + 1);

	return nucleotides.map((nucleotide, index) => {
		return {
			x: xValues,
			y: data[index],
			name: nucleotide,
			type: "bar",
			barmode: "stack",
		};
	});
};

export default GenomeChart;
