import React, { SyntheticEvent } from "react";
import {
	Card,
	Box,
	Button,
	Typography,
	IconButton,
	useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { RiAddCircleFill, RiArrowLeftCircleFill } from "react-icons/ri";
import { selectLayoutTheme } from "@src/store/customise/customise";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { useSelector } from "react-redux";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { systemSelector } from "@src/store/system/system.slice";
import { LuFilter } from "react-icons/lu";

type props = {
	pageTitle: string;
	pageText?: string;
	modalVisible?: boolean;
	setIsModalVisible?: (value: boolean) => void;
	goBack: boolean;
	addModelTile?: string;
	prefix: string;
	postfix: string;
	navigationToAdd?: string;
	otherButtons?: any;
	showFilterButton?: boolean;
	openFilter?: (value: boolean) => void;
	filteredData?: any;
	children?: React.ReactNode;
};

const MaterPageTitle = ({
	pageTitle,
	pageText,
	addModelTile,
	goBack,
	modalVisible,
	setIsModalVisible,
	postfix,
	prefix,
	navigationToAdd,
	otherButtons,
	showFilterButton = false,
	openFilter,
	filteredData,
	children,
}: props) => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { userAccessList } = useAppSelector((state) => systemSelector(state));
	const theme = useTheme();

	let searchSchema = object({
		search: string(),
	});

	const { control, handleSubmit, register } = useForm({
		resolver: yupResolver(searchSchema),
		values: {
			search: filteredData?.search,
		},
	});

	return (
		<Box sx={{ flexGrow: 1 }}>
			<Card sx={{ padding: 2, border: "none", marginTop: "15px" }}>
				<Box
					display="flex"
					justifyContent="space-between"
					alignItems="center">
					<Box display="flex" alignItems="center">
						{goBack && (
							<>
								<Link
									to="#"
									onClick={() => navigate(-1)}
									style={{
										textDecoration: "none",
										color: theme.palette?.primary?.main,
									}}>
									<RiArrowLeftCircleFill size={20} />
								</Link>
							</>
						)}
						{pageTitle && (
							<Typography
								variant="h5"
								sx={{
									marginLeft: goBack ? "12px" : "0",
									mt: -1,
								}}>
								{pageTitle}
							</Typography>
						)}
						{pageText && (
							<Typography
								variant="body2"
								style={{ marginLeft: "8px" }}>
								{pageText}
							</Typography>
						)}
					</Box>
					<Box>
						{showFilterButton && (
							<IconButton
								onClick={() => openFilter && openFilter(true)}>
								<LuFilter size="15" />
							</IconButton>
						)}
						{otherButtons && otherButtons}
						{addModelTile && (
							<Button
								variant="contained"
								color="primary"
								onClick={(event: SyntheticEvent) => {
									if (setIsModalVisible) {
										setIsModalVisible
											? setIsModalVisible(true)
											: false;
										const target =
											event.target as HTMLElement;
										target.blur();
									} else if (navigationToAdd) {
										navigate(navigationToAdd); // Navigate to the specified route
									}
									// setIsModalVisible ? setIsModalVisible(true) : false
								}}
								endIcon={<RiAddCircleFill size={16} />}>
								{addModelTile}
							</Button>
						)}
					</Box>
				</Box>
				{children}
			</Card>
		</Box>
	);
};
export default MaterPageTitle;
