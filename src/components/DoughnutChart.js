import React from "react";
import { Doughnut } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { showProteinRegion } from "../features/genome/genomeSlice";
import { proteinRegionColorMap } from "../utils/proteinRegionColorMap";

const DoughnutChart = ({ data }) => {
	const dispatch = useDispatch();
	const totalSum = Object.values(data).reduce((acc, curr) => acc + curr, 0);

	const percentages = {};
	Object.keys(data).forEach((key) => {
		percentages[key] = ((data[key] / totalSum) * 100).toFixed(2);
	});

	const chartData = {
		labels: Object.keys(percentages),
		datasets: [
			{
				label: "Mutation Probability (%)",
				data: Object.values(percentages),
				backgroundColor: Object.values(proteinRegionColorMap),
				borderWidth: 1,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: true,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Mutation Probability (Normalized)",
			},
		},
		onClick: (event, elements) => {
			if (elements[0]) {
				const clickedIndex = elements[0].index;
				const clickedLabel = chartData.labels[clickedIndex];
				const clickedKey = Object.keys(percentages)[clickedIndex];
				console.log("Clicked key:", clickedKey);
				dispatch(showProteinRegion(clickedKey));
			}
		},
	};

	return <Doughnut data={chartData} options={chartOptions} />;
};

export default DoughnutChart;
