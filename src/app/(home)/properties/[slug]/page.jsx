"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShare,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faCheck,
  faXmark,
  faMagnifyingGlass,
  faStar,
  faChevronLeft,
  faChevronRight,
  faHome,
  faBuilding,
  faCompass,
  faWindowMaximize,
  faBirthdayCake,
  faRocket,
  faVolumeMute,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner, Alert, Badge, Button } from "react-bootstrap";
import axios from "axios";
import "./property-detail.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [mediaTab, setMediaTab] = useState("Property"); // "Videos" or "Property"
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  // Extract ID from slug (slug format: title-id or just id)
  const propertyId = slug ? (() => {
    const slugStr = slug.toString();
    // Try to extract ID from end of slug (after last hyphen)
    const parts = slugStr.split('-');
    const lastPart = parts[parts.length - 1];
    // Check if last part is a number
    if (!isNaN(lastPart) && lastPart !== '') {
      return parseInt(lastPart);
    }
    // If not, try parsing the whole slug as ID
    return !isNaN(slugStr) ? parseInt(slugStr) : null;
  })() : null;

  useEffect(() => {
    if (propertyId) {
      fetchPropertyDetails();
      fetchRelatedProperties();
    }
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const response = await axios.get(`${apiUrl}/api/public/properties/${propertyId}`);

      if (response.data.success && response.data.property) {
        setProperty(response.data.property);
      } else {
        setError(response.data.message || "Property not found");
      }
    } catch (err) {
      console.error("Error fetching property details:", err);
      setError(err.response?.data?.message || "Failed to load property details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProperties = async () => {
    try {
      const apiUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const response = await axios.get(`${apiUrl}/api/public/properties?limit=4`);
      
      if (response.data.success && Array.isArray(response.data.properties)) {
        // Filter out current property and limit to 4
        const related = response.data.properties
          .filter(p => p.id.toString() !== propertyId)
          .slice(0, 4);
        setRelatedProperties(related);
      }
    } catch (err) {
      console.error("Error fetching related properties:", err);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    const apiUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    
    let cleanImageUrl = imageUrl;
    if (cleanImageUrl.match(/^[A-Za-z]:[\/\\]/)) {
      const propertyListingsIndex = cleanImageUrl.toLowerCase().indexOf("property-listings");
      if (propertyListingsIndex !== -1) {
        cleanImageUrl = cleanImageUrl.substring(propertyListingsIndex);
      } else {
        return null;
      }
    }
    
    cleanImageUrl = cleanImageUrl.replace(/\\/g, '/');
    if (cleanImageUrl.startsWith('/')) {
      cleanImageUrl = cleanImageUrl.slice(1);
    }
    if (cleanImageUrl.startsWith('uploads/')) {
      cleanImageUrl = cleanImageUrl.replace('uploads/', '');
    }
    
    const pathParts = cleanImageUrl.split('/');
    if (pathParts.length >= 3 && pathParts[0] === 'property-listings') {
      const listingId = pathParts[1];
      const filename = pathParts.slice(2).join('/');
      return `${apiUrl}/get/images/property-listings/${listingId}/${filename}`;
    }
    return null;
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return "Price on request";
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return "Price on request";
    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(2)} L`;
    }
    return `₹${Math.round(numPrice).toLocaleString('en-IN')}`;
  };

  const formatArea = (area, showSqM = false) => {
    if (area === null || area === undefined || area === "") return null;
    const numericArea = typeof area === 'string' ? parseFloat(area) : area;
    if (Number.isNaN(numericArea)) return null;
    if (showSqM) {
      const sqM = (numericArea * 0.092903).toFixed(2);
      return `${numericArea.toLocaleString('en-IN')} sq.ft. (${sqM} sq.m.)`;
    }
    return `${numericArea.toLocaleString('en-IN')} sq.ft.`;
  };

  const formatPricePerSqft = (price, perSqM = false) => {
    if (!price) return null;
    if (perSqM) {
      const pricePerSqM = (price * 10.764).toFixed(0);
      return `₹${pricePerSqM}`;
    }
    return `₹${Math.round(price).toLocaleString('en-IN')} per sq.ft.`;
  };

  const getBedroomLabel = (bedrooms) => {
    if (!bedrooms) return null;
    if (bedrooms === 1) return "1 RK/1 BHK";
    return `${bedrooms} BHK`;
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container my-5">
        <Alert variant="danger">
          <Alert.Heading>Property Not Found</Alert.Heading>
          <p>{error || "The property you are looking for does not exist or is not available."}</p>
          <Button variant="outline-danger" onClick={() => router.push("/properties")}>
            Back to Properties
          </Button>
        </Alert>
      </div>
    );
  }

  const allImageUrls = property.imageUrls && property.imageUrls.length > 0
    ? property.imageUrls.map(img => getImageUrl(img)).filter(Boolean)
    : [];

  const locationParts = [];
  if (property.address) locationParts.push(property.address);
  if (property.locality) locationParts.push(property.locality);
  if (property.city) locationParts.push(property.city);

  return (
    <div className="property-detail-page">
      {/* Header Section */}
      <div className="property-header-section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 py-3">
            <div>
              <h1 className="property-header-title mb-1">
                {formatPrice(property.totalPrice)} {getBedroomLabel(property.bedrooms)} {property.bathrooms ? `${property.bathrooms}Baths` : ''}
              </h1>
              {property.reraId && (
                <div className="rera-status">
                  <span>RERA STATUS: </span>
                  <a href={property.reraState ? `http://${property.reraState.toLowerCase()}-rera.in/projects` : '#'} target="_blank" rel="noopener noreferrer">
                    {property.reraId}
                  </a>
                </div>
              )}
            </div>
            <Button variant="primary" className="contact-dealer-btn">
              Contact Dealer
            </Button>
          </div>
          
          {/* Navigation Tabs */}
          <div className="property-nav-tabs">
            <button 
              className={activeTab === "Overview" ? "active" : ""}
              onClick={() => setActiveTab("Overview")}
            >
              Overview
            </button>
            <button 
              className={activeTab === "Society" ? "active" : ""}
              onClick={() => setActiveTab("Society")}
            >
              Society
            </button>
            <button 
              className={activeTab === "Dealer Details" ? "active" : ""}
              onClick={() => setActiveTab("Dealer Details")}
            >
              Dealer Details
            </button>
            <button 
              className={activeTab === "Price Trends" ? "active" : ""}
              onClick={() => setActiveTab("Price Trends")}
            >
              Price Trends
            </button>
            <button 
              className={activeTab === "Explore Locality" ? "active" : ""}
              onClick={() => setActiveTab("Explore Locality")}
            >
              Explore Locality
            </button>
            <button 
              className={activeTab === "Recommendation" ? "active" : ""}
              onClick={() => setActiveTab("Recommendation")}
            >
              Recommendation
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container my-4">
        <div className="row hero-section-row">
          {/* Left Panel - Media Gallery (40%) */}
          <div className="col-lg-5 col-md-12 mb-4">
            <div className="property-media-gallery">
              {/* Media Tabs */}
              <div className="media-tabs">
                <button
                  className={`media-tab ${mediaTab === "Videos" ? "active" : ""}`}
                  onClick={() => setMediaTab("Videos")}
                >
                  Videos (0)
                </button>
                <button
                  className={`media-tab ${mediaTab === "Property" ? "active" : ""}`}
                  onClick={() => setMediaTab("Property")}
                >
                  Property ({allImageUrls.length})
                </button>
              </div>

              {/* Media Content */}
              <div className="media-content">
                {mediaTab === "Property" && allImageUrls.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination, Zoom]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={allImageUrls.length > 1}
                    pagination={{ 
                      clickable: true,
                      type: 'fraction'
                    }}
                    zoom={true}
                    className="main-property-swiper"
                    onSlideChange={(swiper) => setImageIndex(swiper.activeIndex)}
                  >
                    {allImageUrls.map((imageUrl, index) => (
                      <SwiperSlide key={index}>
                        <div className="swiper-zoom-container">
                          <Image
                            src={imageUrl}
                            alt={`${property.title || 'Property'} - Image ${index + 1}`}
                            fill
                            className="property-main-image"
                            style={{ objectFit: 'cover' }}
                            unoptimized
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : mediaTab === "Videos" ? (
                  <div className="video-placeholder">
                    <div className="placeholder-content">
                      <p>No Videos Available</p>
                    </div>
                  </div>
                ) : (
                  <div className="property-image-placeholder">
                    <div className="placeholder-content">
                      <p>No Image Available</p>
                    </div>
                  </div>
                )}
                {/* Mute Icon for Videos */}
                {mediaTab === "Videos" && (
                  <div className="mute-icon">
                    <FontAwesomeIcon icon={faVolumeMute} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Property Details (60%) */}
          <div className="col-lg-7 col-md-12">
            <div className="property-details-hero">
              {/* Area */}
              <div className="detail-row">
                <div className="detail-icon">
                  <FontAwesomeIcon icon={faHome} />
                </div>
                <div className="detail-content">
                  <div className="detail-label">Area</div>
                  <div className="detail-value">
                    {property.plotArea 
                      ? `Plot area ${formatArea(property.plotArea, true)}`
                      : property.superBuiltUpArea 
                      ? `Super Built up area ${formatArea(property.superBuiltUpArea, true)}`
                      : property.builtUpArea
                      ? `Built up area ${formatArea(property.builtUpArea, true)}`
                      : property.carpetArea
                      ? `Carpet area ${formatArea(property.carpetArea, true)}`
                      : 'Area not specified'}
                    <FontAwesomeIcon icon={faChevronDown} className="ms-2 dropdown-arrow" />
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div className="detail-row">
                <div className="detail-icon">
                  <FontAwesomeIcon icon={faBuilding} />
                </div>
                <div className="detail-content">
                  <div className="detail-label">Configuration</div>
                  <div className="detail-value">
                    {property.bedrooms || 0} Bedrooms, {property.bathrooms || 0} Bathrooms, {property.balconies || 0} Balcony
                    {property.studyRoom && ', Study Room'}
                    {property.storeRoom && ', Store Room'}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="detail-row">
                <div className="detail-icon price-icon">
                  <FontAwesomeIcon icon={faRocket} />
                </div>
                <div className="detail-content">
                  <div className="detail-label">Price</div>
                  <div className="detail-value price-value">
                    {formatPrice(property.totalPrice)}
                    {property.totalPrice && property.totalPrice >= 10000000 && '+'}
                    {property.pricePerSqft && (
                      <>
                        {' '}Govt Charges & Tax @ {formatPricePerSqft(property.pricePerSqft, true)} per sq.m.
                        {property.totalPrice && ' (All inclusive, Negotiable)'}
                      </>
                    )}
                  </div>
                  <a href="#" className="price-details-link" onClick={(e) => { e.preventDefault(); setShowPriceDetails(!showPriceDetails); }}>
                    View Price Details
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="detail-row">
                <div className="detail-icon">
                  <FontAwesomeIcon icon={faHome} />
                </div>
                <div className="detail-content">
                  <div className="detail-label">Address</div>
                  <div className="detail-value">
                    {locationParts.filter(Boolean).join(", ") || "Address not specified"}
                  </div>
                </div>
              </div>

              {/* Total Floors */}
              {property.totalFloors && (
                <div className="detail-row">
                  <div className="detail-icon">
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Total Floors</div>
                    <div className="detail-value">
                      {property.totalFloors} {property.totalFloors === 1 ? 'Floor' : 'Floors'}
                    </div>
                  </div>
                </div>
              )}

              {/* Facing */}
              {property.facing && (
                <div className="detail-row">
                  <div className="detail-icon">
                    <FontAwesomeIcon icon={faCompass} />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Facing</div>
                    <div className="detail-value">{property.facing}</div>
                  </div>
                </div>
              )}

              {/* Overlooking */}
              {property.overlooking && (
                <div className="detail-row">
                  <div className="detail-icon">
                    <FontAwesomeIcon icon={faWindowMaximize} />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Overlooking</div>
                    <div className="detail-value">{property.overlooking}</div>
                  </div>
                </div>
              )}

              {/* Property Age */}
              {property.status && (
                <div className="detail-row">
                  <div className="detail-icon">
                    <FontAwesomeIcon icon={faBirthdayCake} />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Property Age</div>
                    <div className="detail-value">
                      {property.ageOfConstruction !== null && property.ageOfConstruction !== undefined
                        ? `${property.ageOfConstruction} to ${property.ageOfConstruction + 1} Year Old`
                        : property.status}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="row">
          <div className="col-12">
            {/* About Property Section */}
            <div className="property-section mt-4">
              <h3 className="section-title">About Property</h3>
              <div className="property-address mb-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                <strong>Address: </strong>
                {locationParts.filter(Boolean).join(", ") || "Address not specified"}
              </div>
              <div className="property-description">
                <p>
                  {property.description || "No description available."}
                  {property.description && property.description.length > 200 && (
                    <span className="text-primary ms-2" style={{ cursor: 'pointer' }}>More&gt;&gt;</span>
                  )}
                </p>
              </div>
            </div>

            {/* Furnishing Details Section */}
            {property.furnished && (
              <div className="property-section mt-4">
                <h4 className="section-subtitle">{property.furnished}</h4>
                <h5 className="section-label">Furnishing Details</h5>
                <div className="furnishing-grid">
                  {/* Included Items */}
                  <div className="furnishing-item included">
                    <FontAwesomeIcon icon={faCheck} className="check-icon" />
                    <span>2 Wardrobe</span>
                  </div>
                  <div className="furnishing-item included">
                    <FontAwesomeIcon icon={faCheck} className="check-icon" />
                    <span>1 Exhaust Fan</span>
                  </div>
                  <div className="furnishing-item included">
                    <FontAwesomeIcon icon={faCheck} className="check-icon" />
                    <span>2 Light</span>
                  </div>
                  <div className="furnishing-item included">
                    <FontAwesomeIcon icon={faCheck} className="check-icon" />
                    <span>1 Modular Kitchen</span>
                  </div>
                  {/* Excluded Items */}
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No AC</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Bed</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Chimney</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Curtains</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Dining Table</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Fan</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Geyser</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Microwave</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Fridge</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Sofa</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Stove</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No TV</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Washing Machine</span>
                  </div>
                  <div className="furnishing-item excluded">
                    <FontAwesomeIcon icon={faXmark} className="x-icon" />
                    <span>No Water Purifier</span>
                  </div>
                </div>
              </div>
            )}

            {/* Features Section */}
            {property.features && property.features.length > 0 && (
              <div className="property-section mt-4">
                <h4 className="section-subtitle">Features</h4>
                <div className="features-grid">
                  {property.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <FontAwesomeIcon icon={faCheck} className="check-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Society Section */}
            {property.projectName && (
              <div className="property-section mt-4">
                <h4 className="section-subtitle">Society</h4>
                <div className="society-info">
                  <h5 className="society-name">{property.projectName}</h5>
                  <div className="society-details">
                    <span>{getBedroomLabel(property.bedrooms)}</span>
                    {property.builderName && (
                      <span>Developed / built by {property.builderName}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Places Nearby Section */}
            {property.city && (
              <div className="property-section mt-4">
                <h4 className="section-subtitle">Places nearby</h4>
                <p className="text-muted mb-3">{locationParts.filter(Boolean).join(", ")}</p>
                <div className="places-nearby">
                  <div className="place-item">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>Metro Station</span>
                  </div>
                  <div className="place-item">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>Shopping Mall</span>
                  </div>
                  <div className="place-item">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>School</span>
                  </div>
                  <Link href="#" className="view-all-link">View All (12)</Link>
                </div>
              </div>
            )}

            {/* Locality Reviews Section */}
            {property.city && (
              <div className="property-section mt-4">
                <h4 className="section-subtitle">Locality Reviews</h4>
                <p className="text-muted mb-3">{locationParts.filter(Boolean).join(", ")}</p>
                <div className="locality-reviews">
                  <div className="review-summary">
                    <div className="rating-display">
                      <span className="rating-value">3.8</span>
                      <span className="rating-max">/5</span>
                    </div>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon 
                          key={star} 
                          icon={faStar} 
                          className={star <= 3.8 ? "star-filled" : "star-empty"} 
                        />
                      ))}
                    </div>
                    <p className="review-count">17 Total Reviews</p>
                  </div>
                  <div className="rating-breakdown">
                    <div className="rating-item">
                      <span>Connectivity</span>
                      <div className="rating-bar">
                        <div className="rating-fill" style={{ width: '74%' }}></div>
                      </div>
                      <span>3.7</span>
                    </div>
                    <div className="rating-item">
                      <span>Lifestyle</span>
                      <div className="rating-bar">
                        <div className="rating-fill" style={{ width: '78%' }}></div>
                      </div>
                      <span>3.9</span>
                    </div>
                    <div className="rating-item">
                      <span>Safety</span>
                      <div className="rating-bar">
                        <div className="rating-fill" style={{ width: '78%' }}></div>
                      </div>
                      <span>3.9</span>
                    </div>
                    <div className="rating-item">
                      <span>Green Area</span>
                      <div className="rating-bar">
                        <div className="rating-fill" style={{ width: '74%' }}></div>
                      </div>
                      <span>3.7</span>
                    </div>
                  </div>
                  <Button variant="outline-primary" className="mt-3">
                    Review your Society / Locality
                  </Button>
                </div>
              </div>
            )}

            {/* Sponsored Properties Section */}
            {relatedProperties.length > 0 && (
              <div className="property-section mt-4">
                <h4 className="section-subtitle">Sponsored Properties</h4>
                <div className="sponsored-properties">
                  {relatedProperties.slice(0, 2).map((related) => {
                    const relatedImageUrl = related.imageUrls && related.imageUrls.length > 0
                      ? getImageUrl(related.imageUrls[0])
                      : null;
                    return (
                      <div key={related.id} className="sponsored-property-card">
                        {relatedImageUrl && (
                          <Image
                            src={relatedImageUrl}
                            alt={related.title || 'Property'}
                            width={200}
                            height={150}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                            unoptimized
                          />
                        )}
                        <div className="sponsored-property-info">
                          <h6>{related.title || 'Property'}</h6>
                          <p className="text-muted small">
                            {related.locality || ''} {related.city || ''}
                          </p>
                          <p className="text-muted small">
                            {getBedroomLabel(related.bedrooms)} Flats
                          </p>
                          <p className="price-text">{formatPrice(related.totalPrice)} onwards</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Owner Properties Section */}
            {relatedProperties.length > 0 && (
              <div className="property-section mt-4">
                <h4 className="section-subtitle">Owner Properties Available Only on MB</h4>
                <div className="owner-properties-grid">
                  {relatedProperties.map((related) => {
                    const relatedImageUrl = related.imageUrls && related.imageUrls.length > 0
                      ? getImageUrl(related.imageUrls[0])
                      : null;
                    const relatedSlug = related.title
                      ? related.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + related.id
                      : related.id.toString();
                    return (
                      <Link 
                        key={related.id} 
                        href={`/properties/${relatedSlug}`}
                        className="owner-property-card"
                      >
                        <div className="owner-property-image">
                          {relatedImageUrl ? (
                            <Image
                              src={relatedImageUrl}
                              alt={related.title || 'Property'}
                              fill
                              style={{ objectFit: 'cover' }}
                              unoptimized
                            />
                          ) : (
                            <div className="placeholder-image-small">No Image</div>
                          )}
                          {related.imageUrls && related.imageUrls.length > 0 && (
                            <div className="image-count-badge">
                              {related.imageUrls.length}+ Photos
                            </div>
                          )}
                        </div>
                        <div className="owner-property-details">
                          <p className="price-text mb-1">
                            {formatPrice(related.totalPrice)} | {formatArea(related.carpetArea || related.builtUpArea)}
                          </p>
                          <p className="location-text small">
                            {related.locality || ''} {related.city || ''}
                          </p>
                          {related.status && (
                            <Badge bg="success" className="mt-1">{related.status}</Badge>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

