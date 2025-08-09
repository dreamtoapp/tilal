// types/prisma.ts
import {
  Account as PrismaAccount,
  Category as PrismaCategory,
  CategoryProduct as PrismaCategoryProduct,
  CategoryTranslation as PrismaCategoryTranslation,
  Company as PrismaCompany,
  ContactSubmission as PrismaContactSubmission,
  Counter as PrismaCounter,
  Expense as PrismaExpense,
  GlobalSEO as PrismaGlobalSEO,
  LocationHistory as PrismaLocationHistory,
  NewLetter as PrismaNewLetter,
  UserNotification as PrismaUserNotification,
  OrderItem as PrismaOrderItem,
  Prisma,
  Product as PrismaProduct,
  ProductTranslation as PrismaProductTranslation,

  Reply as PrismaReply,
  Request as PrismaRequest,
  Review as PrismaReview,
  Shift as PrismaShift,
  SupplierTranslation as PrismaSupplierTranslation,
  SupportPing as PrismaSupportPing,
  Term as PrismaTerm,
  TermTranslation as PrismaTermTranslation,
  User as PrismaUser,
  WebVital as PrismaWebVital,
  WishlistItem as PrismaWishlistItem,
} from '@prisma/client';

// Re-export all types
export type Account = PrismaAccount;
export type Category = PrismaCategory;
export type CategoryProduct = PrismaCategoryProduct;
export type CategoryTranslation = PrismaCategoryTranslation;
export type Company = PrismaCompany;
export type ContactSubmission = PrismaContactSubmission;
export type Counter = PrismaCounter;
export type Expense = PrismaExpense;
export type GlobalSEO = PrismaGlobalSEO;
export type LocationHistory = PrismaLocationHistory;
export type NewLetter = PrismaNewLetter;
export type UserNotification = PrismaUserNotification;
// export type Order = PrismaOrder;
// export type ActiveTrip = PrismaActiveTrip;
export type OrderItem = PrismaOrderItem;
export type Product = PrismaProduct;
export type ProductTranslation = PrismaProductTranslation;

export type Reply = PrismaReply;
export type Request = PrismaRequest;
export type Review = PrismaReview;
export type Shift = PrismaShift;
// export type Supplier = PrismaSupplier;
export type SupplierTranslation = PrismaSupplierTranslation;
export type SupportPing = PrismaSupportPing;
export type Term = PrismaTerm;
export type TermTranslation = PrismaTermTranslation;
export type User = PrismaUser;
export type WebVital = PrismaWebVital;
export type WishlistItem = PrismaWishlistItem;


export const orderIncludeRelation = {
  items: {
    include: {
      product: true,
    },
  },
  customer: true,
  driver: true,
  shift: true,
  address: true,
} satisfies Prisma.OrderInclude;

export type Order = Prisma.OrderGetPayload<{
  include: typeof orderIncludeRelation;
}>;

export const activeTripIncludeRelation = {
  order: {
    include: {
      items: {
        include: {
          product: true,
        },
      },
      customer: true,
      driver: true,
      shift: true,
    },
  },
  driver: true,
} satisfies Prisma.ActiveTripInclude;

export type ActiveTrip = Prisma.ActiveTripGetPayload<{
  include: typeof activeTripIncludeRelation;
}>;


export const supplierIncludeRelation = {
  products: true,
} satisfies Prisma.SupplierInclude;

// Type for Supplier with included relations
export type Supplier = Prisma.SupplierGetPayload<{
  include: typeof supplierIncludeRelation;
}>;

export const categoryIncludeRelation = {
  productAssignments: {
    include: {
      product: true,
    },
  },
} satisfies Prisma.CategoryInclude;

export type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: typeof categoryIncludeRelation;
}>;



export const productIncludeRelation = {
  categoryAssignments: {
    include: {
      category: true,
    },
  },
} satisfies Prisma.ProductInclude;

export type ProductWithCategories = Prisma.ProductGetPayload<{
  include: typeof productIncludeRelation;
}>;
