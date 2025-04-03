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
import { FormInput } from "@src/components";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniUsers, getMiniUserTypes } from "@src/store/mini/mini.Action";
import {
	clearMiniUsers,
	clearMiniUserTypes,
	miniSelector,
} from "@src/store/mini/mini.Slice";
import {
	editProjectGroups,
	postProjectGroup,
} from "@src/store/sidemenu/project_management/ProjectGroups/projectGroups.action";
import {
	ProjectGroupsState,
	Group,
} from "@src/store/sidemenu/project_management/ProjectGroups/projectGroups.types";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";
import * as yup from "yup";

interface Props {
	open: boolean;
	hide: (reset: any) => void;
	selectedData: Group;
	project_id: string;
	params: ProjectGroupsState["pageParams"];
}

const AddGroup = ({ open, hide, selectedData, project_id, params }: Props) => {
	const dispatch = useAppDispatch();

	const GroupSchema = yup.object().shape({
		name: yup.string().required("Group name is required"),
	});

	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(GroupSchema),
		values: {
			name: selectedData?.name ? selectedData?.name : "",
		},
	});

	const handleAdd = (payload: { name: string }) => {
		const data = {
			project_id: project_id ? project_id : "",
			name: payload?.name,
		};

		!selectedData?.id
			? dispatch(
					postProjectGroup({
						data,
						hide: () => {
							hide(reset);
						},
						params,
					})
				)
			: dispatch(
					editProjectGroups({
						id: selectedData?.id,
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
				{!selectedData?.id ? "Add Group" : "Edit Group"}
				<IconButton
					onClick={() => {
						hide(reset);
					}}>
					<LuX color="white" />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ px: "24px", pt: "12px !important", pb: 0 }}>
				<DialogContentText id="alert-dialog-description">
					<Grid container spacing={2}>
						<Grid size={{ xs: 12 }}>
							<FormInput
								name="name"
								label="Name"
								type="text"
								placeholder="Enter Group Name here..."
								control={control}
							/>
						</Grid>
					</Grid>
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

export default AddGroup;
