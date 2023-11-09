import React, { useContext } from "react";
import { SequenceContext } from "../contexts/GenomeContext";

const RandomSequence = () => {
	const { randomGenome } = useContext(SequenceContext);

	return (
		<div>
			<h2>Random Genome:</h2>
			<pre>{JSON.stringify(randomGenome)}</pre>
		</div>
	);
};

export default RandomSequence;
