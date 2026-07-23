import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface LoginModalStore {
  isOpen: boolean

  open: () => void
  close: () => void
}

const useLoginModalStore = create<LoginModalStore>()(
  devtools(
    (set) => ({
      isOpen: false,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: "login-modal-store" }
  )
)

export const useLoginModal = () => {
  const isOpen = useLoginModalStore((state) => state.isOpen)
  const close = useLoginModalStore((state) => state.close)
  return { isOpen, close }
}

export const useOpenLoginModal = () => useLoginModalStore((state) => state.open)
