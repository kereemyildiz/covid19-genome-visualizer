import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { generate } from "./features/genome/genomeSlice";
import RandomSequence from "./components/RandomSequence";
import BarChart from "./components/BarChart";
// import { generateRandomSequence } from "./helpers/fooGenomeElements";

function App() {
	const randomSeq = useSelector((state) => state.genome.randomSeq);
	const possibilityMap = useSelector((state) => state.genome.possibilityMap);
	console.log("possMap:", possibilityMap);

	const dispatch = useDispatch();

	return (
		<div className="App">
			{randomSeq ? (
				<>
					{console.log("seq: ", randomSeq)}
					<p>{randomSeq}</p>
					<RandomSequence />
					<BarChart data={possibilityMap} />
				</>
			) : (
				<div>
					<div>Sequence is not generated yet</div>
				</div>
			)}
			<div>
				<button onClick={() => dispatch(generate())}>Generate Sequence</button>
			</div>
		</div>
	);
}

export default App;
