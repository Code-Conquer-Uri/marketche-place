import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getUsersCouponsByCouponsAction } from "@/actions/coupon";
import {
  getCouponsByProductIdAction,
  getProductAction,
  getPromotionsByProductIdAction,
  getSimilarProductsAction,
} from "@/actions/product";
import { RedeemCouponButton } from "@/components/pages/product/redeem-coupon-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GetCouponsByProductIdControllerHandleQueryResponse } from "@/http/types/GetCouponsByProductIdControllerHandle.ts";
import type { GetProductControllerHandleQueryResponse } from "@/http/types/GetProductControllerHandle.ts";
import type { GetPromotionsByProductIdControllerHandleQueryResponse } from "@/http/types/GetPromotionsByProductIdControllerHandle.ts";
import type { GetSimilarProductsControllerHandleQueryResponse } from "@/http/types/GetSimilarProductsControllerHandle.ts";

export async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: productId } = await params;
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

  const [, promotionsThatUserHave] = await getUsersCouponsByCouponsAction(
    couponsData
      ? { couponIds: couponsData.coupons.map((c) => c.id) }
      : { couponIds: [] },
  );
  const product = productData.product;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:justify-between">
        <div className="relative rounded-xl overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.title}
            blurDataURL={product.imageBlurData}
            width={515}
            height={635}
            className="object-cover w-full max-w-[32.185rem] h-full max-h-[39.685rem] rounded-xl"
          />
        </div>
        <div className="flex flex-col justify-center h-full">
          <div className="space-y-2">
            <h1 className="text-3xl text-foreground font-semibold leading-tight">
              {product.title}
            </h1>
            <span className="text-sm text-muted-foreground line-clamp-4">
              <strong className="text-foreground">Código: </strong>
              {product.id}
            </span>
            <p className="text-sm text-muted-foreground line-clamp-4">
              {product.description}
            </p>
            <div className="text-xl font-medium">
              R$ {product.price.toFixed(2)}
            </div>
            <Link href="#" className="text-xl font-medium">
              <Button className="cursor-pointer">
                Eu quero esse produto
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          {couponsData?.coupons?.length ? (
            <div className="space-y-3 pt-3">
              <h4 className="font-medium text-sm">Cupons disponíveis</h4>
              <div className="flex flex-wrap gap-2">
                {couponsData.coupons.map((c) => (
                  <RedeemCouponButton
                    key={c.id}
                    alreadyRedeemed={
                      !!promotionsThatUserHave?.userCoupons?.some(
                        (p) => p.couponId === c.id,
                      )
                    }
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
