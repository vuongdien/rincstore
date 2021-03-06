// import React, {useState, useEffect} from 'react'
import { useSliderControl } from '@lib/hooks'
import Link from 'next/link'

import {FaChevronRight, FaChevronLeft} from 'react-icons/fa'
import FeaturedRecommendedItem from './FeaturedRecommendedItem'

// const FeaturedRecommended = ({id, background_image, index}) => {
const FeaturedRecommended = ({games}) => {
    const [sliderIndex, setSliderIndex] = useSliderControl(games.length, 8000)

    //$ const slider = useRef(null)
    //$ const height = null
    //$ function getHeight(data) {height = data}
    //$ useEffect(() => slider.current.style.height = `${height}px`, [])

    return (
        <section className="movie-card-container">
            <div>
                <h5>Community recommended</h5>
                <Link href="/"><a>more <FaChevronRight /></a></Link>
            </div>
            <button className='previous' onClick={() => setSliderIndex(sliderIndex - 1)}>
                <FaChevronLeft />
            </button>
            <button className="next" onClick={() => setSliderIndex(sliderIndex + 1)}>
                <FaChevronRight />
            </button>
            <div 
                className='slider' 
                //$ ref={slider}
            > 
                {games.map((game, index, games) => {
                    return <FeaturedRecommendedItem 
                        //$ getHeight={getHeight}
                        key={game.slug}
                        {...game} 
                        index={index} 
                        length={games.length}
                        sliderIndex={sliderIndex}
                    />
                })}
            </div>
        </section>
    )
}

export default FeaturedRecommended
