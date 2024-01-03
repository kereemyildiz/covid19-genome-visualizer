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
// import { generateRandomSequence } from "./helpers/fooGenomeElements";

function App() {
	console.log("asdasdasdad");
	const randomSeq = useSelector((state) => state.genome.randomSeq);
	const possibilityMap = useSelector((state) => state.genome.possibilityMap);
	const barChartData = useSelector((state) => state.genome.chartData);
	const showDoughnut = useSelector((state) => state.genome.showDoughnut);
	const nodeIds = useSelector((state) => state.genome.nodeList);

	const realChartData = useSelector((state) => state.genome.realChartData);
	const seq = useSelector((state) => state.genome.seq);
	const [showAllData, setShowAllData] = useState(true);

	const elapsedDay = useSelector((state) => state.genome.elapsedDay);
	const nodeId = useSelector((state) => state.genome.nodeId);
	const [loading, setLoading] = useState(true);
	const [dataLoading, setDataLoading] = useState(false);

	const proteinRegionPossMap = useSelector(
		(state) => state.genome.proteinRegionPossMap
	);
	const proteinRegionPossMap2 = useSelector(
		(state) => state.genome.proteinRegionPossMap2
	);

	const windowSlices = useSelector((state) => state.genome.windowSlices);

	const dispatch = useDispatch();

	const handleNodeSelection = (nodeId, elapsedDay, selectedModel) => {
		dispatch(selectNode([nodeId, elapsedDay, selectedModel]));
	};

	useEffect(() => {
		setLoading(true);
		console.log("runnnnnnn");

		async function fetchData() {
			try {
				const response = await axios.get(
					"http://localhost:8000/api/load-predefined-data/"
				);
				const { models, nodes } = response.data;
				dispatch(loadNodesAndModels([models, nodes]));
			} catch (error) {
				console.error("Error fetching nodes and models", error);
			}
		}
		fetchData();
		setLoading(false);
		console.log(nodeIds);
		dispatch(generate());
	}, []);

	const handleSubmit = async (
		nodeId,
		elapsedDay,
		selectedModel,
		selectedProteinRegion
	) => {
		setDataLoading(true);
		console.log("11111");
		console.log(nodeId, elapsedDay, selectedModel, selectedProteinRegion);
		try {
			const response = await axios.post("http://localhost:8000/api/data/", {
				nodeId,
				elapsedDay,
				selectedModel,
				selectedProteinRegion,
			});
			let isSelected = false;
			if (selectedProteinRegion) {
				setShowAllData(true);
				isSelected = true;
			}
			const { dataset, genome, pr_poss } = response.data;
			console.log("res: ", response);
			dispatch(setDataset([dataset, genome, pr_poss, isSelected]));
		} catch (error) {
			console.error("Error submitting the form", error);
		}
		setDataLoading(false);
	};

	return (
		// <div>{loading ? <Spinner /> : <DropDown items={nodeIds} />}</div>
		<div className="App w-[100vw] h-[100vh]">
			{dataLoading ? (
				<Progressbar />
			) : loading ? (
				<Spinner />
			) : (
				<div>
					<Navbar onNodeSelect={handleNodeSelection} onSubmit={handleSubmit} />
					{realChartData ? (
						<div>
							{/* <RandomSequence /> */}
							<div className="flex justify-evenly mt-10 pl-10">
								<div className="flex">
									<BarChart2 data={realChartData} seq={seq} />
								</div>
								{showDoughnut ? (
									<div className="chart-container w-[500px] items-center pr-4 flex justify-center ">
										<PieChart data={proteinRegionPossMap} />
									</div>
								) : (
									""
								)}
							</div>
						</div>
					) : (
						""
					)}
				</div>
			)}
		</div>
	);
}

export default App;
