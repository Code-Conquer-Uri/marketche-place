"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { parseAsString, useQueryState } from "nuqs";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const searchSchema = z.object({
  search: z.string().min(0),
  page: z.string().optional(),
  perPage: z.string().optional(),
  orderBy: z.enum(["createdAt", "updatedAt", "title", "price"]).optional(),
  orderDirection: z.enum(["asc", "desc"]).optional(),
  organizationId: z.string().optional(),
});

type SearchFormData = z.infer<typeof searchSchema>;

export const SearchProductsInput: FC = () => {
  const [searchTerm, setSearchTerm] = useQueryState(
    "searchTerm",
    parseAsString.withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  const [page, setPage] = useQueryState(
    "page",
    parseAsString.withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  const [perPage, setPerPage] = useQueryState(
    "perPage",
    parseAsString.withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  const [orderBy, setOrderBy] = useQueryState(
    "orderBy",
    parseAsString.withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  const [orderDirection, setOrderDirection] = useQueryState(
    "orderDirection",
    parseAsString.withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  const [organizationId, setOrganizationId] = useQueryState(
    "organizationId",
    parseAsString.withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: searchTerm ?? "",
      page: page ?? "1",
      perPage: perPage ?? "10",
      orderBy:
        (orderBy as "createdAt" | "updatedAt" | "title" | "price") ??
        "createdAt",
      orderDirection: (orderDirection as "asc" | "desc") ?? "desc",
      organizationId: organizationId ?? "",
    },
  });

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
  }, 800);

  const onSubmit = (data: SearchFormData) => {
    setSearchTerm(data.search);
    setPage(data.page ?? "1");
    setPerPage(data.perPage ?? "10");
    setOrderBy(data.orderBy ?? "createdAt");
    setOrderDirection(data.orderDirection ?? "desc");
    setOrganizationId(data.organizationId ?? "");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full lg:self-end lg:justify-end lg:justify-self-end"
      >
        <div className="flex flex-col sm:flex-row gap-2 lg:justify-self-end">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="flex-1 lg:max-w-56">
                <FormControl>
                  <Input
                    placeholder="Pesquise aqui..."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedSetSearch(e.target.value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orderBy"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setOrderBy(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ordene por" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    <SelectItem value="createdAt">Data</SelectItem>
                    <SelectItem value="title">Título</SelectItem>
                    <SelectItem value="price">Preço</SelectItem>
                    <SelectItem value="updatedAt">Atualizado</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orderDirection"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setOrderDirection(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Dir" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    <SelectItem value="desc">Decrescente</SelectItem>
                    <SelectItem value="asc">Crescente</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="perPage"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setPerPage(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Per page" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="cursor-pointer"
            disabled={form.formState.isSubmitting || form.formState.disabled}
          >
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
};
