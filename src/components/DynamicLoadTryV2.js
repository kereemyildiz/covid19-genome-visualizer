import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-plugin-zoom";

const DynamicChart = ({ data }) => {
	console.log(data);
	const [dataPoints, setDataPoints] = useState(data);
	const [viewWindow, setViewWindow] = useState({ start: 0, end: 1000 });

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
	const zoomOptions = {
		pan: {
			enabled: true,
			mode: "x",
			onPan: ({ chart }) => {
				const newStart = Math.max(0, Math.floor(chart.scales.x.min));
				const newEnd = Math.min(30000, Math.ceil(chart.scales.x.max));
				setViewWindow({ start: newStart, end: newEnd });
			},
		},
		zoom: {
			wheel: { enabled: true },
			mode: "x",
			onZoom: ({ chart }) => {
				const newStart = Math.max(0, Math.floor(chart.scales.x.min));
				const newEnd = Math.min(30000, Math.ceil(chart.scales.x.max));
				setViewWindow({ start: newStart, end: newEnd });
			},
		},
	};

	const options = {
		scales: {
			x: {
				type: "linear",
				min: viewWindow.start,
				max: viewWindow.end,
			},
		},
		plugins: {
			zoom: zoomOptions,
		},
	};

	return <Bar data={dataset} options={options} />;
};

export default DynamicChart;
