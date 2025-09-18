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
});

type SearchFormData = z.infer<typeof searchSchema>;

export const OrganizationProductsSearchInput: FC = () => {
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

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: searchTerm || "",
      page: page || "1",
      perPage: perPage || "12",
      orderBy:
        (orderBy as "createdAt" | "updatedAt" | "title" | "price") ||
        "createdAt",
      orderDirection: (orderDirection as "asc" | "desc") || "desc",
    },
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value || null);
    setPage("1"); // Reset to first page when searching
  }, 500);

  const onSubmit = (data: SearchFormData) => {
    setSearchTerm(data.search || null);
    setPage(data.page || "1");
    setPerPage(data.perPage || "12");
    setOrderBy(data.orderBy || "createdAt");
    setOrderDirection(data.orderDirection || "desc");
  };

  const handleClear = () => {
    setSearchTerm(null);
    setPage("1");
    setPerPage("12");
    setOrderBy("createdAt");
    setOrderDirection("desc");
    form.reset({
      search: "",
      page: "1",
      perPage: "12",
      orderBy: "createdAt",
      orderDirection: "desc",
    });
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Search products..."
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedSearch(e.target.value);
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="createdAt">Date</SelectItem>
                      <SelectItem value="updatedAt">Updated</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="desc">Newest</SelectItem>
                      <SelectItem value="asc">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit" variant="default">
              Search
            </Button>

            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
