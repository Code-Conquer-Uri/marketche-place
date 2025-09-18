"use client";
import { useState, useTransition } from "react";
import { redeemCouponAction } from "@/actions/product";
import { Button } from "@/components/ui/button";

export function RedeemCouponButton({
  couponId,
  discount,
}: {
  couponId: string;
  discount: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [redeemed, setRedeemed] = useState(false);

  return (
    <Button
      variant={redeemed ? "secondary" : "outline"}
      disabled={isPending || redeemed}
      onClick={() => {
        startTransition(async () => {
          const res = await redeemCouponAction(couponId);
          if (Array.isArray(res) && !res[0]) setRedeemed(true);
        });
      }}
      className="text-xs h-8"
    >
      {redeemed ? `Cupom resgatado` : `Desconto ${discount}%`}
    </Button>
  );
}
