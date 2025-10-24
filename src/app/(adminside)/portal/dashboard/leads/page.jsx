"use client";
import { useState } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Badge, 
  Table, 
  Form, 
  InputGroup,
  Dropdown,
  Modal,
  Alert
} from "react-bootstrap";
import { 
  cilPeople, 
  cilSearch, 
  cilFilter, 
  cilPlus, 
  cilViewModule, 
  cilPencil, 
  cilTrash,
  cilPhone,
  cilEnvelopeOpenOpen,
  cilLocationPin,
  cilCalendar,
  cilStar,
  cilCheck,
  cilX
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210",
      source: "Website",
      status: "Hot",
      priority: "High",
      propertyType: "3 BHK Apartment",
      budget: "₹1.2 Cr",
      location: "Gurgaon",
      lastContact: "2024-01-20",
      nextFollowUp: "2024-01-22",
      score: 85,
      notes: "Interested in ready-to-move properties"
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 87654 32109",
      source: "Referral",
      status: "Warm",
      priority: "Medium",
      propertyType: "2 BHK Villa",
      budget: "₹2.5 Cr",
      location: "Delhi",
      lastContact: "2024-01-18",
      nextFollowUp: "2024-01-25",
      score: 72,
      notes: "Looking for investment property"
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit.patel@email.com",
      phone: "+91 76543 21098",
      source: "Social Media",
      status: "Cold",
      priority: "Low",
      propertyType: "1 BHK Studio",
      budget: "₹85 L",
      location: "Noida",
      lastContact: "2024-01-15",
      nextFollowUp: "2024-01-30",
      score: 45,
      notes: "First-time buyer, needs guidance"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const getStatusBadge = (status) => {
    const variants = {
      "Hot": "danger",
      "Warm": "warning", 
      "Cold": "secondary",
      "Converted": "success"
    };
    return variants[status] || "secondary";
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      "High": "danger",
      "Medium": "warning",
      "Low": "success"
    };
    return variants[priority] || "secondary";
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === "Hot").length;
  const warmLeads = leads.filter(l => l.status === "Warm").length;
  const coldLeads = leads.filter(l => l.status === "Cold").length;
  const avgScore = Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length);

  return (
    <div className="leads-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Lead Management</h2>
            <p>Track and manage your property leads effectively</p>
          </div>
          <div className="header-actions">
            <Button variant="primary">
              <CIcon icon={cilPlus} className="me-1" />
              Add New Lead
            </Button>
          </div>
        </div>
      </div>

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
                  <small className="stat-change text-success">+12 this week</small>
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
                  <CIcon icon={cilStar} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Hot Leads</h6>
                  <h3 className="stat-value">{hotLeads}</h3>
                  <small className="stat-change text-success">{Math.round((hotLeads/totalLeads)*100)}% of total</small>
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
                  <CIcon icon={cilStar} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Warm Leads</h6>
                  <h3 className="stat-value">{warmLeads}</h3>
                  <small className="stat-change text-warning">{Math.round((warmLeads/totalLeads)*100)}% of total</small>
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
                  <h6 className="stat-title">Avg. Score</h6>
                  <h3 className="stat-value">{avgScore}</h3>
                  <small className="stat-change text-success">+5 this month</small>
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
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <CIcon icon={cilSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search leads by name, email, or phone..."
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
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
                <option value="Converted">Converted</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="outline-secondary" className="w-100">
                <CIcon icon={cilFilter} className="me-1" />
                More Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Leads Table */}
      <Card className="leads-table-card">
        <Card.Header>
          <h5 className="mb-0">All Leads ({filteredLeads.length})</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Property Interest</th>
                  <th>Score</th>
                  <th>Last Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => (
                  <tr key={lead.id}>
                    <td>
                      <div>
                        <h6 className="mb-1">{lead.name}</h6>
                        <small className="text-muted">ID: #{lead.id}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="d-flex align-items-center mb-1">
                          <CIcon icon={cilEnvelopeOpen} className="me-1 text-muted" />
                          <small>{lead.email}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <CIcon icon={cilPhone} className="me-1 text-muted" />
                          <small>{lead.phone}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info">{lead.source}</Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusBadge(lead.status)}>{lead.status}</Badge>
                    </td>
                    <td>
                      <Badge bg={getPriorityBadge(lead.priority)}>{lead.priority}</Badge>
                    </td>
                    <td>
                      <div>
                        <div>{lead.propertyType}</div>
                        <small className="text-muted">{lead.budget}</small>
                      </div>
                    </td>
                    <td>
                      <div className="score-badge">
                        <span className="score-number">{lead.score}</span>
                        <div className="score-bar">
                          <div 
                            className="score-fill" 
                            style={{ width: `${lead.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{new Date(lead.lastContact).toLocaleDateString()}</div>
                        <small className="text-muted">Next: {new Date(lead.nextFollowUp).toLocaleDateString()}</small>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleViewLead(lead)}
                        >
                          <CIcon icon={cilViewModule} />
                        </Button>
                        <Button variant="outline-secondary" size="sm" className="me-1">
                          <CIcon icon={cilPencil} />
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          <CIcon icon={cilTrash} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Lead Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lead Details - {selectedLead?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLead && (
            <Row className="g-4">
              <Col md={6}>
                <h6>Contact Information</h6>
                <div className="contact-info">
                  <div className="contact-item">
                    <CIcon icon={cilEnvelopeOpen} className="me-2" />
                    {selectedLead.email}
                  </div>
                  <div className="contact-item">
                    <CIcon icon={cilPhone} className="me-2" />
                    {selectedLead.phone}
                  </div>
                  <div className="contact-item">
                    <CIcon icon={cilLocationPin} className="me-2" />
                    {selectedLead.location}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <h6>Lead Information</h6>
                <div className="lead-info">
                  <div className="info-item">
                    <strong>Status:</strong> <Badge bg={getStatusBadge(selectedLead.status)}>{selectedLead.status}</Badge>
                  </div>
                  <div className="info-item">
                    <strong>Priority:</strong> <Badge bg={getPriorityBadge(selectedLead.priority)}>{selectedLead.priority}</Badge>
                  </div>
                  <div className="info-item">
                    <strong>Source:</strong> <Badge bg="info">{selectedLead.source}</Badge>
                  </div>
                  <div className="info-item">
                    <strong>Score:</strong> {selectedLead.score}/100
                  </div>
                </div>
              </Col>
              <Col md={12}>
                <h6>Property Interest</h6>
                <div className="property-interest">
                  <div className="interest-item">
                    <strong>Type:</strong> {selectedLead.propertyType}
                  </div>
                  <div className="interest-item">
                    <strong>Budget:</strong> {selectedLead.budget}
                  </div>
                  <div className="interest-item">
                    <strong>Location:</strong> {selectedLead.location}
                  </div>
                </div>
              </Col>
              <Col md={12}>
                <h6>Timeline</h6>
                <div className="timeline-info">
                  <div className="timeline-item">
                    <CIcon icon={cilCalendar} className="me-2" />
                    <strong>Last Contact:</strong> {new Date(selectedLead.lastContact).toLocaleDateString()}
                  </div>
                  <div className="timeline-item">
                    <CIcon icon={cilCalendar} className="me-2" />
                    <strong>Next Follow-up:</strong> {new Date(selectedLead.nextFollowUp).toLocaleDateString()}
                  </div>
                </div>
              </Col>
              <Col md={12}>
                <h6>Notes</h6>
                <p className="lead-notes">{selectedLead.notes}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            <CIcon icon={cilPencil} className="me-1" />
            Edit Lead
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .leads-page {
          padding: 2rem;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-title h2 {
          margin: 0;
          font-weight: 700;
          font-size: 2rem;
        }

        .header-title p {
          margin: 0.5rem 0 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .stat-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          background: white;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        }

        .stat-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .stat-icon.hot {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        .stat-icon.warm {
          background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
        }

        .stat-title {
          color: #6c757d;
          font-size: 0.875rem;
          font-weight: 500;
          margin: 0;
        }

        .stat-value {
          color: #212529;
          font-weight: 700;
          font-size: 1.75rem;
          margin: 0.25rem 0;
        }

        .stat-change {
          font-size: 0.75rem;
          font-weight: 600;
        }

        .leads-table-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          background: white;
        }

        .leads-table-card .card-header {
          background: transparent;
          border-bottom: 1px solid #e9ecef;
          padding: 1.25rem;
        }

        .table th {
          border-top: none;
          font-weight: 600;
          color: #495057;
          font-size: 0.875rem;
        }

        .table td {
          vertical-align: middle;
          border-top: 1px solid #e9ecef;
        }

        .score-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .score-number {
          font-weight: 600;
          color: #495057;
        }

        .score-bar {
          width: 40px;
          height: 6px;
          background: #e9ecef;
          border-radius: 3px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          background: linear-gradient(90deg, #28a745 0%, #ffc107 70%, #dc3545 100%);
          transition: width 0.3s ease;
        }

        .action-buttons {
          display: flex;
          gap: 0.25rem;
        }

        .action-buttons .btn {
          padding: 0.375rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-info, .lead-info, .property-interest, .timeline-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .contact-item, .info-item, .interest-item, .timeline-item {
          display: flex;
          align-items: center;
          font-size: 0.9rem;
        }

        .lead-notes {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #667eea;
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

          .action-buttons {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
