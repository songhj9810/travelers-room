"use client"

import { useMediaQuery } from "usehooks-ts"

import { cn } from "@/shared/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer"

export type ResponsiveModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  size?: "default" | "lg"
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  close?: React.ReactElement
}

export function ResponsiveModal({
  open,
  onOpenChange,
  size = "default",
  title,
  children,
  footer,
  close,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const Modal = isDesktop
    ? {
        Root: Dialog,
        Content: DialogContent,
        Header: DialogHeader,
        Title: DialogTitle,
        Footer: DialogFooter,
        Close: DialogClose,
      }
    : {
        Root: Drawer,
        Content: DrawerContent,
        Header: DrawerHeader,
        Title: DrawerTitle,
        Footer: DrawerFooter,
        Close: DrawerClose,
      }

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        className={cn(
          "max-h-[80vh] md:max-w-xl",
          size === "lg" && "lg:max-w-2xl xl:max-w-3xl"
        )}
      >
        <Modal.Header className="text-center">
          <Modal.Title className="text-lg">{title}</Modal.Title>
        </Modal.Header>

        <div className="flex-1 scrollbar-thin overflow-y-auto px-6 py-2">
          {children}
        </div>

        {(footer || close) && (
          <Modal.Footer>
            {footer}
            {close && <Modal.Close render={close} />}
          </Modal.Footer>
        )}
      </Modal.Content>
    </Modal.Root>
  )
}
