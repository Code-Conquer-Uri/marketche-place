import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface ProductProps {
  organizationId: UniqueEntityID;

  imageUrl: string;
  imageBlurData: string;

  title: string;
  description: string;

  price: number;

  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export class Product extends Entity<ProductProps> {
  get organizationId(): ProductProps["organizationId"] {
    return this.props.organizationId;
  }

  get imageUrl(): ProductProps["imageUrl"] {
    return this.props.imageUrl;
  }

  get imageBlurData(): ProductProps["imageBlurData"] {
    return this.props.imageBlurData;
  }

  get price(): ProductProps["price"] {
    return this.props.price;
  }

  get title(): ProductProps["title"] {
    return this.props.title;
  }

  get description(): ProductProps["description"] {
    return this.props.description;
  }

  get createdAt(): Date | null | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  set imageUrl(imageUrl: string) {
    this.props.imageUrl = imageUrl;
    this.updateTimestamp();
  }

  set imageBlurData(imageBlurData: string) {
    this.props.imageBlurData = imageBlurData;
    this.updateTimestamp();
  }

  set price(price: number) {
    this.props.price = price;

    this.updateTimestamp();
  }

  set title(title: string) {
    this.props.title = title;
    this.updateTimestamp();
  }

  set description(description: string) {
    this.props.description = description;
    this.updateTimestamp();
  }

  private updateTimestamp() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<ProductProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID,
  ): Product {
    const product = new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return product;
  }
}
