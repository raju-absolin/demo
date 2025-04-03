import { List, ListItem, styled } from "@mui/material";
import { AsyncThunk, Dispatch } from "@reduxjs/toolkit";
import { PageParamsTypes } from "@src/common/common.types";
import { useAppDispatch } from "@src/store/store";
import { SyntheticEvent, useState } from "react";
import Loader from "./Loader";

export const Scrollable = styled(List)<Record<string, any>>(
	({ theme, ...props }) => ({
		maxHeight: props?.styles?.maxHeight,
		marginTop: "0px",
		overflowY: "auto",
		padding: "0 8px",
		"&::-webkit-scrollbar": {
			width: "8px",
		},
		"&::-webkit-scrollbar-thumb": {
			backgroundColor: theme.palette.primary.main,
			borderRadius: "8px",
		},
		...props.styles,
	})
);

type Props<T, P> = {
	styles?: Record<string, any>;
	loading?: boolean;
	params?: PageParamsTypes & P;
	fetchapi?: AsyncThunk<any, any, any>;
	list: T[];
	keyExtractor?: (item: T) => string | number;
	renderItem: (
		item: T,
		index: number,
		selectedItem: string | number | null,
		handleSelect: (item: T) => void
	) => JSX.Element;
};

const ScrollableList = <T, P>({
	styles,
	loading,
	params,
	fetchapi,
	list,
	keyExtractor,
	renderItem,
}: Props<T, P>) => {
	const dispatch = useAppDispatch();
	const [selectedItem, setSelectedItem] = useState<string | number | null>(
		null
	);

	const loadMoreItems = (event: SyntheticEvent) => {
		if (!loading) {
			const { target } = event as any;
			if (
				Math.ceil(target.scrollTop + target.offsetHeight) ==
				target.scrollHeight
			) {
				if (params && params.page < params.no_of_pages) {
					fetchapi &&
						dispatch(
							fetchapi({
								...params,
								page: params.page + 1,
							})
						);
				}
			}
		}
	};

	const handleSelect = (item: T) => {
		keyExtractor && setSelectedItem(keyExtractor(item));
	};
	return (
		<Scrollable onScroll={loadMoreItems} styles={styles}>
			{loading ? (
				<Loader />
			) : (
				list?.map((item, index) =>
					renderItem(item, index, selectedItem, handleSelect)
				)
			)}
		</Scrollable>
	);
};

export default ScrollableList;
