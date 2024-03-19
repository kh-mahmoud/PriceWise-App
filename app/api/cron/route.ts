import { ScrapAndStoreProduct } from "@/lib/actions"
import { generateEmailBody, sendEmail } from "@/lib/mailer"
import { prisma } from "@/lib/prismaClient"
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils"
import { User } from "@/types"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"


export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 8

export const GET = async () => {
    try {
        const products = await prisma.product.findMany({ include: { priceHistory: { select: { price: true } },users:true } })

        if (!products) throw new Error("No products found")

        //scrap latest products details and update DB
        const updateProduct = products.map(async (CurrentProduct:any) => {

            const scrapeProduct = await ScrapAndStoreProduct(CurrentProduct.url)

            if (!scrapeProduct) throw new Error("No product Found")

            //creating variable with product new values
            const product = {
                ...scrapeProduct,
                lowestPrice: getLowestPrice(CurrentProduct.priceHistory),
                highestPrice: getHighestPrice(CurrentProduct.priceHistory),
                averagePrice: getAveragePrice(CurrentProduct.priceHistory)
            }

            //upddate product 
            const updatedProduct = await prisma.product.update({ where: { id: CurrentProduct.id }, data: product,include:{users:true} })

            //update history
            if (CurrentProduct.price !== scrapeProduct.price) {
                await prisma.history.create({
                    data: { productId: CurrentProduct.id, price: CurrentProduct.price }
                })
            }

            //updating page by revalidating cash
            revalidatePath(`/products/${CurrentProduct.id}`)
            revalidatePath(`/`)

          //check product and send email 
           const emailNotifType= getEmailNotifType(scrapeProduct,CurrentProduct)

           if(emailNotifType && updatedProduct.users.length > 0)
           {
              const productInfo= {
                 title: updatedProduct.title,
                 url: updatedProduct.url,
                 image:updatedProduct.image
              }

              const emailContent= await generateEmailBody(productInfo,emailNotifType)

              const usersEmail= updatedProduct.users.map((user:User)=>user.email)

              await sendEmail(emailContent,usersEmail)
           }

           return updatedProduct
        })

        return NextResponse.json({message:"ok",data:updateProduct})


    } catch (error: any) {
        throw new Error(`failed to GET: ${error.message}`)
    }
}

