import React from 'react';
import { MapPin, Ruler, BedDouble, Heart } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
    const {
        id,
        title,
        price,
        location,
        size,
        bedrooms,
        image,
        tags
    } = property;

    return (
        <Card className="property-card">
            <div className="property-image-container">
                <img src={image} alt={title} className="property-image" />
                <div className="property-price-badge">
                    {price}
                </div>
                <Button variant="outline" size="sm" className="property-like-btn">
                    <Heart className="w-4 h-4" />
                </Button>
            </div>

            <div className="property-content">
                <div className="property-tags">
                    {tags.map((tag, index) => (
                        <Badge key={index} variant="primary" className="mr-2 mb-2">
                            {tag}
                        </Badge>
                    ))}
                </div>

                <Link to={`/property/${id}`} className="property-title-link">
                    <h3 className="property-title">{title}</h3>
                </Link>

                <div className="property-location">
                    <MapPin className="w-4 h-4 mr-1 text-secondary" />
                    {location}
                </div>

                <div className="property-features">
                    <div className="feature-item">
                        <Ruler className="w-4 h-4 mr-1" />
                        {size} Ping
                    </div>
                    <div className="feature-item">
                        <BedDouble className="w-4 h-4 mr-1" />
                        {bedrooms} Beds
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default PropertyCard;
