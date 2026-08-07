"use client"

import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  FavouriteIcon,
  InformationCircleIcon,
  Loading03Icon,
  MultiplicationSignCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"

const topToast = ToastPrimitive.createToastManager()
const bottomToast = ToastPrimitive.createToastManager()

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({
  className,
  position = "top",
  ...props
}: ToastPrimitive.Viewport.Props & { position?: "top" | "bottom" }) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      data-position={position}
      className={cn(
        "group/toast-viewport pointer-events-none fixed left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 outline-none",
        position === "top" && "top-4 md:top-8",
        position === "bottom" && "bottom-20 md:bottom-8",
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      swipeDirection={[]}
      className={cn(
        "group/toast pointer-events-auto absolute z-[calc(1000-var(--toast-index))] w-full rounded-2xl border bg-popover text-popover-foreground shadow-lg will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",

        "group-data-[position=top]/toast-viewport:top-0 group-data-[position=top]/toast-viewport:right-0 group-data-[position=top]/toast-viewport:origin-top",
        "group-data-[position=bottom]/toast-viewport:right-0 group-data-[position=bottom]/toast-viewport:bottom-0 group-data-[position=bottom]/toast-viewport:origin-bottom",

        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "group-data-[position=top]/toast-viewport:[--offset-y:calc(var(--toast-offset-y)*1+calc(var(--toast-index)*var(--gap)*1)+var(--toast-swipe-movement-y))]",
        "group-data-[position=top]/toast-viewport:[--peek-dir:1]",
        "group-data-[position=bottom]/toast-viewport:[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
        "group-data-[position=bottom]/toast-viewport:[--peek-dir:-1]",

        "h-(--height) transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek)*var(--peek-dir))+(var(--shrink)*var(--height)*var(--peek-dir))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0",

        "group-data-[position=top]/toast-viewport:data-starting-style:transform-[translateY(-150%)]",
        "group-data-[position=top]/toast-viewport:md:data-starting-style:transform-[translateY(-200%)]",
        "group-data-[position=bottom]/toast-viewport:data-starting-style:transform-[translateY(150%)]",
        "group-data-[position=top]/toast-viewport:[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(-150%)]",
        "group-data-[position=top]/toast-viewport:md:[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(-200%)]",
        "group-data-[position=bottom]/toast-viewport:[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]",

        "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "md:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-200%))]",

        "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "md:data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-200%))]",
        className
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        "relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground",
        className
      )}
      {...props}
    >
      {children ?? (
        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} aria-hidden="true" />
      )}
    </ToastPrimitive.Close>
  )
}

function ToastIcon({ type }: { type: string | undefined }) {
  let icon: React.ReactNode = null

  if (type === "success") {
    icon = (
      <HugeiconsIcon
        icon={CheckmarkCircle02Icon}
        strokeWidth={2}
        aria-hidden="true"
      />
    )
  }

  if (type === "info") {
    icon = (
      <HugeiconsIcon
        icon={InformationCircleIcon}
        strokeWidth={2}
        aria-hidden="true"
      />
    )
  }

  if (type === "warning") {
    icon = (
      <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} aria-hidden="true" />
    )
  }

  if (type === "error") {
    icon = (
      <HugeiconsIcon
        icon={MultiplicationSignCircleIcon}
        strokeWidth={2}
        className="text-destructive"
        aria-hidden="true"
      />
    )
  }

  if (type === "loading") {
    icon = (
      <HugeiconsIcon
        icon={Loading03Icon}
        strokeWidth={2}
        className="animate-spin"
        aria-hidden="true"
      />
    )
  }

  if (type === "wishlist") {
    icon = (
      <HugeiconsIcon icon={FavouriteIcon} strokeWidth={2} aria-hidden="true" />
    )
  }

  if (!icon) {
    return null
  }

  return (
    <span
      data-slot="toast-icon"
      className="shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4"
    >
      {icon}
    </span>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}

function Toaster({ children, ...props }: ToastPrimitive.Provider.Props) {
  return (
    <>
      {children}

      <ToastProvider toastManager={topToast} timeout={4000} {...props}>
        <ToastPortal>
          <ToastViewport position="top">
            <ToastList />
          </ToastViewport>
        </ToastPortal>
      </ToastProvider>

      <ToastProvider toastManager={bottomToast} timeout={4000} {...props}>
        <ToastPortal>
          <ToastViewport position="bottom">
            <ToastList />
          </ToastViewport>
        </ToastPortal>
      </ToastProvider>
    </>
  )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export {
  bottomToast,
  createToastManager,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  topToast,
  useToastManager,
}
