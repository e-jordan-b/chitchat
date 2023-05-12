import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hasJoined: false,
  isHost: false,
  hasRefreshed: true,
  //TODO find earlies entry point to set false
  callId: "",
  agenda: [],
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

    setRefreshedTrue: (state) => { state.hasRefreshed = true },
    setRefreshedFalse: (state) => { state.hasRefreshed = false },

    setCallId: (state, action) => { state.callId = action.payload },
    setAgenda: (state, action) => { state.agenda = action.payload },
  },
});

export const {
  toggleHasJoined,
  setHasJoinedTrue,
  setHasJoinedFalse,
  toggleIsHost,
  setIsHostTrue,
  setIsHostFalse,
  setRefreshedTrue,
  setRefreshedFalse,
  setCallId,
  setAgenda
} = videoCallSlice.actions;

export default videoCallSlice.reducer;