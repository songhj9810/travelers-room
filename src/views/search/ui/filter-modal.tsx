"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"

import {
  formValuesToSearchParams,
  OPTIONS,
  PRICE_MAX,
  PRICE_MIN,
  PRICE_STEP,
  type SearchFormValues,
  searchSchema,
} from "@/features/search"

import { PATHS } from "@/shared/config/paths"
import { Button } from "@/shared/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/shared/ui/field"
import {
  ResponsiveModal,
  type ResponsiveModalProps,
} from "@/shared/ui/responsive-modal"
import { Slider } from "@/shared/ui/slider"

type FilterModalProps = Pick<ResponsiveModalProps, "open" | "onOpenChange"> & {
  values: SearchFormValues
}

export function FilterModal({ open, onOpenChange, values }: FilterModalProps) {
  const router = useRouter()

  const form = useForm<SearchFormValues>({
    resolver: standardSchemaResolver(searchSchema),
    mode: "onSubmit",
    defaultValues: values,
  })

  const handleSubmit: SubmitHandler<SearchFormValues> = (values) => {
    const params = formValuesToSearchParams(values)
    onOpenChange(false)
    router.push(`${PATHS.SEARCH}?${params.toString()}`)
  }

  const handleReset = () => {
    form.reset({
      keyword: form.getValues("keyword"),
      guests: form.getValues("guests"),
      regions: form.getValues("regions"),
      priceRange: [PRICE_MIN, PRICE_MAX],
      parking: null,
      party: null,
    })
  }

  // 모달이 열릴 때 폼을 초기화
  useEffect(() => {
    if (open) form.reset(values)
  }, [open, form, values])

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="필터"
      footer={
        <>
          <Button type="submit" form="filter-form">
            적용
          </Button>
          <Button type="button" variant="link" onClick={handleReset}>
            초기화
          </Button>
        </>
      }
    >
      <form
        id="filter-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-7"
      >
        <FieldSet>
          <FieldLegend>가격</FieldLegend>
          <Controller
            name="priceRange"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="priceRange" className="sr-only">
                  가격
                </FieldLabel>
                <Slider
                  id="priceRange"
                  value={field.value}
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  onValueChange={(value) =>
                    field.onChange(value as [number, number])
                  }
                />
                <FieldDescription className="text-center">
                  최소 {field.value[0].toLocaleString()} 원 ~ 최대{" "}
                  {field.value[1].toLocaleString()} 원
                </FieldDescription>
              </Field>
            )}
          />
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>옵션</FieldLegend>
          <FieldGroup className="grid grid-cols-2">
            {OPTIONS.map((option) => (
              <Controller
                key={option.value}
                name={option.value}
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>{option.label}</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "전체", value: null },
                        { label: "있음", value: true },
                        { label: "없음", value: false },
                      ].map((opt) => (
                        <Button
                          key={opt.label}
                          type="button"
                          variant={
                            field.value === opt.value ? "default" : "outline"
                          }
                          onClick={() => field.onChange(opt.value)}
                          className="font-normal"
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </Field>
                )}
              />
            ))}
          </FieldGroup>
        </FieldSet>
      </form>
    </ResponsiveModal>
  )
}
