import Image from "next/image";
import Link from "next/link";
import { searchProductAction } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddProductModal } from "./add-product-modal";
import { ProductCardDropdown } from "./product-card-dropdown";

export async function OrganizationProductsTable({
  organizationId,
  searchTerm,
  page,
  perPage,
  orderBy,
  orderDirection,
}: {
  organizationId: string;
  searchTerm?: string;
  page?: string;
  perPage?: string;
  orderBy?: string;
  orderDirection?: string;
}) {
  const [error, data] = await searchProductAction({
    organizationId,
    ...(searchTerm && { searchTerm }),
    ...(page && { page: parseInt(page) }),
    ...(perPage && { perPage: parseInt(perPage) }),
    ...(orderBy && { orderBy: orderBy as any }),
    ...(orderDirection && { orderDirection: orderDirection as any }),
  });

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Erro ao carregar produtos</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="text-sm text-muted-foreground">
            {data?.products?.length || 0} produto(s)
          </div>
          <AddProductModal organizationId={organizationId}>
            <Button className="h-9 px-4">Adicionar novo produto +</Button>
          </AddProductModal>
        </div>
        {data?.products && data.products.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Foto</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-32">Preço</TableHead>
                  <TableHead className="w-24 text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.products.map((p) => (
                  <TableRow key={p.id} className="align-top">
                    <TableCell>
                      <div className="relative h-12 w-16 rounded-md overflow-hidden border bg-muted">
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          blurDataURL={p.imageBlurData}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[180px] truncate">
                      {p.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[360px] truncate">
                      {p.description}
                    </TableCell>
                    <TableCell>R$ {p.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/product/${p.id}`}>
                          <Button
                            variant="default"
                            size="sm"
                            className="h-8 px-2"
                            aria-label="abrir"
                          >
                            ↗
                          </Button>
                        </Link>
                        <ProductCardDropdown
                          productId={p.id}
                          productTitle={p.title}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
            {searchTerm ? "Nenhum produto encontrado" : "Sem produtos"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
