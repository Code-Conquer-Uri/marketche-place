import type { FC } from "react";
import { searchUserAction } from "@/actions/users";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from "@/lib/get-current-user";
import { ImpersonateUserButton } from "./impersonate-user.button";

export const SearchedUserList: FC<{
  searchTerm?: string;
}> = async ({ searchTerm }) => {
  const [[error, data], { user: currentUser }] = await Promise.all([
    await searchUserAction({ searchTerm }),
    await getCurrentUser(),
  ]);

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <div className="space-y-4">
      {data && (
        <div className="space-y-4">
          <div className="text-muted-foreground text-sm">
            Found {data.users?.length || 0} users
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name || "No Name"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {user.id}
                  </TableCell>
                  <TableCell>
                    {currentUser.id !== user.id && (
                      <ImpersonateUserButton
                        userId={user.id}
                        name={user.name}
                      />
                    )}
                  </TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
