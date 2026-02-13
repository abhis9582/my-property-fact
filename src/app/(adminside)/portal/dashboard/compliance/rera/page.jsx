"use client";
import { useState, useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Form,
  Alert,
  Badge,
  Table,
  Modal,
  Spinner
} from "react-bootstrap";
import { 
  cilIdCard, 
  cilShieldAlt, 
  cilCheck,
  cilX,
  cilWarning,
  cilPlus,
  cilPencil,
  cilTrash,
  cilInfo,
  cilLocationPin,
  cilCalendar,
  cilCheckCircle,
  cilClock
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import Cookies from "js-cookie";
import "../../../_components/PortalCommonStyles.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

export default function RERAPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRera, setSelectedRera] = useState(null);
  const [reraCredentials, setReraCredentials] = useState([]);
  
  const [formData, setFormData] = useState({
    reraId: "",
    reraState: "",
    registrationNumber: "",
    registrationDate: "",
    expiryDate: "",
    status: "Active",
    documentUrl: "",
    notes: ""
  });

  // Indian states for RERA
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];

  useEffect(() => {
    fetchReraCredentials();
  }, []);

  const fetchReraCredentials = async () => {
    try {
      setLoading(true);
      setError(null);
      // const response = await axios.get(`${API_BASE_URL}user/rera-credentials`, {
      //   withCredentials: true,
      // });

      // if (response.status === 200 && Array.isArray(response.data)) {
      //   setReraCredentials(response.data);
      // } else {
      //   setReraCredentials([]);
      // }
      setLoading(false);
    } catch (err) {
      setReraCredentials([
        {
          id: 1,
          reraId: "RERA/2023/001234",
          reraState: "Maharashtra",
          registrationNumber: "REG/MAH/2023/1234",
          registrationDate: "2023-01-15",
          expiryDate: "2026-01-15",
          status: "Active",
          documentUrl: "",
          notes: "Primary RERA registration",
          createdAt: "2023-01-15T10:00:00"
        }
      ]);
      console.error("Error fetching RERA credentials:", err);
      // setError(err.message || "Failed to load RERA credentials. Please try again.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRera = () => {
    setFormData({
      reraId: "",
      reraState: "",
      registrationNumber: "",
      registrationDate: "",
      expiryDate: "",
      status: "Active",
      documentUrl: "",
      notes: ""
    });
    setSelectedRera(null);
    setShowAddModal(true);
  };

  const handleEditRera = (rera) => {
    setFormData({
      reraId: rera.reraId || "",
      reraState: rera.reraState || "",
      registrationNumber: rera.registrationNumber || "",
      registrationDate: rera.registrationDate || "",
      expiryDate: rera.expiryDate || "",
      status: rera.status || "Active",
      documentUrl: rera.documentUrl || "",
      notes: rera.notes || ""
    });
    setSelectedRera(rera);
    setShowEditModal(true);
  };

  const handleDeleteRera = (rera) => {
    setSelectedRera(rera);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = Cookies.get("token");
      
      if (!token) {
        setError("Please login to save RERA credentials");
        setSaving(false);
        return;
      }

      const apiUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      
      // TODO: Replace with actual API endpoint when backend is ready
      // const url = selectedRera 
      //   ? `${apiUrl}/api/user/rera-credentials/${selectedRera.id}`
      //   : `${apiUrl}/api/user/rera-credentials`;
      // 
      // const method = selectedRera ? "PUT" : "POST";
      // 
      // const response = await fetch(url, {
      //   method: method,
      //   headers: {
      //     "Authorization": `Bearer ${token}`,
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success - replace with actual API response handling
      setSuccess(selectedRera ? "RERA credential updated successfully!" : "RERA credential added successfully!");
      
      // Refresh the list
      await fetchReraCredentials();
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedRera(null);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving RERA credential:", err);
      setError(err.message || "Failed to save RERA credential. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedRera) return;

    setSaving(true);
    setError(null);

    try {
      const token = Cookies.get("token");
      
      if (!token) {
        setError("Please login to delete RERA credentials");
        setSaving(false);
        return;
      }

      const apiUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      
      // TODO: Replace with actual API endpoint when backend is ready
      // const response = await fetch(`${apiUrl}/api/user/rera-credentials/${selectedRera.id}`, {
      //   method: "DELETE",
      //   headers: {
      //     "Authorization": `Bearer ${token}`,
      //     "Content-Type": "application/json"
      //   }
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSuccess("RERA credential deleted successfully!");
      await fetchReraCredentials();
      setShowDeleteModal(false);
      setSelectedRera(null);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting RERA credential:", err);
      setError(err.message || "Failed to delete RERA credential. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      "Active": "success",
      "Expired": "danger",
      "Pending": "warning",
      "Inactive": "secondary"
    };
    return variants[status] || "secondary";
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // Calculate statistics
  const stats = {
    total: reraCredentials.length,
    active: reraCredentials.filter(r => r.status === "Active" && !isExpired(r.expiryDate)).length,
    expired: reraCredentials.filter(r => isExpired(r.expiryDate)).length,
    pending: reraCredentials.filter(r => r.status === "Pending").length
  };

  return (
    <div className="portal-content">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h2>RERA Credentials</h2>
            <p>Manage your RERA registration credentials and compliance documents</p>
          </div>
          <div className="header-actions">
            <Button 
              variant="light"
              onClick={handleAddRera}
              className="d-flex align-items-center gap-2"
            >
              <CIcon icon={cilPlus} />
              Add RERA Credential
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon primary">
                  <CIcon icon={cilIdCard} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Total Credentials</h6>
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <h3 className="stat-value">{stats.total}</h3>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon success">
                  <CIcon icon={cilCheckCircle} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Active</h6>
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <h3 className="stat-value">{stats.active}</h3>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon warning">
                  <CIcon icon={cilClock} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Pending</h6>
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <h3 className="stat-value">{stats.pending}</h3>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6}>
          <Card className="stat-card h-100">
            <Card.Body>
              <div className="stat-content">
                <div className="stat-icon" style={{ background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)" }}>
                  <CIcon icon={cilWarning} />
                </div>
                <div className="stat-info">
                  <h6 className="stat-title">Expired</h6>
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    <h3 className="stat-value">{stats.expired}</h3>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
          <CIcon icon={cilWarning} className="me-2" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)} className="mb-4">
          <CIcon icon={cilCheck} className="me-2" />
          {success}
        </Alert>
      )}

      {loading ? (
        <Card className="dashboard-card">
          <Card.Body>
            <div className="loading-container">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3 text-muted">Loading RERA credentials...</p>
            </div>
          </Card.Body>
        </Card>
      ) : reraCredentials.length === 0 ? (
        <Card className="dashboard-card">
          <Card.Body className="text-center py-5">
            <CIcon icon={cilIdCard} size="3xl" className="text-muted mb-3" />
            <h5 className="mb-2">No RERA Credentials Found</h5>
            <p className="text-muted mb-4">
              Add your RERA registration credentials to ensure compliance and build trust with clients.
            </p>
            <Button variant="primary" onClick={handleAddRera}>
              <CIcon icon={cilPlus} className="me-2" />
              Add Your First RERA Credential
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Card className="dashboard-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">RERA Credentials</h5>
              <small className="text-muted">
                Showing {reraCredentials.length} credential{reraCredentials.length !== 1 ? 's' : ''}
              </small>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table hover className="portal-table">
                <thead>
                  <tr>
                    <th>RERA ID</th>
                    <th>State</th>
                    <th>Registration Number</th>
                    <th>Registration Date</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reraCredentials.map((rera) => {
                    const expired = isExpired(rera.expiryDate);
                    return (
                      <tr key={rera.id} className={expired ? "table-warning" : ""}>
                        <td>
                          <div className="d-flex align-items-center">
                            <strong>{rera.reraId}</strong>
                            {expired && (
                              <Badge bg="danger" className="ms-2">
                                <CIcon icon={cilWarning} className="me-1" />
                                Expired
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <CIcon icon={cilLocationPin} className="me-1 text-muted" />
                            {rera.reraState}
                          </div>
                        </td>
                        <td>
                          <span className={rera.registrationNumber ? "" : "text-muted"}>
                            {rera.registrationNumber || "N/A"}
                          </span>
                        </td>
                        <td>
                          {rera.registrationDate 
                            ? new Date(rera.registrationDate).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })
                            : <span className="text-muted">N/A</span>}
                        </td>
                        <td>
                          {rera.expiryDate 
                            ? (
                              <span className={expired ? "text-danger fw-semibold" : ""}>
                                {new Date(rera.expiryDate).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            )
                            : <span className="text-muted">N/A</span>}
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(rera.status)}>
                            {rera.status}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditRera(rera)}
                              title="Edit"
                            >
                              <CIcon icon={cilPencil} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteRera(rera)}
                              title="Delete"
                            >
                              <CIcon icon={cilTrash} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        show={showAddModal || showEditModal} 
        onHide={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedRera(null);
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="d-flex align-items-center">
            <CIcon icon={cilIdCard} className="me-2" />
            {selectedRera ? "Edit RERA Credential" : "Add RERA Credential"}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ padding: '1.5rem' }}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold d-flex align-items-center">
                    <CIcon icon={cilIdCard} className="me-2" />
                    RERA ID <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="reraId"
                    value={formData.reraId}
                    onChange={handleInputChange}
                    placeholder="e.g., RERA/2023/001234"
                    required
                  />
                  <Form.Text className="text-muted small">
                    Your unique RERA registration ID
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold d-flex align-items-center">
                    <CIcon icon={cilLocationPin} className="me-2" />
                    RERA State <span className="text-danger ms-1">*</span>
                  </Form.Label>
                  <Form.Select
                    name="reraState"
                    value={formData.reraState}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Registration Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., REG/MAH/2023/1234"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold d-flex align-items-center">
                    <CIcon icon={cilCheckCircle} className="me-2" />
                    Status
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Expired">Expired</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-2" />
                    Registration Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="registrationDate"
                    value={formData.registrationDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold d-flex align-items-center">
                    <CIcon icon={cilCalendar} className="me-2" />
                    Expiry Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                  {formData.expiryDate && isExpired(formData.expiryDate) && (
                    <Form.Text className="text-danger d-flex align-items-center mt-1">
                      <CIcon icon={cilWarning} className="me-1" />
                      This credential has expired
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Document URL</Form.Label>
              <Form.Control
                type="url"
                name="documentUrl"
                value={formData.documentUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/rera-certificate.pdf"
              />
              <Form.Text className="text-muted small">
                Link to your RERA registration certificate or document
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes or comments..."
              />
            </Form.Group>

            <Alert variant="info" className="mb-0">
              <CIcon icon={cilInfo} className="me-2" />
              <strong>RERA Compliance:</strong> Ensure your RERA credentials are up-to-date and valid. 
              Expired credentials may affect your ability to list properties in certain states.
            </Alert>
          </Modal.Body>
          <Modal.Footer className="border-top">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setSelectedRera(null);
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                <>
                  <CIcon icon={cilCheck} className="me-2" />
                  {selectedRera ? "Update" : "Add"} Credential
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Are you sure you want to delete this RERA credential?</p>
          {selectedRera && (
            <div className="bg-light p-3 rounded mb-3">
              <div className="mb-2">
                <strong>RERA ID:</strong> {selectedRera.reraId}
              </div>
              <div>
                <strong>State:</strong> {selectedRera.reraState}
              </div>
            </div>
          )}
          <Alert variant="warning" className="mb-0">
            <CIcon icon={cilWarning} className="me-2" />
            This action cannot be undone.
          </Alert>
        </Modal.Body>
        <Modal.Footer className="border-top">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <CIcon icon={cilTrash} className="me-2" />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

