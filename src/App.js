import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { generate, setLoading } from "./features/genome/genomeSlice";
import RandomSequence from "./components/RandomSequence";
import BarChart from "./components/BarChart";
import Spinner from "./components/Spinner";
import PieChart from "./components/DoughnutChart";
// import LargeDataSetChart from "./components/LineChart";
import Test from "./components/Test";
import Test2 from "./components/Test2";
import { useState } from "react";
import Test3 from "./components/Test3";
import MyChart from "./components/Test4";
import { proteinRegionsSize } from "./data/proteinRegions";
import Test5 from "./components/Test5";
import BarChartManager from "./components/BarChartManager";
import LazyLoadingChart from "./components/DynamicLoadTry";
import DynamicChart from "./components/DynamicLoadTryV2";
// import NewTest from "./components/NewTest";
// import { generateRandomSequence } from "./helpers/fooGenomeElements";
const _data = Array.from({ length: 30000 }, (_, i) => ({
	x: i,
	y: parseInt(Math.random() * 10), // Replace with actual data logic
}));

function App() {
	const randomSeq = useSelector((state) => state.genome.randomSeq);
	const possibilityMap = useSelector((state) => state.genome.possibilityMap);
	// const barChartData = useSelector((state) => state.genome.chartData);

	const proteinRegionPossMap = useSelector(
		(state) => state.genome.proteinRegionPossMap
	);
	// const loading = useSelector((state) => state.genome.loading);
	const windowSlices = useSelector((state) => state.genome.windowSlices);

	const [loading, setLoading] = useState(false);
	// console.log("possMap:", possibilityMap);
	// console.log("loading:", loading);
	// console.log("prororoor:", proteinRegionsSize);
	const dispatch = useDispatch();

	const handleGenerate = () => {
		setLoading(true);
		dispatch(generate());
		setLoading(false);
	};
	return (
		// <NewTest />
		// <DynamicChart data={_data} />
		<div className="App">
			{loading ? (
				<div>
					{/* {console.log("123")} */}
					<Spinner />
				</div>
			) : (
				<div>
					<div>
						<button
							className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
							onClick={handleGenerate}
						>
							{" "}
							Generate Sequence
						</button>
					</div>
					{randomSeq ? (
						<>
							{/* {console.log("seq: ", randomSeq)} */}
							<RandomSequence />
							<br />
							<div className="flex justify-center">
								<div className="flex flex-col">
									{windowSlices
										.filter((item, idx) => idx < 10)
										.map((item, idx) => (
											<div key={idx}>
												<pre>{JSON.stringify(item)}</pre>
											</div>
										))}
								</div>
								{"   "}
								<div className="flex flex-col">
									{possibilityMap
										.filter((item) => item.pos < 10)
										.map((item, idx) => (
											<div key={idx}>
												<pre>{JSON.stringify(item)}</pre>
											</div>
										))}
								</div>
							</div>
							<div className="flex justify-center gap-10 p-4">
								<BarChartManager />
								{/* <div className="w-[400px] h-[400px]">
									<PieChart data={proteinRegionPossMap} />
								</div> */}
								{/* <Test /> */}
								{/* <Test2 /> */}
								{/* <Test3 /> */}
							</div>
							{/* <LargeDataSetChart /> */}
						</>
					) : (
						<div>
							<div>Sequence is not generated yet</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default App;
