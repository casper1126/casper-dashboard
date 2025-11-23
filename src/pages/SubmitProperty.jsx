import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Upload, CheckCircle } from 'lucide-react';

const SubmitProperty = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    if (submitted) {
        return (
            <div className="page-submit-property container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div className="success-message">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Submission Received!</h2>
                    <p className="text-gray-600 mb-6">
                        Your property has been submitted successfully. <br />
                        It is currently waiting for admin approval before it goes public.
                    </p>
                    <Button variant="primary" onClick={() => setSubmitted(false)}>
                        Submit Another Property
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-submit-property container">
            <div className="submit-header mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Submit Your Property</h1>
                <p className="text-gray-600">Fill out the form below to list your property on our platform.</p>
            </div>

            <form className="submit-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3 className="form-section-title">Basic Information</h3>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Property Title</label>
                            <Input placeholder="e.g. Modern Apartment in Xinyi" required />
                        </div>

                        <div className="form-group">
                            <label>Price (TWD)</label>
                            <Input type="text" placeholder="e.g. 25,000,000" required />
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <Input placeholder="Full address" required />
                        </div>

                        <div className="form-group">
                            <label>District</label>
                            <select className="input">
                                <option value="">Select District</option>
                                <option value="xinyi">Xinyi District</option>
                                <option value="daan">Da'an District</option>
                                <option value="zhongshan">Zhongshan District</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Property Details</h3>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Size (Ping)</label>
                            <Input type="number" placeholder="e.g. 35" required />
                        </div>

                        <div className="form-group">
                            <label>Property Type</label>
                            <select className="input">
                                <option value="apartment">Apartment</option>
                                <option value="condo">Condo</option>
                                <option value="house">House</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Floor</label>
                            <Input placeholder="e.g. 5F / 12F" />
                        </div>

                        <div className="form-group">
                            <label>Building Age</label>
                            <Input placeholder="e.g. 10 years" />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Photos</h3>
                    <div className="upload-area">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 font-medium">Click to upload photos</p>
                        <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
                    </div>
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Description</h3>
                    <textarea
                        className="input"
                        rows="6"
                        placeholder="Describe the property features, amenities, and surroundings..."
                    ></textarea>
                </div>

                <div className="form-section">
                    <h3 className="form-section-title">Contact Information</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Name</label>
                            <Input placeholder="Your Name" required />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <Input placeholder="0912-345-678" required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <Input type="email" placeholder="email@example.com" required />
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <label className="confirmation-checkbox">
                        <input type="checkbox" required />
                        <span>I confirm that the information provided is accurate and I have the right to list this property.</span>
                    </label>

                    <Button variant="primary" size="lg" type="submit" className="w-full">
                        Submit Property
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SubmitProperty;
