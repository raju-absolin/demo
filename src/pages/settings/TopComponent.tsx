import { FilterFilled, FilterOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Grid2 as Grid,
	IconButton,
	InputAdornment,
	OutlinedInput,
	Stack,
	TextField,
} from "@mui/material";
import { FormInput, PageBreadcrumb } from "@src/components";
import { debounce, getFilterParams } from "@src/helpers";
import { selectManageGroups } from "@src/store/settings/manageGroups/manage_groups.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
import React, { SyntheticEvent, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { LuSearch } from "react-icons/lu";
import { Link, useOutletContext } from "react-router-dom";
import { object, string } from "yup";
import { FaPlusCircle } from "react-icons/fa";

type Props = {
	permissionPostFix: string;
	permissionPreFix: string;
	navigateLink: string;
	showAddButton: boolean;
	addButtonName: string;
	handleInputChange?: any;
	handleSearch: (value: { search?: string | undefined }) => void;
	showFilterButton: boolean;
	openFilter?: (value: boolean) => void;
	filteredData?: any;
	openModal?: (value: boolean) => void;
	children?: React.ReactNode;
};

const TopComponent = ({
	permissionPostFix,
	permissionPreFix,
	navigateLink,
	showAddButton,
	addButtonName,
	handleSearch,
	handleInputChange,
	showFilterButton = false,
	openFilter,
	filteredData,
	openModal,
	children,
}: Props) => {
	// const filteredData = getFilterParams(filterParams);
	const dispatch = useAppDispatch();
	const { userAccessList } = useAppSelector((state) => systemSelector(state));

	let searchSchema = object({
		search: string(),
	});

	const { control, handleSubmit, register, getValues } = useForm({
		resolver: yupResolver(searchSchema),
		values: {
			search: filteredData?.search,
		},
	});

	// Create memoized debounced search handler
	const debouncedSearch = useCallback(
		debounce((value: string) => {
			handleSearch({ search: value });
		}, 300),
		[handleSearch]
	);

	const outletContext = useOutletContext<{
		title: string;
		subtitle: string;
		setTitle: Function;
		setSubtitle: Function;
	}>();

	const searchValue = getValues("search");

	return (
		<Box
			sx={{
				borderRadius: "6px",
				mb: 2,
			}}>
			<Box mb={2}>
				{outletContext?.title && (
					<PageBreadcrumb
						title={outletContext?.title}
						subName={outletContext?.subtitle}
					/>
				)}
			</Box>
			<Grid container spacing={2}>
				<Grid
					size={{
						xs: 12,
						md: 12,
						lg: 4,
						xl: 4,
					}}>
					<form onSubmit={handleSubmit(handleSearch)}>
						<Stack direction="row" spacing={1} flex={1}>
							<TextField
								type="text"
								sx={{
									width: "100%",
								}}
								{...register("search")}
								id="input-with-icon-textfield"
								size="small"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<LuSearch size={20} />
										</InputAdornment>
									),
								}}
								variant="outlined"
								placeholder="Search"
								onChange={(event) => {
									debouncedSearch(event.target.value);
								}}
							/>
							{/* <Button
								variant="contained"
								type="submit"
								// disabled={searchValue ? false : true}
							>
								Search
							</Button> */}
						</Stack>
					</form>
				</Grid>

				<Grid
					size={{
						xs: 12,
						md: 12,
						lg: 8,
						xl: 8,
					}}>
					<Stack
						spacing={2}
						direction={"row"}
						justifyContent={{
							xs: "flex-start",
							lg: "flex-end",
						}}>
						{showFilterButton && (
							<IconButton
								onClick={() => openFilter && openFilter(true)}>
								{/* <LuFilter size="15" /> */}
								{!Object.values(filteredData).every(
									(e) =>
										e == undefined || e == "" || e == null
								) ? (
									<FilterFilled
										className="hp-mr-10"
										style={{
											fontSize: "16px",
										}}
									/>
								) : (
									<FilterOutlined
										className="hp-mr-10"
										style={{
											fontSize: "16px",
										}}
									/>
								)}
							</IconButton>
						)}
						{userAccessList?.indexOf(
							`${permissionPreFix}.add_${permissionPostFix}`
						) !== -1 &&
							navigateLink &&
							showAddButton && (
								<Link to={navigateLink}>
									<Button
										variant="contained"
										color="primary"
										size="large"
										endIcon={<FaPlusCircle size={14} />}>
										{addButtonName}
									</Button>
								</Link>
							)}
						{!navigateLink &&
							showAddButton &&
							userAccessList?.indexOf(
								`${permissionPreFix}.add_${permissionPostFix}`
							) !== -1 && (
								<Button
									variant="contained"
									color="primary"
									size="large"
									endIcon={<FaPlusCircle size={14} />}
									onClick={(event: SyntheticEvent) => {
										const target =
											event.target as HTMLButtonElement;
										openModal && openModal(true);
										target.blur();
									}}>
									{addButtonName}
								</Button>
							)}

						{children}
					</Stack>
				</Grid>
			</Grid>
		</Box>
	);
};

export default TopComponent;
