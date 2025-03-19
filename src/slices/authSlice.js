import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("✅ setUser Reducer Called! Updating state with:", action.payload);
      state.user = action.payload;
    },
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const {setUser, setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;