import Image from "next/image";
import {
  getCouponsByProductIdAction,
  getProductAction,
  getPromotionsByProductIdAction,
  getSimilarProductsAction,
} from "@/actions/product";
import { RedeemCouponButton } from "@/components/pages/product/redeem-coupon-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GetCouponsByProductIdControllerHandleQueryResponse } from "@/http/types/GetCouponsByProductIdControllerHandle.ts";
import type { GetProductControllerHandleQueryResponse } from "@/http/types/GetProductControllerHandle.ts";
import type { GetPromotionsByProductIdControllerHandleQueryResponse } from "@/http/types/GetPromotionsByProductIdControllerHandle.ts";
import type { GetSimilarProductsControllerHandleQueryResponse } from "@/http/types/GetSimilarProductsControllerHandle.ts";

export async function ProductDetails({ productId }: { productId: string }) {
  const [productError, productData] = (await getProductAction(productId)) as [
    unknown,
    GetProductControllerHandleQueryResponse,
  ];
  if (productError) return <div>{JSON.stringify(productError)}</div>;
  if (!productData?.product) return null;

  const [couponsRes] = await Promise.all([
    getCouponsByProductIdAction(productId),
  ]);
  const [promotionsRes] = await Promise.all([
    getPromotionsByProductIdAction(productId),
  ]);
  const similarRes = await getSimilarProductsAction(productId, { limit: 4 });

  const [, couponsData] = couponsRes as [
    unknown,
    GetCouponsByProductIdControllerHandleQueryResponse,
  ];
  const [, promotionsData] = promotionsRes as [
    unknown,
    GetPromotionsByProductIdControllerHandleQueryResponse,
  ];
  const [, similarData] = similarRes as [
    unknown,
    GetSimilarProductsControllerHandleQueryResponse,
  ];

  const product = productData.product;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative border rounded-xl overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.title}
            blurDataURL={product.imageBlurData}
            width={800}
            height={800}
            className="object-cover w-full h-auto"
          />
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold leading-tight">
              {product.title}
            </h1>
            <p className="text-sm text-muted-foreground line-clamp-4">
              {product.description}
            </p>
            <div className="text-xl font-medium">
              R$ {product.price.toFixed(2)}
            </div>
          </div>
          {couponsData?.coupons?.length ? (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Cupons disponíveis</h4>
              <div className="flex flex-wrap gap-2">
                {couponsData.coupons.map((c) => (
                  <RedeemCouponButton
                    key={c.id}
                    couponId={c.id}
                    discount={c.discountPercentage}
                  />
                ))}
              </div>
            </div>
          ) : null}
          {promotionsData?.promotions?.length ? (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Promoções</h4>
              <div className="space-y-2">
                {promotionsData.promotions.map((p) => (
                  <div
                    key={p.id}
                    className="text-xs bg-primary/10 text-primary rounded-md px-3 py-2 w-fit"
                  >
                    Desconto {p.discountPercentage}%
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {similarData?.products?.length ? (
        <div className="space-y-4">
          <h4 className="font-medium">Produtos relacionados</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarData.products.map((sp) => (
              <Card key={sp.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={sp.imageUrl}
                      alt={sp.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  <p className="text-sm font-medium line-clamp-2">{sp.title}</p>
                  <p className="text-xs text-muted-foreground">
                    R$ {sp.price.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
