import { Suspense } from "react";
import { ProductDetails } from "@/components/pages/product/product-details";
import { ProductDetailsSkeleton } from "@/components/pages/product/product-details.skeleton";
import { GoBackButton } from "../../../../components/go-back-button";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="w-full py-10">
      <div className="mx-auto max-w-7xl px-5 xl:px-0">
      <div className="flex flex-col gap-3">
        <GoBackButton />

        <Suspense fallback={<ProductDetailsSkeleton />} key={id}>
          <ProductDetails productId={id} />
        </Suspense>
      </div>
      </div>
    </div>
  );
}
