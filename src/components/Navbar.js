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

const customStyles = {
	placeholder: (provided) => ({
		...provided,
		color: "#BDC3D4", // Set your desired color
		fontSize: "14px", // Set your desired font-size
	}),
	// ... You can add other custom styles for other parts of the select here
};

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
		<div className=" pt-4 flex flex-col items-center sm:flex-row mt-2 justify-center ">
			<form className="navbar" onSubmit={handleSubmit}>
				<div className="flex flex-col  pt-2 items-start w-[520px] ">
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
						className="rounded-md w-[520px] text-gray-900 "
						options={modelList.map((model) => ({ label: model, value: model }))}
						placeholder="Select Prediction Model"
						styles={customStyles} // Apply the custom styles here
						name="model"
					></Select>
				</div>
				<div className="w-[520px] pt-4">
					<label
						htmlFor="nodeId"
						className="text-sm mb-1 text-blue-600 font-semibold leading-6"
					>
						Covid19 Variant Id{" "}
						<span className="text-sm mb-1 text-red-300 font-semibold leading-1">
							*
						</span>
					</label>
					<DropDown items={nodeIds} setNodeId={setNodeId} />
				</div>
				<div className="flex justify-between ">
					<div className="flex pr-4 pt-2 flex-col items-start">
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
							className="rounded-md h-[40px] w-[200px] border-black input-placeholder"
							type="number"
							label="e.g., 120"
						></Input>
					</div>
					<div className="flex flex-col pt-2 self-end sm:w-[240px] ">
						<label
							htmlFor="nodeId"
							className="text-sm mb-1 text-blue-600 font-semibold leading-6"
						>
							Select Protein Region{" "}
						</label>
						<Select
							className="text-sm"
							onChange={(opt) => {
								setSelectedProteinRegion(opt.value);
							}}
							label="Protein Region"
							name="protein"
							options={proteinRegionKeys.map((pr) => ({
								label: pr,
								value: pr,
							}))}
							styles={customStyles} // Apply the custom styles here
						></Select>
					</div>
				</div>

				<div className="flex justify-center py-4  w-[520px] ">
					<Button
						color="blue"
						variant="gradient"
						type="submit"
						className="flex justify-center w-[520px] gap-2"
					>
						Predict <MdOutlineCreate className="h-4 w-4" />
					</Button>
				</div>
			</form>
		</div>
	);
}

export default Navbar;
