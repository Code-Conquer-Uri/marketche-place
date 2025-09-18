import { searchUserCouponsAction } from "@/actions/product";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SearchUserCouponsControllerHandleQueryResponse } from "@/http/types/SearchUserCouponsControllerHandle.ts";

export async function UserCouponsList({
  page,
  perPage,
}: {
  page?: string;
  perPage?: string;
}) {
  const [error, data] = (await searchUserCouponsAction({
    ...(page && { page }),
    ...(perPage && { perPage }),
  })) as [unknown, SearchUserCouponsControllerHandleQueryResponse];

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data?.userCoupons?.map((uc) => (
        <Card key={uc.id}>
          <CardHeader className="p-4 pb-0">
            <p className="text-sm font-medium line-clamp-2">{uc.couponId}</p>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground">
              Cupom: {uc.couponId}
            </p>
            <p className="text-[10px] text-muted-foreground">Resgatado</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
