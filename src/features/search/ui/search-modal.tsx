"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import {
  MinusSignIcon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { REGION_GROUPS } from "@/entities/guesthouse"

import { Constants } from "@/shared/api/supabase/types"
import { PATHS } from "@/shared/config/paths"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group"
import { Slider } from "@/shared/ui/slider"

import { formValuesToSearchParams } from "../api/mapper"
import { PRICE_MAX, PRICE_MIN, PRICE_STEP } from "../config/filter"
import { OPTIONS } from "../model/options"
import { type SearchFormValues, searchSchema } from "../model/schema"
import { useSearchModal } from "../model/search-modal.store"

export function SearchModal() {
  const router = useRouter()
  const { isOpen, close } = useSearchModal()

  const form = useForm<SearchFormValues>({
    resolver: standardSchemaResolver(searchSchema),
    mode: "onSubmit",
    defaultValues: {
      keyword: "",
      guests: 1,
      regions: [],
      priceRange: [PRICE_MIN, PRICE_MAX],
      parking: null,
      party: null,
    },
  })

  const handleSubmit: SubmitHandler<SearchFormValues> = (values) => {
    const params = formValuesToSearchParams(values)
    close()
    router.push(`${PATHS.SEARCH}?${params.toString()}`)
  }

  // 모달이 열릴 때 폼을 초기화
  useEffect(() => {
    if (isOpen) form.reset()
  }, [isOpen, form])

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close()
      }}
    >
      <DialogContent className="h-full max-h-full max-w-full rounded-none md:max-h-[80vh] md:max-w-xl md:rounded-4xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-center text-lg">
            어디에 머무를까요?
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 scrollbar-thin overflow-y-auto px-6 py-2">
          <form
            id="search-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-7"
          >
            <FieldSet>
              <FieldLegend>검색어 및 인원수</FieldLegend>
              <FieldGroup className="grid grid-cols-[1fr_auto] items-center gap-2">
                <Controller
                  name="keyword"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="keyword" className="sr-only">
                        검색어
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          {...field}
                          id="keyword"
                          type="text"
                          placeholder="검색어를 입력하세요"
                          autoComplete="off"
                        />
                        <InputGroupAddon align="inline-start">
                          <HugeiconsIcon
                            icon={Search01Icon}
                            size={16}
                            strokeWidth={2}
                            aria-hidden
                          />
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  )}
                />

                <Controller
                  name="guests"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel className="sr-only">인원수</FieldLabel>
                      <div className="grid grid-cols-3 place-items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            field.onChange(Math.max(1, field.value - 1))
                          }
                          disabled={field.value <= 1}
                          aria-label="인원수 감소"
                        >
                          <HugeiconsIcon
                            icon={MinusSignIcon}
                            size={16}
                            strokeWidth={2}
                            aria-hidden
                          />
                        </Button>
                        <p aria-live="polite">{field.value} 명</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            field.onChange(field.value + 1)
                          }}
                          disabled={field.value >= 20}
                          aria-label="인원수 증가"
                        >
                          <HugeiconsIcon
                            icon={PlusSignIcon}
                            size={16}
                            strokeWidth={2}
                            aria-hidden
                          />
                        </Button>
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSeparator className="-mx-6" />

            <FieldSet>
              <FieldLegend>지역</FieldLegend>
              <Controller
                name="regions"
                control={form.control}
                render={({ field }) => (
                  <FieldGroup className="grid grid-cols-3 grid-rows-2">
                    {REGION_GROUPS.map((group) => (
                      <Field key={group.label}>
                        <FieldLabel className="justify-center">
                          {group.label}
                        </FieldLabel>
                        <div className="flex flex-col gap-2">
                          {group.regions.map((region) => {
                            const selected = field.value.includes(region.value)
                            return (
                              <Button
                                key={region.value}
                                type="button"
                                variant={selected ? "default" : "outline"}
                                onClick={() =>
                                  field.onChange(
                                    selected
                                      ? field.value.filter(
                                          (v) => v !== region.value
                                        )
                                      : Constants.public.Enums.REGION.filter(
                                          (v) =>
                                            [
                                              ...field.value,
                                              region.value,
                                            ].includes(v)
                                        )
                                  )
                                }
                                className="font-normal"
                              >
                                {region.label}
                              </Button>
                            )
                          })}
                        </div>
                      </Field>
                    ))}
                  </FieldGroup>
                )}
              />
            </FieldSet>

            <FieldSeparator className="-mx-6" />

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

            <FieldSeparator className="-mx-6" />

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
                                field.value === opt.value
                                  ? "default"
                                  : "outline"
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
        </div>

        <DialogFooter className="border-t pt-4">
          <Button type="submit" form="search-form">
            검색
          </Button>
          <Button type="button" variant="link" onClick={() => form.reset()}>
            초기화
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
