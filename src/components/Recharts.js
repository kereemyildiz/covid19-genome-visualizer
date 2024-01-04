import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DataZoomComponent,
	ToolboxComponent,
	LegendComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	BarChart,
	DataZoomComponent,
	ToolboxComponent,
	LegendComponent,
	CanvasRenderer,
]);

const GenomeChart = ({ genomeData, genomeSequence }) => {
	const chartRef = useRef(null);
	const decimationFactor = 1;
	const zoomThreshold = 10; // Define a zoom threshold
	const [isZoomed, setIsZoomed] = useState(false);

	useEffect(() => {
		const chartInstance = echarts.init(chartRef.current);
		chartInstance.setOption(
			getChartOptions(
				decimateData(genomeData, decimationFactor),
				genomeSequence
			)
		);

		const zoomHandler = (event) => {
			handleZoom(event, chartInstance);
		};

		chartInstance.on("datazoom", zoomHandler);

		return () => chartInstance.off("datazoom", zoomHandler);
	}, [genomeData, genomeSequence, isZoomed]);

	const decimateData = (data, factor) => {
		let length = Math.ceil(genomeSequence.length / factor);
		let decimated = Array.from({ length }, () =>
			new Array(data.length).fill(0)
		);

		for (let i = 0; i < genomeSequence.length; i++) {
			let chunkIndex = Math.floor(i / factor);
			for (let j = 0; j < data.length; j++) {
				decimated[chunkIndex][j] += data[j][i] / factor;
			}
		}
		return decimated;
	};

	const handleZoom = (event, chartInstance) => {
		const zoomScale =
			chartInstance.getModel().option.dataZoom[0].end -
			chartInstance.getModel().option.dataZoom[0].start;
		console.log("a:", zoomScale);
		if (zoomScale < zoomThreshold && !isZoomed) {
			setIsZoomed(true);
			chartInstance.setOption(getChartOptions(genomeData, genomeSequence));
		} else if (zoomScale >= zoomThreshold && isZoomed) {
			setIsZoomed(false);
			chartInstance.setOption(
				getChartOptions(
					decimateData(genomeData, decimationFactor),
					genomeSequence
				)
			);
		}
	};

	const getChartOptions = (data, sequence) => {
		const categories = Array.from(
			{ length: data.length },
			(_, i) => `Chunk ${i + 1}`
		);
		const series = ["A", "C", "G", "T"].map((nucleotide, idx) => ({
			name: nucleotide,
			type: "bar",
			stack: "total",
			data: data.map((chunk) => chunk[idx]),
		}));

		return {
			title: {
				text: "Genome Mutation Probabilities",
			},
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "shadow",
				},
			},
			legend: {
				data: ["A", "C", "G", "T"],
			},
			grid: {
				left: "3%",
				right: "4%",
				bottom: "3%",
				containLabel: true,
			},
			xAxis: {
				type: "category",
				data: categories,
			},
			yAxis: {
				type: "value",
			},
			series: series,
			dataZoom: [
				{
					type: "slider",
					show: true,
					start: 0,
					end: 10,
				},
				{
					type: "inside",
					start: 0,
					end: 10,
				},
			],
		};
	};

	return <div ref={chartRef} style={{ height: "400px", width: "100%" }} />;
};

export default GenomeChart;
