import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GenomeChart = ({ genomeData, genomeSequence }) => {
	const chartRef = useRef(null);
	const svgRef = useRef(null);

	useEffect(() => {
		if (genomeData && genomeSequence) {
			drawChart();
		}
	}, [genomeData, genomeSequence]);

	const drawChart = () => {
		// Clear previous SVG elements
		d3.select(svgRef.current).selectAll("*").remove();

		const nucleotides = ["A", "C", "G", "T"];
		const processedData = genomeSequence.split("").map((nt, index) => {
			return nucleotides.reduce(
				(acc, nucleotide, i) => {
					acc[nucleotide] = genomeData[i][index];
					return acc;
				},
				{ position: index }
			);
		});

		const margin = { top: 20, right: 30, bottom: 30, left: 40 };
		const fullWidth = 3000; // Full width of the chart
		const width = chartRef.current.clientWidth - margin.left - margin.right; // Viewport width
		const height = 500 - margin.top - margin.bottom;

		const x = d3
			.scaleBand()
			.range([0, fullWidth])
			.padding(0.1)
			.domain(processedData.map((d) => d.position));

		const y = d3.scaleLinear().range([height, 0]).domain([0, 1]);

		const svg = d3
			.select(svgRef.current)
			.attr(
				"viewBox",
				`0 0 ${fullWidth + margin.left + margin.right} ${
					height + margin.top + margin.bottom
				}`
			)
			.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`);

		const stack = d3.stack().keys(nucleotides)(processedData);

		svg
			.selectAll(".stack")
			.data(stack)
			.enter()
			.append("g")
			.attr("fill", (d, i) => d3.schemeCategory10[i])
			.selectAll("rect")
			.data((d) => d)
			.enter()
			.append("rect")
			.attr("x", (d) => x(d.data.position))
			.attr("y", (d) => y(d[1]))
			.attr("height", (d) => Math.max(0, y(d[0]) - y(d[1]))) // Ensure non-negative height
			.attr("width", x.bandwidth());

		svg
			.append("g")
			.attr("transform", `translate(0,${height})`)
			.call(d3.axisBottom(x).tickValues([]));

		svg.append("g").call(d3.axisLeft(y));

		// Zoom and Pan
		const zoom = d3
			.zoom()
			.scaleExtent([1, 5])
			.translateExtent([
				[0, 0],
				[fullWidth, height],
			])
			.on("zoom", (event) => {
				svg.attr("transform", event.transform);
			});

		d3.select(svgRef.current).call(zoom);
	};

	return (
		<div ref={chartRef} style={{ width: "100%", overflowX: "auto" }}>
			<svg ref={svgRef}></svg>
		</div>
	);
};

export default GenomeChart;
