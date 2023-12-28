import React, { useState } from "react";
import { nodeIds } from "../data/nodeIds";
import { useDispatch } from "react-redux";
import { selectNode } from "../features/genome/genomeSlice";
import { Option, Select, Button, Input } from "@material-tailwind/react";
import { MdOutlineCreate } from "react-icons/md";
function Navbar() {
	const dispatch = useDispatch();
	const [_nodeId, setNodeId] = useState(null);
	const [_elapsedDay, setElapsedDay] = useState(null);
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("runned");
		dispatch(selectNode([_nodeId, _elapsedDay]));
	};
	return (
		<div className="flex flex-col items-center sm:flex-row mt-2 justify-center ">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col px-2 pt-2 items-start w-[470px] sm:w-[440px] ">
					<label
						htmlFor="nodeId"
						className="text-sm mb-1 text-blue-600 font-semibold leading-6"
					>
						Node Id
					</label>
					<Select
						onChange={(value) => {
							setNodeId(value);
						}}
						label="Select Node Id"
						name="nodeId"
					>
						{nodeIds.map((node, index) => (
							<Option key={index} value={node}>
								{node}
							</Option>
						))}
					</Select>
				</div>
				<div className="flex">
					<div className="flex px-2 pt-2 flex-col items-start">
						<label
							htmlFor="num"
							className="text-sm mb-1 font-semibold leading-6 text-blue-600"
						>
							Elapsed Day
						</label>
						<Input
							onChange={(e) => {
								setElapsedDay(e.target.value);
							}}
							className="rounded-md h-[40px] w-[200px] border-border"
							type="number"
							label="Ex: 120"
						/>
					</div>
					<div className="px-2 self-end ">
						<Button
							color="blue"
							variant="gradient"
							type="submit"
							className="flex items-center gap-"
						>
							<MdOutlineCreate className="h-4 w-4" /> Generate
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}

export default Navbar;
