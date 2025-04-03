import { selectMaterialRequest, setIsItemModalOpen, setMRItemData } from "@src/store/sidemenu/project_management/MaterialRequest/material_request.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    DialogContentText,
    Button,
    useTheme,
    Avatar,
    CardContent,
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
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    Tabs,
    Tab,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    Select,
    MenuItem,
    InputLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as yup from "yup";
import { FileType, FormInput } from "@src/components";
import { systemSelector } from "@src/store/system/system.slice";
import { itemgroupSelector } from "@src/store/masters/ItemGroup/itemgroup.slice";
import {
    clearMiniBaseUnits,
    clearMiniItemGroups,
    clearMiniMake,
    clearMiniUnits,
    miniSelector,
    setCountryValue,
    setStateValue,
} from "@src/store/mini/mini.Slice";
import {
    getMiniItemgroups,
    getMiniMake,
    getMiniMoc,
    getMiniCategory,
    getMiniBaseUnits,
    getMiniUnits,
} from "@src/store/mini/mini.Action";
import {
    addItems,
    editItems,
    getGroups,
    getItems,
    getItemsById,
    getItemsList,
} from "@src/store/masters/Item/item.action";
import {
    isModelVisible,
    itemsSelector,
    setUploadImages,
    setSelectedData,
} from "@src/store/masters/Item/item.slice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LuFile, LuSearch, LuTrash2, LuX } from "react-icons/lu";
import SelectComponent from "@src/components/form/SelectComponent";
import Dropzone from "react-dropzone";
import TextArea from "@src/components/form/TextArea";
import { editMaterialRequest, getMRById } from "@src/store/sidemenu/project_management/MaterialRequest/material_request.action";
import moment from "moment";
import Swal from "sweetalert2";

interface ItemData {
    id: string;
    modelnumber: string;
    type_name: string;
    name: string;
    code: string;
    category: { id: string, name: string };
    units: [];
    moc: { id: string, name: string };
    productGroup: string;
    baseunit: { id: string, name: string };
    quantity: number;
    product_type_name: string;
    image?: string; // Optional property
}

const ItemModal = () => {

    const { id, projectId, tab } = useParams();
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState(0);

    const {
        materialRequest: {
            itemModel, itemName, mr_itemData, selectedData
        },
    } = useAppSelector((state) => selectMaterialRequest(state));

    const [itemImage, setItemImage] = useState({});
    const [itemData, setItemData] = useState<ItemData>({
        id: "",
        name: "",
        code: "",
        category: { id: "", name: "" },
        productGroup: "",
        baseunit: { id: "", name: "" },
        units: [],
        moc: { id: "", name: "" },
        quantity: 0,
        product_type_name: "",
        modelnumber: "",
        type_name: "",
        image: undefined,
    });

    const {
        items: { masterEditId, image, pageParams, itemsList },
        mini: {
            miniItemgroupParams,
            miniMake,
            miniUnits,
            miniCategory,
            miniBaseUnit,
            miniItemgroupList,
            miniItemgroupLoading,
        },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            system: systemSelector(state),
            itemgroup: itemgroupSelector(state),
            mini: miniSelector(state),
            items: itemsSelector(state),
        };
    });
    const navigate = useNavigate();

    const handleItemClose = () => {
        dispatch(setIsItemModalOpen(false));
    }
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const search = event.target.value;
        dispatch(
            getItemsList({
                ...pageParams,
                search: search ? search : "",
                page: 1,
                page_size: 10,
            })
        );
    };

    const itemsSchema = yup.object().shape({
        make: yup.object({
            label: yup.string().required("Please select a  make"),
            value: yup.string().required("Please select a make"),
        }),
        unit: yup.object({
            label: yup.string().required("Please select a unit"),
            value: yup.string().required("Please select a unit"),
        }),
        qty: yup
            .number()
            .required("Please enter quantity")
            .typeError("Quantity is required"),
        description: yup.string().required("Please enter a description")
    });
    const { control, handleSubmit, register, reset, setValue } = useForm<any>({
        resolver: yupResolver(itemsSchema),
        values: {
            make: mr_itemData?.make
                ?
                {
                    label: mr_itemData?.make?.name,
                    value: mr_itemData?.make?.id
                }
                : null,
            unit: mr_itemData?.unit ?
                {
                    label: mr_itemData?.unit?.name,
                    value: mr_itemData?.unit?.id
                }
                : null,
            description: mr_itemData?.description,
            qty: parseInt(mr_itemData?.qty)
        },
    });

    useEffect(() => {
        dispatch(
            getItemsList({
                ...pageParams
            })
        );
        itemData?.units?.forEach((val: any) => {
            if (val?.name && mr_itemData?.unit_name === val?.name) {
                setValue("unit", {
                    label: val.name,
                    value: val.id,
                });
            } else {
                setValue("unit", null);
            }
        });
    }, [itemData?.units]);

    const changeItemValue = (value: any) => {
        const isDuplicate = selectedData?.mr_items?.some((val) =>
            value?.makes?.some((make: any) =>
                value?.units?.some((unit: any) =>
                    val?.item?.id === value?.id &&
                    val?.make?.id === make?.id &&
                    val?.unit?.id === unit?.id
                )
            )
        );
        if (isDuplicate) {
            Swal.fire({
                title: `<p style="font-size:20px">Info</p>`,
                text: "Item already added",
                icon: "info",
                confirmButtonText: `Close`,
                confirmButtonColor: "#3085d6",
            });

            setActiveTab(0);
        } else {
            setItemData(value);
            setActiveTab(1);
            mr_itemData?.make != null ?
                setValue("make", {
                    label: mr_itemData?.make?.name,
                    value: mr_itemData?.make?.id,
                }) :
                setValue("make", null);
        }
    }

    function clearDataFun() {
        handleItemClose();
        navigate(0);
        dispatch(
            getMRById({
                id: id ? id : "",
            })
        );
    }
    console.log("selectedData?.mr_items", selectedData?.mr_items)

    const onSubmit = (payload: any) => {
        const data = {
            project_id: projectId,
            date: moment(selectedData?.date).format("YYYY-MM-DD"),
            description: selectedData?.description,
            mr_items:
                selectedData?.mr_items?.map((item) => {
                    if (item?.id == mr_itemData?.id) {
                        return {
                            id: item?.id,
                            item_id: itemData?.id,
                            make_id: payload?.make?.value,
                            unit_id: payload?.unit?.value,
                            qty: payload?.qty,
                            description: payload?.description,
                            required_date: moment(payload.date).format(
                                "YYYY-MM-DD"
                            ),
                            dodelete: item.dodelete,
                        };
                    } else {
                        return item;
                    }
                }),
        };
        dispatch(
            editMaterialRequest({
                id: id ? id : "",
                data,
                params: {
                    ...pageParams,
                    project_id: projectId,
                },
                mrReset: reset,
                clearDataFun
            })
        );
    }
    const navigateToAddItem = () => {
        handleItemClose();
        navigate("/pages/masters/item/add");
    }

    return (
        <Dialog
            open={itemModel}
            onClose={handleItemClose}
            maxWidth="lg"
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
                Change Item
                <IconButton onClick={handleItemClose}>
                    <LuX color="white" />
                </IconButton>
            </DialogTitle>
            <DialogContent
                sx={{
                    px: "24px",
                    pt: "12px !important",
                    pb: 0,

                    p: 3,
                    paddingTop: 2,
                }}>
                <DialogContentText
                    id="alert-dialog-description"
                    sx={{
                        width: 650,
                        // height:500
                    }}>
                    {userAccessList?.indexOf("Masters.add_item") !== -1 && (
                        <Grid style={{ display: "flex", justifyContent: "flex-end" }} mt={2}>
                            <Button variant="outlined"
                                color="primary"
                                style={{ cursor: "pointer", marginLeft: "auto" }}
                                onClick={navigateToAddItem}>
                                Add Item
                            </Button>
                        </Grid>
                    )}
                    <Box>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            aria-label="Tabs"
                            sx={{
                                "& .MuiTabs-flexContainer": {
                                    display: "flex",
                                },
                                "& .MuiTab-root": {
                                    flex: 1,
                                    textAlign: "center",
                                },
                            }}>
                            <Tab label="ItemList" />
                            {activeTab === 1 && <Tab label="Details" />}
                        </Tabs>
                        {/* <Divider
                            sx={{
                                my: 1,
                                borderColor: "rgba(0, 0, 0, 0.12)",
                            }}
                        /> */}
                        {activeTab === 0 && (
                            <>
                                <TextField style={{ marginTop: "10px" }}
                                    type="text"
                                    id="input-with-icon-textfield"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LuSearch size={20} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Search"
                                    onChange={handleInputChange}
                                />
                                <List>
                                    {itemsList?.map((row, index) => (
                                        <ListItem key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            {/* <ListItemAvatar>
                                                {row?.image ? <img src={row?.image}
                                                    style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }} /> :
                                                    <img src="/assets/images/Default_img.jpg"
                                                        style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 8 }} />
                                                }</ListItemAvatar> */}
                                            <ListItemText primary={row?.name} secondary={row?.code} />
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => changeItemValue(row)}
                                            >
                                                Select
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                        {activeTab === 1 && (
                            <Box
                                p={2}
                                sx={{
                                    borderRadius: 2,
                                }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Box
                                            sx={{
                                                width: "100%",
                                                height: 200,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "1px solid #ccc",
                                                borderRadius: 2
                                            }}
                                        >
                                            <img src="/assets/images/Default_img.jpg" alt="No Image Available" height={200} width="100%" />
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <Typography variant="h6" fontWeight="bold">{itemData?.name.toUpperCase()}</Typography>
                                        <Typography variant="body2" color="textSecondary" mb={1}>
                                            Code: <strong>{itemData?.code}</strong>
                                        </Typography>
                                        <Divider />
                                        <Box sx={{ marginTop: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <Typography variant="body2" color="textSecondary" >
                                                        Model Number:
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Category:
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" >
                                                        MOC:
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Product Type:
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Type:
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Base Unit:
                                                    </Typography>
                                                </Grid>

                                                {/* Second Column - Values (Aligned Left) */}
                                                <Grid size={{ xs: 12, md: 4 }}>
                                                    <Typography variant="body2" color="textPrimary">
                                                        <strong>{itemData?.modelnumber || "N/A"}</strong>
                                                    </Typography>
                                                    <Typography variant="body2" color="textPrimary">
                                                        <strong>{itemData?.category?.name || "N/A"}</strong>
                                                    </Typography>
                                                    <Typography variant="body2" color="textPrimary">
                                                        <strong>{itemData?.moc?.name || "N/A"}</strong>
                                                    </Typography>
                                                    <Typography variant="body2" color="textPrimary">
                                                        <strong>{itemData?.product_type_name || "N/A"}</strong>
                                                    </Typography>
                                                    <Typography variant="body2" color="textPrimary">
                                                        <strong>{itemData?.type_name || "N/A"}</strong>
                                                    </Typography>
                                                    <Typography variant="body2" color="textPrimary">
                                                        <strong>{itemData?.baseunit?.name || "N/A"}</strong>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>


                                    </Grid>
                                    <form
                                        style={{ width: "100%" }}
                                        onSubmit={handleSubmit(onSubmit)}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <SelectComponent
                                                    name="make"
                                                    label="Make"
                                                    control={control}
                                                    required
                                                    options={miniMake?.list.map(
                                                        (e: { id: string | number; name: string }) => ({
                                                            id: e.id,
                                                            name: e.name,
                                                        })
                                                    )}
                                                    loading={miniMake.loading}
                                                    selectParams={{
                                                        page: miniMake.miniParams.page,
                                                        page_size: miniMake.miniParams.page_size,
                                                        search: miniMake.miniParams.search,
                                                        no_of_pages: miniMake.miniParams.no_of_pages,
                                                        products__id: itemData?.id
                                                            ? itemData?.id
                                                            : null,
                                                    }}
                                                    hasMore={
                                                        miniMake.miniParams.page <
                                                        miniMake.miniParams.no_of_pages
                                                    }
                                                    fetchapi={getMiniMake}
                                                    clearData={clearMiniMake}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <FormInput
                                                    name="qty"
                                                    label="Quantity"
                                                    required
                                                    type="number"
                                                    placeholder="Enter quantity here..."
                                                    control={control}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <SelectComponent
                                                    name="unit"
                                                    label="Unit"
                                                    control={control}
                                                    required
                                                    options={miniUnits.list.map(
                                                        (e: {
                                                            id: string | number;
                                                            name: string;
                                                        }) => ({
                                                            id: e.id,
                                                            name: e.name,
                                                        })
                                                    )}
                                                    loading={miniUnits.loading}
                                                    helperText={
                                                        itemData?.id
                                                            ? ""
                                                            : "Select an item to see unit"
                                                    }
                                                    selectParams={{
                                                        page: miniUnits.miniParams.page,
                                                        page_size: miniUnits.miniParams.page_size,
                                                        search: miniUnits.miniParams.search,
                                                        no_of_pages:
                                                            miniUnits.miniParams.no_of_pages,
                                                        item: itemData?.id,
                                                    }}
                                                    hasMore={
                                                        miniUnits.miniParams.page <
                                                        miniUnits.miniParams.no_of_pages
                                                    }
                                                    fetchapi={getMiniUnits}
                                                    clearData={clearMiniUnits}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <TextArea
                                                    name="description"
                                                    label="Description"
                                                    required
                                                    type="text"
                                                    placeholder="Write Description here..."
                                                    minRows={1}
                                                    maxRows={1}
                                                    containerSx={{
                                                        display: "grid",
                                                        gap: 1,
                                                    }}
                                                    control={control}
                                                />
                                            </Grid>
                                        </Grid>
                                        <DialogActions sx={{ p: 2 }}>
                                            <Button
                                                onClick={handleItemClose}
                                                variant="outlined"
                                                color="secondary"
                                                style={{ cursor: "pointer" }}>
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                color="primary"
                                                autoFocus>
                                                Submit
                                            </Button>
                                        </DialogActions>
                                    </form>
                                </Grid>
                            </Box>
                        )}
                    </Box>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

export default ItemModal;