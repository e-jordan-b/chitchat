import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  audioInputDevices: [],
  videoInputDevices: [],
  selectedAudioDevice: null,
  selectedVideoDevice: null,
};

// fk typescript

const mediaDevicesSlice = createSlice({
  name: 'mediaDevices',
  initialState,
  reducers: {
    setAudioInputDevices: (state, action) => {
      state.audioInputDevices = action.payload;
    },
    setVideoInputDevices: (state, action) => {
      state.videoInputDevices = action.payload;
    },
    setSelectedAudioDevice: (state, action) => {
      state.selectedAudioDevice = action.payload;
    },
    setSelectedVideoDevice: (state, action) => {
      state.selectedVideoDevice = action.payload;
    },

  },
});

export const {
  setAudioInputDevices,
  setVideoInputDevices,
  setSelectedAudioDevice,
  setSelectedVideoDevice
} = mediaDevicesSlice.actions;

export default mediaDevicesSlice.reducer;