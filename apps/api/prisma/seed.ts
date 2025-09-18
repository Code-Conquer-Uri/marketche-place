import * as fs from "node:fs/promises";
import { faker } from "@faker-js/faker";
import {
  Coupon,
  Organization,
  PrismaClient,
  Product,
  Theme,
  User,
} from "@prisma/client";
import { ulid } from "ulid";

const prisma = new PrismaClient();

async function createUsers() {
  console.log("Creating users...");

  const users = [];
  const roles = ["admin", "seller", "buyer"];

  for (let i = 0; i < 15; i++) {
    const user = await prisma.user.create({
      data: {
        id: ulid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        emailVerified: faker.datatype.boolean(),
        image: faker.image.avatar(),
        role: faker.helpers.arrayElement(roles),
        banned: faker.datatype.boolean({ probability: 0.1 }),
        banReason: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        banExpires: faker.datatype.boolean() ? faker.date.future() : null,
        createdAt: faker.date.past({ years: 2 }),
        updatedAt: faker.date.recent(),
      },
    });
    users.push(user);
  }

  console.log(`Created ${users.length} users`);
  return users;
}

async function createOrganizations(_users: User[]) {
  console.log("Creating organizations...");

  const organizations = [];

  for (let i = 0; i < 8; i++) {
    const organization = await prisma.organization.create({
      data: {
        id: ulid(),
        name: faker.company.name(),
        slug: faker.helpers.slugify(faker.company.name().toLowerCase()),
        logo: faker.image.url(),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
        metadata: JSON.stringify({
          description: faker.company.buzzPhrase(),
          website: faker.internet.url(),
          phone: faker.phone.number(),
        }),
      },
    });
    organizations.push(organization);
  }

  console.log(`Created ${organizations.length} organizations`);
  return organizations;
}

async function createMembers(users: User[], organizations: Organization[]) {
  console.log("Creating members...");

  const members = [];
  const roles = ["owner", "admin", "member"];

  for (const org of organizations) {
    const orgMembers = faker.helpers.arrayElements(users, { min: 2, max: 5 });

    for (const user of orgMembers) {
      const member = await prisma.member.create({
        data: {
          id: ulid(),
          organizationId: org.id,
          userId: user.id,
          role: faker.helpers.arrayElement(roles),
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: faker.date.recent(),
        },
      });
      members.push(member);
    }
  }

  console.log(`Created ${members.length} members`);
  return members;
}

async function createStoreFronts(organizations: Organization[]) {
  console.log("Creating store fronts...");

  const themes: Theme[] = ["DEFAULT", "AMETHYST_HAZE", "SOLAR_DUSK"];

  const storeFrontPromises = organizations.map(async (org) => {
    const randomId1 = faker.number.int({ min: 1, max: 400 });
    const randomId2 = faker.number.int({ min: 1, max: 400 });
    const logoImageUrl = `https://picsum.photos/id/${randomId1}/200/300`;
    const bannerImageUrl = `https://picsum.photos/id/${randomId2}/200/300`;
        const imageBlurData = faker.image.dataUri({ width: 16, height: 16 });


    return prisma.storeFront.create({
      data: {
        id: ulid(),
        organizationId: org.id,
        logoImageUrl,
        bannerImageBlurData:imageBlurData,
        logoImageBlurData:imageBlurData,
        bannerImageUrl,
        location: `${faker.location.city()}, ${faker.location.state()}`,
        theme: faker.helpers.arrayElement(themes),
      },
    });
  });
  const storeFronts = await Promise.all(storeFrontPromises);

  console.log(`Created ${storeFronts.length} store fronts`);
  return storeFronts;
}

async function createProducts(organizations: Organization[], _users: User[]) {
  console.log("Creating products...");

  const products = [];

  for (const org of organizations) {
    const numProducts = faker.number.int({ min: 5, max: 12 });

    const productPromises = [];
    for (let i = 0; i < numProducts; i++) {
      const promise = (async () => {
        console.log("Fetching image for product...");
        const randomId = faker.number.int({ min: 1, max: 400 });
        const imageUrl = `https://picsum.photos/id/${randomId}/200/300`;
        const imageBlurData = faker.image.dataUri({ width: 16, height: 16 });
        return prisma.product.create({
          data: {
            id: ulid(),
            organizationId: org.id,
            imageUrl,
            imageBlurData,
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.number.float({
              min: 10,
              max: 1000,
              fractionDigits: 2,
            }),
            createdAt: faker.date.past({ years: 1 }),
            updatedAt: faker.date.recent(),
          },
        });
      })();
      productPromises.push(promise);
    }
    const createdProducts = await Promise.all(productPromises);
    products.push(...createdProducts);
  }

  console.log(`Created ${products.length} products`);
  return products;
}

async function createPromotions(products: Product[], users: User[]) {
  console.log("Creating promotions...");

  const promotions = [];

  for (const product of products) {
    if (faker.datatype.boolean({ probability: 0.3 })) {
      // 30% chance of promotion
      const promotion = await prisma.promotion.create({
        data: {
          id: ulid(),
          discountPercentage: faker.number.int({ min: 5, max: 50 }),
          productId: product.id,
          userId: faker.helpers.arrayElement(users).id,
          validUntil: faker.date.future({ years: 1 }),
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: faker.date.recent(),
        },
      });
      promotions.push(promotion);
    }
  }

  console.log(`Created ${promotions.length} promotions`);
  return promotions;
}

async function createCoupons(products: Product[], users: User[]) {
  console.log("Creating coupons...");

  const coupons = [];

  for (const product of products) {
    if (faker.datatype.boolean({ probability: 0.4 })) {
      // 40% chance of coupon
      const maxQuantity = faker.number.int({ min: 10, max: 100 });
      const coupon = await prisma.coupon.create({
        data: {
          id: ulid(),
          discountPercentage: faker.number.int({ min: 5, max: 30 }),
          maxQuantity,
          currentQuantity: faker.number.int({ min: 0, max: maxQuantity }),
          productId: product.id,
          userId: faker.helpers.arrayElement(users).id,
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: faker.date.recent(),
        },
      });
      coupons.push(coupon);
    }
  }

  console.log(`Created ${coupons.length} coupons`);
  return coupons;
}

async function createFollowings(users: User[], organizations: Organization[]) {
  console.log("Creating followings...");

  const followings = [];

  for (const user of users) {
    const followedOrgs = faker.helpers.arrayElements(organizations, {
      min: 1,
      max: 3,
    });

    for (const org of followedOrgs) {
      const following = await prisma.following.create({
        data: {
          id: ulid(),
          userId: user.id,
          organizationId: org.id,
          createdAt: faker.date.past({ years: 1 }),
        },
      });
      followings.push(following);
    }
  }

  console.log(`Created ${followings.length} followings`);
  return followings;
}

async function createUserCoupons(users: User[], coupons: Coupon[]) {
  console.log("Creating user coupons...");

  const userCoupons = [];

  for (const user of users) {
    const userCoups = faker.helpers.arrayElements(coupons, { min: 0, max: 2 });

    for (const coupon of userCoups) {
      if (coupon.currentQuantity > 0) {
        const userCoupon = await prisma.userCoupons.create({
          data: {
            id: ulid(),
            userId: user.id,
            couponId: coupon.id,
          },
        });
        userCoupons.push(userCoupon);

        // Decrease coupon quantity
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { currentQuantity: { decrement: 1 } },
        });
      }
    }
  }

  console.log(`Created ${userCoupons.length} user coupons`);
  return userCoupons;
}

async function createSessions(users: User[]) {
  console.log("Creating sessions...");

  const sessions = [];

  for (const user of users) {
    if (faker.datatype.boolean({ probability: 0.7 })) {
      // 70% chance of active session
      const session = await prisma.session.create({
        data: {
          id: ulid(),
          expiresAt: faker.date.future({ years: 1 }),
          token: faker.string.alphanumeric(32),
          createdAt: faker.date.recent(),
          updatedAt: faker.date.recent(),
          ipAddress: faker.internet.ip(),
          userAgent: faker.internet.userAgent(),
          userId: user.id,
          activeOrganizationId: faker.datatype.boolean() ? ulid() : null,
          impersonatedBy: faker.datatype.boolean({ probability: 0.1 })
            ? faker.helpers.arrayElement(users).id
            : null,
        },
      });
      sessions.push(session);
    }
  }

  console.log(`Created ${sessions.length} sessions`);
  return sessions;
}

async function createAccounts(users: User[]) {
  console.log("Creating accounts...");

  const accounts = [];
  const providers = ["google", "github", "facebook"];

  for (const user of users) {
    if (faker.datatype.boolean({ probability: 0.8 })) {
      // 80% chance of OAuth account
      const account = await prisma.account.create({
        data: {
          id: ulid(),
          accountId: faker.string.alphanumeric(16),
          providerId: faker.helpers.arrayElement(providers),
          userId: user.id,
          accessToken: faker.string.alphanumeric(32),
          refreshToken: faker.string.alphanumeric(32),
          idToken: faker.datatype.boolean()
            ? faker.string.alphanumeric(32)
            : null,
          accessTokenExpiresAt: faker.date.future(),
          refreshTokenExpiresAt: faker.date.future(),
          scope: "email profile",
          password: faker.datatype.boolean() ? faker.internet.password() : null,
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: faker.date.recent(),
        },
      });
      accounts.push(account);
    }
  }

  console.log(`Created ${accounts.length} accounts`);
  return accounts;
}

async function createVerifications() {
  console.log("Creating verifications...");

  const verifications = [];

  for (let i = 0; i < 20; i++) {
    const verification = await prisma.verification.create({
      data: {
        id: ulid(),
        identifier: faker.internet.email(),
        value: faker.string.alphanumeric(64),
        expiresAt: faker.date.future(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
      },
    });
    verifications.push(verification);
  }

  console.log(`Created ${verifications.length} verifications`);
  return verifications;
}

async function createInvitations(users: User[], organizations: Organization[]) {
  console.log("Creating invitations...");

  const invitations = [];
  const statuses = ["pending", "accepted", "rejected", "expired"];

  for (const org of organizations) {
    const numInvitations = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numInvitations; i++) {
      const invitation = await prisma.invitation.create({
        data: {
          id: ulid(),
          organizationId: org.id,
          email: faker.internet.email(),
          role: faker.helpers.arrayElement(["admin", "member"]),
          status: faker.helpers.arrayElement(statuses),
          expiresAt: faker.date.future(),
          inviterId: faker.helpers.arrayElement(users).id,
        },
      });
      invitations.push(invitation);
    }
  }

  console.log(`Created ${invitations.length} invitations`);
  return invitations;
}

async function main() {
  console.log("Starting database seeding...");

  try {
    // Create base entities first
    const users = await createUsers();
    const organizations = await createOrganizations(users);

    // Create dependent entities
    await createMembers(users, organizations);
    await createStoreFronts(organizations);
    const products = await createProducts(organizations, users);

    // Create product-related entities
    await createPromotions(products, users);
    const coupons = await createCoupons(products, users);

    // Create user interactions
    await createFollowings(users, organizations);
    await createUserCoupons(users, coupons);

    // Create auth-related entities
    await createSessions(users);
    await createAccounts(users);
    await createVerifications();
    await createInvitations(users, organizations);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
