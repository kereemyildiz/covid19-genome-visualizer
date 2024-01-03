import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";

const Recharts = ({ genomeData, genomeSequence }) => {
	// Transform the data into a format suitable for the chart
	const processData = () => {
		const nucleotides = ["A", "C", "G", "T"];
		return genomeSequence.split("").map((nucleotide, index) => {
			const dataPoint = { position: nucleotide + (index + 1) };
			nucleotides.forEach((nt, ntIndex) => {
				dataPoint[nt] = genomeData[ntIndex][index];
			});
			return dataPoint;
		});
	};

	const chartData = processData();

	return (
		<BarChart
			width={1000}
			height={500}
			data={chartData}
			margin={{
				top: 20,
				right: 30,
				left: 20,
				bottom: 5,
			}}
			barSize={20}
		>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="position" />
			<YAxis />
			<Tooltip />
			<Legend />
			<Bar dataKey="A" stackId="a" fill="#8884d8" />
			<Bar dataKey="C" stackId="a" fill="#82ca9d" />
			<Bar dataKey="G" stackId="a" fill="#ffc658" />
			<Bar dataKey="T" stackId="a" fill="#ff8042" />
		</BarChart>
	);
};

export default Recharts;
