import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface ProductProps {
  organizationId: string;

  image: Buffer;

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

  get image(): ProductProps["image"] {
    return this.props.image;
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

  set image(image: Buffer) {
    this.props.image = image;
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

  static create(props: ProductProps, id?: UniqueEntityID): Product {
    const acceptedTerms = new Product(
      {
        ...props,
      },
      id,
    );

    return acceptedTerms;
  }
}
