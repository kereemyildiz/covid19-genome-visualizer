import {
	nucleotides,
	windowSize,
	sequenceLength,
} from "../constants/constantVars";

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

		console.log("window_slice: ", windowSlice);

		return {
			pos: index,
			nucleotide,
			mutationPoss,
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

// Example usage:
export function main(randomGenome) {
	const [possibilityMap, windowSliceArr] = windowPropagation(
		randomGenome,
		windowSize
	);
	console.log("result:", possibilityMap);
	return [possibilityMap, windowSliceArr];
}
