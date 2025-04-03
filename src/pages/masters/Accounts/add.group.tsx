import react, { ChangeEvent, useEffect, useState } from "react";
import { Button, Checkbox, Chip, TextareaAutosize } from "@mui/material";
import {
	Card,
	TextField,
	InputAdornment,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Grid2 as Grid,
	Paper,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	ListItemText,
	Modal,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Control, useForm } from "react-hook-form";
import {
	CheckboxInput,
	ComponentContainerCard,
	FormInput,
	PasswordInput,
} from "@src/components";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { addLocation } from "@src/store/masters/Locations/location.action";
import { countrySelector } from "@src/store/masters/Country/country.slice";
import { setMasterValue } from "@src/store/masters/Locations/location.slice";
import { systemSelector } from "@src/store/system/system.slice";
import TextArea from "@src/components/form/TextArea";
import SelectComponent from "@src/components/form/SelectComponent";
import {
	miniSelector,
	setCountryValue,
	setStateValue,
} from "@src/store/mini/mini.Slice";
import {
	getMiniCountries,
	getMiniStates,
	getMiniCity,
	getMiniLocation,
	getMiniAccountgroups,
} from "@src/store/mini/mini.Action";
import { LuBook, LuDelete, LuSave } from "react-icons/lu";
import Customers from ".";
import {
	customersSelector,
	setSelectedData,
} from "@src/store/masters/Customers/customer.slice";
import {
	addCustomers,
	editCustomers,
} from "@src/store/masters/Customers/customer.action";
import { accountsSelector } from "@src/store/masters/Account/accounts.slice";
import {
	addGroups,
	getGroups,
	getAccounts,
	getAccountsWithChildrenList,
} from "@src/store/masters/Account/accounts.action";
import {
	addAccountgroup,
	editAccountgroup,
} from "@src/store/masters/AccountGroup/accountgroup.action";
import { accountgroupSelector } from "@src/store/masters/AccountGroup/accountgroup.slice";

type Props = {
	modal: boolean;
	closeModal: () => void;
	mastersName: string;
	editId?: any;
	mastersValue: string;
	groupdata?: {
		id?: string | number | undefined;
		name?: string;
		parent_id?: string | number;
	};
};

const AddGroupMasters = ({
	modal,
	closeModal,
	mastersName,
	editId,
	mastersValue,
	groupdata,
}: Props) => {
	const dispatch = useAppDispatch();
	const {
		mini: {
			miniStatesList,
			miniCountryParams,
			miniCountriesList,
			miniCountryLoading,
			miniCityList,
			miniAccountgroupParams,
			miniStatesParams,
			miniStateLoading,
			miniCityParams,
			miniCityLoading,
			miniAccountgroupList,
			miniAccountgroupLoading,
			countryValue,
			stateValue,
		},
		accountgroup: { selectedData },
		system: { userAccessList },
	} = useAppSelector((state) => {
		return {
			system: systemSelector(state),
			mini: miniSelector(state),
			accountgroup: accountgroupSelector(state),
		};
	});

	const groupSchema = yup.object().shape({
		name: yup
			.string()
			.required("Please enter your group name")
			.trim()
			.matches(
				/^[a-zA-Z0-9 ]*$/,
				"group name should not contain special characters"
			),
		parent: yup
			.object()
			.shape({
				label: yup.string().optional(),
				value: yup.string().optional(),
			})
			.optional()
			.nullable(),
		// product_type: yup.object().shape({
		//     label: yup.string().required("Please select account type"),
		//     value: yup.string().required("Please select account type"),
		// }),
	});
	const { control, handleSubmit, reset } = useForm<any>({
		resolver: yupResolver(groupSchema),
		values: {
			name: selectedData?.name ? selectedData?.name : "",
			parent: selectedData?.parent
				? {
						label: selectedData?.parent
							? `${selectedData?.parent.name}`
							: "",
						value: selectedData?.parent
							? `${selectedData?.parent.id}`
							: "",
					}
				: null,
		},
	});
	const PRODUCT_TYPE_CHOICES = [
		{ name: "Group", id: 1 },
		{ name: "Product", id: 2 },
	];

	const handleAddGroup = (data: any) => {
		if (editId == undefined || editId == 0) {
			const obj = {
				name: data.name,
				parent_id: data.parent?.value,
				product_type: 1,
			};

			dispatch(addAccountgroup({ obj }));
			dispatch(
				getAccountsWithChildrenList({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			dispatch(
				getAccounts({
					page: 1,
					page_size: 10,
				})
			);
			closeModal();
			reset();
		} else {
			const obj = {
				id: editId,
				name: data.name,
				parent_id: data.parent?.value,
				product_type: 1,
			};

			dispatch(
				editAccountgroup({
					obj,
					pageParams: {},
					clearDataFn: () => {},
					navigate: (path: string) => {},
				})
			);
			dispatch(
				getAccounts({
					page: 1,
					page_size: 10,
				})
			);
			dispatch(
				getAccountsWithChildrenList({
					search: "",
					page: 1,
					page_size: 10,
				})
			);
			closeModal();
			reset();
		}
	};

	return (
		<>
			<Dialog open={modal} onClose={closeModal} maxWidth="md" fullWidth>
				<DialogTitle>
					{editId == undefined || editId == 0 ? "Add " : "Update "}
					{mastersName}
				</DialogTitle>
				<Box
					sx={{
						border: "1px solid #ccc",
						padding: 1,
						borderRadius: 1,
						bgcolor: "#f9f9f9", // Optional: background color
					}}>
					<DialogContent>
						<Box mt={1}>
							<form action="">
								<Grid container spacing={3}>
									<Grid size={{ xs: 12, md: 4 }}>
										<FormInput
											name="name"
											label="Group name"
											required
											type="text"
											placeholder="Enter Group here..."
											control={control}
										/>
									</Grid>

									<Grid size={{ xs: 12, md: 4 }}>
										<SelectComponent
											name="parent"
											label="Parent Group"
											control={control}
											rules={{ required: true }}
											options={miniAccountgroupList?.map(
												(e: {
													id: string;
													name: string;
												}) => ({
													id: e.id,
													name: e.name,
												})
											)}
											loading={miniAccountgroupLoading}
											selectParams={{
												page: miniAccountgroupParams.page,
												page_size:
													miniAccountgroupParams.page_size,
												search: miniAccountgroupParams.search,
												no_of_pages:
													miniAccountgroupParams.no_of_pages,
											}}
											hasMore={
												miniAccountgroupParams.page <
												miniAccountgroupParams.no_of_pages
											}
											fetchapi={getMiniAccountgroups}
										/>
									</Grid>
									{/* <Grid item xs={12} sm={4}>
                                        <SelectComponent
                                            name="product_type"
                                            label="Account Type Choice"
                                            control={control}
                                            rules={{ required: true }}
                                            options={PRODUCT_TYPE_CHOICES?.map((e: { id: number, name: string }) => ({
                                                id: e.id,
                                                name: e.name,
                                            }))}
                                        />
                                    </Grid> */}
								</Grid>
							</form>
						</Box>
					</DialogContent>
				</Box>
				<DialogActions>
					<Box textAlign={"center"}>
						<Button
							onClick={closeModal}
							variant="outlined"
							color="secondary">
							Cancel
						</Button>
					</Box>
					{editId == undefined || editId == 0 ? (
						<Box textAlign={"right"}>
							<Button
								color="primary"
								type="submit"
								onClick={handleSubmit(handleAddGroup)}
								variant="contained"
								size="large">
								Submit
							</Button>
						</Box>
					) : (
						<Box textAlign={"right"}>
							<Button
								variant="contained"
								type="submit"
								onClick={handleSubmit(handleAddGroup)}
								color="primary"
								autoFocus>
								Update
							</Button>
						</Box>
					)}
				</DialogActions>
			</Dialog>
		</>
	);
};
export default AddGroupMasters;
