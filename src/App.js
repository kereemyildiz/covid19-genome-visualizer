import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { generate, setLoading } from "./features/genome/genomeSlice";
import RandomSequence from "./components/RandomSequence";
import BarChart from "./components/BarChart";
import Spinner from "./components/Spinner";
import PieChart from "./components/DoughnutChart";
// import LargeDataSetChart from "./components/LineChart";
// import Test from "./components/Test";
// import Test2 from "./components/Test2";
import { useEffect, useState } from "react";
// import Test3 from "./components/Test3";
// import MyChart from "./components/Test4";
import { proteinRegionsSize } from "./data/proteinRegions";
import Navbar from "./components/Navbar";
// import { generateRandomSequence } from "./helpers/fooGenomeElements";

function App() {
	const randomSeq = useSelector((state) => state.genome.randomSeq);
	const possibilityMap = useSelector((state) => state.genome.possibilityMap);
	const barChartData = useSelector((state) => state.genome.chartData);
	const elapsedDay = useSelector((state) => state.genome.elapsedDay);
	const nodeId = useSelector((state) => state.genome.nodeId);

	const proteinRegionPossMap = useSelector(
		(state) => state.genome.proteinRegionPossMap
	);

	const windowSlices = useSelector((state) => state.genome.windowSlices);

	const [loading, setLoading] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		console.log("n: ", nodeId);
		console.log("e: ", elapsedDay);
	}, [nodeId, elapsedDay]);

	return (
		<div className="App">
			<Navbar />

			<div>
				{randomSeq ? (
					<div>
						<RandomSequence />
						<div className="flex justify-center gap-10 p-4">
							<div className="w-[800px] h-[400px]">
								<BarChart data={barChartData} />
							</div>
							<div className="w-[400px] h-[400px]">
								<PieChart data={proteinRegionPossMap} />
							</div>
						</div>
					</div>
				) : (
					<div>
						<div>Sequence is not generated yet</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
