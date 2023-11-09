import React, { createContext, useState } from "react";
import { generateRandomSequence } from "../helpers/fooGenomeElements";
import { main } from "../helpers/fooGenomeElements";

const SequenceContext = createContext();

const GenomeProvider = ({ children }) => {
	const [randomGenome, setRandomGenome] = useState([]);
	const [possibilityMap, setPossibilityMap] = useState([]);

	const generateRandomGenome = () => {
		const randomSeq = generateRandomSequence();
		setRandomGenome(randomSeq);
	};
	const generatePossibilityMap = () => {
		const possibilityMap_ = main(randomGenome);
		setPossibilityMap(possibilityMap_);
	};

	return (
		<SequenceContext.Provider
			value={{
				generateRandomGenome,
				randomGenome,
				generatePossibilityMap,
				possibilityMap,
			}}
		>
			{children}
		</SequenceContext.Provider>
	);
};

export { GenomeProvider, SequenceContext };
