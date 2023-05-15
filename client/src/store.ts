import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useDeviceStore = create(
  combine({
    audioDeviceId: "",
    videoDeviceId: "",
  }, (set) => ({
    setAudioDeviceId: (id: string) => set(() => ({ audioDeviceId: id })),
    setVideoDeviceId: (id: string) => set(() => ({ videoDeviceId: id })),
  }))
  )
  export default useDeviceStore;