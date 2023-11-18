import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { generate, setLoading } from "./features/genome/genomeSlice";
import RandomSequence from "./components/RandomSequence";
import BarChart from "./components/BarChart";
import Spinner from "./components/Spinner";
import PieChart from "./components/DoughnutChart";
// import { generateRandomSequence } from "./helpers/fooGenomeElements";

function App() {
	const randomSeq = useSelector((state) => state.genome.randomSeq);
	const possibilityMap = useSelector((state) => state.genome.possibilityMap);
	const barChartData = useSelector((state) => state.genome.chartData);

	const proteinRegionPossMap = useSelector(
		(state) => state.genome.proteinRegionPossMap
	);
	const loading = useSelector((state) => state.genome.loading);
	const windowSlices = useSelector((state) => state.genome.windowSlices);
	console.log("possMap:", possibilityMap);
	console.log("loading:", loading);

	const dispatch = useDispatch();

	const handleGenerate = () => {
		dispatch(generate());
	};
	return (
		<div className="App">
			{loading ? (
				<div>
					{console.log("123")}
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
							{console.log("seq: ", randomSeq)}
							<RandomSequence />
							<br />
							<div className="flex justify-center">
								<div className="flex flex-col">
									{windowSlices
										.filter((item, idx) => idx < 10)
										.map((item, idx) => (
											<div>
												<pre>{JSON.stringify(item)}</pre>
											</div>
										))}
								</div>
								{"   "}
								<div className="flex flex-col">
									{possibilityMap
										.filter((item) => item.pos < 10)
										.map((item) => (
											<div>
												<pre>{JSON.stringify(item)}</pre>
											</div>
										))}
								</div>
							</div>
							<div className="flex justify-center gap-10 p-4">
								<div className="w-[800px] h-[400px]">
									<BarChart data={barChartData} />
								</div>
								<div className="w-[400px] h-[400px]">
									<PieChart data={proteinRegionPossMap} />
								</div>
							</div>
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
