import { configureStore } from '@reduxjs/toolkit';
import mediaDevicesReducer from "./slices/mediaDeviceSlice"
import videoCallReducer from './slices/videoCallSlice';

const store = configureStore({
  reducer: {
    mediaDevices: mediaDevicesReducer,
    videoCall: videoCallReducer
  },
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;