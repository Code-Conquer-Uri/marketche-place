import { Suspense } from "react";
import { SearchedUserList } from "./searched-user.list";
import { SearchedUserListSkeleton } from "./searched-user-list.skeleton";

export async function SearchUsers({
  searchParams,
}: {
  searchParams: Promise<{ searchTerm?: string }>;
}) {
  const searchTerm = (await searchParams).searchTerm;

  return (
    <div>
      <Suspense fallback={<SearchedUserListSkeleton />} key={searchTerm}>
        <SearchedUserList searchTerm={searchTerm} />
      </Suspense>
    </div>
  );
}
