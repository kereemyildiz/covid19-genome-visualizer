import { createSlice, current } from "@reduxjs/toolkit";
import {
	generateRandomSequence,
	main,
	generateProteinRegionPossibility,
} from "../../helpers/fooGenomeElements";
import { proteinRegions } from "../../data/proteinRegions";

const initialState = {
	randomSeq: null,
	possibilityMap: null,
	windowSlices: null,
	proteinRegionPossMap: null,
	chartData: null,
};

export const genomeSlice = createSlice({
	name: "genome",
	initialState,
	reducers: {
		generate: (state) => {
			state.randomSeq = generateRandomSequence();
			const output = main(state.randomSeq);
			const _possMap = output[0];
			state.possibilityMap = _possMap;
			state.chartData = _possMap;
			state.windowSlices = output[1];
			state.proteinRegionPossMap = generateProteinRegionPossibility(_possMap);
		},
		changeDataset: (state, action) => {
			const [start, end] = proteinRegions[action.payload]
				.split("-")
				.map((pos) => parseInt(pos));
			const possMap = current(state).possibilityMap;
			console.log(possMap);

			state.chartData = possMap.filter(
				(item) => item.pos >= start && item.pos <= end
			);
		},
	},
});

export const { generate, addWindowSlice, changeDataset } = genomeSlice.actions;
export default genomeSlice.reducer;
