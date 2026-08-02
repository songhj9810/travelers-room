import { cn } from "@/shared/lib/utils"

type MapMarkerProps = {
  name: string
  active: boolean
}

export function MapMarker({ name, active }: MapMarkerProps) {
  return (
    <div className="relative flex -translate-x-1/2 -translate-y-full flex-col items-center">
      <div
        className={cn(
          "inline-flex w-fit items-center rounded-md px-3 py-1.5 transition-colors",
          active
            ? "max-w-none bg-foreground text-background"
            : "max-w-xs bg-background text-foreground"
        )}
      >
        <span className="truncate text-xs font-medium">{name}</span>
      </div>

      <div className="mx-auto -mt-1.5">
        <div
          className={cn(
            "size-2.5 rotate-45 rounded-xs transition-colors",
            active ? "bg-foreground" : "bg-background"
          )}
        />
      </div>
    </div>
  )
}
