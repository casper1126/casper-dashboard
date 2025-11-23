import React from 'react';
import { useParams } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { MapPin, Ruler, BedDouble, Calendar, Building, DollarSign, Phone, Mail } from 'lucide-react';

const MOCK_PROPERTY = {
    id: 1,
    title: 'Modern Apartment in Xinyi District',
    price: '$25,000,000',
    address: 'No. 123, Xinyi Road, Xinyi District, Taipei City',
    size: 35,
    type: 'Apartment',
    age: '5 years',
    floor: '12F / 20F',
    managementFee: '$3,500 / month',
    parking: 'Included (B2-101)',
    bedrooms: 2,
    bathrooms: 1,
    description: `
    Experience luxury living in the heart of Taipei's Xinyi District. This stunning apartment features modern finishes, floor-to-ceiling windows, and breathtaking city views. 
    
    The open-concept living area is perfect for entertaining, while the spacious bedrooms provide a quiet retreat. The building offers top-notch amenities including a gym, swimming pool, and 24-hour security.
    
    Conveniently located near MRT stations, shopping malls, and parks. Don't miss this opportunity to own a piece of prime real estate in Taipei.
  `,
    images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
    ],
    details: {
        mainArea: '25 ping',
        balcony: '3 ping',
        publicArea: '7 ping',
        structure: 'RC',
        orientation: 'South',
        amenities: 'Gym, Pool, Lounge',
        surroundings: 'MRT, Park, Department Store'
    },
    agent: {
        name: 'Alice Chen',
        phone: '0912-345-678',
        email: 'alice@example.com',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80'
    }
};

const PropertyDetail = () => {
    const { id } = useParams();
    // In a real app, fetch property by id. Using mock data for now.
    const property = MOCK_PROPERTY;

    return (
        <div className="page-property-detail container">
            <ImageCarousel images={property.images} />

            <div className="property-detail-grid">
                <div className="property-main-info">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                        <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="w-5 h-5 mr-2" />
                            {property.address}
                        </div>
                        <div className="flex gap-2 mb-6">
                            <Badge variant="primary">For Sale</Badge>
                            <Badge variant="outline">{property.type}</Badge>
                            <Badge variant="outline">{property.age}</Badge>
                        </div>
                        <div className="text-3xl font-bold text-primary mb-6">
                            {property.price}
                        </div>
                    </div>

                    <div className="key-info-grid">
                        <div className="info-item">
                            <span className="label">Size</span>
                            <span className="value">{property.size} Ping</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Floor</span>
                            <span className="value">{property.floor}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Bedrooms</span>
                            <span className="value">{property.bedrooms}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Bathrooms</span>
                            <span className="value">{property.bathrooms}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Parking</span>
                            <span className="value">{property.parking}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Management Fee</span>
                            <span className="value">{property.managementFee}</span>
                        </div>
                    </div>

                    <div className="section-block">
                        <h2 className="section-title">Description</h2>
                        <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                            {property.description}
                        </p>
                    </div>

                    <div className="section-block">
                        <h2 className="section-title">Property Details</h2>
                        <table className="details-table">
                            <tbody>
                                <tr>
                                    <th>Main Area</th>
                                    <td>{property.details.mainArea}</td>
                                    <th>Structure</th>
                                    <td>{property.details.structure}</td>
                                </tr>
                                <tr>
                                    <th>Balcony</th>
                                    <td>{property.details.balcony}</td>
                                    <th>Orientation</th>
                                    <td>{property.details.orientation}</td>
                                </tr>
                                <tr>
                                    <th>Public Area</th>
                                    <td>{property.details.publicArea}</td>
                                    <th>Amenities</th>
                                    <td>{property.details.amenities}</td>
                                </tr>
                                <tr>
                                    <th>Surroundings</th>
                                    <td colSpan="3">{property.details.surroundings}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="section-block">
                        <h2 className="section-title">Location</h2>
                        <div className="map-placeholder">
                            <MapPin className="w-12 h-12 text-gray-400 mb-2" />
                            <p>Google Map Placeholder</p>
                            <p className="text-sm text-gray-500">{property.address}</p>
                        </div>
                    </div>
                </div>

                <aside className="property-sidebar">
                    <div className="agent-card">
                        <div className="agent-header">
                            <img src={property.agent.image} alt={property.agent.name} className="agent-image" />
                            <div>
                                <h3 className="font-bold text-lg">{property.agent.name}</h3>
                                <p className="text-sm text-gray-500">Real Estate Agent</p>
                            </div>
                        </div>
                        <div className="agent-contact">
                            <Button variant="primary" className="w-full mb-2">
                                <Phone className="w-4 h-4 mr-2" />
                                Call Agent
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Mail className="w-4 h-4 mr-2" />
                                Send Message
                            </Button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PropertyDetail;
