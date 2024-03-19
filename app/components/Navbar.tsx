import Image from "next/image";
import Link from "next/link";



const navIcons = [
  { src: '/assets/icons/search.svg', alt: 'search' },
  { src: '/assets/icons/black-heart.svg', alt: 'heart' },
  { src: '/assets/icons/user.svg', alt: 'user' },
]


const Navbar = () => {
  return (
    <div className='w-full'>
       <nav className='nav'>
          <Link href={"/"} className={"flex item-center gap-1"}>
             <Image
                src={"/assets/icons/logo.svg"}
                alt="logo"
                height={27}
                width={27}/>

             <p className="nav-logo">
                Price<span className="text-primary">Wise</span>
             </p>
          </Link>

          <div className="flex items-center gap-5">
              {navIcons.map((icon) => (
                  <Image key={icon.alt}
                    src={icon.src}
                    alt={icon.alt}
                    height={27}
                    width={27}/>
              ))        
              }
          </div>
       </nav>
    </div>
  );
}

export default Navbar;
