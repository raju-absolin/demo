import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Divider, Drawer, FormLabel, Stack } from "@mui/material";
import { CustomDatepicker } from "@src/components";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { miniSelector, setCountryValue, setStateValue } from "@src/store/mini/mini.Slice";
import { locationSelector, setIsFilterOpen } from "@src/store/masters/Locations/location.slice";
import SelectComponent from "@src/components/form/SelectComponent";
import { getMiniCity, getMiniCountries, getMiniStates } from "@src/store/mini/mini.Action";
import { getLocation } from "@src/store/masters/Locations/location.action";
import { setPageParams } from "@src/store/masters/Locations/location.slice";

type Props = {
    openFilter: boolean;
    handleFilter: (open: boolean) => void;
};

type FilterFormData = {
    city?: any;
    state?: any;
    country?: any;
};

const Filters = ({ openFilter, handleFilter }: Props) => {
    const dispatch = useAppDispatch();
    const {
        location: {
            pageParams,
        },
        mini: {
            miniStatesList, miniCountryParams, miniCountriesList, miniCountryLoading, miniCityList, miniItemgroupParams,
            miniStatesParams, miniStateLoading, miniCityParams, miniCityLoading, miniItemgroupList, miniItemgroupLoading,
            countryValue, stateValue
        },
    } = useAppSelector((state) => ({
        mini: miniSelector(state),
        location: locationSelector(state),
    }));

    //Form Submission
    const filterSchema = yup.object({
        country: yup.object().shape({
            label: yup.string().optional(),
            value: yup.string().optional(),
        }),
        state: yup.object().shape({
            label: yup.string().optional(),
            value: yup.string().optional(),
        }),
        city: yup.object().shape({
            label: yup.string().optional(),
            value: yup.string().optional(),
        }),
    });

    const { control, handleSubmit, reset } = useForm({
        // resolver: yupResolver(filterSchema),
        values: {
            country: pageParams.country,
            state: pageParams.state,
            city: pageParams.city,
        },
    });

    const clearFilters = () => {
        const formData = {
            country: null,
            state: null,
            city: null,
        };
        dispatch(
            getLocation({
                ...pageParams,
                ...formData,
            })
        );
        dispatch(setIsFilterOpen(false));
        reset(formData);
    };

    const handleFilterSubmit = ({ country, state, city }: FilterFormData) => {
        const formData = {
            country: country ?? null,
            state: state ?? null,
            city: city ?? null,
        };
        dispatch(
            getLocation({
                ...pageParams,
                ...formData,
            })
        );
        dispatch(setIsFilterOpen(false));
    };

    useEffect(()=>{
        clearFilters();
    },[]);

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
                        <form onSubmit={handleSubmit(handleFilterSubmit)}>
                            <Box>
                                <Stack width={"100%"} mt={2}>
                                    <SelectComponent
                                        name="country"
                                        label="Country"
                                        control={control}
                                        rules={{ required: true }}
                                        options={miniCountriesList?.map(
                                            (e: { id: string | number; name: string }) => ({
                                                id: e.id,
                                                name: e.name,
                                            })
                                        )}
                                        loading={miniCountryLoading}
                                        onChange={(val) => {
                                            dispatch(setCountryValue(val?.value));
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
                                        rules={{ required: true }}
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
                                        rules={{ required: true }}
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
                                {/* </Stack> */}
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
                                        onClick={clearFilters}>
                                        Clear
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type="submit">
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
