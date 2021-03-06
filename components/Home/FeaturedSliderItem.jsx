import Link from "next/link"
import {FaPlaystation} from 'react-icons/fa'

import { toTop, sliderControlClass } from "@lib/commonFunctions"
import Image from "next/image"

const FeaturedSliderItem = ({
    mainImageUrl, title, slug, secondaryImageUrls, basePrice, discount,
    index, sliderIndex, length, getHeight,
}) => {
    const position = sliderControlClass(index, sliderIndex, length)
    const truePrice = basePrice - (basePrice * (discount/100))

    //$ const slide = useRef(null)
    //$ useEffect(() => {
    //$     if(index == 0) getHeight(slide.current.getBoundingClientRect().height)
    //$ }, [getHeight, index])

    return (
        <Link passHref href={`/${slug}`}>
            <a 
                onClick={() => toTop()} 
                className={position} 
                //$ref={slide}
            >
                <div className="main-image-container">
                    <Image src={mainImageUrl || '/nope-not-here.png'} alt={slug} width={800} height={500} quality='75' layout='responsive' objectPosition='center' objectFit="cover"/>
                </div>
                <div>
                    <h4>{title}</h4>
                    <div className="secondary-image-container">
                        <div><Image src={secondaryImageUrls[0] ? secondaryImageUrls[0] : '/nope-not-here.png'} width={800} height={400} quality='1' layout='responsive' alt="secondary-image-1"/></div>
                        <div><Image src={secondaryImageUrls[1] ? secondaryImageUrls[1] : '/nope-not-here.png'} width={800} height={400} quality='1' layout='responsive' alt="secondary-image-2"/></div>
                        <div><Image src={secondaryImageUrls[2] ? secondaryImageUrls[2] : '/nope-not-here.png'} width={800} height={400} quality='1' layout='responsive' alt="secondary-image-3"/></div>
                        <div><Image src={secondaryImageUrls[3] ? secondaryImageUrls[3] : '/nope-not-here.png'} width={800} height={400} quality='1' layout='responsive' alt="secondary-image-4"/></div>
                    </div>
                    <div className='home-copoment-extra'>
                        <div>Now available</div>
                        <div>Top seller</div>
                    </div>
                    <div className='home-copomnent-main'>
                        <div className='price-container'>
                            {discount >= 1
                                && <div className='discount-percent'>-{discount}%</div>
                            }
                            <div className='price'>
                                {discount >= 1
                                    && <span>${basePrice.toFixed(2)}</span>
                                }
                                <p>{truePrice ? `$${truePrice.toFixed(2)}` : 'Free 2 Play'}</p>
                            </div>
                        </div>
                        {/*//$ <ConsoleIcons parent_platforms={parent_platforms}/> */}
                        <FaPlaystation />
                    </div>
                </div>
            </a>
        </Link>
    )
}

export default FeaturedSliderItem