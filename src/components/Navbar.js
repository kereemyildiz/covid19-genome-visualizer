import React, { useState } from "react";
import { nodeIds as nodes } from "../data/nodeIds";
import { modelList } from "../data/modelList";
import { useDispatch, useSelector } from "react-redux";
import {
	Option,
	Select as Select2,
	Button,
	Input,
} from "@material-tailwind/react";
import { MdOutlineCreate } from "react-icons/md";
import Select from "react-select";
import LoadingSpinner from "./Spinner";

import { proteinRegions } from "../data/proteinRegions";
import DropDown from "./DropDown";

function Navbar({ onNodeSelect, onSubmit }) {
	const nodeIds = useSelector((state) => state.genome.nodeList);
	const dispatch = useDispatch();
	const [_nodeId, setNodeId] = useState(null);
	const [_elapsedDay, setElapsedDay] = useState(null);
	const [selectedModel, setSelectedModel] = useState(null);
	const [selectedProteinRegion, setSelectedProteinRegion] = useState(null);

	const proteinRegionKeys = Object.keys(proteinRegions);

	if (!nodeIds) {
		return <LoadingSpinner />;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		onNodeSelect(_nodeId, _elapsedDay, selectedModel);
		onSubmit(_nodeId, _elapsedDay, selectedModel, selectedProteinRegion);
	};

	return (
		<div className="flex flex-col items-center sm:flex-row mt-2 justify-center ">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col px-2 pt-2 items-start w-[470px] sm:w-[440px] ">
					<label
						htmlFor="nodeId"
						className="text-sm mb-1 text-blue-600 font-semibold leading-6"
					>
						Prediction Model{" "}
						<span className="text-sm mb-1 text-red-300 font-semibold leading-1">
							*
						</span>
					</label>
					<Select
						required={true}
						onChange={(opt) => {
							setSelectedModel(opt.value);
						}}
						className="rounded-md w-[440px]"
						options={modelList.map((model) => ({ label: model, value: model }))}
						placeholder="Select Prediction Model"
						name="model"
					></Select>
				</div>
				<DropDown items={nodeIds} />
				<div className="flex  pt-2 ">
					<div className="flex px-2 pt-2 flex-col items-start">
						<label
							htmlFor="num"
							className="text-sm mb-1 font-semibold leading-6 text-blue-600"
						>
							Elapsed Days{" "}
							<span className="text-sm mb-1 text-red-300 font-semibold leading-1">
								*
							</span>
						</label>

						<Input
							required={true}
							onChange={(e) => {
								setElapsedDay(e.target.value);
							}}
							className="rounded-md h-[40px] w-[200px] border-black"
							type="number"
							label="e.g., 120"
						></Input>
					</div>
					<div className="flex flex-col px-2 pt-2 self-end  w-[470px] sm:w-[240px] ">
						<label
							htmlFor="nodeId"
							className="text-sm mb-1 text-blue-600 font-semibold leading-6"
						>
							Select Protein Region{" "}
						</label>
						<Select
							onChange={(opt) => {
								setSelectedProteinRegion(opt.value);
							}}
							label="Protein Region"
							name="protein"
							options={proteinRegionKeys.map((pr) => ({
								label: pr,
								value: pr,
							}))}
						></Select>
					</div>
				</div>

				<div className="flex justify-center pr-2 py-4 w-[470px] ">
					<Button
						color="blue"
						variant="gradient"
						type="submit"
						className="flex justify-center w-[440px] gap-2"
					>
						<MdOutlineCreate className="h-4 w-4" /> Predict
					</Button>
				</div>
			</form>
		</div>
	);
}

export default Navbar;
