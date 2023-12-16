import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { showProteinRegion } from "../features/genome/genomeSlice";
import { proteinRegionColorMap } from "../utils/proteinRegionColorMap";
import { proteinRegionsSize } from "../data/proteinRegions";

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
		<div>
			{/* <button>normalize</button> */}
			<label className="relative inline-flex items-center cursor-pointer">
				<input
					onChange={handleNormalizedButton}
					type="checkbox"
					value=""
					className="sr-only peer"
				/>

				<div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-500 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
				<span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
					Normalize
				</span>
			</label>
			<Doughnut data={chartData} options={chartOptions} />;
		</div>
	);
};

export default DoughnutChart;
