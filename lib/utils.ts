import { PriceHistoryItem, Product } from "@/types";
import { Notification } from "./mailer";

const THRESHOLD_PERCENTAGE = 10;

export const extractOriginalPrice=(price1:string,price2:string)=>
{
    if(price1>price2)
    {
        return price1;
    }
    else
    {
        return price2;
    }
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
    let highestPrice = priceList[0];
  
    for (let i = 0; i < priceList.length; i++) {
      if (priceList[i].price > highestPrice.price) {
        highestPrice = priceList[i];
      }
    }
  
    return highestPrice.price;
  }
  
  export function getLowestPrice(priceList: PriceHistoryItem[]) {
    let lowestPrice = priceList[0];
  
    for (let i = 0; i < priceList.length; i++) {
      if (priceList[i].price < lowestPrice.price) {
        lowestPrice = priceList[i];
      }
    }
  
    return lowestPrice.price;
  }
  
  export function getAveragePrice(priceList: PriceHistoryItem[]) {
    const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
    const averagePrice = sumOfPrices / priceList.length || 0;
  
    return averagePrice;
  }
  
  export const getEmailNotifType = (scrapedProduct: Product,currentProduct: any) => {

    const lowestPrice = getLowestPrice(currentProduct.priceHistory);

    if (scrapedProduct?.price  < lowestPrice) {
      return Notification.LOWEST_PRICE as keyof typeof Notification;
    }
    if (!scrapedProduct?.isavailable && currentProduct.isavailable) {
      return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
    }
    if (scrapedProduct.discount && scrapedProduct.discount >= THRESHOLD_PERCENTAGE) {
      return Notification.THRESHOLD_MET as keyof typeof Notification;
    }
  
    return null;
  };
  
  export const formatNumber = (num: number = 0) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };