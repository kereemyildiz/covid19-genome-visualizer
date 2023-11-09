import { useContext, useEffect } from "react";
import "./App.css";
// import { generateRandomSequence } from "./helpers/fooGenomeElements";
import { SequenceContext } from "./contexts/GenomeContext";
import RandomSequence from "./components/RandomSequence";
import { main } from "./helpers/fooGenomeElements";

function App() {
	const {
		generateRandomGenome,
		randomGenome,
		generatePossibilityMap,
		possibilityMap,
	} = useContext(SequenceContext);
	useEffect(() => {
		console.log("1");
		generateRandomGenome();
	}, []);

	useEffect(() => {
		generatePossibilityMap();
	}, [randomGenome]);

	return (
		<div className="App">
			<RandomSequence />
			{console.log("22", randomGenome)}
		</div>
	);
}

export default App;
