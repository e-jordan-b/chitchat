import { createSlice } from '@reduxjs/toolkit';

const initialState = {

  selectedAudioDeviceId: "",
  selectedVideoDeviceId: "",
};

const mediaDevicesSlice = createSlice({
  name: 'mediaDevices',
  initialState,
  reducers: {
    updateAudioDeviceId: (state, action) => {
      state.selectedAudioDeviceId = action.payload;
    },
    updateVideoDeviceId: (state, action) => {
      state.selectedVideoDeviceId = action.payload;
    },

  },
});

export const {
  updateAudioDeviceId,
  updateVideoDeviceId
} = mediaDevicesSlice.actions;

export default mediaDevicesSlice.reducer;