export type PriceHistoryItem = {
  price: number;
};
export type ProductInfoItem = {
  name: string;
  value: string;
};

export type User = {
  email: string;
};

export type IProduct = {
  _id: string;
  url: string;
  currency: string;
  image: string;
  pdfFile: string;
  title: string;
  discount: string;
  brand: string;
  currentPrice: number;
  quantity: number;
  minQuantity: number;
  originalPrice: number;
  priceHistory: PriceHistoryItem[] | [];
  productInformationTech: ProductInfoItem[] | [];
  productInformationAdditional: ProductInfoItem[] | [];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  productDescription: string;
  category: string;
  reviewsCount: number;
  stars: number;
  type: string;
  isOutOfStock: Boolean;
  users?: User[];
  sliderImages?: string[] | [];
};

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};
