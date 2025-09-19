import Image from "next/image";
import Link from "next/link";
import { searchCouponsAction, searchProductAction } from "@/actions/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function ProductsGrid({
  searchTerm,
  page,
  perPage,
  orderBy,
  orderDirection,
  organizationId,
}: {
  searchTerm?: string;
  page?: string;
  perPage?: string;
  orderBy?: string;
  orderDirection?: string;
  organizationId?: string;
}) {
  const [error, data] = await searchProductAction({
    ...(searchTerm && { searchTerm }),
    ...(page && { page: parseInt(page) }),
    ...(perPage && { perPage: parseInt(perPage) }),
    ...(orderBy && {
      orderBy: orderBy as "createdAt" | "updatedAt" | "title" | "price",
    }),
    ...(orderDirection && { orderDirection: orderDirection as "asc" | "desc" }),
    ...(organizationId && { organizationId }),
  });

  if (error) return <div>{JSON.stringify(error)}</div>;

  const couponsMap = new Map<string, number>();
  if (data?.products?.length) {
    const couponsPromises = await Promise.all(
      data.products.map((p) => searchCouponsAction({ productId: p.id })),
    );
    couponsPromises.forEach(([, coupons], idx) => {
      if (coupons?.coupons?.length && data.products) {
        couponsMap.set(data.products[idx].id, coupons.coupons.length);
      }
    });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data?.products?.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id}>
          <Card className="overflow-hidden">
            <CardHeader className="p-0 relative">
              <div className="relative aspect-square">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  blurDataURL={product.imageBlurData}
                  fill
                  className="object-cover"
                />
              </div>
              {couponsMap.get(product.id) && (
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
                  {couponsMap.get(product.id)} cupom(s)
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="line-clamp-2 text-base mb-2">
                {product.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  R$ {product.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {product.createdAt
                    ? new Date(product.createdAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
