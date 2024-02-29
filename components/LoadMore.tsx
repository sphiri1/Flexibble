'use client'

import Button from './Button';


type Props = {
    currentPage: number,
    handlePageChange: Function,
    noOfPages: number | undefined;
}

const LoadMore = ({ currentPage, handlePageChange, noOfPages }: Props) => {

    return (
        <div className='w-full flexCenter gap-5 mt-10'>
            {currentPage === 1 && currentPage !== noOfPages && (
                <Button title='Next Page' handleClick={() => handlePageChange('Next')} />
            )}
            {currentPage === noOfPages && currentPage !== 1 && (
                <Button title='Prev Page' handleClick={() => handlePageChange('Prev')} />
            )}
        </div>
    )
}

export default LoadMore