import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hasJoined: false,
  isHost: false,
  hasRefreshed: true,
  //TODO find earlies entry point to set false
};

const videoCallSlice = createSlice({
  name: 'videoCall',
  initialState,
  reducers: {
    toggleHasJoined: (state) => { state.hasJoined = !state.hasJoined },
    setHasJoinedTrue: (state) => { state.hasJoined = true },
    setHasJoinedFalse: (state) => { state.hasJoined = false },

    toggleIsHost: (state) => { state.isHost = !state.isHost },
    setIsHostTrue: (state) => { state.isHost = true },
    setIsHostFalse: (state) => { state.isHost = false },
  },
});

export const {
  toggleHasJoined,
  setHasJoinedTrue,
  setHasJoinedFalse,
  toggleIsHost,
  setIsHostTrue,
  setIsHostFalse
} = videoCallSlice.actions;

export default videoCallSlice.reducer;