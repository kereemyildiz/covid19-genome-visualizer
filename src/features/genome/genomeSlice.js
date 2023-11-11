import { createSlice } from "@reduxjs/toolkit";
import { generateRandomSequence, main } from "../../helpers/fooGenomeElements";

const initialState = {
	randomSeq: null,
	possibilityMap: null,
};

export const genomeSlice = createSlice({
	name: "genome",
	initialState,
	reducers: {
		generate: (state) => {
			state.randomSeq = generateRandomSequence();
			state.possibilityMap = main(state.randomSeq);
		},
	},
});

export const { generate } = genomeSlice.actions;
export default genomeSlice.reducer;
