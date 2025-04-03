import {
	Box,
	Button,
	Card,
	CardContent,
	Checkbox,
	Grid2 as Grid,
} from "@mui/material";
import GoBack from "@src/components/GoBack";
import TableComponent from "@src/components/TableComponenet";
import { getMiniDocuments } from "@src/store/mini/mini.Action";
import {
	editDocument,
	getDocumentById,
	getDocuments,
} from "@src/store/sidemenu/tender_mangement/document/document.action";
import {
	selectDocument,
	setCheckedList,
} from "@src/store/sidemenu/tender_mangement/document/document.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { ChangeEvent, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const DocumentEdit = () => {
	const { tenderId, documentId, tab } = useParams();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const {
		document: { documentList, pageParams, selectedData, checkedList },
		mini: { miniDocuments },
		system: { userAccessList },
	} = useAppSelector((state) => selectDocument(state));

	const handleUpdate = () => {
		if (checkedList.length === 0) {
			Swal.fire({
				title: `<p style="font-size:20px">Zero Documents Selected</p>`,
				text: `Atleast select one document`,
				icon: "info",
				confirmButtonText: `Close`,
				confirmButtonColor: "#3085d6",
			});
		} else {
			const data = {
				tender_id: tenderId,
				document_ids: checkedList,
			};
			dispatch(
				editDocument({
					id: documentId ? documentId : "",
					data,
					params: pageParams,
					clearData: () => {},
				})
			);
		}
	};

	const handleCheckboxChange = (
		id: string,
		type: "yes" | "no",
		isChecked: boolean
	) => {
		if (isChecked) {
			dispatch(setCheckedList([...checkedList, id]));
		} else {
			const filter = checkedList.filter((e) => e != id);
			dispatch(setCheckedList(filter));
		}
	};

	useEffect(() => {
		dispatch(
			getDocumentById({
				id: documentId,
			})
		);
	}, []);

	useEffect(() => {
		dispatch(
			getMiniDocuments({
				page: 1,
				page_size: 10,
				search: "",
			})
		);
	}, []);

	const columns = [
		{
			title: "S.No",
			width: 100,
		},
		{
			title: "Document",
			width: 100,
		},
		{
			title: "Is Checked",
			width: 100,
		},
	];

	function createData(
		index: number,
		document?: string,
		yesCheck?: JSX.Element
	) {
		return {
			index,
			document,
			yesCheck,
		};
	}

	const rows = useMemo(() => {
		return miniDocuments?.list?.map(
			(
				row: {
					name: string;
					id: string;
				},
				key: number
			) => {
				const index =
					(pageParams.page - 1) * pageParams.page_size + (key + 1);

				const document =
					// <Button color="primary" variant="contained" sx={{ width: 150 }}>
					row?.name;
				// </Button>

				const yesCheck = (
					<Checkbox
						checked={
							checkedList.find((e) => e == row.id) ? true : false
						} // Track 'Yes' checkbox state
						onChange={(e) =>
							handleCheckboxChange(
								row.id,
								"yes",
								e.target.checked
							)
						}
					/>
				);

				return createData(
					index,
					document,
					yesCheck
					// noCheck
				);
			}
		);
	}, [miniDocuments, selectedData, createData]);

	const handleChangePage = (event: unknown, newPage: number) => {
		dispatch(
			getMiniDocuments({
				...pageParams,
				search: "",
				page: newPage + 1,
			})
		);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		dispatch(
			getMiniDocuments({
				...pageParams,
				search: "",
				page: 1,
				page_size: parseInt(event.target.value),
			})
		);
	};

	const handleSearch = ({ search }: { search?: string | undefined }) => {
		dispatch(
			getMiniDocuments({
				...pageParams,
				search: search ? search : "",
				page: 1,
				page_size: 10,
			})
		);
	};

	return (
		<div>
			<Box>
				<GoBack
					is_goback={true}
					title={`Documents Update`}
					go_back_url={`/tenders/view/${tenderId}/${tab}/documents/`}
					showSaveButton={false}
					loading={false}>
					<Card>
						<CardContent>
							<TableComponent
								count={miniDocuments?.count}
								columns={columns}
								rows={rows ? rows : []}
								loading={miniDocuments?.loading}
								page={
									miniDocuments?.miniParams?.page
										? miniDocuments?.miniParams?.page
										: 1
								}
								pageSize={
									miniDocuments?.miniParams?.page_size
										? miniDocuments?.miniParams?.page_size
										: 10
								}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
							/>
							<Grid container justifyContent="flex-end" mt={3.4}>
								<Button
									variant="contained"
									onClick={(e) => {
										e.preventDefault();
										handleUpdate();
									}}
									type="submit"
									color="primary"
									autoFocus>
									Save
								</Button>
							</Grid>
						</CardContent>
					</Card>{" "}
				</GoBack>
			</Box>
		</div>
	);
};

export default DocumentEdit;
