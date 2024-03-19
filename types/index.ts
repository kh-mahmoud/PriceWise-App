export type PriceHistoryItem = {
    price: number;
  };
  
  export type User = {
    email: string;
  };
  
  export type Product = {
    id?: string;
    url: string;
    title: string;
    description: string | null;
    price: number;
    originalPrice: number;
    discount: number | null;
    currency: string;
    isavailable: boolean;
    image: string | undefined | null;
    rating: number;
    reviewsCount: number;
    lowestPrice: number;
    priceHistory?:{
      price:number
    }[];
    highestPrice: number;
    averagePrice: number;
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
    image:string | null;
    url: string;
  };