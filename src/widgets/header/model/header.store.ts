import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface HeaderState {
  showSearchBar: boolean
  keyword: string
  showTitle: boolean
  title: string
}

interface HeaderActions {
  setHeader: (header: Partial<HeaderState>) => void
  resetHeader: () => void
}

const initialState = {
  showSearchBar: false,
  keyword: "",
  showTitle: false,
  title: "",
}

const useHeaderStore = create<HeaderState & HeaderActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setHeader: (header) => set(header),
      resetHeader: () => set({ ...initialState }),
    }),
    { name: "header-store" }
  )
)

export const useHeaderSearchBar = () => {
  const showSearchBar = useHeaderStore((state) => state.showSearchBar)
  const keyword = useHeaderStore((state) => state.keyword)
  return { showSearchBar, keyword }
}

export const useHeaderTitle = () => {
  const showTitle = useHeaderStore((state) => state.showTitle)
  const title = useHeaderStore((state) => state.title)
  return { showTitle, title }
}

export const useHeaderActions = () => {
  const setHeader = useHeaderStore((state) => state.setHeader)
  const resetHeader = useHeaderStore((state) => state.resetHeader)
  return { setHeader, resetHeader }
}
