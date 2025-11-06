"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { allPropertiesData } from "./propertyData";
import "./properties.css";

export default function Properties() {
  const [activeTab, setActiveTab] = useState("Properties");
  const [sortBy, setSortBy] = useState("Relevance");
  const [hideSeen, setHideSeen] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [budgetMin, setBudgetMin] = useState("No min");
  const [budgetMax, setBudgetMax] = useState("No max");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(["Residential Apartment"]);
  const [selectedBedrooms, setSelectedBedrooms] = useState(["3 BHK"]);
  const [selectedConstructionStatuses, setSelectedConstructionStatuses] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    budget: true,
    propertyType: true,
    bedrooms: true,
    constructionStatus: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Helper function to parse price string to numeric value (in lakhs)
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const str = priceStr.replace(/[₹,]/g, "").trim();
    if (str.includes("Cr")) {
      return parseFloat(str.replace("Cr", "").trim()) * 100; // Convert Cr to lakhs
    } else if (str.includes("Lakh")) {
      return parseFloat(str.replace("Lakh", "").trim());
    }
    return 0;
  };

  // Helper function to parse budget string to numeric value (in lakhs)
  const parseBudget = (budgetStr) => {
    if (!budgetStr || budgetStr === "No min" || budgetStr === "No max") return null;
    return parsePrice(budgetStr);
  };

  // Helper function to extract bedroom count from title
  const extractBedroom = (title) => {
    const match = title.match(/(\d+)\s*(RK|BHK)/i);
    if (match) {
      const count = parseInt(match[1]);
      const type = match[2].toUpperCase();
      if (type === "RK") return "1 RK/1 BHK";
      return `${count} BHK`;
    }
    return "3 BHK"; // Default
  };

  // Helper function to map construction status
  const mapConstructionStatus = (status) => {
    if (!status) return null;
    if (status === "Ready to Move" || status === "Ready to move") return "Ready to move";
    if (status === "Under Construction") return "Under Construction";
    return "New Launch";
  };

  // Sample property data - replace with actual API data
  const allProperties = allPropertiesData;

  // Enhanced properties with computed fields
  const enhancedProperties = useMemo(() => 
    allProperties.map((property) => ({
      ...property,
      numericPrice: parsePrice(property.price),
      bedroom: extractBedroom(property.title),
      constructionStatus: mapConstructionStatus(property.status),
    })), [allProperties]
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
    if (hideSeen) filters.push("Hide Seen");
    if (verifiedOnly) filters.push("Verified Only");
    if (budgetMin !== "No min") filters.push(`Min: ${budgetMin}`);
    if (budgetMax !== "No max") filters.push(`Max: ${budgetMax}`);
    selectedPropertyTypes.forEach((type) => filters.push(type));
    selectedBedrooms.forEach((bedroom) => filters.push(bedroom));
    selectedConstructionStatuses.forEach((status) => filters.push(status));
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
      <div className="container-fluid py-2 bg-light">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/properties">Flats for Sale in Noida</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                3 BHK Flats for Sale in Noida
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Tabs and Sort */}
      <div className="container-fluid border-bottom bg-white sticky-top" style={{ zIndex: 100 }}>
        <div className="container py-3">
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
        <div className="container py-4">
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
                {filteredAndSortedProperties.length === 0 ? (
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
                    href={`/detail/${property.id}`}
                    className="property-card text-decoration-none"
                    style={{ color: 'inherit', display: 'block' }}
                  >
                    <div className="row g-0 h-100">
                      {/* Property Image */}
                      <div className="col-md-4 p-0 d-flex">
                        <div className="property-image-container position-relative w-100">
                          <Image
                            src={property.image}
                            alt={property.title}
                            width={400}
                            height={220}
                            className="property-image"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                          {property.imageLabel && (
                            <div className="image-label">{property.imageLabel}</div>
                          )}
                          {property.postedDate && (
                            <div className="posted-date">Posted: {property.postedDate}</div>
                          )}
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="col-md-8 d-flex">
                        <div className="property-details w-100">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h5 className="property-title">{property.title}</h5>
                              <p className="property-developer">{property.developer}</p>
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
                            {property.superArea && (
                              <div>
                                <strong>SUPER AREA:</strong> {property.superArea}
                              </div>
                            )}
                            {/* {property.possession ? (
                              <div>
                                <strong>UNDER CONSTRUCTION:</strong> {property.possession}
                              </div>
                            ) : property.status ? (
                              <div>
                                <strong>STATUS:</strong> {property.status}
                              </div>
                            ) : null} */}
                            {/* {property.furnishing && (
                              <div>
                                <strong>FURNISHING:</strong> {property.furnishing}
                              </div>
                            )} */}
                            {/* {property.bathroom && (
                              <div>
                                <strong>BATHROOM:</strong> {property.bathroom}
                              </div>
                            )} */}
                            {property.transaction && (
                              <div>
                                <strong>TRANSACTION:</strong> {property.transaction}
                              </div>
                            )}
                            {property.balcony && (
                              <div>
                                <strong>BALCONY:</strong> {property.balcony}
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <p className="property-description mb-0">{property.description}</p>

                          {/* Price and Actions */}
                          <div className="d-flex justify-content-between align-items-end mt-0">
                            <div>
                              <h4 className="property-price mb-1">{generatePrice(property.price)}</h4>
                              <p className="property-price-per-sqft mb-0">
                                {property.pricePerSqft}
                              </p>
                            </div>
                            <div className="property-action-buttons">
                              {property.buttonType === "phone" ? (
                                <>
                                  <button 
                                    className="btn btn-outline-secondary me-2"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Get Phone No.
                                  </button>
                                  <button 
                                    className="btn btn-danger"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Contact Agent
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button 
                                    className="btn btn-danger me-2"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Contact Agent
                                  </button>
                                  <button 
                                    className="btn btn-outline-secondary"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Enquire Now
                                  </button>
                                </>
                              )}
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
