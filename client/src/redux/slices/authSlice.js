import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
    isSidebarOpen: false,
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload
            localStorage.setItem("userInfo", JSON.stringify(state.user))
        },
        logout: (state) => {
            state.user = null
            localStorage.removeItem("userInfo")
        },
        setOpenSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen
        }
    }
})

export const { setCredentials, logout, setOpenSidebar } = authSlice.actions
export default authSlice.reducer
