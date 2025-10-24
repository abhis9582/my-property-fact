"use client";
import { Suspense, useState, useEffect } from "react";
import ModernPropertyListing from "../../_components/ModernPropertyListing";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";

export default function ListingPage({ searchParams }) {
  const [action, setAction] = useState(null);
  const [isClient, setIsClient] = useState(true); // Start as true to prevent flash

  useEffect(() => {
    // Check URL parameters on client side
    const urlParams = new URLSearchParams(window.location.search);
    setAction(urlParams.get('action'));
  }, []);

  if (action === 'add') {
    return <ModernPropertyListing />;
  }

  // Default listings management view
  const mockListings = [
    {
      id: 1,
      title: "3 BHK Apartment in Sector 45",
      location: "Sector 45, Gurgaon",
      price: "₹1.2 Cr",
      area: "1200 sq ft",
      status: "Active",
      views: 245,
      inquiries: 12,
      created: "2024-01-15"
    },
    {
      id: 2,
      title: "2 BHK Villa with Garden",
      location: "Golf Course Road",
      price: "₹2.5 Cr",
      area: "1800 sq ft",
      status: "Active",
      views: 189,
      inquiries: 8,
      created: "2024-01-10"
    },
    {
      id: 3,
      title: "1 BHK Ready to Move",
      location: "DLF Phase 2",
      price: "₹85 L",
      area: "800 sq ft",
      status: "Sold",
      views: 156,
      inquiries: 15,
      created: "2024-01-05"
    }
  ];

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
                  <h3 className="mb-1" style={{color: 'var(--portal-primary)'}}>{mockListings.length}</h3>
                  <small className="text-success">+2 this month</small>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="portal-card">
                <div className="portal-card-body text-center">
                  <h6 className="portal-form-label">Active Listings</h6>
                  <h3 className="mb-1" style={{color: 'var(--portal-success)'}}>{mockListings.filter(l => l.status === 'Active').length}</h3>
                  <small className="text-success">83% active</small>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="portal-card">
                <div className="portal-card-body text-center">
                  <h6 className="portal-form-label">Total Views</h6>
                  <h3 className="mb-1" style={{color: 'var(--portal-info)'}}>{mockListings.reduce((sum, l) => sum + l.views, 0)}</h3>
                  <small className="text-success">+25% this month</small>
                </div>
              </div>
            </Col>
            <Col lg={3} md={6}>
              <div className="portal-card">
                <div className="portal-card-body text-center">
                  <h6 className="portal-form-label">Inquiries</h6>
                  <h3 className="mb-1" style={{color: 'var(--portal-warning)'}}>{mockListings.reduce((sum, l) => sum + l.inquiries, 0)}</h3>
                  <small className="text-success">+18% this month</small>
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
                  {mockListings.map(listing => (
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
                        <Badge bg={listing.status === 'Active' ? 'success' : 'warning'}>
                          {listing.status}
                        </Badge>
                      </td>
                      <td>{listing.views}</td>
                      <td>{listing.inquiries}</td>
                      <td>{new Date(listing.created).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button variant="outline-primary" size="sm" className="portal-btn">
                            View
                          </Button>
                          <Button variant="outline-secondary" size="sm" className="portal-btn">
                            Edit
                          </Button>
                          <Button variant="outline-danger" size="sm" className="portal-btn">
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
