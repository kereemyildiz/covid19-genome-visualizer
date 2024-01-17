import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { showProteinRegion } from "../features/genome/genomeSlice";
import { proteinRegionColorMap } from "../utils/proteinRegionColorMap";
import { proteinRegionsSize } from "../data/proteinRegions";
import { Switch } from "@material-tailwind/react";

const DoughnutChart = ({ data }) => {
	const [normalized, setNormalized] = useState(false);
	const [title, setTitle] = useState("Mutation Probability");
	const dispatch = useDispatch();
	const totalSum = calculateTotalSum();

	function calculateTotalSum() {
		if (normalized) {
			let sum = 0;
			Object.entries(data).map((item) => {
				const [key, value] = item;
				const length = proteinRegionsSize[key];
				sum += value / length;
			});
			return sum;
		} else {
			return Object.values(data).reduce((acc, curr) => acc + curr, 0);
		}
	}

	const handleNormalizedButton = () => {
		if (normalized) {
			setTitle("Mutation Probability");
			setNormalized(false);
		} else {
			setTitle("Mutation Probability (Normalized)");
			setNormalized(true);
		}
	};
	const percentages = {};
	Object.keys(data).forEach((key) => {
		if (normalized) {
			percentages[key] = (
				(data[key] / (totalSum * proteinRegionsSize[key])) *
				100
			).toFixed(2);
		} else {
			percentages[key] = ((data[key] / totalSum) * 100).toFixed(2);
		}
	});

	console.log("percentages", percentages);

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
				text: title,
			},
		},
		onClick: (event, elements) => {
			if (elements[0]) {
				const clickedIndex = elements[0].index;
				const clickedLabel = chartData.labels[clickedIndex];
				const clickedKey = Object.keys(percentages)[clickedIndex];
				// console.log("Clicked key:", clickedKey);
				dispatch(showProteinRegion(clickedKey));
			}
		},
	};

	return (
		<div className="w-[360px]">
			<div className="flex justify-start items-center cursor-pointer">
				<div className="ms-3 font-bold text-gray-700">Normalize</div>
				<div className="pl-3 pt-1">
					<Switch onClick={handleNormalizedButton} color="blue" />
				</div>
			</div>
			<Doughnut data={chartData} options={chartOptions} />
		</div>
	);
};

export default DoughnutChart;
