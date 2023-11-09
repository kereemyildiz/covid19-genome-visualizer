import { useContext } from "react";
import { nucleotides, windowSize } from "../constants/constantVars";
import { createArrayOfDictionaries } from "../data/possibilityMap";

// parameters: None
// objective: generates 30k long random strain
// return: 30k length long array
export function generateRandomSequence(length = 30000) {
	const randomSequence = Array.from(
		{ length },
		() => nucleotides[Math.floor(Math.random() * nucleotides.length)]
	);
	return randomSequence;
}

export function featureExtractor(kmers = null) {
	return kmers;
}

export function fooModelOutputGenerator(kmerFeatures = null) {
	const randomNumber = Math.random();
	return parseFloat(randomNumber.toFixed(2));
}
function windowPropagation(randomGenome2, windowLength) {
	const arrayOfDictionaries = randomGenome2.map((nucleotide, index) => {
		let windowSlice = [];
		if (index === 0) {
			windowSlice = randomGenome2.slice(index, index + windowLength - 2);
			windowSlice.unshift("-");
			windowSlice.unshift("-");
		} else if (index === 1) {
			windowSlice = randomGenome2.slice(index - 1, index + windowLength - 2);
			windowSlice.unshift("-");
		} else if (index === 2) {
			windowSlice = randomGenome2.slice(index - 2, index + windowLength - 2);
		} else if (index === randomGenome2.length - 2) {
			windowSlice = randomGenome2.slice(index - 2, index + windowLength - 2);
			windowSlice.push("-");
		} else if (index === randomGenome2.length - 1) {
			windowSlice = randomGenome2.slice(index - 2, index + windowLength - 2);
			windowSlice.push("-");
			windowSlice.push("-");
		} else {
			windowSlice = randomGenome2.slice(index - 2, index + windowLength - 2);
		}

		// windowSlice feature extract

		const mutationPoss = calculateMutationPoss(windowSlice);

		return {
			pos: index,
			nucleotide,
			mutationPoss,
		};
	});

	return arrayOfDictionaries;
}

function calculateMutationPoss(windowSlice) {
	const mutationPoss = { A: 0, T: 0, G: 0, C: 0 };

	for (const key in mutationPoss) {
		mutationPoss[key] = fooModelOutputGenerator();
	}

	return mutationPoss;
}

// Example usage:
export function main(randomGenome) {
	const result = windowPropagation(randomGenome, windowSize);
	console.log("result:", result);
}
