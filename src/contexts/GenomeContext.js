import React, { createContext, useState } from "react";
import { generateRandomSequence } from "../helpers/fooGenomeElements";

const SequenceContext = createContext();

const GenomeProvider = ({ children }) => {
	const [randomGenome, setRandomGenome] = useState([]);

	const generateRandomGenome = () => {
		const randomSeq = generateRandomSequence();
		setRandomGenome(randomSeq);
	};

	return (
		<SequenceContext.Provider value={{ generateRandomGenome, randomGenome }}>
			{children}
		</SequenceContext.Provider>
	);
};

export { GenomeProvider, SequenceContext };
