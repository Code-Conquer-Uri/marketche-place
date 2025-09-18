import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { searchCouponsAction, searchProductAction } from "@/actions/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SearchProductsList: FC<{
	searchTerm?: string;
	page?: string;
	perPage?: string;
	orderBy?: string;
	orderDirection?: string;
	organizationId?: string;
}> = async ({
	searchTerm,
	page,
	perPage,
	orderBy,
	orderDirection,
	organizationId,
}) => {
	const [error, data] = await searchProductAction({
		...(searchTerm && { searchTerm }),
		...(page && { page: parseInt(page) }),
		...(perPage && { perPage: parseInt(perPage) }),
		...(orderBy && {
			orderBy: orderBy as "createdAt" | "updatedAt" | "title" | "price",
		}),
		...(orderDirection && { orderDirection: orderDirection as "asc" | "desc" }),
		...(organizationId && { organizationId }),
	});

	if (error) {
		return <div>{JSON.stringify(error)}</div>;
	}

	const couponsMap = new Map<string, number>();
	if (data?.products?.length) {
		const couponsPromises = await Promise.all(
			data.products.map((p) => searchCouponsAction({ productId: p.id })),
		);
		couponsPromises.forEach(([, coupons], idx) => {
			if (coupons?.coupons?.length && data.products) {
				couponsMap.set(data.products[idx].id, coupons.coupons.length);
			}
		});
	}

	return (
		<div className="space-y-4">
			{data && (
				<div className="space-y-4">
					{data.products && data.products.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{data.products.map((product) => (
								<Link key={product.id} href={`/product/${product.id}` as Route}>
									<Card className="overflow-hidden">
										<CardHeader className="p-0 relative">
											<div className="relative aspect-square">
												<Image
													src={product.imageUrl}
													blurDataURL={product.imageBlurData}
													alt={product.title}
													fill
													className="object-cover transition-transform duration-200 hover:brightness-110"
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
												/>
											</div>
											{couponsMap.get(product.id) && (
												<div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
													{couponsMap.get(product.id)} cupom(s)
												</div>
											)}
										</CardHeader>
										<CardContent className="p-4">
											<CardTitle className="text-lg line-clamp-2 mb-2">
												{product.title}
											</CardTitle>
											<p className="text-sm text-muted-foreground line-clamp-3 mb-3">
												{product.description}
											</p>
											<p className="text-sm text-muted-foreground line-clamp-3 mb-3">
												{product.organizationId}
											</p>
											<div className="flex items-center justify-between">
												<span className="text-lg font-bold text-primary">
													R$ {product.price.toFixed(2)}
												</span>
												<span className="text-xs text-muted-foreground">
													{product.createdAt
														? new Date(product.createdAt).toLocaleDateString()
														: "N/A"}
												</span>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					) : (
						<Card>
							<CardContent className="flex items-center justify-center py-8">
								<p className="text-muted-foreground">No products found</p>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</div>
	);
};
