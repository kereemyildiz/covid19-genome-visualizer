import { createSlice } from "@reduxjs/toolkit";
import { generateRandomSequence, main } from "../../helpers/fooGenomeElements";

const initialState = {
	randomSeq: null,
	possibilityMap: null,
	windowSlices: null,
};

export const genomeSlice = createSlice({
	name: "genome",
	initialState,
	reducers: {
		generate: (state) => {
			state.randomSeq = generateRandomSequence();
			const output = main(state.randomSeq);
			state.possibilityMap = output[0];
			state.windowSlices = output[1];
			console.log("wwwwwwwwwwwwwww:", output);
		},
	},
});

export const { generate, addWindowSlice } = genomeSlice.actions;
export default genomeSlice.reducer;
