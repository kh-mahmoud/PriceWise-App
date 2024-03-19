'use client'

import Image from 'next/image';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader


const HeroCarousel = () => {
    
        const heroImages = [
        { imgUrl: '/assets/images/hero-1.svg', alt: 'smartwatch'},
        { imgUrl: '/assets/images/hero-2.svg', alt: 'bag'},
        { imgUrl: '/assets/images/hero-3.svg', alt: 'lamp'},
        { imgUrl: '/assets/images/hero-4.svg', alt: 'air fryer'},
        { imgUrl: '/assets/images/hero-5.svg', alt: 'chair'},
        ]

  return (
    <div className='relative'>
        <Carousel
        infiniteLoop
        autoPlay
        interval={2000}
        showStatus={false}
        showThumbs={false}
        showArrows={false}
        showIndicators={false}
        className='max-w-2xl  '
        >
            {heroImages.map((image) => (
                <Image key={image.alt}
                width={484}
                height={484}
                src={image.imgUrl}
                alt={image.alt}
                className='object-cover' />
            ))}
        </Carousel>
        <Image
            width={175}
            height={175}
            src='/assets/icons/hand-drawn-arrow.svg'
            alt='arrow'
            className="max-xl:hidden absolute -left-[20%] -bottom-[10%] z-0"
        />
    </div>
  );
}

export default HeroCarousel;
