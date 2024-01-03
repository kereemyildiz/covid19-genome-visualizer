import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { generate, setLoading } from "./features/genome/genomeSlice";
import RandomSequence from "./components/RandomSequence";
import BarChart from "./components/BarChart";
import Spinner from "./components/Spinner";
import {
	selectNode,
	loadNodesAndModels,
	setDataset,
} from "./features/genome/genomeSlice";

import PieChart from "./components/DoughnutChart";
// import LargeDataSetChart from "./components/LineChart";
// import Test from "./components/Test";
// import Test2 from "./components/Test2";
import { useEffect, useState } from "react";
// import Test3 from "./components/Test3";
// import MyChart from "./components/Test4";
import { proteinRegionsSize } from "./data/proteinRegions";
import Navbar from "./components/Navbar";
import axios from "axios";
import BarChart2 from "./components/BarChart2";
import DropDown from "./components/DropDown";
import { nodeIds as nodes } from "./data/nodeIds";
import ZoomSlider from "./components/ZoomSlider";
import Progressbar from "./components/ProgressBar";
import Recharts from "./components/Recharts";
import GenomeChart from "./components/Recharts";
// import { generateRandomSequence } from "./helpers/fooGenomeElements";

function App() {
	// console.log("asdasdasdad");
	// const randomSeq = useSelector((state) => state.genome.randomSeq);
	// const possibilityMap = useSelector((state) => state.genome.possibilityMap);
	// const barChartData = useSelector((state) => state.genome.chartData);
	// const showDoughnut = useSelector((state) => state.genome.showDoughnut);
	// const nodeIds = useSelector((state) => state.genome.nodeList);

	// const realChartData = useSelector((state) => state.genome.realChartData);
	// const seq = useSelector((state) => state.genome.seq);
	// const [showAllData, setShowAllData] = useState(true);

	// const elapsedDay = useSelector((state) => state.genome.elapsedDay);
	// const nodeId = useSelector((state) => state.genome.nodeId);
	// const [loading, setLoading] = useState(true);
	// const [dataLoading, setDataLoading] = useState(false);

	// const proteinRegionPossMap = useSelector(
	// 	(state) => state.genome.proteinRegionPossMap
	// );
	// const proteinRegionPossMap2 = useSelector(
	// 	(state) => state.genome.proteinRegionPossMap2
	// );

	// const windowSlices = useSelector((state) => state.genome.windowSlices);

	// const dispatch = useDispatch();

	// const handleNodeSelection = (nodeId, elapsedDay, selectedModel) => {
	// 	dispatch(selectNode([nodeId, elapsedDay, selectedModel]));
	// };

	// useEffect(() => {
	// 	setLoading(true);
	// 	console.log("runnnnnnn");

	// 	async function fetchData() {
	// 		try {
	// 			const response = await axios.get(
	// 				"http://localhost:8000/api/load-predefined-data/"
	// 			);
	// 			const { models, nodes } = response.data;
	// 			dispatch(loadNodesAndModels([models, nodes]));
	// 		} catch (error) {
	// 			console.error("Error fetching nodes and models", error);
	// 		}
	// 	}
	// 	fetchData();
	// 	setLoading(false);
	// 	console.log(nodeIds);
	// 	dispatch(generate());
	// }, []);

	// const handleSubmit = async (
	// 	nodeId,
	// 	elapsedDay,
	// 	selectedModel,
	// 	selectedProteinRegion
	// ) => {
	// 	setDataLoading(true);
	// 	console.log("11111");
	// 	console.log(nodeId, elapsedDay, selectedModel, selectedProteinRegion);
	// 	try {
	// 		const response = await axios.post("http://localhost:8000/api/data/", {
	// 			nodeId,
	// 			elapsedDay,
	// 			selectedModel,
	// 			selectedProteinRegion,
	// 		});
	// 		let isSelected = false;
	// 		if (selectedProteinRegion) {
	// 			setShowAllData(true);
	// 			isSelected = true;
	// 		}
	// 		const { dataset, genome, pr_poss } = response.data;
	// 		console.log("res: ", response);
	// 		dispatch(setDataset([dataset, genome, pr_poss, isSelected]));
	// 	} catch (error) {
	// 		console.error("Error submitting the form", error);
	// 	}
	// 	setDataLoading(false);
	// };

	const generateRandomGenomeSequence = (length) => {
		const nucleotides = ["A", "C", "G", "T"];
		let sequence = "";
		for (let i = 0; i < length; i++) {
			sequence += nucleotides[Math.floor(Math.random() * nucleotides.length)];
		}
		return sequence;
	};
	const generateRandomMutationProbabilities = (length) => {
		const data = [];
		for (let i = 0; i < 4; i++) {
			const probabilities = [];
			for (let j = 0; j < length; j++) {
				probabilities.push(Math.random());
			}
			data.push(probabilities);
		}
		return data;
	};
	const genomeSequenceLength = 30000;

	const [genomeSequence, setGenomeSequence] = useState(
		generateRandomGenomeSequence(genomeSequenceLength)
	);
	const [genomeData, setGenomeData] = useState(
		generateRandomMutationProbabilities(genomeSequenceLength)
	);

	return (
		// <div>{loading ? <Spinner /> : <DropDown items={nodeIds} />}</div>
		<div>
			{console.log(genomeData, genomeSequence)}
			<h1>Genome Sequence Mutation Visualization</h1>
			<GenomeChart genomeData={genomeData} genomeSequence={genomeSequence} />
		</div>
	);
}

export default App;
