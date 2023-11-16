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
							className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
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
							<div className="flex center">
								<div
									style={{
										position: "relative",
										height: "30vh",
										width: "60vw",
									}}
								>
									<BarChart data={possibilityMap} />
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
