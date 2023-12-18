import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "chartjs-plugin-zoom";

const ChartComponent = () => {
	const [chartData, setChartData] = useState({
		datasets: [],
	});
	const chartRef = useRef(null);

	const fetchData = async (start, end) => {
		try {
			const response = await axios.get(
				`http://localhost:8080/data?start=${start}&end=${end}`
			);
			if (response.data && response.data.length > 0) {
				setChartData({
					labels: response.data.map((d) => d.x),
					datasets: [
						{
							label: "Dataset",
							data: response.data.map((d) => d.y),
							backgroundColor: "rgba(0, 123, 255, 0.5)",
							borderWidth: 1,
						},
					],
				});
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	};

	useEffect(() => {
		fetchData(0, 1000);
	}, []);

	const onZoom = () => {
		if (chartRef.current) {
			const chart = chartRef.current;
			// Get the current axis view
			const xAxis = chart.scales["x"];
			console.log(Math.floor(xAxis.min), Math.ceil(xAxis.max));
			fetchData(Math.floor(xAxis.min), Math.ceil(xAxis.max));
		}
	};

	return (
		<Bar
			ref={chartRef}
			data={chartData}
			options={{
				scales: {
					xAxes: [
						{
							type: "linear",
							position: "bottom",
						},
					],
				},
				plugins: {
					zoom: {
						pan: {
							enabled: true,
							mode: "x",
						},
						zoom: {
							wheel: {
								enabled: true,
							},
							pinch: {
								enabled: true,
							},
							mode: "x",
							onZoom: onZoom,
						},
					},
				},
			}}
		/>
	);
};

export default ChartComponent;
