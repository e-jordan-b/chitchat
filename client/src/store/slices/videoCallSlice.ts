import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hasJoined: false,
};

const videoCallSlice = createSlice({
  name: 'videoCall',
  initialState,
  reducers: {
    toggleHasJoined: (state) => { state.hasJoined = !state.hasJoined }
  },
});

export const { toggleHasJoined } = videoCallSlice.actions;

export default videoCallSlice.reducer;