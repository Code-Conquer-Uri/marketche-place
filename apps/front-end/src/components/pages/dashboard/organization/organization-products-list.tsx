import { Plus } from "lucide-react";
import type { FC } from "react";
import { searchProductAction } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddProductModal } from "./add-product-modal";
import { ProductCard } from "./product-card";

export const OrganizationProductsList: FC<{
  organizationId: string;
  searchTerm?: string;
  page?: string;
  perPage?: string;
  orderBy?: string;
  orderDirection?: string;
}> = async ({
  organizationId,
  searchTerm,
  page,
  perPage,
  orderBy,
  orderDirection,
}) => {
  const [error, data] = await searchProductAction({
    organizationId,
    ...(orderDirection && { orderDirection: orderDirection as "asc" | "desc" }),
    ...(searchTerm && { searchTerm }),
    ...(page && { page: parseInt(page) }),
    ...(perPage && { perPage: parseInt(perPage) }),
    ...(orderBy && {
      orderBy: orderBy as "createdAt" | "updatedAt" | "title" | "price",
    }),
  });

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">
            Error loading products: {JSON.stringify(error)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Product Button */}
      <div className="flex justify-end">
        <AddProductModal organizationId={organizationId}>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Produto
          </Button>
        </AddProductModal>
      </div>

      {data && (
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            Found {data.products?.length || 0} products
          </div>

          {data.products && data.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm
                    ? `No products found matching "${searchTerm}"`
                    : "No products found"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
