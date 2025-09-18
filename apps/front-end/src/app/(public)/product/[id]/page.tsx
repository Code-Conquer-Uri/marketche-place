import { Suspense } from "react";
import { ProductDetails } from "@/components/pages/product/product-details";
import { ProductDetailsSkeleton } from "@/components/pages/product/product-details.skeleton";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="w-full pt-24 pb-10">
      <div className="mx-auto max-w-7xl px-5 xl:px-0">
        <Suspense fallback={<ProductDetailsSkeleton />} key={id}>
          <ProductDetails productId={id} />
        </Suspense>
      </div>
    </div>
  );
}
