import { createSlice, current } from "@reduxjs/toolkit";
import {
	generateRandomSequence,
	main,
	generateProteinRegionPossibility,
	generateProteinRegionPossibility2,
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
	proteinRegionPossMap2: null,
	showDoughnut: false,
	selectedProteinRegion: null,
};

export const genomeSlice = createSlice({
	name: "genome",
	initialState,
	reducers: {
		generate: (state) => {
			state.randomSeq = generateRandomSequence();
			// const output = main(state.randomSeq);
			// const _possMap = output[0];
			// state.possibilityMap = _possMap;
			// state.chartData = _possMap;
			// state.windowSlices = output[1];
			// state.proteinRegionPossMap = generateProteinRegionPossibility(_possMap);
			// console.log(state.chartData);
		},
		setDataset: (state, action) => {
			console.log("burda", action.payload);
			const [data, genome, pr_poss, isSelected] = action.payload;
			state.seq = genome;
			state.showDoughnut = false;
			state.chartData = data;
			state.realChartData = data;
			if (!isSelected) {
				state.showDoughnut = true;
				state.proteinRegionPossMap = pr_poss;
			}
			// state.proteinRegionPossMap2 = generateProteinRegionPossibility2(data);
		},
		showProteinRegion: (state, action) => {
			const [start, end] = proteinRegions[action.payload]
				.split("-")
				.map((pos) => parseInt(pos));
			const chartData = current(state).chartData;
			console.log(chartData);
			state.chartTitle = action.payload;
			state.realChartData = chartData.map((arr) => arr.slice(start, end + 1));
			state.isWholeSequenceSelected = false;
			state.selectedProteinRegion = action.payload;
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
			state.realChartData = current(state).chartData;
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
