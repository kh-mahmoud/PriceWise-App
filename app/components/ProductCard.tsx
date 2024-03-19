import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props={
    product:Product
}


const ProductCard = ({product}:Props) => {
  return (
    <Link href={`/products/${product.id}`} className='product-card'>
        <div className='relative w-full h-64 overflow-hidden '>
            <Image 
                src={product.image || ''}
                alt={product.title}
                fill
                className=' object-contain absolute'/>
        </div>

        <div className='flex flex-col gap-3 w-full'>
            <h3 className='product-title'>{product.title}</h3>

            <div className='flex text-lg text-black font-semibold justify-between '>
                    <div className='flex items-center gap-1'>
                        <Image
                          src={'/assets/icons/star.svg'}
                          alt='star'
                          height={20}
                          width={20}/>
                        {product.rating}
                    </div>
                    <div>
                       <span>{product.currency}</span> 
                       <span>{product.price}</span> 
                    </div>
            </div>
            
        </div>

        
        
    </Link>
  );
}

export default ProductCard;
