import {
	nucleotides,
	windowSize,
	sequenceLength,
} from "../constants/constantVars";
import { proteinRegions } from "../data/proteinRegions";

// parameters: None
// objective: generates 30k long random strain
// return: 30k length long array
export function generateRandomSequence(length = sequenceLength) {
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

// this function is hardcoded for windowSize=5 for now...
// TODO: refactor this function
function windowPropagation(randomGenome, windowLength) {
	const windowSliceArr = [];
	const possibilityMap = randomGenome.map((nucleotide, index) => {
		let windowSlice = [];
		if (index === 0) {
			windowSlice = randomGenome.slice(index, index + windowLength - 2);
			windowSlice.unshift("-");
			windowSlice.unshift("-");
		} else if (index === 1) {
			windowSlice = randomGenome.slice(index - 1, index + windowLength - 2);
			windowSlice.unshift("-");
		} else if (index === 2) {
			windowSlice = randomGenome.slice(index - 2, index + windowLength - 2);
		} else if (index === randomGenome.length - 2) {
			windowSlice = randomGenome.slice(index - 2, index + windowLength - 2);
			windowSlice.push("-");
		} else if (index === randomGenome.length - 1) {
			windowSlice = randomGenome.slice(index - 2, index + windowLength - 2);
			windowSlice.push("-");
			windowSlice.push("-");
		} else {
			windowSlice = randomGenome.slice(index - 2, index + windowLength - 2);
		}
		windowSliceArr.push(windowSlice);
		// windowSlice feature extract
		const mutationPoss = calculateMutationPoss(windowSlice);

		let proteinRegion = "";
		if (index <= 399) {
			proteinRegion = "ORF1ab protein";
		} else if (index >= 400 && index <= 459) {
			proteinRegion = "S protein";
		} else if (index >= 460 && index <= 510) {
			proteinRegion = "ORF3a protein";
		} else if (index >= 511 && index <= 600) {
			proteinRegion = "E protein";
		} else if (index >= 601 && index <= 630) {
			proteinRegion = "M protein";
		} else if (index >= 631 && index <= 699) {
			proteinRegion = "ORF6 protein";
		} else if (index >= 700 && index <= 799) {
			proteinRegion = "ORF7a protein";
		} else if (index >= 800 && index <= 849) {
			proteinRegion = "ORF8 protein";
		} else if (index >= 850 && index <= 899) {
			proteinRegion = "N protein";
		} else if (index >= 900 && index <= 999) {
			proteinRegion = "ORF10 protein";
		}

		return {
			pos: index,
			nucleotide,
			mutationPoss,
			proteinRegion,
		};
	});

	return [possibilityMap, windowSliceArr];
}

function calculateMutationPoss(windowSlice) {
	const mutationPoss = { A: 0, T: 0, G: 0, C: 0 };

	for (const key in mutationPoss) {
		mutationPoss[key] = fooModelOutputGenerator();
	}

	return mutationPoss;
}

// input: mutationPoss and indexes
// output: Sum of the mutation possibilities for each protein region
// i.e: "S": 17,
//      "ORF1a" : 23
const calculateSumOfMutationProbability = (currentProteinRegion) => {
	return currentProteinRegion.reduce((acc, curr) => {
		const sum = Object.keys(curr.mutationPoss)
			.filter((key) => key !== curr.nucleotide)
			.reduce(
				(acc, key) => parseFloat(acc) + parseFloat(curr.mutationPoss[key]),
				0
			)
			.toFixed(2);
		return (parseFloat(acc) + parseFloat(sum)).toFixed(2);
	}, 0);
};
export function generateProteinRegionPossibility(data) {
	// console.log("protein region");
	// console.log("data: ", data);
	// console.log("map:", proteinRegions);
	const proteinRegionPossMap = {};
	for (const [proteinName, interval] of Object.entries(proteinRegions)) {
		const [start, end] = interval.split("-").map((pos) => parseInt(pos));
		const currentProteinRegion = data.slice(start, end + 1);
		const prSum = parseFloat(
			calculateSumOfMutationProbability(currentProteinRegion)
		);

		proteinRegionPossMap[proteinName] = prSum;
	}
	// console.log("proteinRegionPossMap:", proteinRegionPossMap);
	return proteinRegionPossMap;
}

// Example usage:
export function main(randomGenome) {
	const [possibilityMap, windowSliceArr] = windowPropagation(
		randomGenome,
		windowSize
	);
	console.log("result:", possibilityMap);
	return [possibilityMap, windowSliceArr];
}
