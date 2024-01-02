import React, { useState, useMemo, useCallback } from "react";
import { FixedSizeList as List } from "react-window";

// Row component for each item in the list
const Row = ({ data, index, style }) => {
	const { items, onItemClick } = data;
	return (
		<div
			onClick={() => onItemClick(items[index])}
			style={{
				...style,
				cursor: "pointer",
				padding: "5px",
				borderBottom: "1px solid #ddd",
			}}
		>
			{items[index]}
		</div>
	);
};

function DropDown({ items }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedItem, setSelectedItem] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const filteredItems = useMemo(() => {
		// Ensure items is not null or undefined before filtering
		return items
			? items.filter((item) =>
					item.toLowerCase().includes(searchTerm.toLowerCase())
			  )
			: [];
	}, [searchTerm, items]);

	const onItemClick = useCallback((item) => {
		setSelectedItem(item);
		setSearchTerm(""); // Clear search term upon selection
		setIsOpen(false);
	}, []);

	return (
		<div style={{ width: "900px", margin: "auto" }}>
			<input
				type="text"
				value={selectedItem}
				onFocus={() => setIsOpen(true)}
				onChange={(e) => setSelectedItem(e.target.value)}
				placeholder="Select an item..."
				readOnly
				style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
			/>
			{isOpen && (
				<div>
					<input
						type="text"
						autoFocus
						placeholder="Type to search..."
						onChange={(e) => setSearchTerm(e.target.value)}
						style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
					/>
					<List
						height={300}
						itemCount={filteredItems.length}
						itemSize={35}
						width={900}
						itemData={{ items: filteredItems, onItemClick }}
					>
						{Row}
					</List>
				</div>
			)}
		</div>
	);
}

export default DropDown;
