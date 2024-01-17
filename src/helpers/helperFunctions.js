export function getColorForNucleotide(nucleotide) {
	const colorMap = {
		A: "#FF5733",
		C: "#3399FF",
		T: "#33CC33",
		G: "#9966FF",
	};

	return colorMap[nucleotide] || "#000000";
}

export const nucleotides = { 0: "A", 1: "C", 2: "T", 3: "G" };
