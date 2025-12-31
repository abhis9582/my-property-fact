"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/(home)/contact-us/page";
import { useRouter } from "next/navigation";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function BasicInfoStep({
  projectId,
  projectData,
  builderList = [],
  typeList = [],
  countryData = [],
  projectStatusList = [],
  onComplete,
  initialData = {},
}) {
  const router = useRouter();
  const [validated, setValidated] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: projectId || 0,
    builderId: 0,
    cityId: 0,
    stateId: 0,
    countryId: 0,
    propertyTypeId: 0,
    projectStatusId: 0,
    projectPrice: null,
    metaTitle: null,
    metaKeyword: null,
    metaDescription: null,
    projectName: null,
    slugURL: null,
    projectLocality: null,
    projectConfiguration: null,
    ivrNo: null,
    reraNo: null,
    reraQr: null,
    reraWebsite: null,
    locationMap: null,
    projectLogo: null,
    floorPlanDescription: null,
    locationDescription: null,
    amenityDescription: null,
    status: false,
    projectLogoPreview: null,
    locationMapPreview: null,
    ...initialData,
  });
  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Refs for JoditEditor instances
  const amenityDescEditorRef = useRef(null);
  const locationDescEditorRef = useRef(null);
  const floorPlanDescEditorRef = useRef(null);
  const hasLoadedProjectDataRef = useRef(false);
  
  // Memoized JoditEditor config
  const joditConfig = useMemo(() => ({
    readonly: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    disablePlugins: [],
    height: 300,
    toolbar: true,
    spellcheck: true,
  }), []);
  
  // Simplified onChange handlers for Jodit editors
  const handleAmenityDescChange = useCallback((newContent) => {
    setFormData((prev) => {
      const updated = { ...prev, amenityDescription: newContent };
      // Notify parent on change
      if (onComplete && hasLoadedProjectDataRef.current) {
        onComplete(updated);
      }
      return updated;
    });
  }, [onComplete]);
  
  const handleLocationDescChange = useCallback((newContent) => {
    setFormData((prev) => {
      const updated = { ...prev, locationDescription: newContent };
      // Notify parent on change
      if (onComplete && hasLoadedProjectDataRef.current) {
        onComplete(updated);
      }
      return updated;
    });
  }, [onComplete]);
  
  const handleFloorPlanDescChange = useCallback((newContent) => {
    setFormData((prev) => {
      const updated = { ...prev, floorPlanDescription: newContent };
      // Notify parent on change
      if (onComplete && hasLoadedProjectDataRef.current) {
        onComplete(updated);
      }
      return updated;
    });
  }, [onComplete]);

  // Load existing project data if editing (only once)
  useEffect(() => {
    if (projectData && !hasLoadedProjectDataRef.current) {
      hasLoadedProjectDataRef.current = true;
      const updatedData = {
        ...formData,
        ...projectData,
        locationMapPreview: projectData.locationMapImage
          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectData.slugURL}/${projectData.locationMapImage}`
          : null,
        projectLogoPreview: projectData.projectLogoImage
          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${projectData.slugURL}/${projectData.projectLogoImage}`
          : null,
        amenityDescription: projectData.amenityDescription || formData.amenityDescription || "",
        locationDescription: projectData.locationDescription || formData.locationDescription || "",
        floorPlanDescription: projectData.floorPlanDescription || formData.floorPlanDescription || "",
      };
      setFormData(updatedData);
      const country = countryData?.find((c) => c.id === projectData.countryId);
      setStates(country ? country?.stateList : []);
      const state = country?.stateList?.find((s) => s.id === projectData.stateId);
      setCities(state ? state.cityList : []);
      // Notify parent with loaded data
      if (onComplete) {
        onComplete(updatedData);
      }
    }
  }, [projectData, countryData, onComplete]);

  const handleCountryChange = (e) => {
    const countryId = parseInt(e.target.value);
    setFormData((prev) => {
      const updated = { ...prev, countryId, stateId: 0, cityId: 0 };
      // Notify parent on change
      if (onComplete && hasLoadedProjectDataRef.current) {
        onComplete(updated);
      }
      return updated;
    });
    const country = countryData?.find((c) => c.id === countryId);
    setStates(country ? country?.stateList : []);
    setCities([]);
  };

  const handleStateChange = (e) => {
    const stateId = parseInt(e.target.value);
    setFormData((prev) => {
      const updated = { ...prev, stateId, cityId: 0 };
      // Notify parent on change
      if (onComplete && hasLoadedProjectDataRef.current) {
        onComplete(updated);
      }
      return updated;
    });
    const state = states.find((s) => s.id === stateId);
    setCities(state ? state.cityList : []);
  };

  const handleChange = (e) => {
    const { name, type, files, value, checked } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        // Clean up previous URL
        if (formData[`${name}Preview`]?.startsWith("blob:")) {
          URL.revokeObjectURL(formData[`${name}Preview`]);
        }
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => {
          const updated = {
            ...prev,
            [name]: file,
            [`${name}Preview`]: previewUrl,
          };
          // Notify parent on change
          if (onComplete && hasLoadedProjectDataRef.current) {
            onComplete(updated);
          }
          return updated;
        });
      }
    } else if (type === "checkbox") {
      setFormData((prev) => {
        const updated = { ...prev, [name]: checked };
        // Notify parent on change
        if (onComplete && hasLoadedProjectDataRef.current) {
          onComplete(updated);
        }
        return updated;
      });
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        // Notify parent on change
        if (onComplete && hasLoadedProjectDataRef.current) {
          onComplete(updated);
        }
        return updated;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus();
      }
      setValidated(true);
      return;
    }

    setValidated(true);

    if (form.checkValidity()) {
      await submitFormData();
    }
  };

  const submitFormData = async () => {
    if (!formData.metaTitle || formData.metaTitle.trim() === "") {
      toast.error("Meta Title is required");
      return;
    }

    const data = new FormData();
    
    // Append files
    if (formData.projectLogo instanceof File) {
      data.append("projectLogo", formData.projectLogo);
    }
    if (formData.locationMap instanceof File) {
      data.append("locationMap", formData.locationMap);
    }
    if (formData.projectThumbnail instanceof File) {
      data.append("projectThumbnail", formData.projectThumbnail);
    }

    // Append DTO as JSON - ensure ID is included for updates
    const dto = { ...formData };
    if (projectId) {
      dto.id = projectId;
    }
    delete dto.projectLogo;
    delete dto.locationMap;
    delete dto.projectLogoPreview;
    delete dto.locationMapPreview;

    data.append(
      "addUpdateProjectDto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    try {
      setShowLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}projects/add-new`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.isSuccess === 1) {
        const savedProjectId = response.data.projectId || projectId || formData.id;
        const updatedData = { ...formData, id: savedProjectId };
        setFormData(updatedData);
        // Notify parent with updated data
        if (onComplete) {
          onComplete(updatedData);
        }
        // Don't auto-refresh, let user continue editing
      } else {
        const errorMsg = response.data.message || "Failed to save basic information. Please try again.";
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An error occurred while saving. Please check your input and try again.";
      toast.error(errorMessage);
      console.error("Error saving basic info:", error);
    } finally {
      setShowLoading(false);
    }
  };

  const formFields = [
    {
      label: "Meta Title",
      name: "metaTitle",
      type: "text",
      placeholder: "Meta Title",
      required: true,
      colSize: 6,
    },
    {
      label: "Meta Description",
      name: "metaDescription",
      type: "text",
      placeholder: "Meta Description",
      required: true,
      colSize: 6,
    },
    {
      label: "Meta Keyword",
      name: "metaKeyword",
      type: "text",
      placeholder: "Meta Keyword",
      required: true,
      colSize: 6,
    },
    {
      label: "Project Name",
      name: "projectName",
      type: "text",
      placeholder: "Project Name",
      required: true,
      colSize: 6,
    },
    {
      label: "Project Locality",
      name: "projectLocality",
      type: "text",
      placeholder: "Project Locality",
      required: true,
      colSize: 6,
    },
    {
      label: "Country",
      name: "countryId",
      type: "select",
      required: true,
      colSize: 6,
      options: countryData,
      valueKey: "id",
      labelKey: "countryName",
      onChange: handleCountryChange,
    },
    {
      label: "State",
      name: "stateId",
      type: "select",
      required: true,
      colSize: 6,
      options: states,
      valueKey: "id",
      labelKey: "stateName",
      onChange: handleStateChange,
      disabled: !states.length,
    },
    {
      label: "City",
      name: "cityId",
      type: "select",
      required: true,
      colSize: 6,
      options: cities,
      valueKey: "id",
      labelKey: "cityName",
      disabled: !cities.length,
    },
    {
      label: "Project Configuration",
      name: "projectConfiguration",
      type: "text",
      placeholder: "Project Configuration",
      required: true,
      colSize: 6,
    },
    {
      label: "Project By",
      name: "builderId",
      type: "select",
      required: true,
      colSize: 6,
      options: builderList,
      valueKey: "id",
      labelKey: "builderName",
    },
    {
      label: "Location Map",
      name: "locationMap",
      previousImage: formData.locationMapPreview,
      type: "file",
      required: false,
      colSize: 6,
      width: 815,
      height: 813,
    },
    {
      label: "Project Logo",
      name: "projectLogo",
      previousImage: formData.projectLogoPreview,
      type: "file",
      required: false,
      colSize: 6,
      width: 792,
      height: 203,
    },
    {
      label: "Project price",
      name: "projectPrice",
      type: "text",
      placeholder: "Project price",
      required: true,
      colSize: 6,
    },
    {
      label: "RERA Number",
      name: "reraNo",
      type: "text",
      placeholder: "RERA Number",
      required: true,
      colSize: 6,
    },
    {
      label: "RERA website",
      name: "reraWebsite",
      type: "text",
      placeholder: "RERA website",
      required: false,
      colSize: 6,
    },
    {
      label: "Slug Url",
      name: "slugURL",
      type: "text",
      placeholder: "Slug url",
      required: false,
      colSize: 6,
    },
    {
      label: "IVR number",
      name: "ivrNo",
      type: "text",
      placeholder: "IVR number",
      required: false,
      colSize: 6,
    },
    {
      label: "Property type",
      name: "propertyTypeId",
      type: "select",
      required: true,
      colSize: 6,
      options: typeList,
      valueKey: "id",
      labelKey: "projectTypeName",
    },
    {
      label: "Project Status",
      name: "projectStatusId",
      type: "select",
      required: true,
      colSize: 6,
      options: projectStatusList,
      valueKey: "id",
      labelKey: "statusName",
    },
    {
      label: "Amenity Description",
      name: "amenityDescription",
      type: "jodit",
      required: true,
      colSize: 12,
    },
    {
      label: "Location Description",
      name: "locationDescription",
      type: "jodit",
      required: true,
      colSize: 12,
    },
    {
      label: "Floor Plan Description",
      name: "floorPlanDescription",
      type: "jodit",
      required: true,
      colSize: 12,
    },
  ];

  return (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          {formFields.map((field, index) => (
            <Form.Group
              as={Col}
              md={field.colSize || 6}
              className="mb-2"
              controlId={`form-${field.name}`}
              key={index}
            >
              <Form.Label className="fw-bold" style={{ fontSize: "13px" }}>
                {field.label}
              </Form.Label>

              {field.type === "jodit" ? (
                <JoditEditor
                  key={`${field.name}-${projectId || 'new'}`}
                  ref={
                    field.name === "amenityDescription" ? amenityDescEditorRef :
                    field.name === "locationDescription" ? locationDescEditorRef :
                    field.name === "floorPlanDescription" ? floorPlanDescEditorRef :
                    null
                  }
                  value={formData[field.name] ?? ""}
                  onChange={
                    field.name === "amenityDescription" ? handleAmenityDescChange :
                    field.name === "locationDescription" ? handleLocationDescChange :
                    field.name === "floorPlanDescription" ? handleFloorPlanDescChange :
                    (newContent) => {
                      setFormData((prev) => ({
                        ...prev,
                        [field.name]: newContent,
                      }));
                    }
                  }
                  config={joditConfig}
                />
              ) : field.type === "select" ? (
                <Form.Select
                  name={field.name}
                  value={formData[field.name] ?? ""}
                  onChange={field.onChange || handleChange}
                  disabled={field.disabled}
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option
                      key={`${opt[field.valueKey]}-${index}`}
                      value={opt[field.valueKey]}
                    >
                      {opt[field.labelKey]}
                    </option>
                  ))}
                </Form.Select>
              ) : field.type === "file" ? (
                <>
                  {field.previousImage && (
                    <div>
                      <Image
                        src={field.previousImage}
                        alt="Current"
                        width={field.width || 200}
                        height={field.height || 200}
                        className="mb-3 img-fluid rounded"
                      />
                      <br />
                    </div>
                  )}
                  <Form.Control
                    type="file"
                    name={field.name}
                    onChange={handleChange}
                    required={field.required}
                    disabled={field.disabled}
                    accept="image/*"
                  />
                </>
              ) : (
                <Form.Control
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  disabled={field.disabled}
                />
              )}
              <Form.Control.Feedback type="invalid">
                {field.label} is required!
              </Form.Control.Feedback>
            </Form.Group>
          ))}
        </Row>
        <Row className="mt-3">
          <Col md={12} className="text-end">
            <Button
              variant="success"
              type="submit"
              disabled={showLoading}
              size="sm"
            >
              {projectId ? "Update" : "Save"} Basic Info <LoadingSpinner show={showLoading} />
            </Button>
            <small className="d-block text-muted mt-2">
              {projectId 
                ? "Basic info updated. Use 'Save Draft' or 'Publish' buttons in header to save all changes."
                : "Save basic info first to unlock other steps."}
            </small>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

