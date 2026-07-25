import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface SearchModalStore {
  isOpen: boolean

  open: () => void
  close: () => void
}

const useSearchModalStore = create<SearchModalStore>()(
  devtools(
    (set) => ({
      isOpen: false,

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: "search-modal-store" }
  )
)

export const useSearchModal = () => {
  const isOpen = useSearchModalStore((state) => state.isOpen)
  const close = useSearchModalStore((state) => state.close)
  return { isOpen, close }
}

export const useOpenSearchModal = () =>
  useSearchModalStore((state) => state.open)
