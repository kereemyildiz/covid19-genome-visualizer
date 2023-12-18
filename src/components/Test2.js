import React, { useState } from "react";

const Test2 = () => {
	const [newData, setNewData] = useState(null);
	const [loading, setLoading] = useState(false);
	function generateData() {
		return new Promise((resolve) => {
			// Simulate time-consuming task using setTimeout
			setTimeout(function () {
				// Generate some data (e.g., an array of random numbers)
				const data = Array.from({ length: 100 }, () => Math.random());
				resolve(data); // Resolve the Promise with the generated data
			}, 2000); // Simulating 2 seconds of delay
		});
	}

	async function fetchData() {
		console.log("Generating data...");
		setLoading(true);
		const data = await generateData();
		console.log("Data generated:", data.length, "items");
		setNewData(data);
		setLoading(false);
		// Do something with the generated data here
	}

	// Call the async function

	return (
		<div>
			{loading ? (
				"Spinner"
			) : (
				<div>
					<div>Test2</div>
					<div>
						<button onClick={fetchData}>fetch data</button>
					</div>
					<div>{newData ? newData.slice(0, 5) : "data is not generated"}</div>
				</div>
			)}
		</div>
	);
};

export default Test2;
