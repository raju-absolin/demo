import React, { Fragment, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { selectManageUsers } from "@src/store/settings/manageUsers/manage_users.slice";
import { systemSelector } from "@src/store/system/system.slice";
import { useParams } from "react-router-dom";
import { projectActivitySelectors } from "@src/store/sidemenu/project_management/ProjectActivity/project_activity.slice";
import { getProjectActivityList } from "@src/store/sidemenu/project_management/ProjectActivity/project_activity.action";
import moment from "moment";
import { Avatar, Box, Button, Card, CardContent, Divider, Grid2 as Grid, Typography } from "@mui/material";
import { LuCircleDot } from "react-icons/lu";

type ProjectData = {
    [key: string]: {
        type?: string;
        date?: string;
        table?: string;
        user?: string;
        variant?: string;
        project?: string
        avatar?: {
            position: string;
            name: string;
            image: string;
        }[];
    }[];
};

const ProjectActivity = () => {

    const {
        projectActivity: {
            projectActivityParams,
            activityList,
            selectedData
        },
        system: { userAccessList },
    } = useAppSelector((state) => {
        return {
            projectActivity: projectActivitySelectors(state),
            system: systemSelector(state),
        };
    });
    const dispatch = useAppDispatch();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getProjectActivityList({
            ...projectActivityParams,
            search: "",
            page: 1,
            project: id
        }));
    }, [])
    function transformTypename(typename: string) {
        if (typename === 'Create') {
            return 'Created';
        } else if (typename === 'Update') {
            return 'Updated';
        } else if (typename === 'Delete') {
            return 'Deleted';
        }
        return typename;
    }

    const projectData: ProjectData = {};

    activityList?.forEach((act: any, index: number) => {
        const key = moment(act.created_on).format("YYYY-MM-DD hh:mm:ss a");
        projectData[key] = [
            {
                date: act.created_on,
                type: transformTypename(act.type_name),
                variant: "#15d1e9",
                table: act.tablename,
                project: act.project?.code,
                user: act.user?.username,
            },
        ];
    });

    return (
        <Box sx={{ padding: "16px" }}>
            {/* Title */}
            <Typography
                variant="h4"
                title="h2"
                sx={{
                    mb: 4,
                    fontWeight: "bold",
                }}
            >
                Project Activity
            </Typography>
            <Box sx={{ "& > *:not(:first-child)": { mt: 2 }, position: "relative" }}>
                <Box
                    sx={{
                        position: "absolute",
                        border: "1px solid",
                        borderColor: "divider",
                        height: "100%",
                        top: 1,
                        left: "40px",
                        insetInlineStart: { md: "0%" },
                        translate: "-50%",
                        zIndex: 0,
                    }}
                />
                {Object.keys(projectData)?.map((data, idx) => {
                    return (
                        <Fragment key={idx}>
                            {projectData[data]?.map((item: any, idx: number) => {
                                return (
                                    <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                                        <Box sx={{ position: "", left: { xs: "40px", md: "50%" }, translate: "-50%", }}>
                                            <Box
                                                sx={{
                                                    width: "24px",
                                                    height: "24px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    borderRadius: "100%",
                                                    bgcolor: item.variant,
                                                }}>
                                                <LuCircleDot color="white" size={20} />
                                            </Box>
                                        </Box>
                                        <Box sx={{ width: "100%" }}>
                                            <Box
                                                sx={{ position: "relative", marginInlineStart: { md: "0px" }, ml: { md: "0px", xs: "0px" } }}>
                                                <Card>
                                                    <CardContent sx={{ backgroundColor: "grey.50" }}>
                                                        <Typography component={"h4"} color={"grey.700"} fontSize={"12px"} mb={2}>
                                                            {moment(item.date).fromNow().toUpperCase()}
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            <Grid>
                                                                <Avatar
                                                                    sx={{ width: 25, height: 25 }}
                                                                    src="" alt=""
                                                                />
                                                            </Grid>
                                                            <Grid>
                                                                <Typography
                                                                    color={"grey.700"}>
                                                                    <strong>{item.project}</strong>
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Typography
                                                            component={"h4"}
                                                            sx={{ fontSize: "16px", ml: 5 }}
                                                            color={"grey.700"}>
                                                            {item.user + "  ->  " + item.type + " " + item.table}
                                                        </Typography>
                                                        {/* <Typography sx={{ color: "grey.700", ml: 5 }}>
                                                            {item.table}
                                                        </Typography> */}
                                                    </CardContent>
                                                </Card>
                                                <Box
                                                    sx={{
                                                        bgcolor: "grey.50",
                                                        position: "absolute",
                                                        height: "16px",
                                                        width: "16px",
                                                        rotate: "45deg",
                                                        borderRadius: "2px",
                                                        right: { md: "-8px" },
                                                        top: "28px",
                                                        left: { md: "auto", xs: "-8px" },
                                                    }}></Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Fragment>
                    );
                })}
            </Box>
        </Box>
    )
}

export default ProjectActivity