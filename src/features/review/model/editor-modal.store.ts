import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

import type { Review } from "@/entities/review"

interface EditorModalStore {
  isOpen: boolean
  mode: "create" | "edit" | null
  guesthouseId: string | null // mode === "create"
  review: Review | null // mode === "edit"

  open: (props: {
    mode: "create" | "edit"
    guesthouseId?: string
    review?: Review
  }) => void
  close: () => void
}

const initialState = {
  isOpen: false,
  mode: null,
  guesthouseId: null,
  review: null,
}

const useEditorModalStore = create<EditorModalStore>()(
  devtools(
    (set) => ({
      ...initialState,

      open: ({ mode, guesthouseId, review }) =>
        set({
          isOpen: true,
          mode,
          guesthouseId: guesthouseId ?? null,
          review: review ?? null,
        }),
      close: () => set({ isOpen: false, guesthouseId: null, review: null }),
    }),
    { name: "editor-modal-store" }
  )
)

export const useEditorModal = () => {
  return useEditorModalStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      mode: state.mode,
      guesthouseId: state.guesthouseId,
      review: state.review,
      close: state.close,
    }))
  )
}

export const useOpenEditorModal = () =>
  useEditorModalStore((state) => state.open)
