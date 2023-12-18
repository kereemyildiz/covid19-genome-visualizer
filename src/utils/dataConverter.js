export function chunkAndAverageData(data, chunkSize) {
	const chunkedData = [];
	for (let i = 0; i < data.length; i += chunkSize) {
		let chunk = data.slice(i, i + chunkSize);
		let sum = chunk
			.map((item) => item["mutationPoss"])
			.reduce((acc, { A, T, G, C }) => acc + A + T + G + C, 0);
		let avg = parseFloat((sum / chunkSize).toFixed(2));
		chunkedData.push(avg);
	}
	return chunkedData;
}
