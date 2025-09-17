import Image from "next/image";
import type { FC } from "react";
import { searchProductAction } from "@/actions/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SearchProductsList: FC<{
  searchTerm?: string;
  page?: string;
  perPage?: string;
  orderBy?: string;
  orderDirection?: string;
  organizationId?: string;
}> = async ({
  searchTerm,
  page,
  perPage,
  orderBy,
  orderDirection,
  organizationId,
}) => {
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

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <div className="space-y-4">
      {data && (
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            Found {data.products?.length || 0} products
            {data.total && ` (total: ${data.total})`}
            {data.pages && ` - Page ${page || 1} of ${data.pages}`}
          </div>

          {data.products && data.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        blurDataURL={product.imageBlur}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {product.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {product.description}
                    </p>
                     <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {product.organizationId}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No products found</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
