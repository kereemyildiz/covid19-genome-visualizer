import React from "react";
import {
	List,
	ListItem,
	Card,
	Typography,
	ListItemSuffix,
	Chip,
	Tooltip,
	Switch,
} from "@material-tailwind/react";
import { proteinRegionColorMap } from "../utils/proteinRegionColorMap";
import { TooltipCustom } from "./TooltipComponent";

const SidePanel = ({
	proteinRegions,
	onProteinHover,
	onProteinLeave,
	handleshowFullAnnotation,
}) => {
	return (
		<div className="mr-4 mt-12">
			<Card className="w-60 ">
				<div className="flex justify-center">
					<Typography variant="h5" color="blue-gray" className="mb-2">
						Protein Regions
					</Typography>
					<TooltipCustom />
				</div>
				<div className="m-2 flex justify-center ">
					<Switch
						onChange={handleshowFullAnnotation}
						label="Show Protein Regions"
						labelProps={{ className: "font-medium" }}
						color="blue"
					/>
				</div>

				<List className="">
					{Object.keys(proteinRegions).map((protein) => (
						<ListItem
							className="text-sm p-1.5 flex items-center justify-end font-normal border-solid border-2 "
							onMouseEnter={() => onProteinHover(protein)}
							onMouseLeave={onProteinLeave}
						>
							{" "}
							<span className="font-semibold">{protein}:</span>
							{/* {proteinRegions[protein]} */}
							<ListItemSuffix>
								<Chip
									value={proteinRegions[protein]}
									variant="ghost"
									size="sm"
									className="rounded-full"
									style={{ backgroundColor: proteinRegionColorMap[protein] }}
								/>
							</ListItemSuffix>
						</ListItem>
					))}
				</List>
			</Card>
		</div>
	);
};

export default SidePanel;

// {Object.keys(proteinRegions).map((protein) => (
// 	<li
// 		key={protein}
// 		onMouseEnter={() => onProteinHover(protein)}
// 		onMouseLeave={onProteinLeave}
// 	>
// 		{protein}: {proteinRegions[protein]}
// 	</li>
// ))}
