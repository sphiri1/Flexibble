'use cilent'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { categoryFilters } from '@/constants';
import { MutableRefObject, useRef, useState } from 'react';
import Button from './Button';
import '../app/global.css';



const Categories = () => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const [scrollPosition, setScrollPosition] = useState(0);


    const category = searchParams.get('category');
    const handleTags = (filter: string) => {
        router.push(`${pathName}?category=${filter}`)
    }


    const containerRef = useRef() as MutableRefObject<HTMLUListElement>;

    const handleScroll = (scrollAmount: any) => {
        const newScrollPosition = scrollPosition + scrollAmount;

        setScrollPosition(newScrollPosition);
        if (containerRef.current) {
            containerRef.current.scrollLeft = newScrollPosition;
        }

    };


    return (
        <div className='flex w-full flex-wrap relative'  >

            {/* Left scroll button */}
            <div className="rotate-l absolute">
                <Button
                    bgColor='transparent'
                    leftIcon={'/arrow-down.svg'}
                    handleClick={() => handleScroll(-200)}
                />
            </div>

            {/* Categories */}
            <div className='overflow-auto'>
                <ul className='flex gap-2 overflow-x-hidden scroll-smooth' ref={containerRef}>
                    {categoryFilters.map((filter) => (
                        <button
                            key={filter}
                            type='button'
                            onClick={() => handleTags(filter)}
                            className={`${category === filter ?
                                'bg-light-white-300 text-small' : 'font-normal text-small'} px-4 py-3 rounded-lg 
                    capitalize whitespace-nowrap`}
                        >
                            {filter}
                        </button>
                    ))}
                </ul>
            </div>

            {/* Right scroll button */}
            <div className="rotate-r absolute">
                <Button
                    bgColor='transparent'
                    leftIcon={'/arrow-down.svg'}
                    handleClick={() => handleScroll(200)}
                />
            </div>
        </div>
    )
}

export default Categories