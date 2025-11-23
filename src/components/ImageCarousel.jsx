import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './ui/Button';

const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="image-carousel">
            <div className="carousel-main-image">
                <img src={images[currentIndex]} alt={`Property view ${currentIndex + 1}`} />

                <Button
                    variant="outline"
                    className="carousel-nav-btn prev"
                    onClick={prevSlide}
                >
                    <ChevronLeft />
                </Button>

                <Button
                    variant="outline"
                    className="carousel-nav-btn next"
                    onClick={nextSlide}
                >
                    <ChevronRight />
                </Button>

                <div className="carousel-counter">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            <div className="carousel-thumbnails">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`carousel-thumbnail ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    >
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
