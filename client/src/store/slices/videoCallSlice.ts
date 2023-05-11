import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hasJoined: false,
  isHost: false,
};

const videoCallSlice = createSlice({
  name: 'videoCall',
  initialState,
  reducers: {
    toggleHasJoined: (state) => { state.hasJoined = !state.hasJoined },
    toggleIsHost: (state) => { state.isHost = !state.isHost }
  },
});

export const {
  toggleHasJoined,
  toggleIsHost } = videoCallSlice.actions;

export default videoCallSlice.reducer;