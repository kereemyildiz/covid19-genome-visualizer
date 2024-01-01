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

function Navbar({ onNodeSelect, onSubmit }) {
	const nodeIds = useSelector((state) => state.genome.nodeList);
	const dispatch = useDispatch();
	const [_nodeId, setNodeId] = useState(null);
	const [_elapsedDay, setElapsedDay] = useState(null);
	const [selectedModel, setSelectedModel] = useState(null);

	if (!nodeIds) {
		return <LoadingSpinner />;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		onNodeSelect(_nodeId, _elapsedDay, selectedModel);
		onSubmit(_nodeId, _elapsedDay, selectedModel);
	};

	return (
		<div className="flex flex-col items-center sm:flex-row mt-2 justify-center ">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col px-2 pt-2 items-start w-[470px] sm:w-[440px] ">
					<label
						htmlFor="nodeId"
						className="text-sm mb-1 text-blue-600 font-semibold leading-6"
					>
						Prediction Model
					</label>
					<Select2
						onChange={(value) => {
							setSelectedModel(value);
						}}
						label="Select Prediction Model"
						name="model"
					>
						{modelList.map((model, index) => (
							<Option key={index} value={model}>
								{model}
							</Option>
						))}
					</Select2>
				</div>
				<div className="flex flex-col px-2 pt-2 items-start w-[470px] sm:w-[440px] ">
					<label
						htmlFor="nodeId"
						className="text-sm mb-1 text-blue-600 font-semibold leading-6"
					>
						Covid19 Variant Id
					</label>
					{/* Covid19 Variant Id (Enter country acronym, e.g., USA or year, e.g.,
					2021) */}
					<Select
						placeholder="Select Variant Id"
						className="w-[440px]"
						options={nodes.map((opt) => ({ label: opt, value: opt }))}
						onChange={(opt) => {
							setNodeId(opt.value);
						}}
					/>
				</div>
				<div className="flex">
					<div className="flex px-2 pt-2 flex-col items-start">
						<label
							htmlFor="num"
							className="text-sm mb-1 font-semibold leading-6 text-blue-600"
						>
							Elapsed Days
						</label>
						<Input
							onChange={(e) => {
								setElapsedDay(e.target.value);
							}}
							className="rounded-md h-[40px] w-[200px] border-border"
							type="number"
							label="e.g: 120"
						/>
					</div>
					<div className="px-2 self-end ">
						<Button
							color="blue"
							variant="gradient"
							type="submit"
							className="flex items-center gap-"
						>
							<MdOutlineCreate className="h-4 w-4" /> Predict
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}

export default Navbar;
