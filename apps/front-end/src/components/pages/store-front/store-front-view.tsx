import Image from "next/image";
import Link from "next/link";
import { searchCouponsAction, searchProductAction } from "@/actions/product";
import { getStoreFrontAction } from "@/actions/store-front";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GetStoreFrontControllerHandleQueryResponse } from "@/http/types/GetStoreFrontControllerHandle.ts";

export async function StoreFrontView({
  organizationId,
  page,
  perPage,
}: {
  organizationId: string;
  page?: string;
  perPage?: string;
}) {
  const [sfError, sfData] = (await getStoreFrontAction({ organizationId })) as [
    unknown,
    GetStoreFrontControllerHandleQueryResponse,
  ];
  if (sfError) return <div>{JSON.stringify(sfError)}</div>;
  if (!sfData?.storeFront) return null;

  const storeFront = sfData.storeFront;

  const [productsError, productsData] = await searchProductAction({
    organizationId,
    ...(page && { page: parseInt(page) }),
    ...(perPage && { perPage: parseInt(perPage) }),
  });
  if (productsError) return <div>{JSON.stringify(productsError)}</div>;

  const couponsMap = new Map<string, number>();
  if (productsData?.products?.length) {
    const couponsPromises = await Promise.all(
      productsData.products.map((p) =>
        searchCouponsAction({ productId: p.id }),
      ),
    );
    couponsPromises.forEach(([, coupons], idx) => {
      if (coupons?.coupons?.length && productsData.products) {
        couponsMap.set(productsData.products[idx].id, coupons.coupons.length);
      }
    });
  }

  return (
    <div className="space-y-10">
      <div className="rounded-xl overflow-hidden relative h-60 w-full border bg-muted">
        <Image
          src={storeFront.bannerImageUrl}
          alt="banner"
          fill
          blurDataURL={storeFront.bannerImageBlurData}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/10" />
        <div className="absolute bottom-4 left-4 flex items-center gap-4">
          <div className="relative h-20 w-20 rounded-lg overflow-hidden border bg-background">
            <Image
              src={storeFront.logoImageUrl}
              alt="logo"
              fill
              blurDataURL={storeFront.logoImageBlurData}
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Loja</h1>
            <p className="text-xs text-muted-foreground">
              {storeFront.location}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Produtos</h2>
          <p className="text-xs text-muted-foreground">
            {productsData?.products?.length || 0} itens
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productsData?.products?.map((product) => (
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
      </div>
    </div>
  );
}
