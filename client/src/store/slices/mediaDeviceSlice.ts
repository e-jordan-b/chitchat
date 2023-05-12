import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  audioInputDeviceIds: [],
  videoInputDeviceIds: [],
  selectedAudioDeviceId: null,
  selectedVideoDeviceId: null,
};

const mediaDevicesSlice = createSlice({
  name: 'mediaDevices',
  initialState,
  reducers: {
    setAudioInputDeviceIds: (state, action) => {
      state.audioInputDeviceIds = action.payload;
    },
    setVideoInputDevicesIds: (state, action) => {
      state.videoInputDeviceIds = action.payload;
    },
    setSelectedAudioDeviceId: (state, action) => {
      state.selectedAudioDeviceId = action.payload;
    },
    setSelectedVideoDeviceId: (state, action) => {
      state.selectedVideoDeviceId = action.payload;
    },

  },
});

export const {
  setAudioInputDeviceIds,
  setVideoInputDevicesIds,
  setSelectedAudioDeviceId,
  setSelectedVideoDeviceId
} = mediaDevicesSlice.actions;

export default mediaDevicesSlice.reducer;