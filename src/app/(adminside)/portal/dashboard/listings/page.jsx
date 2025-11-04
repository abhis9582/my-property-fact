"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import ModernPropertyListing from "../../_components/ModernPropertyListing";
import { Card, Row, Col, Button, Badge, Spinner, Alert } from "react-bootstrap";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

export default function ListingPage({ searchParams }) {
  const [action, setAction] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const response = await fetch(`${apiUrl}/api/user/properties`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Transform backend Project objects to frontend listing format
        const transformedListings = result.data.map(project => ({
          id: project.id,
          title: project.projectName || 'Untitled Property',
          location: `${project.projectLocality || ''}${project.city?.name ? ', ' + project.city.name : ''}`.trim() || 'Location not specified',
          price: formatPrice(project.projectPrice || project.totalPrice),
          area: formatArea(project.carpetAreaSqft || project.builtUpAreaSqft),
          status: getStatusDisplay(project.approvalStatus),
          statusBadge: getStatusBadge(project.approvalStatus),
          views: 0, // Not available in backend
          inquiries: 0, // Not available in backend
          created: project.createdAt || project.submittedAt,
          approvalStatus: project.approvalStatus,
          projectData: project // Store full project data for future use
        }));
        
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
    if (!area) return "Area not specified";
    return `${area} sq ft`;
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

  if (action === 'add') {
    return <ModernPropertyListing />;
  }

  const activeListings = listings.filter(l => l.approvalStatus === 'APPROVED').length;
  const pendingListings = listings.filter(l => l.approvalStatus === 'PENDING').length;
  const draftListings = listings.filter(l => l.approvalStatus === 'DRAFT').length;

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
                            <h6 className="mb-1">{listing.projectName}</h6>
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
                              onClick={() => window.location.href = `/portal/dashboard/listings/${listing.id}`}
                            >
                              View
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="portal-btn"
                              onClick={() => window.location.href = `/portal/dashboard/listings/${listing.id}?action=edit`}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              className="portal-btn"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this property?')) {
                                  alert('Delete functionality coming soon');
                                }
                              }}
                            >
                              Delete
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
