import { createSlice } from '@reduxjs/toolkit';

const initialState = {

  selectedAudioDeviceId: "",
  selectedVideoDeviceId: "",
};

const mediaDevicesSlice = createSlice({
  name: 'mediaDevices',
  initialState,
  reducers: {

    setSelectedAudioDeviceId: (state, action) => {
      state.selectedAudioDeviceId = action.payload;
    },
    setSelectedVideoDeviceId: (state, action) => {
      console.log("from store", action.payload);
      state.selectedVideoDeviceId = action.payload;
    },

  },
});

export const {
  setSelectedAudioDeviceId,
  setSelectedVideoDeviceId
} = mediaDevicesSlice.actions;

export default mediaDevicesSlice.reducer;