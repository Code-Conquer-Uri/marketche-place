"use client";

import { CaretLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";

export function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      type="button"
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm border p-3 transition-colors duration-300 ease-linear disabled:cursor-not-allowed"
    >
      <CaretLeftIcon className="h-5.5 min-h-5.5 w-5.5 min-w-5.5" />
    </button>
  );
}
