"use client";
import { useState, useEffect, useRef } from "react";
import { Form, Button, Alert, Modal, ListGroup } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function FloorPlansStep({
  projectId,
  onComplete,
  initialData = {},
  isActive = false,
}) {
  const [floorPlans, setFloorPlans] = useState([]);
  const [planType, setPlanType] = useState("");
  const [area, setArea] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasInitializedRef = useRef(false);
  const lastProjectIdRef = useRef(null);

  useEffect(() => {
    // Reset if projectId changed
    if (lastProjectIdRef.current !== projectId) {
      hasInitializedRef.current = false;
      lastProjectIdRef.current = projectId;
      setFloorPlans([]);
    }

    // Don't load if step is not active
    if (!isActive) return;
    
    // Only initialize once
    if (hasInitializedRef.current) return;

    // Initialize from initialData if available (from projectData)
    if (initialData?.projectFloorPlanList && Array.isArray(initialData.projectFloorPlanList) && initialData.projectFloorPlanList.length > 0) {
      const plans = initialData.projectFloorPlanList.map(plan => ({
        id: plan.id,
        planType: plan.planType,
        areaSqft: plan.areaSqft || plan.areaSqFt,
        areaSqMt: plan.areaSqMt
      }));
      setFloorPlans(plans);
      hasInitializedRef.current = true;
      return;
    } else if (initialData?.floorPlans && Array.isArray(initialData.floorPlans) && initialData.floorPlans.length > 0) {
      // Handle if data is already in floorPlans format
      setFloorPlans(initialData.floorPlans);
      hasInitializedRef.current = true;
      return;
    }

    // Load from API only if projectId exists
    if (projectId) {
      loadFloorPlans();
    } else {
      setFloorPlans([]);
      hasInitializedRef.current = true;
    }
  }, [projectId, isActive]); // Only depend on projectId and isActive

  const loadFloorPlans = async () => {
    if (!projectId || hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/get-by-id/${projectId}`
      );
      
      if (response.data) {
        const plans = response.data.projectFloorPlanList || response.data.floorPlans || [];
        const mappedPlans = plans.map(plan => ({
          id: plan.id,
          planType: plan.planType,
          areaSqft: plan.areaSqft || plan.areaSqFt,
          areaSqMt: plan.areaSqMt
        }));
        setFloorPlans(mappedPlans);
        if (onComplete) {
          onComplete({ floorPlans: mappedPlans });
        }
      }
    } catch (error) {
      console.error("Failed to load floor plans:", error);
      setError("Failed to load existing floor plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = () => {
    setPlanType("");
    setArea("");
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditPlan = (plan) => {
    setPlanType(plan.planType || "");
    setArea(plan.areaSqft || plan.areaSqFt || "");
    setEditingId(plan.id);
    setShowModal(true);
  };

  const handleSavePlan = async () => {
    if (!planType.trim()) {
      toast.error("Plan type is required");
      return;
    }
    if (!area || isNaN(area) || parseFloat(area) <= 0) {
      toast.error("Please enter a valid area in square feet");
      return;
    }

    try {
      setLoading(true);
      const data = {
        projectId: projectId,
        planType: planType.trim(),
        areaSqFt: parseFloat(area),
        floorId: editingId || 0,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}floor-plans/add-update`,
        data
      );

      if (response.data.isSuccess === 1) {
        toast.success(response.data.message || "Floor plan saved successfully");
        setShowModal(false);
        hasInitializedRef.current = false; // Reset to allow reload
        loadFloorPlans();
      } else {
        toast.error(response.data.message || "Failed to save floor plan");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An error occurred while saving the floor plan. Please try again.";
      toast.error(errorMessage);
      console.error("Error saving floor plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this floor plan?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}floor-plans/delete/${id}`
      );

      if (response.data.isSuccess === 1) {
        toast.success(response.data.message || "Floor plan deleted successfully");
        hasInitializedRef.current = false; // Reset to allow reload
        loadFloorPlans();
      } else {
        toast.error(response.data.message || "Failed to delete floor plan");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An error occurred while deleting the floor plan. Please try again.";
      toast.error(errorMessage);
      console.error("Error deleting floor plan:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!projectId) {
    return (
      <div>
        <h4 className="mb-4">Floor Plans</h4>
        <Alert variant="info">
          Please complete the Basic Info step first to add floor plans.
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Floor Plans</h4>
        <Button variant="success" size="sm" onClick={handleAddPlan}>
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Add Floor Plan
        </Button>
      </div>

      {error && (
        <Alert variant="warning" className="mb-3" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && floorPlans.length === 0 ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : floorPlans.length === 0 ? (
        <Alert variant="info">
          No floor plans added yet. Click &quot;Add Floor Plan&quot; to get started.
        </Alert>
      ) : (
        <ListGroup>
          {floorPlans.map((plan, index) => (
            <ListGroup.Item
              key={plan.id || index}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{plan.planType}</strong> - {plan.areaSqft || plan.areaSqFt} sq.ft
                {plan.areaSqMt && ` (${parseFloat(plan.areaSqMt).toFixed(2)} sq.mt)`}
              </div>
              <div>
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditPlan(plan)}
                >
                  <FontAwesomeIcon icon={faPencil} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <small className="text-muted d-block mt-3">
        Changes are saved immediately. Use &quot;Save Draft&quot; or &quot;Publish&quot; button in header to save the project.
      </small>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Floor Plan" : "Add Floor Plan"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Plan Type <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., 2 BHK, 3 BHK, Studio"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                required
              />
              <Form.Text className="text-muted">
                Enter the type of floor plan (e.g., 2 BHK, 3 BHK)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Area (sq.ft) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter area in square feet"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                min="0"
              />
              <Form.Text className="text-muted">
                Enter the area in square feet. Square meters will be calculated automatically.
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="success"
                onClick={handleSavePlan}
                disabled={loading || !planType.trim() || !area || isNaN(area)}
              >
                {loading ? "Saving..." : editingId ? "Update" : "Add"} Plan
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
