import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leftSidebarOpen: true,
  rightSidebarOpen: true,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleLeftSidebar: (state) => {
      state.leftSidebarOpen = !state.leftSidebarOpen;
    },
    toggleRightSidebar: (state) => {
      state.rightSidebarOpen = !state.rightSidebarOpen;
    },
    setInitialState: (state, action) => {
      state.leftSidebarOpen = action.payload.leftSidebarOpen;
      state.rightSidebarOpen = action.payload.rightSidebarOpen;
    }
  },
});

export const { toggleLeftSidebar, toggleRightSidebar, setInitialState } = sidebarSlice.actions;
export default sidebarSlice.reducer; 