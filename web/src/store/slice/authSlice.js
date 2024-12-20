import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import * as API from '../../api/apiHandler';
import * as Common from '../../utils/Common.js';

export const login = createAsyncThunk(
    "UserLogin",
    async (data, { dispatch }) => {
        try {
            dispatch(setLoader(true));

            const response = await API.login({ ...data });

            dispatch(setLoader(false));

            return response;
        } catch (error) {
            dispatch(setLoader(false));
            Common.ErrorAlert(error);
            console.error(error, "error");
            throw error; // Explicitly reject the promise
        }
    }
);

export const signup = createAsyncThunk(
    "UserSignup",
    async (data, { dispatch }) => {
        try {
            dispatch(setLoader(true));

            const response = await API.signup({ ...data });

            dispatch(setLoader(false));

            return response;
        } catch (error) {
            dispatch(setLoader(false));
            Common.ErrorAlert(error);
            console.error(error, "error");
            throw error; // Explicitly reject the promise
        }
    }
);

export const getUserData = createAsyncThunk(
    "UserDetails",
    async (data, { dispatch }) => {
        try {
            dispatch(setLoader(true));

            const response = await API.getUserDetails({ ...data });

            dispatch(setLoader(false));

            return response;
        } catch (error) {
            dispatch(setLoader(false));
            Common.ErrorAlert(error);
            console.error(error, "error");
            throw error; // Explicitly reject the promise
        }
    }
);

export const updateProfile = createAsyncThunk(
    "EditProfile",
    async (data, { dispatch }) => {
        try {
            dispatch(setLoader(true));

            const response = await API.editProfile({ ...data });

            dispatch(setLoader(false));
            dispatch(getUserData({}));
            return response;
        } catch (error) {
            dispatch(setLoader(false));
            // Common.ErrorAlert(error);
            console.error(error, "error");
            // throw error; // Explicitly reject the promise
        }
    }
);

export const logout = createAsyncThunk(
    "UserLogout",
    async (data, { dispatch }) => {
        try {
            dispatch(setLoader(true));

            const response = await API.logout({ ...data });

            dispatch(setLoader(false));

            return response;
        } catch (error) {
            dispatch(setLoader(false));
            Common.ErrorAlert(error);
            console.error(error, "error");
            throw error; // Explicitly reject the promise
        }
    }
);


const initialState = {

    userSignup: {
        data: null,
        error: null
    },

    userLogin: {
        data: null,
        error: null
    },

    userDetails: {
        data: null,
        error: null
    },

    editProfile: {
        data: null,
        error: null
    },

    userLogout: {
        data: null,
        error: null
    },
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoader: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserData.fulfilled, (state, action) => {
                state.userDetails.data = action.payload;
                state.userDetails.error = null;
            })
            .addCase(getUserData.rejected, (state, action) => {
                state.userDetails.data = null;
                state.userDetails.error = action.error.message;
            })

            .addCase(signup.fulfilled, (state, action) => {
                state.userSignup.data = action.payload;
                state.userSignup.error = null;
            })
            .addCase(signup.rejected, (state, action) => {
                state.userSignup.data = null;
                state.userSignup.error = action.error.message;
            })

            .addCase(login.fulfilled, (state, action) => {
                state.userLogin.data = action.payload;
                state.userLogin.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.userLogin.data = null;
                state.userLogin.error = action.error.message;
            })

            .addCase(updateProfile.fulfilled, (state, action) => {
                state.editProfile.data = action.payload;
                state.editProfile.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.editProfile.data = null;
                state.editProfile.error = action.error.message;
            })

            .addCase(logout.fulfilled, (state, action) => {
                state.userLogout.data = action.payload;
                state.userLogout.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.userLogout.data = null;
                state.userLogout.error = action.error.message;
            })
    }
});

export const { setLoader } = authSlice.actions;
export default authSlice.reducer;