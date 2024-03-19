'use client'

import { ScrapAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

const isValidAmazonUrl=(url:string)=>
{
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if(
      hostname.includes('amazon.com') || 
      hostname.includes ('amazon.') || 
      hostname.endsWith('amazon')
    ) {
      return true;
    }
    } catch (error) {
      return false;
    }

    return false;
}


const Searchbar = () => {
     const [searchPrompt, setSearchPrompt] = useState('')
      const [Loading, setLoading] = useState(false)

    const handleSubmit= async(e:FormEvent<HTMLFormElement>)=>
    {
       e.preventDefault()

       const isValidLink=isValidAmazonUrl(searchPrompt)
       if(!isValidLink) return alert("Please Provide a Valid Amazon Link")

       try {
          setLoading(true)
          const product = await ScrapAndStoreProduct(searchPrompt)
          setSearchPrompt('')

       } catch (error) {
         console.log(error)
       }
       finally{
         setLoading(false)
       }

    }

  return (
    <div>
       <form className='mt-12 flex flex-wrap gap-4' onSubmit={handleSubmit}>
          <input
              value={searchPrompt}
              onChange={(e)=>setSearchPrompt(e.target.value)}
              type="text"
              placeholder="Enter Product link"
              className="searchbar-input" />

          <button disabled={searchPrompt==="" || Loading} className="searchbar-btn" type="submit">
            {Loading ? 'Searching...' : 'Search'}
          </button>
       </form>
    </div>
  );
}

export default Searchbar;
