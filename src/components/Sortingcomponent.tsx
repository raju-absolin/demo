import React, { useState, useRef } from "react";
import {
	IconButton,
	Popover,
	MenuList,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Divider,
} from "@mui/material";
import {
	LuArrowUpDown,
	LuArrowUpNarrowWide,
	LuArrowUpWideNarrow,
	LuCheck,
} from "react-icons/lu";

// const SORT_OPTIONS = ["Name", "Modified", "Type", "Size"];
// const TYPE_OPTIONS = ["Ascending", "Descending"];
type Props = {
	SORT_OPTIONS: { label: string; value: string }[];
	onSortChange: (option: { label: string; value: string }) => void;
	onTypeChange: (type: boolean) => void;
};

const SortMenu = ({ SORT_OPTIONS, onSortChange, onTypeChange }: Props) => {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const [selectedSort, setSelectedSort] = useState<{
		label: string;
		value: string;
	}>({
		label: "",
		value: "",
	});
	const [ascending, setAscending] = useState(true);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Open Popover when hovering over the button
	const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setAnchorEl(event.currentTarget);
	};

	// Delay closing to prevent flickering
	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setAnchorEl(null);
		}, 200); // Small delay prevents instant closing
	};

	// Keep the dropdown open when moving inside it
	const handlePopoverEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	};

	// Handle sorting option change
	const handleSortChange = (option: { label: string; value: string }) => {
		setSelectedSort(option);
		onSortChange(option);
	};

	// Toggle sorting order
	const toggleSortOrder = () => {
		setAscending((prev) => !prev);
		onTypeChange(!ascending);
	};

	return (
		<div>
			{/* Sort Button */}
			<IconButton
				onMouseEnter={handleMouseEnter}
				sx={(theme) => ({
					bgcolor: theme.palette.primary.main,
					color: theme.palette.common.white,
					"&:hover": {
						color: theme.palette.common.black,
					},
				})}>
				<LuArrowUpDown size={20} />
			</IconButton>

			{/* Sort Menu (Popover with hover effect) */}
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handleMouseLeave}
				disableRestoreFocus
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
				PaperProps={{
					onMouseEnter: handlePopoverEnter,
					onMouseLeave: handleMouseLeave,
				}}>
				<MenuList sx={{ minWidth: 160 }}>
					{SORT_OPTIONS.map((option) => (
						<MenuItem
							key={option?.value}
							onClick={(event) => {
								event.stopPropagation(); // Prevents menu from closing
								handleSortChange(option);
							}}>
							<ListItemIcon>
								{selectedSort?.value === option?.value ? (
									<LuCheck />
								) : null}
							</ListItemIcon>
							<ListItemText>{option?.label}</ListItemText>
						</MenuItem>
					))}
					<Divider />
					<MenuItem
						disabled={selectedSort?.value ? false : true}
						onClick={(event) => {
							event.stopPropagation();
							toggleSortOrder();
						}}>
						<ListItemIcon>
							{ascending ? (
								<LuArrowUpWideNarrow />
							) : (
								<LuArrowUpNarrowWide />
							)}
						</ListItemIcon>
						<ListItemText>
							{ascending ? "Ascending" : "Descending"}
						</ListItemText>
					</MenuItem>
				</MenuList>
			</Popover>
		</div>
	);
};

export default SortMenu;
