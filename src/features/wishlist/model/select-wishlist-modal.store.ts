import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

interface SelectWishlistModalStore {
  isOpen: boolean
  wishlistItemId: string | null

  open: ({ wishlistItemId }: { wishlistItemId: string }) => void
  close: () => void
}

const initialState = {
  isOpen: false,
  wishlistItemId: null,
}

const useSelectWishlistModalStore = create<SelectWishlistModalStore>()(
  devtools(
    (set) => ({
      ...initialState,

      open: ({ wishlistItemId }) => set({ isOpen: true, wishlistItemId }),
      close: () => set({ ...initialState }),
    }),
    { name: "select-wishlist-modal-store" }
  )
)

export const useSelectWishlistModal = () => {
  return useSelectWishlistModalStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      wishlistItemId: state.wishlistItemId,
      close: state.close,
    }))
  )
}

export const useOpenSelectWishlistModal = () =>
  useSelectWishlistModalStore((state) => state.open)
