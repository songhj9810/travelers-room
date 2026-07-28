import { GridViewIcon, MapsIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

type ViewSwitcherProps = {
  value: "list" | "map"
  onValueChange: (value: "list" | "map") => void
}

export function ViewSwitcher({ value, onValueChange }: ViewSwitcherProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList>
        <TabsTrigger value="list">
          <HugeiconsIcon
            icon={GridViewIcon}
            size={16}
            strokeWidth={2}
            data-icon="inline-start"
            aria-hidden
          />
          목록
        </TabsTrigger>
        <TabsTrigger value="map">
          <HugeiconsIcon
            icon={MapsIcon}
            size={16}
            strokeWidth={2}
            data-icon="inline-start"
            aria-hidden
          />
          지도
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
