import { nucleotides, windowSize } from "../constants/constantVars";

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
function windowPropagation(randomGenome, windowLength) {
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

		// windowSlice feature extract
		console.log("windowSlice:", windowSlice);
		const mutationPoss = calculateMutationPoss(windowSlice);

		return {
			pos: index,
			nucleotide,
			mutationPoss,
		};
	});

	return possibilityMap;
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
	const possibilityMap = windowPropagation(randomGenome, windowSize);
	console.log("result:", possibilityMap);
}
