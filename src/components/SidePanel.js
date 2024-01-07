import React from "react";

const SidePanel = ({ proteinRegions, onProteinHover, onProteinLeave }) => {
	return (
		<div className="side-panel">
			<h3>Protein Regions</h3>
			<ul>
				{Object.keys(proteinRegions).map((protein) => (
					<li
						key={protein}
						onMouseEnter={() => onProteinHover(protein)}
						onMouseLeave={onProteinLeave}
					>
						{protein}: {proteinRegions[protein]}
					</li>
				))}
			</ul>
		</div>
	);
};

export default SidePanel;
