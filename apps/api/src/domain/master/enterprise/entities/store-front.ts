import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

type Theme = "DEFAULT" | "AMETHYST_HAZE" | "SOLAR_DUSK";

export interface StoreFrontProps {
  organizationId: string;

  logoImageUrl: string;
  logoImageBlurData: string;
  bannerImageUrl: string;
  bannerImageBlurData: string;

  whatsappNumber?: string;

  location: string;

  theme: Theme;
}

export class StoreFront extends Entity<StoreFrontProps> {
  get organizationId(): StoreFrontProps["organizationId"] {
    return this.props.organizationId;
  }

  get logoImageUrl(): StoreFrontProps["logoImageUrl"] {
    return this.props.logoImageUrl;
  }

  get logoImageBlurData(): StoreFrontProps["logoImageBlurData"] {
    return this.props.logoImageBlurData;
  }

  get bannerImageUrl(): StoreFrontProps["bannerImageUrl"] {
    return this.props.bannerImageUrl;
  }

  get bannerImageBlurData(): StoreFrontProps["bannerImageBlurData"] {
    return this.props.bannerImageBlurData;
  }

  get whatsappNumber(): StoreFrontProps["whatsappNumber"] {
    return this.props.whatsappNumber;
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

  set logoImageUrl(logoImageUrl: string) {
    this.props.logoImageUrl = logoImageUrl;
  }

  set logoImageBlurData(logoImageBlurData: string) {
    this.props.logoImageBlurData = logoImageBlurData;
  }

  set bannerImageUrl(bannerImageUrl: string) {
    this.props.bannerImageUrl = bannerImageUrl;
  }

  set bannerImageBlurData(bannerImageBlurData: string) {
    this.props.bannerImageBlurData = bannerImageBlurData;
  }

  set whatsappNumber(whatsappNumber: string | undefined) {
    this.props.whatsappNumber = whatsappNumber;
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
