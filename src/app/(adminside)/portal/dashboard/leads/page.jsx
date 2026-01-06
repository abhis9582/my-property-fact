"use client";
import { useState, useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Badge, 
  Table, 
  Form, 
  InputGroup,
  Modal,
  Alert,
  Spinner
} from "react-bootstrap";
import { 
  cilPeople, 
  cilSearch, 
  cilViewModule, 
  cilPhone,
  cilEnvelopeOpen,
  cilCalendar,
  cilCheck,
  cilX
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import { useUser } from "../../_contexts/UserContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

export default function LeadsPage() {
  const { userData } = useUser();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [propertyFilter, setPropertyFilter] = useState("All");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      const response = await axios.get(`${apiUrl}/enquiry/get-all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (Array.isArray(response.data)) {
        // Filter leads based on user role
        let filteredLeads = response.data;
        
        // If user is not super admin, filter by their properties
        const isSuperAdmin = userData?.roles?.some(role => 
          role?.roleName === 'ROLE_SUPER_ADMIN' || role === 'ROLE_SUPER_ADMIN'
        ) || userData?.role === 'SUPER_ADMIN';
        
        if (!isSuperAdmin && userData?.id) {
          // For property owners, filter leads by their property IDs
          // This would require fetching user's properties first
          // For now, we'll show all leads with propertyId
          filteredLeads = response.data.filter(lead => lead.propertyId);
        }
        
        setLeads(filteredLeads);
      } else {
        setLeads([]);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError(err.response?.data?.message || "Failed to load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const apiUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
      await axios.put(`${apiUrl}/enquiry/update-status/${leadId}`, 
        { status: newStatus },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      
      // Refresh leads
      fetchLeads();
    } catch (err) {
      console.error("Error updating lead status:", err);
      alert("Failed to update lead status. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || 'New').toLowerCase();
    if (statusLower === 'new' || statusLower === 'hot') return "danger";
    if (statusLower === 'warm' || statusLower === 'contacted') return "warning";
    if (statusLower === 'cold') return "secondary";
    if (statusLower === 'converted' || statusLower === 'closed') return "success";
    return "info";
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || '').includes(searchTerm);
    const matchesStatus = statusFilter === "All" || (lead.status || 'New') === statusFilter;
    const matchesProperty = propertyFilter === "All" || 
      (lead.propertyId && lead.propertyId.toString() === propertyFilter);
    return matchesSearch && matchesStatus && matchesProperty;
  });

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const uniquePropertyIds = [...new Set(leads.filter(l => l.propertyId).map(l => l.propertyId.toString()))];

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => !l.status || l.status === 'New').length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted' || l.status === 'Warm').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted' || l.status === 'Closed').length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading leads...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="leads-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Property Leads</h2>
            <p>Manage inquiries and leads for your properties</p>
          </div>
          <Button variant="light" onClick={fetchLeads}>
            <CIcon icon={cilSearch} className="me-1" />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon">
                  <CIcon icon={cilPeople} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Total Leads</h6>
                  <h3 className="stat-value">{totalLeads}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon hot">
                  <CIcon icon={cilPeople} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">New Leads</h6>
                  <h3 className="stat-value">{newLeads}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon warm">
                  <CIcon icon={cilPeople} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Contacted</h6>
                  <h3 className="stat-value">{contactedLeads}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon">
                  <CIcon icon={cilCheck} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Converted</h6>
                  <h3 className="stat-value">{convertedLeads}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <CIcon icon={cilSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
              </Form.Select>
            </Col>
            {uniquePropertyIds.length > 0 && (
              <Col md={3}>
                <Form.Select
                  value={propertyFilter}
                  onChange={(e) => setPropertyFilter(e.target.value)}
                >
                  <option value="All">All Properties</option>
                  {uniquePropertyIds.map(propId => (
                    <option key={propId} value={propId}>Property ID: {propId}</option>
                  ))}
                </Form.Select>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Leads Table */}
      <Card className="leads-table-card">
        <Card.Header>
          <h5 className="mb-0">All Leads ({filteredLeads.length})</h5>
        </Card.Header>
        <Card.Body>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No leads found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Contact</th>
                    <th>Property ID</th>
                    <th>Status</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id}>
                      <td>
                        <div>
                          <h6 className="mb-1">{lead.name || 'N/A'}</h6>
                          <small className="text-muted">ID: #{lead.id}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            <CIcon icon={cilEnvelopeOpen} className="me-1 text-muted" />
                            <small>{lead.email || 'N/A'}</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilPhone} className="me-1 text-muted" />
                            <small>{lead.phone || 'N/A'}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {lead.propertyId ? (
                          <Badge bg="info">#{lead.propertyId}</Badge>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={lead.status || 'New'}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          style={{ width: 'auto', minWidth: '120px' }}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Warm">Warm</option>
                          <option value="Hot">Hot</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </Form.Select>
                      </td>
                      <td>
                        <div style={{ maxWidth: '200px' }}>
                          <small className="text-muted">
                            {lead.message ? (lead.message.length > 50 ? lead.message.substring(0, 50) + '...' : lead.message) : 'No message'}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilCalendar} className="me-1 text-muted" />
                          <small>{formatDate(lead.createdAt)}</small>
                        </div>
                      </td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => handleViewLead(lead)}
                        >
                          <CIcon icon={cilViewModule} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Lead Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lead Details - {selectedLead?.name || 'N/A'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLead && (
            <Row className="g-4">
              <Col md={6}>
                <h6>Contact Information</h6>
                <div className="contact-info">
                  <div className="contact-item">
                    <CIcon icon={cilEnvelopeOpen} className="me-2" />
                    {selectedLead.email || 'N/A'}
                  </div>
                  <div className="contact-item">
                    <CIcon icon={cilPhone} className="me-2" />
                    {selectedLead.phone || 'N/A'}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <h6>Lead Information</h6>
                <div className="lead-info">
                  <div className="info-item">
                    <strong>Status:</strong> <Badge bg={getStatusBadge(selectedLead.status)}>{selectedLead.status || 'New'}</Badge>
                  </div>
                  <div className="info-item">
                    <strong>Property ID:</strong> {selectedLead.propertyId ? `#${selectedLead.propertyId}` : 'N/A'}
                  </div>
                  <div className="info-item">
                    <strong>Source:</strong> {selectedLead.enquiryFrom || 'Property Detail Page'}
                  </div>
                  <div className="info-item">
                    <strong>Page:</strong> {selectedLead.pageName || 'N/A'}
                  </div>
                </div>
              </Col>
              <Col md={12}>
                <h6>Message</h6>
                <p className="lead-notes">{selectedLead.message || 'No message provided.'}</p>
              </Col>
              <Col md={12}>
                <h6>Timeline</h6>
                <div className="timeline-info">
                  <div className="timeline-item">
                    <CIcon icon={cilCalendar} className="me-2" />
                    <strong>Submitted:</strong> {formatDate(selectedLead.createdAt)}
                  </div>
                  {selectedLead.updatedAt && selectedLead.updatedAt !== selectedLead.createdAt && (
                    <div className="timeline-item">
                      <CIcon icon={cilCalendar} className="me-2" />
                      <strong>Last Updated:</strong> {formatDate(selectedLead.updatedAt)}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedLead && (
            <Form.Select
              value={selectedLead.status || 'New'}
              onChange={(e) => {
                updateLeadStatus(selectedLead.id, e.target.value);
                setSelectedLead({ ...selectedLead, status: e.target.value });
              }}
              style={{ width: 'auto' }}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Warm">Warm</option>
              <option value="Hot">Hot</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </Form.Select>
          )}
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        /* Common styles are now in PortalCommonStyles.css */
        /* Only page-specific styles below */
        
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          background: linear-gradient(135deg, #68ac78 0%, #0d5834 100%);
        }

        .stat-icon.hot {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        .stat-icon.warm {
          background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
        }

        .contact-info, .lead-info, .timeline-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .contact-item, .info-item, .timeline-item {
          display: flex;
          align-items: center;
          font-size: 0.9rem;
        }

        .lead-notes {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #68ac78;
          margin: 0;
        }

        @media (max-width: 768px) {
          .leads-page {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .stat-content {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .table-responsive {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
