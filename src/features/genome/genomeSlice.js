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
	chartTitle: "Full Sequence",
	isWholeSequenceSelected: true,
	elapsedDay: null,
	nodeId: null,
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
		showProteinRegion: (state, action) => {
			const [start, end] = proteinRegions[action.payload]
				.split("-")
				.map((pos) => parseInt(pos));
			const possMap = current(state).possibilityMap;
			console.log(possMap);
			state.chartTitle = action.payload;
			state.chartData = possMap.filter(
				(item) => item.pos >= start && item.pos <= end
			);
			state.isWholeSequenceSelected = false;
		},
		selectNode: (state, action) => {
			const [node, elapsedDay] = action.payload;
			state.nodeId = node;
			state.elapsedDay = elapsedDay;
			console.log("node:", node);
			console.log("elapsed day:", elapsedDay);
		},
		resetChart: (state) => {
			state.chartData = current(state).possibilityMap;
			state.isWholeSequenceSelected = true;
			state.chartTitle = "Full Sequence";
		},
	},
});

export const {
	generate,
	addWindowSlice,
	showProteinRegion,
	resetChart,
	selectNode,
} = genomeSlice.actions;
export default genomeSlice.reducer;
