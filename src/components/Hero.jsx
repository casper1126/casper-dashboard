import React from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { Search } from 'lucide-react';

const Hero = () => {
    return (
        <div className="hero-section">
            <div className="hero-overlay"></div>
            <div className="hero-content container">
                <h1 className="hero-title">Find Your Dream Home</h1>
                <p className="hero-subtitle">Discover the perfect property in the best locations.</p>

                <div className="hero-search-bar">
                    <div className="search-input-group">
                        <Input placeholder="Search by area, station, or keyword..." className="hero-input" />
                    </div>
                    <div className="search-actions">
                        <Button variant="primary" size="lg">
                            <Search className="w-5 h-5 mr-2" />
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
