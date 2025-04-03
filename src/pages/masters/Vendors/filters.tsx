import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Divider, Drawer, FormLabel, Stack } from "@mui/material";
import { CustomDatepicker } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import {
	miniSelector,
	setCountryValue,
	setStateValue,
} from "@src/store/mini/mini.Slice";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniCity, getMiniCountries, getMiniItemgroups, getMiniStates } from "@src/store/mini/mini.Action";
import { vendorsSelector, setPageParams, setIsFilterOpen } from "@src/store/masters/Vendors/vendors.slice";
import { getVendors } from "@src/store/masters/Vendors/vendors.action";

type Props = {
	openFilter: boolean;
	handleFilter: (open: boolean) => void;
};

type FilterFormData = {
    city?: string;
    state?: string;
    country?: string;
    item_groups?: string;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
	const dispatch = useAppDispatch();
	const {
		vendor: { pageParams },
		mini: {
			miniStatesList,
			miniCountryParams,
			miniCountriesList,
			miniCountryLoading,
			miniCityList,
			miniItemgroupParams,
			miniStatesParams,
			miniStateLoading,
			miniCityParams,
			miniCityLoading,
			miniItemgroupList,
			miniItemgroupLoading,
			countryValue,
			stateValue,
		},
	} = useAppSelector((state) => ({
		mini: miniSelector(state),
		vendor: vendorsSelector(state),
	}));

    //Form Submission
    const filterSchema = yup.object({
        country: yup
            .object({
                label: yup.string().optional().nullable(),
                value: yup.string().optional().nullable(),
            })
            .optional()
            .nullable(),
        state: yup
            .object({
                label: yup.string().optional().nullable(),
                value: yup.string().optional().nullable(),
            })
            .optional()
            .nullable(),
        city: yup
            .object({
                label: yup.string().optional().nullable(),
                value: yup.string().optional().nullable(),
            })
            .optional()
            .nullable(),
        item_groups: yup
            .array()
            .of(
                yup.object().shape({
                    label: yup.string().optional(),
                    value: yup.string().optional(),
                })
            )
            .optional()
            .nullable(),
    });

    const { control, handleSubmit, reset ,setValue} = useForm<any>({
        // resolver: yupResolver(filterSchema),
        values: {
            country: pageParams.country,
            state: pageParams.state,
            city: pageParams.city,
            item_groups: pageParams?.item_groups,
        },
    });

    const clearFilters = () => {
        const formData = {
            country: null,
            state: null,
            city: null,
            item_groups: []
        };
        dispatch(
            getVendors({
                ...pageParams,
                ...formData,
            })
        );
        reset();
    };

    const handleFilterSubmit = ({
        country,
        state,
        city,
        item_groups,
    }: FilterFormData) => {
        const formData = {
            country: country ?? null,
            state: state ?? null,
            city: city ?? null,
            item_groups: item_groups ?? null,
        };

        dispatch(
            getVendors({
                ...pageParams,
                ...formData,
                page: 1,
                page_size: 10,
                search: "",
            })
        );
        dispatch(setIsFilterOpen(false));
    };

    return (
        <>
            <Drawer
                anchor={"right"}
                open={openFilter}
                onClose={() => handleFilter(false)}>
                <Box
                    sx={{
                        width: 450,
                        p: 2,
                    }}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <form>
                            <Box>
                                <Stack width={"100%"} mt={2}>
                                    <SelectComponent
                                        name="country"
                                        label="Country"
                                        control={control}
                                        options={miniCountriesList?.map(
                                            (e: {
                                                id: string | number;
                                                name: string;
                                            }) => ({
                                                id: e.id,
                                                name: e.name,
                                            })
                                        )}
                                        loading={miniCountryLoading}
                                        onChange={(val) => {
                                            dispatch(setCountryValue(val?.value));
                                            setValue("state", null);
											setValue("city", null);
                                        }}
                                        selectParams={{
                                            page: miniCountryParams.page,
                                            page_size: miniCountryParams.page_size,
                                            search: miniCountryParams.search,
                                            no_of_pages:
                                                miniCountryParams.no_of_pages,
                                        }}
                                        hasMore={
                                            miniCountryParams.page <
                                            miniCountryParams.no_of_pages
                                        }
                                        fetchapi={getMiniCountries}
                                    />

                                </Stack>
                                <Stack width={"100%"} mt={2}>
                                    <SelectComponent
                                        name="state"
                                        label="State"
                                        control={control}
                                        options={miniStatesList?.map(
                                            (e: { id: string | number; name: string }) => ({
                                                id: e.id,
                                                name: e.name,
                                            })
                                        )}
                                        loading={miniStateLoading}
                                        onChange={(val) => {
                                            dispatch(setStateValue(val?.value));
                                        }}
                                        selectParams={{
                                            page: miniStatesParams.page,
                                            page_size: miniStatesParams.page_size,
                                            search: miniStatesParams.search,
                                            no_of_pages:
                                                miniStatesParams.no_of_pages,
                                            country: countryValue
                                        }}
                                        hasMore={
                                            miniStatesParams.page <
                                            miniStatesParams.no_of_pages
                                        }
                                        fetchapi={getMiniStates}
                                    />

                                </Stack>
                                <Stack width={"100%"} mt={2}>
                                    <SelectComponent
                                        name="city"
                                        label="City"
                                        control={control}
                                        options={miniCityList?.map(
                                            (e: { id: string | number; name: string }) => ({
                                                id: e.id,
                                                name: e.name,
                                            })
                                        )}
                                        loading={miniCityLoading}
                                        selectParams={{
                                            page: miniCityParams.page,
                                            page_size: miniCityParams.page_size,
                                            search: miniCityParams.search,
                                            no_of_pages:
                                                miniCityParams.no_of_pages,
                                            state__country: countryValue,
                                            state: stateValue
                                        }}
                                        hasMore={
                                            miniCityParams.page <
                                            miniCityParams.no_of_pages
                                        }
                                        fetchapi={getMiniCity}
                                    />

                                </Stack>
                                <Stack width={"100%"} mt={2}>
                                    <SelectComponent
                                        name="item_groups"
                                        label="Item Group"
                                        control={control}
                                        // multiple={true}
                                        options={miniItemgroupList?.map(
                                            (e: {
                                                id: string | number;
                                                name: string;
                                            }) => ({
                                                id: e.id,
                                                name: e.name,
                                            })
                                        )}
                                        loading={
                                            miniItemgroupLoading
                                        }
                                        selectParams={{
                                            page: miniItemgroupParams.page,
                                            page_size: miniItemgroupParams
                                                .page_size,
                                            search: miniItemgroupParams.search,
                                            no_of_pages:
                                                miniItemgroupParams
                                                    .no_of_pages,
                                            // item: selectedData?.item_groups?.map(
                                            //     (e) => e.value
                                            // ),
                                        }}
                                        hasMore={
                                            miniItemgroupParams
                                                .page <
                                            miniItemgroupParams
                                                .no_of_pages
                                        }
                                        fetchapi={getMiniItemgroups}
                                    />

                                </Stack>
                            </Box>
                            <Box mt={2}>
                                <Divider />
                                <Stack
                                    direction="row"
                                    justifyContent="flex-end"
                                    spacing={2}
                                    mt={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            dispatch(setIsFilterOpen(false));
                                            clearFilters();
                                        }}>
                                        Clear
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        onClick={handleSubmit(
                                            handleFilterSubmit as () => void
                                        )}>
                                        Apply
                                    </Button>
                                </Stack>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default Filters;
