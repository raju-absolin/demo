import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@src/store/store";
import { LayoutState, LayoutTheme } from "@src/types/layout";
import { themeColours } from "@src/theme/palette";
import { getList, getParamsList, postAdd } from "@src/helpers/Helper";
import { formatErrorMessage } from "../sidemenu/errorMsgFormat";
import { enqueueSnackbar } from "notistack";

// Define the initial state using that type

const themeMode: LayoutTheme = "light";

export interface LayoutThemeMode extends LayoutState {
	status: string;
	error: string;
	themeMode: LayoutTheme;
	preferences: UserPreferencesPayload["preferences"];
}

const preferences = {
	sidebar: {},
	topbar: {},
	bottom: {},
	rightbar: {},
	theme: "",
};

type UserPreferencesPayload = {
	preferences: Record<keyof typeof preferences, any>;
};

const initialState: LayoutThemeMode = {
	status: "",
	error: "",
	theme: themeMode,
	sidenav: {
		mode: "default",
		theme: themeMode,
		showMobileMenu: true,
	},
	themeColours,
	themeColour: {
		topnav: "",
		leftSidenav: "",
	},
	topnav: {
		theme: themeMode,
	},
	showRightsideBar: false,
	themeMode,
	preferences: preferences,
};

export const customiseSlice = createSlice({
	name: "customise",
	initialState,
	reducers: {
		updateSettings: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
		updateThemeColour: (
			state,
			action: PayloadAction<
				Partial<Record<keyof LayoutState["themeColour"], string>>
			>
		) => {
			state.themeColour = {
				...state.themeColour, // Preserve existing values
				...action.payload, // Merge new updates
			};
		},
		updateTheme: (state, action) => {
			return {
				...state,
				theme: action.payload,
				sidenav: {
					...state.sidenav,
					theme: action.payload,
				},
				topnav: {
					...state.topnav,
					theme: action.payload,
				},
				themeMode: action.payload,
			};
		},
		updateSidenav: (state, action) => {
			console.log(action.payload);
			return {
				...state,
				sidenav: {
					...state.sidenav,
					...action.payload,
				},
			};
		},
		updateTopnav: (state, action) => {
			return {
				...state,
				topnav: {
					...state.topnav,
					...action.payload,
				},
			};
		},
		updateShowRightsideBar: (state, action) => {
			return {
				...state,
				showRightsideBar: action.payload,
			};
		},
		resetSettings: () => {
			return { ...initialState };
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUserPreferences.pending, (state, action) => {
				state.status = "loading";
			})
			.addCase(getUserPreferences.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Add any fetched posts to the array

				console.log(action.payload);
				const a = action.payload.shift() as any;
				// state.preferences = action.payload?.preferences;
				state.preferences = a?.preferences as any;
				state.themeColour = {
					topnav: a?.preferences?.topbar?.colour,
					leftSidenav: a?.preferences?.sidebar?.colour,
				};
				state.sidenav = {
					...state.sidenav,
					theme: a?.preferences?.sidebar?.theme,
				};
				state.topnav = {
					...state.topnav,
					theme: a?.preferences?.topbar?.theme,
				};
				state.theme = a?.preferences?.theme
					? a?.preferences?.theme
					: state.theme;
			})
			.addCase(getUserPreferences.rejected, (state, action) => {
				state.status = "failed";

				state.error =
					action?.error?.message || "An unknown error occurred";
			})
			.addCase(postUserPreferences.pending, (state, action) => {
				state.status = "loading";
			})
			.addCase(postUserPreferences.fulfilled, (state, action) => {
				state.status = "succeeded";
				// Add any fetched posts to the array
			})
			.addCase(postUserPreferences.rejected, (state, action) => {
				state.status = "failed";
				state.error =
					action?.error?.message || "An unknown error occurred";
			});
	},
});

export const postUserPreferences = createAsyncThunk<
	UserPreferencesPayload,
	{
		user_id: string;
		body: UserPreferencesPayload;
	}
>("/postUserPreferences", async (payload, { dispatch }) => {
	const { user_id, body } = payload;
	try {
		const response = await postAdd(
			// `/users/user_preferences/${user_id}/`,
			`/users/user_preferences/`,
			body
		);
		if (response) {
			dispatch(getUserPreferences());
			return response?.data?.preferences;
		} else {
			throw new Error(response);
		}
	} catch (error: any) {
		const errResult = formatErrorMessage(error.response.data);
		const formattedErrResult = errResult.replace(/\n/g, "<br>");
		enqueueSnackbar(formattedErrResult || "Unexpected Error Occured", {
			variant: "error",
		});
		// If no response or specific error, throw a general error
		throw new Error(error.message || "An unexpected error occurred");
	}
});
export const getUserPreferences = createAsyncThunk<UserPreferencesPayload[]>(
	// { user_id: string }
	"/getUserPreferences",
	async (payload) => {
		// const { user_id } = payload;
		try {
			const response = await getList(
				// `/users/user_preferences/${user_id}/`,
				`/users/user_preferences/`
				// payload
			);
			if (response) {
				return response.data;
			} else {
				throw new Error(response);
			}
		} catch (error: any) {
			const errResult = formatErrorMessage(error.response.data);
			const formattedErrResult = errResult.replace(/\n/g, "<br>");
			enqueueSnackbar(formattedErrResult || "Unexpected Error Occured", {
				variant: "error",
			});
			// If no response or specific error, throw a general error
			throw new Error(error.message || "An unexpected error occurred");
		}
	}
);

export const {
	updateSettings,
	updateTheme,
	updateSidenav,
	updateTopnav,
	updateShowRightsideBar,
	resetSettings,
	updateThemeColour,
} = customiseSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectLayoutTheme = (state: RootState) => state.customise;

export default customiseSlice.reducer;
