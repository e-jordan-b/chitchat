import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  audioInput: null,
  audioOutput: null,
  videoInput: null,
};

const mediaDevicesSlice = createSlice({
  name: 'mediaDevices',
  initialState,
  reducers: {
    setAudioInput: (state, action) => {
      state.audioInput = action.payload;
    },
    setVideoInput: (state, action) => {
      state.videoInput = action.payload;
    },
    setAudioOutput: (state, action) => {
      state.audioOutput = action.payload;
    },
  },
});

export const { setAudioInput, setVideoInput, setAudioOutput } = mediaDevicesSlice.actions;

export default mediaDevicesSlice.reducer;