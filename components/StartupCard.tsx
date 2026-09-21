import React from 'react'
import { formatDate } from '@/lib/utils'
import {EyeIcon, ThumbsUp} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { Author, Startup } from '@/sanity/types'
import { Skeleton } from './ui/skeleton'
import { cn } from '@/lib/utils'

export type StartupCardType = Omit<Startup, 'author'> & { author: Author, votes?: number}
const StartupCard = ({post}: {post : StartupCardType}) => {
  const {_createdAt, views, votes, author, category, image, title, description, _id} = post

  const formattedDate = formatDate(_createdAt.toString()); // Conversion en chaîne


  return (
<li className='startup-card group'>
    <div className='flex-between'>
        <p className='startup_card_date'>
            {formattedDate}
            
        </p>
        <div className='flex gap-3'>
      {typeof votes === 'number' && (
        <div className='flex gap-1.5'>
          <ThumbsUp className='size-6 text-primary'/>
          <span className='text-16-medium'>{votes}</span>
        </div>
      )}
      <div className='flex gap-1.5'>
        <EyeIcon className='size-6 text-primary'/>
        <span className='text-16-medium'>{views}</span>
      </div>
    </div>
    </div>
<div className='flex-between mt-5 ap-5'>
  <div className='flex-1'>
    <Link href={`/user/${author?._id}`}>
    <p className='text-16-medium line-clamp-1'>{author?.name}</p>
    </Link>

    <Link href={`/startup/${_id}`}>
    <h3 className='text-26-semibold line-clamp-1'>{title}</h3>
    </Link>
    </div>

    <Link href={`/user/${author?._id}`}>
    <Image src={ author?.image||'https://placehold.co/48x48'} alt={ author?.name ||'placeholder'} width={48} height={48} className='rounded-full'/>
    </Link>
</div>

<Link href={`/startup/${_id}`}>
<p className='startup-card-desc text-justify'>
  {description}
</p>

{image ? (
  <Image
    className='startup-card-img rounded-2xl mt-1'
    src={image}
    alt='startup image'
    width={500}
    height={300}
  />
) : (
  <div 
    className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 text-gray-500 italic"
    style={{ width: 500, height: 300 }}
  >
    <span className="text-sm">Image non disponible</span>
  </div>
)}
</Link>

<div className='flex-between mt-5 gap-3'>

<Link href={`/?query=${category?.toLowerCase()}`} >

<p className='text-16-medium'>{category}</p>
</Link>
<Button className='startuo-card_btn' asChild>
<Link href={`/startup/${_id}`}>
Details
</Link>

  </Button>
  
</div>
</li>

  )
}

export const StartupCardSkeleton = () => {
  return (
    <div>
    {[0,1,2,3,4].map((index:number) => (
      <li key={cn('skeleton', index)}>
            <Skeleton className='startup-card_skeleton'/>
      </li>
    ))}
      </div>

  )

}

export default StartupCard
