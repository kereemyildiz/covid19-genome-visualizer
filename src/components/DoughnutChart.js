import React from "react";
import { Chart, Doughnut } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { showProteinRegion } from "../features/genome/genomeSlice";

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
				backgroundColor: [
					"rgba(255, 99, 132, 0.5)",
					"rgba(54, 102, 235, 0.5)",
					"rgba(255, 206, 86, 0.5)",
					"rgba(75, 192, 192, 0.5)",
					"rgba(153, 102, 255, 0.5)",
					"rgba(255, 159, 64, 0.5)",
					"rgba(255, 99, 132, 0.5)",
					"rgba(54, 162, 235, 0.5)",
					"rgba(255, 206, 86, 0.5)",
					"rgba(75, 192, 192, 0.5)",
				],
				borderWidth: 1,
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 102, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
				],
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
