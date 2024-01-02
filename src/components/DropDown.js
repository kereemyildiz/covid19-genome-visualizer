import React, { useState, useMemo, useCallback, useEffect } from "react";
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
				fontSize: "12px",
			}}
		>
			{items[index]}
		</div>
	);
};

function DropDown({ items, setNodeId }) {
	const [inputValue, setInputValue] = useState("");
	const [selectedItem, setSelectedItem] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const filteredItems = useMemo(() => {
		return items
			? items.filter((item) =>
					item.toLowerCase().includes(inputValue.toLowerCase())
			  )
			: [];
	}, [inputValue, items]);

	const onItemClick = useCallback((item) => {
		setSelectedItem(item);
		setNodeId(item);
		setInputValue(item);
		setIsOpen(false);
	}, []);

	const onInputChange = useCallback(
		(e) => {
			setInputValue(e.target.value);
			if (!selectedItem || e.target.value !== selectedItem) {
				setIsOpen(true);
				setSelectedItem("");
				setNodeId(null);
			}
		},
		[selectedItem]
	);

	useEffect(() => {
		if (!isOpen) {
			setInputValue(selectedItem);
		}
	}, [isOpen, selectedItem]);

	return (
		<div className="mx-auto">
			<input
				required={true}
				type="text"
				value={inputValue}
				onFocus={() => setIsOpen(true)}
				onChange={onInputChange}
				placeholder="Select an item..."
				className="w-full p-3 mb-2 border-2 border-gray-300 focus:border-blue-500 rounded-md"
			/>
			{isOpen && (
				<div className="shadow-lg rounded-md">
					<List
						height={300}
						width={500}
						itemCount={filteredItems.length}
						itemSize={35}
						itemData={{ items: filteredItems, onItemClick }}
						className="rounded-b-md "
					>
						{Row}
					</List>
				</div>
			)}
		</div>
	);
}
export default DropDown;
