import { yupResolver } from "@hookform/resolvers/yup";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Grid2 as Grid,
} from "@mui/material";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniUsers, getMiniUserTypes } from "@src/store/mini/mini.Action";
import {
	clearMiniUsers,
	clearMiniUserTypes,
	miniSelector,
} from "@src/store/mini/mini.Slice";
import { postTeamMembers } from "@src/store/sidemenu/project_management/project_teams/project_teams.action";
import {
	ProjectTeamsState,
	Team,
} from "@src/store/sidemenu/project_management/project_teams/project_teams.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import * as yup from "yup";

interface Props {
	open: boolean;
	hide: (reset: any) => void;
	selectedData: Team;
	project_id: string;
	params: ProjectTeamsState["pageParams"];
}

const AddTeamMembers = ({
	open,
	hide,
	selectedData,
	project_id,
	params,
}: Props) => {
	const dispatch = useAppDispatch();
	const { miniUserList, miniUserLoading, miniUserParams, miniUserTypes } =
		useAppSelector((state) => miniSelector(state));

	const SCREENTPYE_CHOICES = [
		{
			id: 1,
			name: "Tender",
		},
		{
			id: 2,
			name: "Project",
		},
	];

	const UserSchema = yup.object().shape({
		user: yup
			.object({
				label: yup.string().required("Please select a user"),
				value: yup.string().required("Please select a user"),
			})
			.required("Please select a user to assign"),
		// screen_type: yup
		// 	.object({
		// 		label: yup.string().required("Please select a screen  type"),
		// 		value: yup.number().required("Please select a screen  type"),
		// 	})
		// 	.required("Please select a screen  type")
		// 	.nullable(),
		user_type: yup
			.object({
				label: yup.string().required("Please select a user type"),
				value: yup.string().required("Please select a user type"),
			})
			.required("Please select a user type"),
	});

	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(UserSchema),
		values: {
			user: selectedData?.user?.id
				? {
						label: selectedData?.user?.fullname,
						value: selectedData?.user?.id,
					}
				: null,
			// screen_type: selectedData?.screen_type
			// 	? {
			// 			label: selectedData?.screen_type_name
			// 				? selectedData?.screen_type_name
			// 				: "",
			// 			value: selectedData.screen_type,
			// 		}
			// 	: null,
			user_type: selectedData?.user_type?.id
				? {
						label: selectedData?.user_type?.name,
						value: selectedData?.user_type?.id,
					}
				: null,
		},
	});

	const handleAdd = (payload: {
		// screen_type: {
		// 	label: string;
		// 	value: number;
		// } | null;
		user_type: {
			label: string;
			value: string;
		} | null;
		user: {
			label: string;
			value: string;
		} | null;
	}) => {
		
		const data = {
			transaction_id: project_id ? project_id : "",
			screen_type: 2,
			user_type_id: payload?.user_type?.value
				? payload?.user_type?.value
				: "",
			user_id: payload?.user?.value ? payload?.user?.value : "",
		};

		dispatch(
			postTeamMembers({
				data,
				hide: () => {
					hide(reset);
				},
				params,
			})
		);
	};
	return (
		<Dialog
			open={open}
			onClose={() => {
				hide(reset);
			}}
			sx={{
				"& .MuiDialog-paper": {
					width: "800px",
				},
			}}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle
				sx={{
					bgcolor: "primary.main",
					color: "white",
					p: 1,
					px: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
				variant="h4"
				id="alert-dialog-title">
				{"Add Team"}
				<IconButton
					onClick={() => {
						hide(reset);
					}}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
				<DialogContentText id="alert-dialog-description">
					<form style={{ width: "100%" }}>
						<Grid container spacing={2}>
							<Grid size={{ xs: 12, md: 6 }}>
								<SelectComponent
									name="user_type"
									label="User Type"
									multiple={false}
									required
									control={control}
									options={miniUserTypes?.list?.map(
										(e: {
											id: string | number;
											name: string;
										}) => ({
											id: e.id,
											name: e.name,
										})
									)}
									loading={miniUserTypes?.loading}
									selectParams={{
										page: miniUserTypes?.miniParams?.page,
										page_size:
											miniUserTypes?.miniParams
												?.page_size,
										search: miniUserTypes?.miniParams
											?.search,
										no_of_pages:
											miniUserTypes?.miniParams
												?.no_of_pages,
									}}
									hasMore={
										miniUserTypes?.miniParams?.page <
										miniUserTypes?.miniParams?.no_of_pages
									}
									fetchapi={getMiniUserTypes}
									clearData={clearMiniUserTypes}
								/>
							</Grid>
							<Grid size={{ xs: 12, md: 6 }}>
								<SelectComponent
									name="user"
									label="User"
									required
									multiple={false}
									control={control}
									options={miniUserList.map(
										(e: {
											id: string | number;
											fullname: string;
										}) => ({
											id: e.id,
											name: e.fullname,
										})
									)}
									loading={miniUserLoading}
									selectParams={{
										page: miniUserParams.page,
										page_size: miniUserParams.page_size,
										search: miniUserParams.search,
										no_of_pages: miniUserParams.no_of_pages,
									}}
									hasMore={
										miniUserParams.page <
										miniUserParams.no_of_pages
									}
									fetchapi={getMiniUsers}
									clearData={clearMiniUsers}
								/>
							</Grid>
							{/* <Grid size={{ xs: 12, md: 6 }}>
								<SelectComponent
									name="screen_type"
									label="Screen Type"
									multiple={false}
									control={control}
									rules={{ required: true }}
									options={SCREENTPYE_CHOICES}
								/>
							</Grid> */}
						</Grid>
					</form>
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button
					onClick={() => hide(reset)}
					variant="outlined"
					color="secondary">
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleSubmit(handleAdd as any)}
					color="primary"
					autoFocus>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddTeamMembers;
