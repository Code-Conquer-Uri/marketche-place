import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

type Theme = "DEFAULT" | "AMETHYST_HAZE" | "SOLAR_DUSK";

export interface StoreFrontProps {
  organizationId: string;

  logoImage: Buffer;
  bannerImage: Buffer;

  location: string;

  theme: Theme;
}

export class StoreFront extends Entity<StoreFrontProps> {
  get organizationId(): StoreFrontProps["organizationId"] {
    return this.props.organizationId;
  }

  get logoImage(): StoreFrontProps["logoImage"] {
    return this.props.logoImage;
  }

  get bannerImage(): StoreFrontProps["bannerImage"] {
    return this.props.bannerImage;
  }

  get theme(): StoreFrontProps["theme"] {
    return this.props.theme;
  }

  get location(): StoreFrontProps["location"] {
    return this.props.location;
  }

  set theme(theme: Theme) {
    this.props.theme = theme;
  }

  set logoImage(logoImage: Buffer) {
    this.props.logoImage = logoImage;
  }

  set bannerImage(bannerImage: Buffer) {
    this.props.bannerImage = bannerImage;
  }

  set location(location: string) {
    this.props.location = location;
  }

  static create(props: StoreFrontProps, id?: UniqueEntityID): StoreFront {
    const storeFront = new StoreFront(
      {
        ...props,
      },
      id,
    );

    return storeFront;
  }
}
