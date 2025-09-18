import { Suspense } from "react";
import { UserCouponsList } from "@/components/pages/user-coupons/user-coupons-list";
import { UserCouponsListSkeleton } from "@/components/pages/user-coupons/user-coupons-list.skeleton";
import { Auth } from "@/components/shared/auth";

export default async function UserCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; perPage?: string }>;
}) {
  const { page, perPage } = await searchParams;
  const key = `${page}-${perPage}`;
  return (
    <div className="w-full pt-24 pb-10">
      <div className="mx-auto max-w-7xl px-5 xl:px-0 space-y-6">
        <h2 className="text-2xl font-semibold">Meus Cupons</h2>
        <Suspense fallback={<UserCouponsListSkeleton />} key={key}>
          <Auth allow="Authenticated-Only" redirectTo="/auth" />
          <UserCouponsList page={page} perPage={perPage} />
        </Suspense>
      </div>
    </div>
  );
}
