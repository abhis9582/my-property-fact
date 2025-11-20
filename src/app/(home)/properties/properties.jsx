"use client";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShare,
  faEllipsisVertical,
  faChevronUp,
  faChevronDown,
  faCheck,
  faXmark,
  faArrowUpDown,
} from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import "./properties.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

export default function Properties() {
  const [activeTab, setActiveTab] = useState("Properties");
  const [sortBy, setSortBy] = useState("Relevance");
  const [hideSeen, setHideSeen] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [budgetMin, setBudgetMin] = useState("No min");
  const [budgetMax, setBudgetMax] = useState("No max");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState([]);
  const [selectedConstructionStatuses, setSelectedConstructionStatuses] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    budget: true,
    propertyType: true,
    bedrooms: true,
    constructionStatus: true,
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const response = await axios.get(`${apiUrl}/api/public/properties`);
        
        if (response.data.success && Array.isArray(response.data.properties)) {
          const transformedProperties = response.data.properties.map((property) => {
            const locationParts = [];
            if (property.address) locationParts.push(property.address);
            if (property.locality) locationParts.push(property.locality);
            if (property.city) locationParts.push(property.city);
            
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

            const formatPricePerSqft = (price) => {
              if (!price) return null;
              return `₹${Math.round(price).toLocaleString('en-IN')} per sqft`;
            };

            const getBedroomLabel = (bedrooms) => {
              if (!bedrooms) return null;
              if (bedrooms === 1) return "1 RK/1 BHK";
              return `${bedrooms} BHK`;
            };

            const mapStatus = (status) => {
              if (!status) return null;
              if (status.toLowerCase().includes("ready")) return "Ready to move";
              if (status.toLowerCase().includes("construction")) return "Under Construction";
              return "New Launch";
            };

            // Generate slug from title and ID
            const generateSlug = (title, id) => {
              if (!title) return id.toString();
              return title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '') + '-' + id;
            };

            const propertyTitle = property.title || `${getBedroomLabel(property.bedrooms) || ''} ${property.subType || 'Property'}`.trim();

            return {
              id: property.id,
              slug: generateSlug(propertyTitle, property.id),
              title: propertyTitle,
              location: locationParts.filter(Boolean).join(", ") || "Location not specified",
              price: formatPrice(property.totalPrice),
              pricePerSqft: formatPricePerSqft(property.pricePerSqft),
              area: property.carpetArea || property.builtUpArea || property.superBuiltUpArea || property.plotArea,
              areaLabel: property.carpetArea ? "Carpet Area" : property.builtUpArea ? "Built-up Area" : property.superBuiltUpArea ? "Super Built-up Area" : "Plot Area",
              bedrooms: property.bedrooms,
              bedroom: getBedroomLabel(property.bedrooms),
              bathrooms: property.bathrooms,
              balconies: property.balconies,
              facing: property.facing,
              status: property.status,
              constructionStatus: mapStatus(property.status),
              transaction: property.transaction,
              listingType: property.listingType,
              subType: property.subType,
              propertyTypeCategory: property.subType === "Apartment" || property.subType === "Flat" ? "Residential Apartment" : property.subType || "Residential Apartment",
              furnished: property.furnished,
              image: property.imageUrls && property.imageUrls.length > 0 ? property.imageUrls[0] : null,
              imageCount: property.imageUrls ? property.imageUrls.length : 0,
              postedDate: property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
              verified: property.approvalStatus === "APPROVED",
              numericPrice: property.totalPrice || 0,
              raw: property
            };
          });
          setProperties(transformedProperties);
        } else {
          setError("Failed to load properties");
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err.message || "Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Helper function to parse price string to numeric value (in lakhs)
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const str = priceStr.replace(/[₹,]/g, "").trim();
    if (str.includes("Cr")) {
      return parseFloat(str.replace("Cr", "").trim()) * 100; // Convert Cr to lakhs
    } else if (str.includes("L")) {
      return parseFloat(str.replace("L", "").trim());
    }
    return 0;
  };

  // Helper function to parse budget string to numeric value (in lakhs)
  const parseBudget = (budgetStr) => {
    if (!budgetStr || budgetStr === "No min" || budgetStr === "No max") return null;
    return parsePrice(budgetStr);
  };

  // Helper function to get image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    const apiUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    
    // Handle absolute Windows paths (e.g., D:\path\to\file or D:/path/to/file)
    let cleanImageUrl = imageUrl;
    if (cleanImageUrl.match(/^[A-Za-z]:[\/\\]/)) {
      // Extract relative path from absolute path
      const propertyListingsIndex = cleanImageUrl.toLowerCase().indexOf("property-listings");
      if (propertyListingsIndex !== -1) {
        cleanImageUrl = cleanImageUrl.substring(propertyListingsIndex);
      } else {
        console.warn('Could not find property-listings in absolute path:', imageUrl);
        return null;
      }
    }
    
    // Normalize path separators
    cleanImageUrl = cleanImageUrl.replace(/\\/g, '/');
    
    // Remove leading slash if present
    if (cleanImageUrl.startsWith('/')) {
      cleanImageUrl = cleanImageUrl.slice(1);
    }
    
    // Remove "uploads/" prefix if present
    if (cleanImageUrl.startsWith('uploads/')) {
      cleanImageUrl = cleanImageUrl.replace('uploads/', '');
    }
    
    // Split the path: property-listings/{id}/{filename}
    const pathParts = cleanImageUrl.split('/');
    if (pathParts.length >= 3 && pathParts[0] === 'property-listings') {
      const listingId = pathParts[1];
      const filename = pathParts.slice(2).join('/');
      const finalUrl = `${apiUrl}/get/images/property-listings/${listingId}/${filename}`;
      console.log('Constructed image URL:', finalUrl);
      return finalUrl;
    } else if (pathParts.length === 2) {
      return `${apiUrl}/get/images/${pathParts[0]}/${pathParts[1]}`;
    }
    
    console.warn('Could not parse image URL:', imageUrl);
    return null;
  };

  // Enhanced properties with computed fields
  const enhancedProperties = useMemo(() => 
    properties.map((property) => {
      // Get all image URLs for the slider
      const allImageUrls = property.raw?.imageUrls && property.raw.imageUrls.length > 0
        ? property.raw.imageUrls.map(img => getImageUrl(img)).filter(Boolean)
        : [];
      
      return {
        ...property,
        numericPrice: property.numericPrice || parsePrice(property.price),
        imageUrl: property.image ? getImageUrl(property.image) : null,
        allImageUrls: allImageUrls.length > 0 ? allImageUrls : (property.image ? [getImageUrl(property.image)].filter(Boolean) : []),
      };
    }), [properties]
  );

  // Filter handlers
  const togglePropertyType = (type) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const toggleBedroom = (bedroom) => {
    setSelectedBedrooms((prev) =>
      prev.includes(bedroom)
        ? prev.filter((b) => b !== bedroom)
        : [...prev, bedroom]
    );
  };

  const toggleConstructionStatus = (status) => {
    setSelectedConstructionStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearPropertyTypes = () => {
    setSelectedPropertyTypes([]);
  };

  const clearBedrooms = () => {
    setSelectedBedrooms([]);
  };

  const clearConstructionStatuses = () => {
    setSelectedConstructionStatuses([]);
  };

  const clearBudget = () => {
    setBudgetMin("No min");
    setBudgetMax("No max");
  };

  // Filter and sort logic
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = enhancedProperties.filter((property) => {
      // Hide seen filter
      if (hideSeen && property.seen) {
        return false;
      }

      // Verified filter
      if (verifiedOnly && !property.verified) {
        return false;
      }

      // Budget filter
      const minBudget = parseBudget(budgetMin);
      const maxBudget = parseBudget(budgetMax);
      if (minBudget !== null && property.numericPrice < minBudget) {
        return false;
      }
      if (maxBudget !== null && property.numericPrice > maxBudget) {
        return false;
      }

      // Property type filter
      if (selectedPropertyTypes.length > 0 && !selectedPropertyTypes.includes(property.propertyTypeCategory)) {
        return false;
      }

      // Bedroom filter
      if (selectedBedrooms.length > 0 && !selectedBedrooms.includes(property.bedroom)) {
        return false;
      }

      // Construction status filter
      if (selectedConstructionStatuses.length > 0) {
        const propertyStatus = property.constructionStatus;
        if (!propertyStatus || !selectedConstructionStatuses.includes(propertyStatus)) {
          return false;
        }
      }

      return true;
    });

    // Sort logic
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Price: Low to High":
          return a.numericPrice - b.numericPrice;
        case "Price: High to Low":
          return b.numericPrice - a.numericPrice;
        case "Newest First":
          // Simple date comparison - you might want to enhance this
          return new Date(b.postedDate) - new Date(a.postedDate);
        default: // Relevance
          return 0;
      }
    });

    return sorted;
  }, [
    hideSeen,
    verifiedOnly,
    budgetMin,
    budgetMax,
    selectedPropertyTypes,
    selectedBedrooms,
    selectedConstructionStatuses,
    sortBy,
    enhancedProperties,
  ]);

  // Compute applied filters for display
  const appliedFilters = useMemo(() => {
    const filters = [];
    selectedBedrooms.forEach((bedroom) => filters.push(bedroom));
    selectedPropertyTypes.forEach((type) => filters.push(type));
    selectedConstructionStatuses.forEach((status) => filters.push(status));
    if (budgetMin !== "No min") filters.push(`Min: ${budgetMin}`);
    if (budgetMax !== "No max") filters.push(`Max: ${budgetMax}`);
    if (hideSeen) filters.push("Hide Seen");
    if (verifiedOnly) filters.push("Verified Only");
    return filters;
  }, [
    hideSeen,
    verifiedOnly,
    budgetMin,
    budgetMax,
    selectedPropertyTypes,
    selectedBedrooms,
    selectedConstructionStatuses,
  ]);

  const removeFilter = (filter) => {
    if (filter === "Hide Seen") {
      setHideSeen(false);
    } else if (filter === "Verified Only") {
      setVerifiedOnly(false);
    } else if (filter.startsWith("Min: ")) {
      setBudgetMin("No min");
    } else if (filter.startsWith("Max: ")) {
      setBudgetMax("No max");
    } else if (selectedPropertyTypes.includes(filter)) {
      setSelectedPropertyTypes((prev) => prev.filter((t) => t !== filter));
    } else if (selectedBedrooms.includes(filter)) {
      setSelectedBedrooms((prev) => prev.filter((b) => b !== filter));
    } else if (selectedConstructionStatuses.includes(filter)) {
      setSelectedConstructionStatuses((prev) => prev.filter((s) => s !== filter));
    }
  };

  const clearAllFilters = () => {
    setHideSeen(false);
    setVerifiedOnly(false);
    setBudgetMin("No min");
    setBudgetMax("No max");
    setSelectedPropertyTypes([]);
    setSelectedBedrooms([]);
    setSelectedConstructionStatuses([]);
  };

  const propertyTypes = [
    "Residential Apartment",
    "Independent/Builder Floor",
    "Independent House/Villa",
    "Farm House",
    "Serviced Apartments",
  ];

  const bedroomOptions = ["1 RK/1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"];
  const constructionStatuses = ["New Launch", "Under Construction", "Ready to move"];

  const generatePrice = (price) => {
    return `₹${price}`;
  };

  return (
    <div className="properties-page">
      {/* Breadcrumbs */}
      <div className="container-fluid bg-light">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Properties
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Tabs and Sort */}
      <div className="container-fluid border-bottom bg-white sticky-top" style={{ zIndex: 100 }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex gap-4 tabs-container">
              <button
                className={`tab-button ${activeTab === "Properties" ? "active" : ""}`}
                onClick={() => setActiveTab("Properties")}
                aria-label="View Properties"
              >
                Properties <span className="count">({filteredAndSortedProperties.length.toLocaleString()})</span>
              </button>
              <button
                className={`tab-button ${activeTab === "New Projects" ? "active" : ""}`}
                onClick={() => setActiveTab("New Projects")}
                aria-label="View New Projects"
              >
                New Projects
              </button>
              <button
                className={`tab-button ${activeTab === "Top Agents" ? "active" : ""}`}
                onClick={() => setActiveTab("Top Agents")}
                aria-label="View Top Agents"
              >
                Top Agents
              </button>
            </div>
            <div className="d-flex align-items-center gap-2">
              <label className="mb-0 fw-semibold">Sort by:</label>
              <select
                className="form-select sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort properties"
              >
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="container-fluid bg-white border-bottom">
        <div className="container py-2">
          <h2 className="mb-0 fw-bold" style={{ 
            fontSize: "1.5rem",
            color: "#212529",
            letterSpacing: "-0.3px"
          }}>
            {filteredAndSortedProperties.length} results | 3 BHK Flats in Noida
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid py-4">
        <div className="container">
          <div className="row">
            {/* Left Sidebar - Filters */}
            <div className="col-lg-3 mb-4 mb-lg-0">
              <div className="filters-sidebar">
                {/* Applied Filters */}
                {appliedFilters.length > 0 && (
                  <div className="filter-section">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0 fw-bold">Applied Filters</h6>
                      <button
                        className="clear-all-btn"
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {appliedFilters.map((filter, index) => (
                        <span key={index} className="filter-pill">
                          {filter}
                          <button
                            className="filter-remove"
                            onClick={() => removeFilter(filter)}
                          >
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hide already seen */}
                <div className="filter-section">
                  <div className="d-flex justify-content-between align-items-center">
                    <label className="mb-0">Hide already seen</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={hideSeen}
                        onChange={(e) => setHideSeen(e.target.checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Verified properties */}
                <div className="filter-section">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="mb-0">Verified properties</label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-success small">
                    <FontAwesomeIcon icon={faCheck} />
                    <span>by MyPropertyFact verification team</span>
                  </div>
                </div>

                {/* Budget */}
                <div className="filter-section">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0 fw-bold">Budget</h6>
                    <button
                      className="btn-link border-0 bg-transparent p-0"
                      onClick={() => toggleSection("budget")}
                    >
                      <FontAwesomeIcon
                        icon={expandedSections.budget ? faChevronUp : faChevronDown}
                      />
                    </button>
                  </div>
                  {expandedSections.budget && (
                    <div className="d-flex gap-2">
                      <select
                        className="form-select form-select-sm"
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value)}
                      >
                        <option>No min</option>
                        <option>₹10 Lakh</option>
                        <option>₹25 Lakh</option>
                        <option>₹50 Lakh</option>
                        <option>₹1 Cr</option>
                      </select>
                      <select
                        className="form-select form-select-sm"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value)}
                      >
                        <option>No max</option>
                        <option>₹50 Lakh</option>
                        <option>₹1 Cr</option>
                        <option>₹2 Cr</option>
                        <option>₹5 Cr</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Type of property */}
                <div className="filter-section">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="mb-0 fw-bold">Type of property</h6>
                      {selectedPropertyTypes.length > 0 && (
                        <button className="clear-btn" onClick={clearPropertyTypes}>
                          Clear
                        </button>
                      )}
                    </div>
                    <button
                      className="btn-link border-0 bg-transparent p-0"
                      onClick={() => toggleSection("propertyType")}
                    >
                      <FontAwesomeIcon
                        icon={expandedSections.propertyType ? faChevronUp : faChevronDown}
                      />
                    </button>
                  </div>
                  {expandedSections.propertyType && (
                    <div className="property-type-list">
                      {propertyTypes.map((type, index) => (
                        <div key={index} className="property-type-item">
                          {selectedPropertyTypes.includes(type) ? (
                            <span 
                              className="selected"
                              onClick={() => togglePropertyType(type)}
                              style={{ cursor: 'pointer' }}
                            >
                              <FontAwesomeIcon icon={faCheck} className="me-2" />
                              {type}
                            </span>
                          ) : (
                            <span 
                              className="add-type"
                              onClick={() => togglePropertyType(type)}
                              style={{ cursor: 'pointer' }}
                            >
                              + {type}
                            </span>
                          )}
                        </div>
                      ))}
                      <div className="property-type-item">
                        <span className="add-type">+ 1 more</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* No. of Bedrooms */}
                <div className="filter-section">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="mb-0 fw-bold">No. of Bedrooms</h6>
                      {selectedBedrooms.length > 0 && (
                        <button className="clear-btn" onClick={clearBedrooms}>
                          Clear
                        </button>
                      )}
                    </div>
                    <button
                      className="btn-link border-0 bg-transparent p-0"
                      onClick={() => toggleSection("bedrooms")}
                    >
                      <FontAwesomeIcon
                        icon={expandedSections.bedrooms ? faChevronUp : faChevronDown}
                      />
                    </button>
                  </div>
                  {expandedSections.bedrooms && (
                    <div className="d-flex flex-wrap gap-2">
                      {bedroomOptions.map((bedroom, index) => (
                        <button
                          key={index}
                          className={`bedroom-btn ${selectedBedrooms.includes(bedroom) ? "active" : ""}`}
                          onClick={() => toggleBedroom(bedroom)}
                        >
                          {selectedBedrooms.includes(bedroom) ? bedroom : `+ ${bedroom}`}
                        </button>
                      ))}
                      <button className="bedroom-btn">+ 5 more</button>
                    </div>
                  )}
                </div>

                {/* Construction Status */}
                <div className="filter-section">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="mb-0 fw-bold">Construction Status</h6>
                      {selectedConstructionStatuses.length > 0 && (
                        <button className="clear-btn" onClick={clearConstructionStatuses}>
                          Clear
                        </button>
                      )}
                    </div>
                    <button
                      className="btn-link border-0 bg-transparent p-0"
                      onClick={() => toggleSection("constructionStatus")}
                    >
                      <FontAwesomeIcon
                        icon={
                          expandedSections.constructionStatus ? faChevronUp : faChevronDown
                        }
                      />
                    </button>
                  </div>
                  {expandedSections.constructionStatus && (
                    <div className="construction-status-list">
                      {constructionStatuses.map((status, index) => (
                        <div key={index} className="construction-status-item">
                          {selectedConstructionStatuses.includes(status) ? (
                            <span 
                              className="selected"
                              onClick={() => toggleConstructionStatus(status)}
                              style={{ cursor: 'pointer' }}
                            >
                              <FontAwesomeIcon icon={faCheck} className="me-2" />
                              {status}
                            </span>
                          ) : (
                            <span 
                              className="add-status"
                              onClick={() => toggleConstructionStatus(status)}
                              style={{ cursor: 'pointer' }}
                            >
                              + {status}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content - Property Listings */}
            <div className="col-lg-9">
              <div className="properties-list">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-3 text-muted">Loading properties...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-5">
                    <p className="text-danger">{error}</p>
                    <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
                      Retry
                    </button>
                  </div>
                ) : filteredAndSortedProperties.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No properties found matching your filters.</p>
                    <button className="btn btn-primary mt-3" onClick={clearAllFilters}>
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  filteredAndSortedProperties.map((property) => (
                  <Link 
                    key={property.id} 
                    href={`/properties/${property.slug || property.id}`}
                    className="property-card text-decoration-none"
                    style={{ color: 'inherit', display: 'block' }}
                  >
                    <div className="row g-0 h-100">
                      {/* Property Image Slider */}
                      <div className="col-md-4 p-0 d-flex">
                        <div className="property-image-container position-relative w-100">
                          {property.allImageUrls && property.allImageUrls.length > 0 ? (
                            <Swiper
                              modules={[Navigation, Pagination, Autoplay]}
                              spaceBetween={0}
                              slidesPerView={1}
                              navigation={false}
                              pagination={{ 
                                clickable: true,
                                bulletClass: 'swiper-pagination-bullet property-slider-bullet',
                                bulletActiveClass: 'swiper-pagination-bullet-active property-slider-bullet-active'
                              }}
                              autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                              }}
                              loop={property.allImageUrls.length > 1}
                              className="property-image-swiper h-100"
                              style={{ height: '100%' }}
                            >
                              {property.allImageUrls.map((imageUrl, index) => (
                                <SwiperSlide key={index}>
                                  <div className="position-relative w-100 h-100">
                                    <Image
                                      src={imageUrl}
                                      alt={`${property.title} - Image ${index + 1}`}
                                      fill
                                      className="property-image"
                                      style={{ objectFit: 'cover' }}
                                      unoptimized
                                      onError={(e) => {
                                        console.error('Image load error:', imageUrl);
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          ) : (
                            <div 
                              className="placeholder-image" 
                              style={{ 
                                display: 'flex',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#6c757d',
                                fontSize: '0.875rem'
                              }}
                            >
                              No Image
                            </div>
                          )}
                          {property.verified && (
                            <div 
                              className="verified-badge"
                              title="This property has been e-verified by our team."
                            >
                              <FontAwesomeIcon icon={faCheck} className="me-1" />
                              Verified
                            </div>
                          )}
                          {property.imageCount > 0 && (
                            <div className="image-label">{property.imageCount}+ Photos</div>
                          )}
                          {property.postedDate && (
                            <div className="posted-date">Posted: {property.postedDate}</div>
                          )}
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="col-md-8 d-flex align-items-center">
                        <div className="property-details w-100">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h5 className="property-title">{property.title}</h5>
                              {/* <p className="property-developer">{property.location}</p> */}
                            </div>
                            <div className="property-actions">
                              <button 
                                className="action-btn" 
                                aria-label="Add to favorites"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FontAwesomeIcon icon={faHeart} />
                              </button>
                              <button 
                                className="action-btn" 
                                aria-label="Share property"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FontAwesomeIcon icon={faShare} />
                              </button>
                              <button 
                                className="action-btn" 
                                aria-label="More options"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                              </button>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="property-details-grid">
                            {property.area && (
                              <div>
                                <strong>{property.areaLabel?.toUpperCase() || 'AREA'}:</strong> {property.area.toLocaleString('en-IN')} sq ft
                              </div>
                            )}
                            {property.status && (
                              <div>
                                <strong>STATUS:</strong> {property.status}
                              </div>
                            )}
                            {property.transaction && (
                              <div>
                                <strong>TRANSACTION:</strong> {property.transaction}
                              </div>
                            )}
                            {property.furnished && (
                              <div>
                                <strong>TYPE:</strong> {property.furnished}
                              </div>
                            )}
                            {property.bathrooms && (
                              <div>
                                <strong>BATHROOMS:</strong> {property.bathrooms}
                              </div>
                            )}
                            {/* {property.balconies && (
                              <div>
                                <strong>BALCONIES:</strong> {property.balconies}
                              </div>
                            )} */}
                            {/* {property.facing && ( */}
                              <div>
                                <strong>FACING:</strong> {property.facing}
                              </div>
                            {/* )} */}
                          </div>

                          {/* Description */}
                          {/* {property.raw?.description && (
                            <p className="property-description mb-0">{property.raw.description.substring(0, 150)}{property.raw.description.length > 150 ? '...' : ''}</p>
                          )} */}

                          {/* Price and Actions */}
                          <div className="d-flex justify-content-between align-items-end mt-0">
                            <div className="d-flex gap-2">
                              <h4 className="property-price mb-1">{property.price}</h4>
                              {property.pricePerSqft && (
                                <p className="property-price-per-sqft mb-0">
                                  / {property.pricePerSqft}
                                </p>
                              )}
                            </div>
                            <div className="property-action-buttons">
                              <button 
                                className="btn btn-danger me-2"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Handle contact agent
                                }}
                              >
                                Contact Agent
                              </button>
                              <button 
                                className="btn btn-outline-secondary"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // Handle enquire now
                                }}
                              >
                                Enquire Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
