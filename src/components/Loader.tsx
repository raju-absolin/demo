import { CircularProgress, styled } from "@mui/material";
import React from "react";

const LoaderStyles = styled(CircularProgress)(({ theme }) => ({
	display: "block",
	margin: "20px auto",
}));

const Loader = () => {
	return <LoaderStyles />;
};

export default Loader;
