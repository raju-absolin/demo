import { yupResolver } from "@hookform/resolvers/yup";
import {
	Box,
	Button,
	Checkbox,
	Divider,
	Grid2 as Grid,
	IconButton,
	Stack,
	Tooltip,
	Typography,
	Zoom,
} from "@mui/material";
import TopComponent from "@src/pages/settings/TopComponent";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import TableComponent from "@src/components/TableComponenet";
import {
	getDocumentById,
	getDocuments,
} from "@src/store/sidemenu/tender_mangement/document/document.action";
import {
	selectDocument,
	setOpenAddDocumentModal,
	setSelectedData,
} from "@src/store/sidemenu/tender_mangement/document/document.slice";
import AddDocument from "./document.add";
import { LuEye, LuPencil } from "react-icons/lu";

const Document = () => {
	// add item form
	const { id, tab } = useParams();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const {
		document: {
			documentList,
			pageParams,
			selectedData,
			openAddDocumentModal,
		},
		mini: { miniDocuments },
		system: { userAccessList },
	} = useAppSelector((state) => selectDocument(state));

	useEffect(() => {
		dispatch(
			getDocuments({
				...pageParams,
				search: "",
				page: 1,
				page_size: 10,
				tender: id,
			})
		);
	}, []);

	const temp_columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Name",
			width: 100,
		},
		{
			title: "Is Submitted",
			width: 100,
		},
		{
			title: "Attached Document",
			width: 100,
		},
		{
			title: "Action",
			width: 100,
		},
	];

	const columns = temp_columns.filter((e) => {
		if (e.title === "Action") {
			return (
				userAccessList?.indexOf("TenderManagement.change_casesheet") !==
				-1
			);
		}
		return e;
	});

	function createData(
		index: number,
		document: string,
		yesCheck: JSX.Element | string,
		file: React.JSX.Element,
		action?: JSX.Element
	) {
		return {
			index,
			document,
			yesCheck,
			file,
			action,
		};
	}

	const rows2 = useMemo(() => {
		return (
			documentList &&
			documentList?.map((row, key: number) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const document =
					// <Button color="primary" variant="contained" sx={{ width: 150 }}>
					row?.document?.name
						? row?.document?.name
						: row?.document_name
							? row?.document_name
							: "";
				// </Button>
				const file = (
					<Tooltip TransitionComponent={Zoom} title="View File">
						<IconButton
							component={"a"}
							href={row?.file}
							target="_blank">
							<LuEye
								size={16}
								style={{
									color: "#167bf0",
								}}
							/>
						</IconButton>
					</Tooltip>
				);

				const yesCheck = row?.is_submitted
					? "Submitted"
					: "Not Submitted";

				const actions = (
					<Box
						sx={{
							display: "flex",
							gap: 2,
							justifyContent: "start",
						}}>
						{userAccessList?.indexOf(
							"TenderManagement.change_casesheet"
						) !== -1 && (
							<Tooltip
								TransitionComponent={Zoom}
								title="Edit Document">
								{/* <LuPencil
									onClick={() => {
										dispatch(setSelectedData(row));
										openModal(true);
									}}
									style={{
										cursor: "pointer",
										color: "#fc6f03",
									}}
								/> */}

								<IconButton
									sx={{
										gap: 1,
									}}
									onClick={() => {
										dispatch(setSelectedData(row));
										openModal(true);
										dispatch(
											getDocumentById({ id: row?.id })
										);
									}}>
									<LuPencil
										style={{
											cursor: "pointer",
											color: "#fc6f03",
											fontSize: 16,
										}}
									/>
									{/* <Typography>Edit</Typography> */}
								</IconButton>
							</Tooltip>
						)}
					</Box>
				);

				return createData(index, document, yesCheck, file, actions);
			})
		);
	}, [miniDocuments, selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getDocuments({
				...pageParams,
				tender: id,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getDocuments({
				...pageParams,
				tender: id,
				search: "",
				page_size: parseInt(event.target.value),
			})
		);
	};

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getDocuments({
				...pageParams,
				tender: id,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	const hide = () => {
		dispatch(setOpenAddDocumentModal(false));
	};

	const openModal = (isOpen: boolean) => {
		dispatch(setOpenAddDocumentModal(isOpen));
	};

	const addDocumnetModal = useMemo(() => {
		return <AddDocument open={openAddDocumentModal} hide={hide} />;
	}, [openAddDocumentModal]);

	return (
		<Box>
			<Box
				p={4}
				sx={{
					borderRadius: 2,
				}}>
				<Typography
					variant="h4"
					align="center"
					gutterBottom
					sx={{
						fontWeight: "bold",
						color: "#3f51b5",
					}}>
					Document Details
				</Typography>
				<Grid container justifyContent="flex-end" spacing={2} pb={2}>
					{userAccessList?.indexOf(
						"TenderManagement.add_casesheet"
					) !== -1 && (
						<Button
							variant="contained"
							onClick={() => {
								dispatch(setSelectedData({}));
								openModal(true);
							}}>
							Add
						</Button>
					)}
				</Grid>

				<Divider sx={{ mb: 4 }} />
				<TableComponent
					count={miniDocuments?.count}
					columns={columns}
					rows={rows2 ? rows2 : []}
					loading={false}
					page={pageParams?.page ? pageParams?.page : 1}
					pageSize={
						pageParams?.page_size ? pageParams?.page_size : 10
					}
					handleChangePage={handleChangePage}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
					showPagination={false}
				/>
			</Box>
			{addDocumnetModal}
		</Box>
	);
};

export default Document;
