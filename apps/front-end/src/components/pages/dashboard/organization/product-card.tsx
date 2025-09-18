import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCardDropdown } from "./product-card-dropdown";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  imageBlurData: string;
  createdAt?: string | null;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          <Image
            src={product.imageUrl}
            blurDataURL={product.imageBlurData}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg line-clamp-2 flex-1">
            {product.title}
          </CardTitle>
          <ProductCardDropdown
            productId={product.id}
            productTitle={product.title}
          />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {product.description}
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
  );
};
