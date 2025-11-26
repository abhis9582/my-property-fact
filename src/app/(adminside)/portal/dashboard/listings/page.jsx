"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import ModernPropertyListing from "../../_components/ModernPropertyListing";
import { Card, Row, Col, Button, Badge, Spinner, Alert } from "react-bootstrap";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

export default function ListingPage({ searchParams }) {
  const router = useRouter();
  const [action, setAction] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    // Check URL parameters on client side
    const urlParams = new URLSearchParams(window.location.search);
    setAction(urlParams.get('action'));
  }, []);

  const fetchUserProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = Cookies.get("authToken") || Cookies.get("token");
      
      if (!token) {
        setError("Please login to view your properties");
        setLoading(false);
        return;
      }

      const apiUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/user/property-listings`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && Array.isArray(result.properties)) {
        const transformedListings = result.properties.map(property => {
          const locationParts = [];
          if (property.address) locationParts.push(property.address);
          if (property.locality) locationParts.push(property.locality);
          if (property.city) locationParts.push(property.city);
          if (property.pincode) locationParts.push(property.pincode);

          // Use approvalStatus directly from API, default to PENDING if not present
          const approvalStatus = property.approvalStatus || "PENDING";
          const approvalStatusUpper = typeof approvalStatus === 'string' 
            ? approvalStatus.toUpperCase() 
            : approvalStatus;

          return {
            id: property.id,
            title:
              property.title ||
              property.projectName ||
              `${property.listingType || ""} ${property.subType || "Property"}`.trim(),
            location: locationParts.filter(Boolean).join(", ") || "Location not specified",
            price: formatPrice(property.totalPrice),
            area: formatArea(property.carpetArea || property.builtUpArea || property.superBuiltUpArea || property.plotArea),
            status: getStatusDisplay(approvalStatusUpper),
            statusBadge: getStatusBadge(approvalStatusUpper),
            views: 0,
            inquiries: 0,
            created: property.createdAt,
            approvalStatus: approvalStatusUpper,
            isApproved: approvalStatusUpper === "APPROVED",
            raw: property
          };
        });
        
        setListings(transformedListings);
      } else {
        setError(result.message || "Failed to fetch properties");
      }
        } catch (err) {
      console.error("Error fetching properties:", err);
      setError(err.message || "Failed to load properties. Please try again.");  
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (action !== 'add') {
      fetchUserProperties();
    }
  }, [action, fetchUserProperties]);

  const formatPrice = (price) => {
    if (!price && price !== 0) return "Price not set";
    
    let numPrice;
    
    // Handle string prices (including scientific notation like "1.5E7")
    if (typeof price === 'string') {
      // Check if it's scientific notation
      if (price.includes('E') || price.includes('e')) {
        numPrice = parseFloat(price);
      } else {
        // Regular string price - remove non-numeric characters except decimal point, E, e, +, and -
        // Place - at the end to avoid range interpretation
        numPrice = parseFloat(price.replace(/[^0-9.Ee+\-]/g, ''));
      }
      
      if (isNaN(numPrice)) {
        // Try extracting number from string like "₹1.5E7" or "1.5E7 Cr"
        const match = price.match(/[\d.]+[Ee][\d+-]+/);
        if (match) {
          numPrice = parseFloat(match[0]);
        } else {
          return price; // Return original if can't parse
        }
      }
    } else {
      // Handle number prices
      numPrice = typeof price === 'number' ? price : parseFloat(price);
    }
    
    if (isNaN(numPrice)) return "Price not set";
    
    // Format based on amount
    if (numPrice >= 10000000) {
      return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
    } else if (numPrice >= 100000) {
      return `₹${(numPrice / 100000).toFixed(2)} L`;
    }
    return `₹${Math.round(numPrice).toLocaleString('en-IN')}`;
  };

  const formatArea = (area) => {
    if (area === null || area === undefined || area === "") return "Area not specified";
    const numericArea = typeof area === 'string' ? parseFloat(area) : area;
    if (Number.isNaN(numericArea)) return "Area not specified";
    return `${numericArea.toLocaleString('en-IN')} sq ft`;
  };

  const getStatusDisplay = (approvalStatus) => {
    if (!approvalStatus) return "Unknown";
    switch (approvalStatus.toUpperCase()) {
      case 'DRAFT':
        return 'Draft';
      case 'PENDING':
        return 'Pending Approval';
      case 'APPROVED':
        return 'Active';
      case 'REJECTED':
        return 'Rejected';
      default:
        return approvalStatus;
    }
  };

  const getStatusBadge = (approvalStatus) => {
    if (!approvalStatus) return 'secondary';
    switch (approvalStatus.toUpperCase()) {
      case 'DRAFT':
        return 'warning';
      case 'PENDING':
        return 'info';
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(listingId);
      const token = Cookies.get("authToken") || Cookies.get("token");
      
      if (!token) {
        alert("Please login to delete properties");
        return;
      }

      const apiUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const response = await fetch(`${apiUrl}/api/user/property-listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Property deleted successfully');
        // Refresh the listings
        fetchUserProperties();
      } else {
        alert(result.message || 'Failed to delete property');
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert('Error deleting property. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (listingId) => {
    router.push(`/portal/dashboard/listings/${listingId}`);
  };

  const handleEdit = (listingId) => {
    router.push(`/portal/dashboard/listings/${listingId}?action=edit`);
  };

  if (action === 'add') {
    return <ModernPropertyListing />;
  }

  const activeListings = listings.filter(l => l.approvalStatus === 'APPROVED').length;
  const pendingListings = listings.filter(l => l.approvalStatus === 'PENDING').length;
  const draftListings = listings.filter(l => l.approvalStatus === 'DRAFT').length;
  const rejectedListings = listings.filter(l => l.approvalStatus === 'REJECTED').length;

  return (
    <div className="portal-content">
      <div className="portal-card">
        <div className="portal-card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">My Property Listings</h2>
              <p className="text-muted mb-0">Manage your property listings and track their performance</p>
            </div>
            <Button 
              variant="primary"
              className="portal-btn portal-btn-primary"
              onClick={() => window.location.href = '/portal/dashboard/listings?action=add'}
            >
              Add New Property
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="portal-card-body">
          <Row className="g-4 mb-4">
            <Col lg={3} md={6}>
              <div className="portal-card">
                <div className="portal-card-body text-center">
                  <h6 className="portal-form-label">Total Listings</h6>
                  {loading ? (
                    <Spinner size="sm" className="mt-2" />
                  ) : (
                    <>
                      <h3 className="mb-1" style={{color: 'var(--portal-primary)'}}>{listings.length}</h3>
                      <small className="text-muted">Properties posted</small>
                    </>
                  )}
                </div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="portal-card">
                <div className="portal-card-body text-center">
                  <h6 className="portal-form-label">Active Listings</h6>
                  {loading ? (
                    <Spinner size="sm" className="mt-2" />
                  ) : (
                    <>
                      <h3 className="mb-1" style={{color: 'var(--portal-success)'}}>{activeListings}</h3>
                      <small className="text-success">Approved & live</small>
                    </>
                  )}
                </div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="portal-card">
                <div className="portal-card-body text-center">
                  <h6 className="portal-form-label">Pending Approval</h6>
                  {loading ? (
                    <Spinner size="sm" className="mt-2" />
                  ) : (
                    <>
                      <h3 className="mb-1" style={{color: 'var(--portal-info)'}}>{pendingListings}</h3>
                      <small className="text-info">Awaiting review</small>
                    </>
                  )}
                </div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="portal-card">
                <div className="portal-card-body text-center">
                  <h6 className="portal-form-label">Draft</h6>
                  {loading ? (
                    <Spinner size="sm" className="mt-2" />
                  ) : (
                    <>
                      <h3 className="mb-1" style={{color: 'var(--portal-warning)'}}>{draftListings}</h3>
                      <small className="text-warning">Not submitted</small>
                    </>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Listings Table */}
        <div className="portal-card">
          <div className="portal-card-header">
            <h5 className="mb-0">All Listings</h5>
          </div>
          <div className="portal-card-body">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3 text-muted">Loading your properties...</p>
              </div>
            ) : error ? (
              <Alert variant="danger">
                <Alert.Heading>Error Loading Properties</Alert.Heading>
                <p>{error}</p>
                <Button variant="outline-danger" size="sm" onClick={fetchUserProperties}>
                  Retry
                </Button>
              </Alert>
            ) : listings.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted mb-3">You haven&apos;t posted any properties yet.</p>
                <Button 
                  variant="primary"
                  onClick={() => window.location.href = '/portal/dashboard/listings?action=add'}
                >
                  Add Your First Property
                </Button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Area</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Inquiries</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map(listing => (
                      <tr key={listing.id}>
                        <td>
                          <div>
                            <h6 className="mb-1">{listing.title}</h6>
                            <small className="text-muted">ID: #{listing.id}</small>
                          </div>
                        </td>
                        <td>{listing.location}</td>
                        <td>
                          <strong className="text-primary">{listing.price}</strong>
                        </td>
                        <td>{listing.area}</td>
                        <td>
                          <Badge bg={listing.statusBadge}>
                            {listing.status}
                          </Badge>
                        </td>
                        <td>{listing.views}</td>
                        <td>{listing.inquiries}</td>
                        <td>{listing.created ? new Date(listing.created).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="portal-btn"
                              onClick={() => handleView(listing.id)}
                              disabled={deletingId === listing.id}
                            >
                              View
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="portal-btn"
                              onClick={() => handleEdit(listing.id)}
                              disabled={deletingId === listing.id}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="portal-btn"
                              onClick={() => handleDelete(listing.id)}
                              disabled={deletingId === listing.id}
                            >
                              {deletingId === listing.id ? (
                                <>
                                  <Spinner size="sm" className="me-1" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
