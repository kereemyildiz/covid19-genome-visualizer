import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-plugin-zoom";

function BarChartNew({ data }) {
	// const [dataset, setDataset] = useState(data);
	const [dataPoints, setDataPoints] = useState(data[0].data);
	const [viewWindow, setViewWindow] = useState({ start: 0, end: 1000 });
	// const [options, setOptions] = useState(null);

	useEffect(() => {
		const fetchData = () => {
			setDataPoints(data);
		};
		fetchData();
	}, [viewWindow]);

	const dataset = {
		labels: dataPoints.map((_, i) => i + viewWindow.start),
		datasets: data,
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

	console.log("data: ", data);
	return <Bar data={dataset} options={options} />;
}

export default BarChartNew;
