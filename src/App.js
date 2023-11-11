import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { generate, setLoading } from "./features/genome/genomeSlice";
import RandomSequence from "./components/RandomSequence";
import BarChart from "./components/BarChart";
import Spinner from "./components/Spinner";
// import { generateRandomSequence } from "./helpers/fooGenomeElements";

function App() {
	const randomSeq = useSelector((state) => state.genome.randomSeq);
	const possibilityMap = useSelector((state) => state.genome.possibilityMap);
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
						<button onClick={handleGenerate}>Generate Sequence</button>
					</div>
					{randomSeq ? (
						<>
							{console.log("seq: ", randomSeq)}
							<RandomSequence />
							<div>
								{windowSlices
									.filter((item, idx) => idx < 10)
									.map((item) => (
										<div>
											<pre>{JSON.stringify(item)}</pre>
										</div>
									))}
								{possibilityMap
									.filter((item) => item.pos < 10)
									.map((item) => (
										<div>
											<pre>{JSON.stringify(item)}</pre>
										</div>
									))}
							</div>

							<BarChart data={possibilityMap} />
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
