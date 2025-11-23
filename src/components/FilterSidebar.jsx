import React from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

const FilterSidebar = () => {
    return (
        <aside className="filter-sidebar">
            <div className="filter-header">
                <h3>Filters</h3>
                <Button variant="outline" size="sm">Reset</Button>
            </div>

            <div className="filter-group">
                <label>Location</label>
                <select className="input">
                    <option value="">All Areas</option>
                    <option value="taipei">Taipei City</option>
                    <option value="new-taipei">New Taipei City</option>
                    <option value="taichung">Taichung</option>
                </select>
            </div>

            <div className="filter-group">
                <label>Price Range (TWD)</label>
                <div className="range-inputs">
                    <Input placeholder="Min" type="number" />
                    <span>-</span>
                    <Input placeholder="Max" type="number" />
                </div>
            </div>

            <div className="filter-group">
                <label>Size (Ping)</label>
                <div className="range-inputs">
                    <Input placeholder="Min" type="number" />
                    <span>-</span>
                    <Input placeholder="Max" type="number" />
                </div>
            </div>

            <div className="filter-group">
                <label>Property Type</label>
                <div className="checkbox-group">
                    <label><input type="checkbox" /> Apartment</label>
                    <label><input type="checkbox" /> Condo</label>
                    <label><input type="checkbox" /> House</label>
                    <label><input type="checkbox" /> Studio</label>
                </div>
            </div>

            <div className="filter-group">
                <label>Bedrooms</label>
                <div className="button-group">
                    <Button variant="outline" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">4+</Button>
                </div>
            </div>

            <Button variant="primary" className="w-full">Apply Filters</Button>
        </aside>
    );
};

export default FilterSidebar;
