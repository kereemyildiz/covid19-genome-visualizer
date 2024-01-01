import { createSlice, current } from "@reduxjs/toolkit";
import {
	generateRandomSequence,
	main,
	generateProteinRegionPossibility,
} from "../../helpers/fooGenomeElements";
import { proteinRegions } from "../../data/proteinRegions";

let nucleotides = { 0: "A", 1: "C", 2: "T", 3: "G" };

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
	model: null,
	modelList: null,
	nodeList: null,
	seq: null,
	realChartData: null,
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
			console.log(state.chartData);
		},
		setDataset: (state, action) => {
			console.log("burda", action.payload);
			const data = action.payload;
			state.seq = data[0][1].map((n_idx) => nucleotides[n_idx]);
			let dataset = [];
			for (const row of data) {
				console.log("girdi");
				console.log("row:", row[0]);
				dataset.push(row[0]);
			}
			state.realChartData = dataset;
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
			const [node, elapsedDay, model] = action.payload;
			state.nodeId = node;
			state.elapsedDay = elapsedDay;
			state.model = model;
			console.log("node:", node);
			console.log("elapsed day:", elapsedDay);
			console.log("model", model);
		},
		resetChart: (state) => {
			state.chartData = current(state).possibilityMap;
			state.isWholeSequenceSelected = true;
			state.chartTitle = "Full Sequence";
		},
		loadNodesAndModels: (state, action) => {
			const [models, nodes] = action.payload;
			state.modelList = models;
			state.nodeList = nodes;
		},
	},
});

export const {
	generate,
	addWindowSlice,
	showProteinRegion,
	resetChart,
	selectNode,
	loadNodesAndModels,
	setDataset,
} = genomeSlice.actions;
export default genomeSlice.reducer;
