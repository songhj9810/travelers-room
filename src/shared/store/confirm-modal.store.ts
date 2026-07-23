import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

interface ConfirmModalStore {
  isOpen: boolean
  title: string
  description: string
  destructive: boolean
  onConfirm?: () => void

  open: (props: {
    title: string
    description: string
    destructive?: boolean
    onConfirm: () => void
  }) => void
  close: () => void
}

const initialState = {
  isOpen: false,
  title: "",
  description: "",
  destructive: false,
  onConfirm: undefined,
}

const useConfirmModalStore = create<ConfirmModalStore>()(
  devtools(
    (set) => ({
      ...initialState,

      open: ({ title, description, destructive = false, onConfirm }) =>
        set({ isOpen: true, title, description, destructive, onConfirm }),
      close: () => set({ isOpen: false, onConfirm: undefined }),
    }),
    { name: "confirm-modal-store" }
  )
)

export const useConfirmModal = () => {
  return useConfirmModalStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      title: state.title,
      description: state.description,
      destructive: state.destructive,
      onConfirm: state.onConfirm,
      close: state.close,
    }))
  )
}

export const useOpenConfirmModal = () =>
  useConfirmModalStore((state) => state.open)
