"use client";
import { useState, useEffect, useRef } from "react";
import { Form, Button, Alert, Modal, ListGroup, Row, Col } from "react-bootstrap";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function LocationBenefitsStep({
  projectId,
  onComplete,
  initialData = {},
  isActive = false,
}) {
  const [benefits, setBenefits] = useState([]);
  const [masterBenefits, setMasterBenefits] = useState([]);
  const [benefitName, setBenefitName] = useState("");
  const [distance, setDistance] = useState("");
  const [selectedMasterBenefit, setSelectedMasterBenefit] = useState(null);
  const [iconImage, setIconImage] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showMasterBenefitModal, setShowMasterBenefitModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMasterBenefits, setLoadingMasterBenefits] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const lastProjectIdRef = useRef(null);

  useEffect(() => {
    // Reset if projectId changed
    if (lastProjectIdRef.current !== projectId) {
      hasInitializedRef.current = false;
      lastProjectIdRef.current = projectId;
      setBenefits([]);
    }

    // Don't load if step is not active
    if (!isActive) return;
    
    // Only initialize once
    if (hasInitializedRef.current) return;

    // Load master benefits
    loadMasterBenefits();

    // Initialize from initialData if available (from projectData)
    if (initialData?.projectLocationBenefitList && Array.isArray(initialData.projectLocationBenefitList) && initialData.projectLocationBenefitList.length > 0) {
      const benefits = initialData.projectLocationBenefitList.map(benefit => ({
        id: benefit.id,
        benefitName: benefit.benefitName,
        distance: benefit.distance,
        iconImage: benefit.image || benefit.iconImage
      }));
      setBenefits(benefits);
      hasInitializedRef.current = true;
      return;
    } else if (initialData?.locationBenefits && Array.isArray(initialData.locationBenefits) && initialData.locationBenefits.length > 0) {
      // Handle if data is already in locationBenefits format
      setBenefits(initialData.locationBenefits);
      hasInitializedRef.current = true;
      return;
    }

    // Load from API only if projectId exists
    if (projectId) {
      loadLocationBenefits();
    } else {
      setBenefits([]);
      hasInitializedRef.current = true;
    }
  }, [projectId, isActive]); // Only depend on projectId and isActive

  const loadMasterBenefits = async () => {
    try {
      setLoadingMasterBenefits(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}benefit`
      );
      if (response.data && Array.isArray(response.data)) {
        setMasterBenefits(response.data);
      }
    } catch (error) {
      console.error("Failed to load master benefits:", error);
      toast.error("Failed to load nearby benefits. Please try again.");
    } finally {
      setLoadingMasterBenefits(false);
    }
  };

  const loadLocationBenefits = async () => {
    if (!projectId || hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/get-by-id/${projectId}`
      );
      
      if (response.data) {
        const benefits = response.data.projectLocationBenefitList || response.data.locationBenefits || [];
        const mappedBenefits = benefits.map(benefit => ({
          id: benefit.id,
          benefitName: benefit.benefitName,
          distance: benefit.distance,
          iconImage: benefit.image || benefit.iconImage
        }));
        setBenefits(mappedBenefits);
        if (onComplete) {
          onComplete({ locationBenefits: mappedBenefits });
        }
      }
    } catch (error) {
      console.error("Failed to load location benefits:", error);
      setError("Failed to load existing location benefits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBenefit = () => {
    setSelectedMasterBenefit(null);
    setBenefitName("");
    setDistance("");
    setIconImage(null);
    setIconPreview(null);
    setEditingId(null);
    setShowMasterBenefitModal(true);
  };

  const handleSelectMasterBenefit = (masterBenefit) => {
    setSelectedMasterBenefit(masterBenefit);
    setShowMasterBenefitModal(false);
    setShowDetailsModal(true);
    // Pre-fill benefit name with master benefit name
    setBenefitName(masterBenefit.benefitName || "");
    // If master benefit has an icon, set it as preview (user can still upload custom)
    if (masterBenefit.benefitIcon) {
      setIconPreview(`${process.env.NEXT_PUBLIC_IMAGE_URL}nearby-benefit/${masterBenefit.benefitIcon}`);
      setIconImage(null); // Clear any previous custom icon
    }
  };

  const handleEditBenefit = (benefit) => {
    setBenefitName(benefit.benefitName || "");
    setDistance(benefit.distance || "");
    setEditingId(benefit.id);
    setIconImage(null);
    setSelectedMasterBenefit(null);
    
    // Load preview if editing
    if (benefit.iconImage) {
      const project = initialData;
      const slugURL = project?.slugURL || project?.slugurl;
      if (slugURL) {
        setIconPreview(`${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${slugURL}/${benefit.iconImage}`);
      }
    }
    
    setShowDetailsModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      setIconImage(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveBenefit = async () => {
    if (!benefitName.trim()) {
      toast.error("Benefit name is required");
      return;
    }
    if (!distance || isNaN(distance) || parseFloat(distance) <= 0) {
      toast.error("Please enter a valid distance in kilometers");
      return;
    }
    if (!editingId && !selectedMasterBenefit) {
      toast.error("Please select a benefit type");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("benefitName", benefitName.trim());
      formData.append("distance", parseFloat(distance).toString());
      formData.append("projectId", projectId.toString());
      
      // For new benefits, download master benefit icon if no custom icon uploaded
      if (!editingId && selectedMasterBenefit && selectedMasterBenefit.benefitIcon) {
        if (iconImage) {
          // User uploaded custom icon
          formData.append("iconImage", iconImage);
        } else {
          // Download master benefit icon and convert to file
          try {
            const iconUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}nearby-benefit/${selectedMasterBenefit.benefitIcon}`;
            const iconResponse = await fetch(iconUrl);
            const blob = await iconResponse.blob();
            const fileName = selectedMasterBenefit.benefitIcon;
            const file = new File([blob], fileName, { type: blob.type });
            formData.append("iconImage", file);
          } catch (iconError) {
            console.error("Error downloading master benefit icon:", iconError);
            toast.error("Failed to load benefit icon. Please try uploading a custom icon.");
            setLoading(false);
            return;
          }
        }
      } else if (iconImage) {
        // Editing or custom icon provided
        formData.append("iconImage", iconImage);
      }
      
      if (editingId) {
        formData.append("id", editingId.toString());
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}location-benefit/add-new`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.isSuccess === 1) {
        toast.success(response.data.message || "Location benefit saved successfully");
        setShowDetailsModal(false);
        setShowMasterBenefitModal(false);
        // Revoke preview URL
        if (iconPreview && iconPreview.startsWith('blob:')) {
          URL.revokeObjectURL(iconPreview);
        }
        setIconPreview(null);
        setIconImage(null);
        setSelectedMasterBenefit(null);
        setBenefitName("");
        setDistance("");
        hasInitializedRef.current = false; // Reset to allow reload
        loadLocationBenefits();
      } else {
        toast.error(response.data.message || "Failed to save location benefit");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An error occurred while saving the location benefit. Please try again.";
      toast.error(errorMessage);
      console.error("Error saving location benefit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBenefit = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location benefit?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}location-benefit/delete/${id}`
      );

      if (response.data.isSuccess === 1) {
        toast.success(response.data.message || "Location benefit deleted successfully");
        hasInitializedRef.current = false; // Reset to allow reload
        loadLocationBenefits();
      } else {
        toast.error(response.data.message || "Failed to delete location benefit");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An error occurred while deleting the location benefit. Please try again.";
      toast.error(errorMessage);
      console.error("Error deleting location benefit:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!projectId) {
    return (
      <div>
        <h4 className="mb-4">Location Benefits</h4>
        <Alert variant="info">
          Please complete the Basic Info step first to add location benefits.
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Location Benefits</h4>
        <Button variant="success" size="sm" onClick={handleAddBenefit}>
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Add Location Benefit
        </Button>
      </div>

      {error && (
        <Alert variant="warning" className="mb-3" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && benefits.length === 0 ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : benefits.length === 0 ? (
        <Alert variant="info">
          No location benefits added yet. Click &quot;Add Location Benefit&quot; to get started.
        </Alert>
      ) : (
        <ListGroup>
          {benefits.map((benefit, index) => {
            const project = initialData;
            const slugURL = project?.slugURL || project?.slugurl;
            const iconUrl = benefit.iconImage && slugURL
              ? `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${slugURL}/${benefit.iconImage}`
              : null;

            return (
              <ListGroup.Item
                key={benefit.id || index}
                className="d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-3">
                  {iconUrl && (
                    <Image
                      src={iconUrl}
                      alt={benefit.benefitName}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  )}
                  <div>
                    <strong>{benefit.benefitName}</strong>
                    {benefit.distance && (
                      <span className="text-muted ms-2">({benefit.distance} km)</span>
                    )}
                  </div>
                </div>
                <div>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditBenefit(benefit)}
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteBenefit(benefit.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}

      <small className="text-muted d-block mt-3">
        Changes are saved immediately. Use &quot;Save Draft&quot; or &quot;Publish&quot; button in header to save the project.
      </small>

      {/* Master Benefit Selection Modal */}
      <Modal 
        show={showMasterBenefitModal} 
        onHide={() => setShowMasterBenefitModal(false)} 
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Nearby Benefit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingMasterBenefits ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : masterBenefits.length === 0 ? (
            <Alert variant="info">No nearby benefits available. Please contact administrator.</Alert>
          ) : (
            <Row className="g-3">
              {masterBenefits.map((benefit) => {
                const iconUrl = benefit.benefitIcon
                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}nearby-benefit/${benefit.benefitIcon}`
                  : null;
                
                return (
                  <Col xs={6} sm={4} md={3} key={benefit.id}>
                    <div
                      className="border rounded p-3 text-center cursor-pointer benefit-card"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        height: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      onClick={() => handleSelectMasterBenefit(benefit)}
                    >
                      {iconUrl && (
                        <div className="mb-2">
                          <Image
                            src={iconUrl}
                            alt={benefit.benefitName || benefit.altTag || 'Benefit'}
                            width={60}
                            height={60}
                            className="rounded"
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                      )}
                      <div className="small fw-semibold">{benefit.benefitName}</div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMasterBenefitModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Details Modal - Capture Name and Distance */}
      <Modal 
        show={showDetailsModal} 
        onHide={() => {
          setShowDetailsModal(false);
          setSelectedMasterBenefit(null);
          if (iconPreview && iconPreview.startsWith('blob:')) {
            URL.revokeObjectURL(iconPreview);
          }
          setIconPreview(null);
          setIconImage(null);
        }} 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Edit Location Benefit" : selectedMasterBenefit ? `Add ${selectedMasterBenefit.benefitName}` : "Add Location Benefit"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMasterBenefit && (
            <div className="mb-3 p-3 bg-light rounded d-flex align-items-center gap-3">
              {selectedMasterBenefit.benefitIcon && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}nearby-benefit/${selectedMasterBenefit.benefitIcon}`}
                  alt={selectedMasterBenefit.benefitName}
                  width={50}
                  height={50}
                  className="rounded"
                />
              )}
              <div>
                <strong>{selectedMasterBenefit.benefitName}</strong>
                <div className="small text-muted">Selected benefit type</div>
              </div>
            </div>
          )}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                {selectedMasterBenefit ? `${selectedMasterBenefit.benefitName} Name` : "Benefit Name"} <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={selectedMasterBenefit 
                  ? `e.g., ${selectedMasterBenefit.benefitName === "Metro" ? "Rajiv Chowk Metro Station" : selectedMasterBenefit.benefitName === "School" ? "Delhi Public School" : `Specific ${selectedMasterBenefit.benefitName} Name`}`
                  : "e.g., Metro Station, Shopping Mall"}
                value={benefitName}
                onChange={(e) => setBenefitName(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Enter the specific name of the {selectedMasterBenefit?.benefitName?.toLowerCase() || 'benefit'}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Distance (km) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                placeholder="Enter approximate distance in kilometers"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
                min="0"
              />
              <Form.Text className="text-muted">
                Enter the approximate distance from the project in kilometers
              </Form.Text>
            </Form.Group>

            {!editingId && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  Icon Image {!selectedMasterBenefit?.benefitIcon && <span className="text-danger">*</span>}
                </Form.Label>
                {iconPreview && (
                  <div className="mb-2">
                    <Image
                      src={iconPreview}
                      alt="Preview"
                      width={60}
                      height={60}
                      className="rounded border"
                    />
                    {selectedMasterBenefit?.benefitIcon && iconPreview.includes('nearby-benefit') && (
                      <div className="small text-success mt-1">
                        <strong>Using default icon</strong> - You can upload a custom icon below to replace it
                      </div>
                    )}
                    {iconPreview.startsWith('blob:') && (
                      <div className="small text-info mt-1">
                        <strong>Custom icon selected</strong> - This will replace the default icon
                      </div>
                    )}
                  </div>
                )}
                {selectedMasterBenefit?.benefitIcon && !iconPreview && (
                  <div className="mb-2">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}nearby-benefit/${selectedMasterBenefit.benefitIcon}`}
                      alt="Default icon"
                      width={60}
                      height={60}
                      className="rounded border"
                    />
                    <div className="small text-success mt-1">
                      <strong>Default icon will be used</strong> - You can upload a custom icon below to replace it
                    </div>
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <Form.Text className="text-muted">
                  {selectedMasterBenefit?.benefitIcon 
                    ? "Upload a custom icon image (optional). Maximum size: 10MB. If not provided, the default icon will be used automatically."
                    : "Upload an icon image. Maximum size: 10MB."}
                </Form.Text>
              </Form.Group>
            )}

            <div className="d-flex gap-2">
              <Button
                variant="success"
                onClick={handleSaveBenefit}
                disabled={loading || !benefitName.trim() || !distance || isNaN(distance) || (!editingId && !selectedMasterBenefit)}
              >
                {loading ? "Saving..." : editingId ? "Update" : "Add"} Benefit
              </Button>
              <Button variant="secondary" onClick={() => {
                setShowDetailsModal(false);
                setSelectedMasterBenefit(null);
                if (iconPreview && iconPreview.startsWith('blob:')) {
                  URL.revokeObjectURL(iconPreview);
                }
                setIconPreview(null);
                setIconImage(null);
              }}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
