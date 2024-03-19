'use server'

import { Product } from '@/types';
import { ScrapeAmazonProduct } from "../scraper"
import { prisma } from "../prismaClient"
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils"
import { revalidatePath } from 'next/cache';
import { generateEmailBody, sendEmail } from '../mailer';


export const ScrapAndStoreProduct=async(ProductUrl:string)=>{
   
    if(!ProductUrl) return 
    try {
         const scrapedProduct= await ScrapeAmazonProduct(ProductUrl)

         if(!scrapedProduct) return

         let product = scrapedProduct

         
     //geting the existed product from db
         const existingProduct= await prisma.product.findFirst({where:{url:scrapedProduct.url},include:{priceHistory:{select:{price:true}}}})

         if(existingProduct)
         {
        
        //creating variable with updated values
            const updatePriceHistory:any=existingProduct.priceHistory

        //creating variable with product new values
            product={
            ...scrapedProduct,
            lowestPrice:getLowestPrice(updatePriceHistory),
            highestPrice:getHighestPrice(updatePriceHistory),
            averagePrice:getAveragePrice(updatePriceHistory)
           }

        //upddate product and create new history
           await prisma.product.update({where:{id:existingProduct.id},data:product})

        //update history if price change
           if(existingProduct.price === product.price) return 
           await prisma.history.create({
            data:{productId:existingProduct.id,price:product.price}
           })

         }else
         {

        //if the product does not exist create new Product
          const newProduct = await prisma.product.create({
             data:product
           })

        //if the product does not exist create new History
          const newHistory= await prisma.history.create({
             data:{productId:newProduct.id,price:scrapedProduct.price}
          })

          if(newProduct && newHistory)
          {
            
        //updating page by revalidating cash
            revalidatePath(`/products/${newProduct.id}`)
            revalidatePath(`/`)

            return newProduct
          }
        }
        //updating page by revalidating cash
            revalidatePath(`/products/${existingProduct?.id}`)
            revalidatePath(`/`)
         
    } catch (error:any) {
        console.log(error)
        throw new Error(`Failed to create/updat product:${error.message}`)
    }

}  


export const getProductById= async(productId:string)=>
{
    try {
        const product = await prisma.product.findFirst({where:{id:productId}})
        if(!product) return null

        return product

    } catch (error) {
         console.log(error)
    }
}

export const getAllProducts= async()=>
{
    try {
        const product = await prisma.product.findMany({})

        return product

    } catch (error) {
         console.log(error)
    }
}

export const getSimilarProducts= async(productId:string)=>
{
    try {
        const currentProduct = await prisma.product.findFirst({where:{id:productId}})
        if(!currentProduct) return null

        const similarProduct= await prisma.product.findMany({where:{id:{not:productId}},take:5})

        return similarProduct

    } catch (error) {
         console.log(error)
    }
}

export const addEmailToProduct= async(productId:string,email:string)=>
{
    try {
      const product= await prisma.product.findFirst({where:{id:productId}})
      if(!product) return 

      const userExists= await prisma.users.findFirst({where:{email}})
      if(!userExists || userExists.productId !== productId)
      {
         const user = await prisma.users.create({data:{email,productId}})

         const emailContent = await generateEmailBody(product,"WELCOME")

         await sendEmail(emailContent,[email])
      }

    } catch (error) {
         console.log(error)
    }
}

