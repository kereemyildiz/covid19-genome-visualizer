import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { generate } from "./features/genome/genomeSlice";
import RandomSequence from "./components/RandomSequence";
// import { generateRandomSequence } from "./helpers/fooGenomeElements";

function App() {
	const randomSeq = useSelector((state) => state.genome.randomSeq);
	const dispatch = useDispatch();

	return (
		<div className="App">
			{randomSeq ? (
				<>
					{console.log("seq: ", randomSeq)}
					<p>{randomSeq}</p>
					<RandomSequence />
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
