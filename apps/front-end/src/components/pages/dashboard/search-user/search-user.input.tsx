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

const searchSchema = z.object({
  search: z.string().min(0),
});

type SearchFormData = z.infer<typeof searchSchema>;

export const SearchUserInput: FC = () => {
  const [search, setSearch] = useQueryState(
    "searchTerm",
    parseAsString.withOptions({
      shallow: false,
      clearOnDefault: false,
    }),
  );

  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: search ?? "",
    },
  });

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 600);

  const onSubmit = (data: SearchFormData) => {
    setSearch(data.search);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search users..."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debouncedSetSearch(e.target.value);
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={
                      form.formState.isSubmitting || form.formState.disabled
                    }
                  >
                    Search
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
