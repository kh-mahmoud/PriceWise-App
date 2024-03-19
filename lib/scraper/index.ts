import { Product } from "@/types";
import axios from "axios";
import * as cheerio from "cheerio"
import { extractOriginalPrice } from "../utils";


export const ScrapeAmazonProduct=async(url:string)=>{

  if(!url) return 

    // BrightData proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    // Create the proxy options
    const options = {
      auth: {
        username: `${username}-session-${session_id}`,
        password,
      },
      host: 'brd.superproxy.io',
      port,
      rejectUnauthorized: false,
    }

    try {
        const {data} = await axios.get(url,options)
        const $ = cheerio.load(data);

        //extract product data 
        const title=$('#productTitle').text().trim();
        const price = $('span.a-price-whole:first').text().trim().replace(/[^\d.]/g, '');
        const originalPrice = extractOriginalPrice(
          $('span.a-text-price.a-price.srpPriceBlockAUI').children('span.a-offscreen').text().trim().replace(/[^0-9,.]/g, ''),
          $('span.a-text-price.a-price').children('span.a-offscreen').text().trim().replace(/[^0-9,.]/g, ''),
        )
        const discount=$('.srpSavingsPercentageBlock').text().trim().replace(/[^0-9,.]/g, '') || $('.savingsPercentage').text().trim().replace(/[^0-9,.]/g, '')
        const availability=$('#availability').children('span').text().trim().toLowerCase()=== "en stock"
        const image=$('#imgTagWrapperId').children('img').attr("src")
        const currency=$('span.a-price-symbol:first').text().trim()
        const rating=$('i.a-icon-star').parent().children('span:first').text().trim()
        const reviews=$('#acrCustomerReviewText:first').text().trim().replace(/[^0-9,.]/g, '')
        const description=$('#productDescription').text().trim()
       
       
       
        //form object out of product data
        const Product={
          url,
          title,
          description,
          price:parseFloat(price) || parseFloat(originalPrice),
          originalPrice:parseInt(originalPrice) || parseInt(price),
          discount:parseInt(discount) ,
          currency,
          isavailable:availability,
          image,
          rating:parseFloat(rating),
          reviewsCount:parseInt(reviews),
          lowestPrice:parseFloat(price) || parseFloat(originalPrice) ,
          highestPrice:parseFloat(originalPrice) || parseFloat(price),
          averagePrice:parseFloat(price) || parseFloat(originalPrice) ,
        }

        return Product




            
    } catch (error:any) {
        throw new Error(`Failed to scrape product ${error.message} `)
    }

}