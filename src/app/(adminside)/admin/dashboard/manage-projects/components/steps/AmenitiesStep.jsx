"use client";
import { useState, useEffect, useRef } from "react";
import { Form, Alert } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import axios from "axios";
import { toast } from "react-toastify";

export default function AmenitiesStep({
  projectId,
  amenityList = [],
  onComplete,
  initialData = {},
  isActive = false, // Only load when step is active
}) {
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasInitializedRef = useRef(false);
  const lastProjectIdRef = useRef(null);

  useEffect(() => {
    // Reset if projectId changed
    if (lastProjectIdRef.current !== projectId) {
      hasInitializedRef.current = false;
      lastProjectIdRef.current = projectId;
      setSelectedAmenities([]); // Clear previous data
    }

    // Don't load if step is not active
    if (!isActive) return;

    // Only initialize once per projectId
    if (hasInitializedRef.current) return;

    // Initialize from initialData if available (from projectData)
    const projectAmenityList = initialData?.projectAmenityList;
    const amenitiesList = initialData?.amenities;
    
    if (projectAmenityList && Array.isArray(projectAmenityList) && projectAmenityList.length > 0) {
      const projectAmenities = projectAmenityList.map(amenity => ({
        id: amenity.id,
        title: amenity.title
      }));
      setSelectedAmenities(projectAmenities);
      if (onComplete) {
        onComplete({ amenities: projectAmenities });
      }
      hasInitializedRef.current = true;
      return;
    }

    // Initialize from mapped initialData if available
    if (amenitiesList && Array.isArray(amenitiesList) && amenitiesList.length > 0) {
      setSelectedAmenities(amenitiesList);
      if (onComplete) {
        onComplete({ amenities: amenitiesList });
      }
      hasInitializedRef.current = true;
      return;
    }

    // Load from API only if projectId exists and we haven't initialized yet
    if (projectId) {
      loadProjectAmenities();
    } else {
      setSelectedAmenities([]);
      hasInitializedRef.current = true;
    }
  }, [projectId, isActive]); // Depend on isActive to load when step becomes active

  const loadProjectAmenities = async () => {
    if (!projectId || hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    
    try {
      setLoading(true);
      setError(null);
      // Fetch project details to get amenities
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/get-by-id/${projectId}`
      );
      
      if (response.data) {
        const amenityList = response.data.projectAmenityList || [];
        const projectAmenities = amenityList.map(amenity => ({
          id: amenity.id,
          title: amenity.title
        }));
        setSelectedAmenities(projectAmenities);
        if (onComplete) {
          onComplete({ amenities: projectAmenities });
        }
      }
    } catch (error) {
      console.error("Failed to load amenities:", error);
      setError("Failed to load existing amenities. Please try again.");
      hasInitializedRef.current = false; // Allow retry on error
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (list) => {
    setSelectedAmenities(list);
    setError(null);
    // Call onComplete when user changes selection
    if (onComplete) {
      onComplete({ amenities: list });
    }
  };

  if (!projectId) {
    return (
      <div>
        <h4 className="mb-4">Project Amenities</h4>
        <Alert variant="info">
          Please complete the Basic Info step first to add amenities.
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4">Project Amenities</h4>
      
      {error && (
        <Alert variant="warning" className="mb-3" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">
          Select Amenities <span className="text-danger">*</span>
        </Form.Label>
        {loading ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <Multiselect
              options={amenityList}
              selectedValues={selectedAmenities}
              onSelect={handleChange}
              onRemove={handleChange}
              displayValue="title"
              placeholder="Select amenities"
              showCheckbox
              emptyRecordMsg="No amenities available"
              loadingMessage="Loading amenities..."
            />
            {selectedAmenities.length === 0 && (
              <Form.Text className="text-muted">
                Select at least one amenity for your project.
              </Form.Text>
            )}
          </>
        )}
      </Form.Group>

      <small className="text-muted d-block mt-2">
        Changes are saved locally. Use &quot;Save Draft&quot; or &quot;Publish&quot; button in header to save.
      </small>
    </div>
  );
}
