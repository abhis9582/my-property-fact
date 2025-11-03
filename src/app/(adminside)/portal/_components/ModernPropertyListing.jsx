"use client";
import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  ProgressBar,
  Alert,
  Badge,
  Modal,
} from "react-bootstrap";
import Cookies from "js-cookie";
import "./EnhancedFormStyles.css";
import {
  cilHome,
  cilLocationPin,
  cilMoney,
  cilStar,
  cilCamera,
  cilCheck,
  cilWarning,
  cilArrowLeft,
  cilArrowRight,
  cilSave,
  cilBuilding,
  cilUser,
  cilMap,
  cilFlagAlt,
  cilEnvelopeOpen,
  cilX,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  fetchBuilderData,
  fetchProjectStatus,
  fetchProjectTypes,
} from "@/app/_global_components/masterFunction";
import axios from "axios";

export default function ModernPropertyListing() {
  const [currentStep, setCurrentStep] = useState(2);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [propertyStatus, setPropertyStatus] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    listingType: "",
    transaction: "",
    subType: "",
    title: "",
    description: "",
    status: "",
    possession: "",
    occupancy: "",
    noticePeriod: "",

    // Step 2: Location & Area
    projectName: "",
    builderName: "",
    address: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
    carpetArea: "",
    builtUpArea: "",
    superBuiltUpArea: "",
    plotArea: "",

    // Step 3: Pricing & Floor Details
    totalPrice: "",
    pricePerSqFt: "",
    maintenanceCharges: "",
    bookingAmount: "",
    floor: "",
    totalFloors: "",
    facing: "",
    ageOfConstruction: "",

    // Step 4: Features & Amenities
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    parking: "",
    furnished: "",
    amenities: [],
    features: [],

    // Step 5: Media & Contact
    images: [],
    imagePreviews: [],
    videos: [],
    virtualTour: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    preferredTime: "",
    additionalNotes: "",
  });

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      icon: cilHome,
      description: "Property type and basic details",
    },
    {
      id: 2,
      title: "Location & Area",
      icon: cilLocationPin,
      description: "Address and area specifications",
    },
    {
      id: 3,
      title: "Pricing & Details",
      icon: cilMoney,
      description: "Price and property specifications",
    },
    {
      id: 4,
      title: "Features & Amenities",
      icon: cilStar,
      description: "Property features and amenities",
    },
    {
      id: 5,
      title: "Media & Contact",
      icon: cilCamera,
      description: "Images, videos and contact information",
    },
  ];

  const validationRules = {
    // Step 1 validations
    listingType: { required: true, message: "Please select listing type" },
    transaction: { required: true, message: "Please select transaction type" },
    subType: { required: true, message: "Please select property sub-type" },
    description: {
      required: true,
      minLength: 50,
      maxLength: 1200,
      message: "Description must be 50-1200 characters",
    },
    status: { required: true, message: "Please select property status" },

    // Step 2 validations
    address: { required: true, message: "Address is required" },
    locality: { required: true, message: "Locality is required" },
    city: { required: true, message: "City is required" },
    state: { required: true, message: "State is required" },
    pincode: {
      required: true,
      pattern: /^\d{6}$/,
      message: "PIN code must be 6 digits",
    },
    carpetArea: {
      required: true,
      min: 50,
      message: "Carpet area must be at least 50 sq ft",
    },

    // Step 3 validations
    totalPrice: {
      required: true,
      min: 50000,
      message: "Price must be realistic (minimum ₹50,000)",
    },
    floor: { required: true, message: "Floor number is required" },
    totalFloors: { required: true, message: "Total floors is required" },

    // Step 4 validations
    bedrooms: { required: true, message: "Number of bedrooms is required" },
    bathrooms: { required: true, message: "Number of bathrooms is required" },

    // Step 5 validations
    contactName: { required: true, message: "Contact name is required" },
    contactPhone: {
      required: true,
      pattern: /^[6-9]\d{9}$/,
      message: "Valid 10-digit phone number required",
    },
    contactEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Valid email address required",
    },
  };

  const validateStep = (step) => {
    const stepErrors = {};

    // Define which fields belong to which step
    const stepFields = {
      1: ["listingType", "transaction", "subType", "description", "status"],
      2: ["address", "locality", "city", "state", "pincode", "carpetArea"],
      3: ["totalPrice", "floor", "totalFloors"],
      4: ["bedrooms", "bathrooms"],
      5: ["contactName", "contactPhone", "contactEmail"],
    };

    const fieldsToValidate = stepFields[step] || [];

    fieldsToValidate.forEach((field) => {
      const rule = validationRules[field];
      const value = formData[field];

      if (rule.required && (!value || value.toString().trim() === "")) {
        stepErrors[field] = rule.message;
      } else if (rule.minLength && value.length < rule.minLength) {
        stepErrors[field] = rule.message;
      } else if (rule.maxLength && value.length > rule.maxLength) {
        stepErrors[field] = rule.message;
      } else if (rule.min && Number(value) < rule.min) {
        stepErrors[field] = rule.message;
      } else if (rule.pattern && !rule.pattern.test(value)) {
        stepErrors[field] = rule.message;
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Auto-calculate pricing when carpet area changes
      if (field === "carpetArea" && value && prev.totalPrice) {
        const carpetArea = parseInt(value);
        const totalPrice = parseInt(prev.totalPrice);
        if (carpetArea > 0 && totalPrice > 0) {
          const calculatedPricePerSqFt = Math.round(totalPrice / carpetArea);
          newData.pricePerSqFt = calculatedPricePerSqFt.toString();
        }
      }

      // Auto-calculate pricing when carpet area changes and price per sq ft exists
      if (field === "carpetArea" && value && prev.pricePerSqFt) {
        const carpetArea = parseInt(value);
        const pricePerSqFt = parseInt(prev.pricePerSqFt);
        if (carpetArea > 0 && pricePerSqFt > 0) {
          const calculatedTotalPrice = Math.round(pricePerSqFt * carpetArea);
          newData.totalPrice = calculatedTotalPrice.toString();
        }
      }

      // Format price fields for display
      if (
        [
          "totalPrice",
          "pricePerSqFt",
          "maintenanceCharges",
          "bookingAmount",
        ].includes(field)
      ) {
        // Store the clean numeric value
        const cleanValue = value.toString().replace(/,/g, "");
        newData[field] = cleanValue;
      }

      return newData;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert(
        "Some files were skipped. Please select only image files under 5MB."
      );
    }

    setFormData((prev) => {
      const newImages = [...prev.images, ...validFiles];
      const newPreviews = [...prev.imagePreviews];

      // Create preview URLs for new images
      validFiles.forEach((file) => {
        const previewUrl = URL.createObjectURL(file);
        newPreviews.push({
          file,
          preview: previewUrl,
          id: Date.now() + Math.random(),
        });
      });

      return {
        ...prev,
        images: newImages,
        imagePreviews: newPreviews,
      };
    });
  };

  // Handle image removal
  const handleImageRemove = (imageId) => {
    setFormData((prev) => {
      const imageToRemove = prev.imagePreviews.find(
        (img) => img.id === imageId
      );
      if (imageToRemove) {
        // Revoke the object URL to free memory
        URL.revokeObjectURL(imageToRemove.preview);
      }

      return {
        ...prev,
        imagePreviews: prev.imagePreviews.filter((img) => img.id !== imageId),
        images: prev.images.filter((_, index) => {
          const previewIndex = prev.imagePreviews.findIndex(
            (img) => img.id === imageId
          );
          return index !== previewIndex;
        }),
      };
    });
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      formData.imagePreviews.forEach((imageData) => {
        URL.revokeObjectURL(imageData.preview);
      });
    };
  }, [formData.imagePreviews]);

  // Load project status and types on component mount
  useEffect(() => {
    const loadProjectStatus = async () => {
        const response = await fetchProjectStatus();
        setPropertyStatus(response.data);
    };

    const loadProjectTypes = async () => {
        const response = await fetchProjectTypes();
        setPropertyTypes(response.data);
    };

    const loadbuilderList = async () => {
      const builderData = await fetchBuilderData();
      setBuilders(builderData.data);
    }

    loadProjectStatus();
    loadProjectTypes();
    loadbuilderList();
  }, []);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get authentication token
      const token = Cookies.get("token");

      if (!token) {
        alert("You must be logged in to submit a property");
        return;
      }

      // Create FormData for file upload
      const formDataObj = new FormData();

      // Add images to form data
      formData.imagePreviews.forEach((imagePreview) => {
        if (imagePreview.file) {
          formDataObj.append("images", imagePreview.file);
        }
      });

      // Create property data object matching backend DTO
      const propertyData = {
        // Basic Information
        listingType: formData.listingType,
        transaction: formData.transaction,
        subType: formData.subType,
        title:
          formData.title ||
          `${formData.bedrooms} BHK ${formData.subType} in ${formData.locality}`,
        description: formData.description,
        status: formData.status,
        possession: formData.possession,
        occupancy: formData.occupancy,
        noticePeriod: formData.noticePeriod
          ? parseInt(formData.noticePeriod)
          : null,

        // Location
        projectName: formData.projectName,
        builderName: formData.builderName,
        address: formData.address,
        locality: formData.locality,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,

        // Area
        carpetArea: formData.carpetArea
          ? parseFloat(formData.carpetArea)
          : null,
        builtUpArea: formData.builtUpArea
          ? parseFloat(formData.builtUpArea)
          : null,
        superBuiltUpArea: formData.superBuiltUpArea
          ? parseFloat(formData.superBuiltUpArea)
          : null,
        plotArea: formData.plotArea ? parseFloat(formData.plotArea) : null,

        // Pricing
        totalPrice: formData.totalPrice
          ? parseFloat(formData.totalPrice)
          : null,
        pricePerSqFt: formData.pricePerSqFt
          ? parseFloat(formData.pricePerSqFt)
          : null,
        maintenanceCharges: formData.maintenanceCharges
          ? parseFloat(formData.maintenanceCharges)
          : null,
        bookingAmount: formData.bookingAmount
          ? parseFloat(formData.bookingAmount)
          : null,

        // Property Details
        floor: formData.floor ? parseInt(formData.floor) : null,
        totalFloors: formData.totalFloors
          ? parseInt(formData.totalFloors)
          : null,
        facing: formData.facing,
        ageOfConstruction: formData.ageOfConstruction
          ? parseInt(formData.ageOfConstruction)
          : null,

        // Configuration
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        balconies: formData.balconies ? parseInt(formData.balconies) : null,
        parking: formData.parking,
        furnished: formData.furnished,

        // Amenities (assuming array of IDs)
        amenities: formData.amenities || [],

        // Contact Information
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        preferredTime: formData.preferredTime,
        additionalNotes: formData.additionalNotes,
      };

      // Add property data as JSON string (backend will parse it)
      formDataObj.append("property", JSON.stringify(propertyData));

      console.log(
        "Submitting property with",
        formData.imagePreviews.length,
        "images"
      );

      // Call backend API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/user/properties`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type, browser will set it with boundary
          },
          body: formDataObj,
        }
      );

      const result = await response.json();

      if (result.success) {
        console.log("Property submitted successfully:", result);
        setShowSuccessModal(true);
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      alert("Error submitting property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createPayload = () => {
    return {
      // Basic Information
      listingType: formData.listingType,
      transaction: formData.transaction,
      subType: formData.subType,
      title:
        formData.title ||
        `${formData.bedrooms} BHK ${formData.subType} in ${formData.locality}`,
      description: formData.description,
      status: formData.status,
      possession: formData.possession,
      occupancy: formData.occupancy,
      noticePeriod: formData.noticePeriod
        ? parseInt(formData.noticePeriod)
        : null,

      // Location
      location: {
        projectName: formData.projectName,
        builderName: formData.builderName,
        address: formData.address,
        locality: formData.locality,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },

      // Area
      area: {
        carpetArea: parseInt(formData.carpetArea),
        builtUpArea: formData.builtUpArea
          ? parseInt(formData.builtUpArea)
          : null,
        superBuiltUpArea: formData.superBuiltUpArea
          ? parseInt(formData.superBuiltUpArea)
          : null,
        plotArea: formData.plotArea ? parseInt(formData.plotArea) : null,
      },

      // Pricing
      pricing: {
        totalPrice: parseInt(formData.totalPrice),
        pricePerSqFt: formData.pricePerSqFt
          ? parseInt(formData.pricePerSqFt)
          : null,
        maintenanceCharges: formData.maintenanceCharges
          ? parseInt(formData.maintenanceCharges)
          : null,
        bookingAmount: formData.bookingAmount
          ? parseInt(formData.bookingAmount)
          : null,
      },

      // Property Details
      propertyDetails: {
        floor: parseInt(formData.floor),
        totalFloors: parseInt(formData.totalFloors),
        facing: formData.facing,
        ageOfConstruction: formData.ageOfConstruction
          ? parseInt(formData.ageOfConstruction)
          : null,
      },

      // Features
      features: {
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        balconies: formData.balconies ? parseInt(formData.balconies) : null,
        parking: formData.parking,
        furnished: formData.furnished,
        amenities: formData.amenities,
        features: formData.features,
      },

      // Media & Contact
      media: {
        images: formData.images,
        videos: formData.videos,
        virtualTour: formData.virtualTour,
      },

      contact: {
        name: formData.contactName,
        phone: formData.contactPhone,
        email: formData.contactEmail,
        preferredTime: formData.preferredTime,
        additionalNotes: formData.additionalNotes,
      },

      // Metadata
      metadata: {
        createdAt: new Date().toISOString(),
        status: "draft", // or "published" based on your workflow
        version: "1.0",
      },
    };
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformationStep
            data={formData}
            onChange={handleInputChange}
            errors={errors}
            propertyTypes={propertyTypes}
            propertyStatus={propertyStatus}
          />
        );
      case 2:
        return (
          <LocationAreaStep
            data={formData}
            builderList={builders}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <PricingDetailsStep
            data={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <FeaturesAmenitiesStep
            data={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      case 5:
        return (
          <MediaContactStep
            data={formData}
            onChange={handleInputChange}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="modern-property-listing">
      {/* Header */}
      <div className="listing-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Add New Property</h2>
            <p>Create a comprehensive property listing in 5 simple steps</p>
          </div>
          <div className="header-actions">
            <Button variant="outline-secondary" className="me-2">
              <CIcon icon={cilSave} className="me-1" />
              Save Draft
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card className="progress-card">
        <Card.Body>
          <div className="progress-header">
            <h5>
              Step {currentStep} of {steps.length}:{" "}
              {steps[currentStep - 1].title}
            </h5>
            <p>{steps[currentStep - 1].description}</p>
          </div>
          <ProgressBar
            now={progressPercentage}
            variant="primary"
            className="progress-bar-custom"
            style={{ height: "8px", borderRadius: "4px" }}
          />
          <div className="step-indicators">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`step-indicator ${
                  currentStep > step.id
                    ? "completed"
                    : currentStep === step.id
                    ? "active"
                    : ""
                }`}
              >
                <div className="step-icon">
                  {currentStep > step.id ? (
                    <CIcon icon={cilCheck} />
                  ) : (
                    <CIcon icon={step.icon} />
                  )}
                </div>
                <span className="step-label">{step.title}</span>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Form Content */}
      <Card className="form-card">
        <Card.Body>
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger" className="mb-4">
              <CIcon icon={cilWarning} className="me-2" />
              Please fix the following errors:
              <ul className="mb-0 mt-2">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          {renderStepContent()}
        </Card.Body>
      </Card>

      {/* Navigation */}
      <Card className="navigation-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="outline-secondary"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <CIcon icon={cilArrowLeft} className="me-1" />
              Previous
            </Button>

            <div className="step-info">
              Step {currentStep} of {steps.length}
            </div>

            {currentStep < steps.length ? (
              <Button variant="primary" onClick={handleNext}>
                Next
                <CIcon icon={cilArrowRight} className="ms-1" />
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Property"}
                <CIcon icon={cilCheck} className="ms-1" />
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <CIcon icon={cilCheck} className="me-2 text-success" />
            Property Listed Successfully!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your property has been successfully listed and is now live on the
            portal.
          </p>
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              onClick={() =>
                (window.location.href = "/portal/dashboard/listings")
              }
            >
              View All Listings
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <style jsx>{`
        .modern-property-listing {
          padding: 2rem;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .listing-header {
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

        .progress-card,
        .form-card,
        .navigation-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          background: white;
          margin-bottom: 2rem;
        }

        .progress-header h5 {
          color: #212529;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .progress-header p {
          color: #6c757d;
          margin-bottom: 1.5rem;
        }

        .progress-bar-custom {
          background-color: #e9ecef;
        }

        .step-indicators {
          display: flex;
          justify-content: space-between;
          margin-top: 1.5rem;
          padding: 0 1rem;
        }

        .step-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          position: relative;
        }

        .step-indicator:not(:last-child)::after {
          content: "";
          position: absolute;
          top: 15px;
          left: 60%;
          width: 80%;
          height: 2px;
          background: #e9ecef;
          z-index: 1;
        }

        .step-indicator.completed:not(:last-child)::after {
          background: #28a745;
        }

        .step-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-size: 0.875rem;
          position: relative;
          z-index: 2;
        }

        .step-indicator.active .step-icon {
          background: #667eea;
          color: white;
        }

        .step-indicator.completed .step-icon {
          background: #28a745;
          color: white;
        }

        .step-label {
          font-size: 0.75rem;
          color: #6c757d;
          text-align: center;
          font-weight: 500;
        }

        .step-indicator.active .step-label {
          color: #667eea;
          font-weight: 600;
        }

        .step-indicator.completed .step-label {
          color: #28a745;
        }

        .step-info {
          color: #6c757d;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .modern-property-listing {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .step-indicators {
            flex-direction: column;
            gap: 1rem;
          }

          .step-indicator:not(:last-child)::after {
            display: none;
          }

          .step-indicator {
            flex-direction: row;
            justify-content: flex-start;
            text-align: left;
          }

          .step-label {
            text-align: left;
          }
        }

        /* Image Gallery Styles */
        .image-gallery-container {
          margin-top: 1.5rem;
          background: #ffffff;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .gallery-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }

        .gallery-title {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .gallery-title .badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }

        .image-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          padding: 1.5rem;
          max-height: 500px;
          overflow-y: auto;
        }

        .gallery-item {
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #f1f3f4;
        }

        .gallery-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: #667eea;
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 150px;
          overflow: hidden;
          background: #f8f9fa;
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .gallery-item:hover .gallery-image {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .image-overlay {
          opacity: 1;
        }

        .remove-btn {
          background: #dc3545;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
        }

        .remove-btn:hover {
          background: #c82333;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
        }

        .image-number {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .image-details {
          padding: 1rem;
          background: #ffffff;
        }

        .file-name {
          font-size: 0.9rem;
          font-weight: 500;
          color: #495057;
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.3;
        }

        .file-size {
          font-size: 0.8rem;
          color: #6c757d;
          font-weight: 400;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .image-gallery {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
            padding: 1rem;
          }

          .image-container {
            height: 120px;
          }

          .gallery-header {
            padding: 0.75rem 1rem;
          }

          .gallery-title {
            font-size: 1rem;
          }

          .image-details {
            padding: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .image-gallery {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 0.75rem;
            padding: 0.75rem;
          }

          .image-container {
            height: 100px;
          }

          .remove-btn {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .image-number {
            width: 20px;
            height: 20px;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}

// Step Components
function BasicInformationStep({ data, onChange, errors, propertyTypes = [], propertyStatus = [] }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h4 className="step-title">Basic Property Information</h4>
        <p className="step-subtitle">
          Tell us about your property type and basic details
        </p>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilHome} className="label-icon" />
              Listing Type
              <span className="required-indicator">*</span>
            </label>
            <div className="select-wrapper">
              <Form.Select
                value={data.listingType}
                onChange={(e) => onChange("listingType", e.target.value)}
                isInvalid={!!errors.listingType}
                className="form-control-enhanced"
              >
                <option value="">Choose listing type</option>
                {propertyTypes.length > 0 ? (
                  propertyTypes.map((type) => (
                    <option key={type.id || type.projectTypeName} value={type.projectTypeName}>
                      {type.projectTypeName}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Residential">🏠 Residential</option>
                    <option value="Commercial">🏢 Commercial</option>
                  </>
                )}
              </Form.Select>
              <div className="select-arrow"></div>
            </div>
            {errors.listingType && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.listingType}
              </div>
            )}
          </div>
        </Col>

        <Col md={6}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilMoney} className="label-icon" />
              Transaction Type
              <span className="required-indicator">*</span>
            </label>
            <div className="select-wrapper">
              <Form.Select
                value={data.transaction}
                onChange={(e) => onChange("transaction", e.target.value)}
                isInvalid={!!errors.transaction}
                className="form-control-enhanced"
              >
                <option value="">Choose transaction type</option>
                <option value="Sale">💰 Sale</option>
                <option value="Rent">📋 Rent/Lease</option>
              </Form.Select>
              <div className="select-arrow"></div>
            </div>
            {errors.transaction && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.transaction}
              </div>
            )}
          </div>
        </Col>

        <Col md={6}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilStar} className="label-icon" />
              Property Sub-Type
              <span className="required-indicator">*</span>
            </label>
            <div className="select-wrapper">
              <Form.Select
                value={data.subType}
                onChange={(e) => onChange("subType", e.target.value)}
                isInvalid={!!errors.subType}
                className="form-control-enhanced"
              >
                <option value="">Choose property sub-type</option>
                {data.listingType === "Residential" ? (
                  <>
                    <option value="Apartment">🏢 Apartment</option>
                    <option value="Villa">🏡 Villa</option>
                    <option value="Plot">📐 Plot</option>
                    <option value="Studio">🏠 Studio</option>
                    <option value="Penthouse">🏗️ Penthouse</option>
                    <option value="Farmhouse">🌾 Farmhouse</option>
                    <option value="Independent House">
                      🏘️ Independent House
                    </option>
                  </>
                ) : (
                  <>
                    <option value="Office">💼 Office</option>
                    <option value="Retail">🛍️ Retail</option>
                    <option value="Warehouse">🏭 Warehouse</option>
                    <option value="Industrial">🏗️ Industrial</option>
                    <option value="Land">📐 Land</option>
                  </>
                )}
              </Form.Select>
              <div className="select-arrow"></div>
            </div>
            {errors.subType && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.subType}
              </div>
            )}
          </div>
        </Col>

        <Col md={6}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilCheck} className="label-icon" />
              Property Status
              <span className="required-indicator">*</span>
            </label>
            <div className="select-wrapper">
              <Form.Select
                value={data.status}
                onChange={(e) => onChange("status", e.target.value)}
                isInvalid={!!errors.status}
                className="form-control-enhanced"
              >
                <option value="">Choose property status</option>
                {propertyStatus.length > 0 ? (
                  propertyStatus.map((status) => (
                    <option key={status.id || status.statusName} value={status.statusName || status.status}>
                      {status.statusName || status.status}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Ready">✅ Ready to Move</option>
                    <option value="Under-Construction">
                      🚧 Under Construction
                    </option>
                  </>
                )}
              </Form.Select>
              <div className="select-arrow"></div>
            </div>
            {errors.status && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.status}
              </div>
            )}
          </div>
        </Col>

        <Col md={12}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilStar} className="label-icon" />
              Property Description
              <span className="required-indicator">*</span>
            </label>
            <div className="textarea-wrapper">
              <Form.Control
                as="textarea"
                rows={4}
                value={data.description}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="Describe your property in detail... What makes it special? Mention key features, amenities, and location benefits."
                isInvalid={!!errors.description}
                className="form-control-enhanced textarea-enhanced"
              />
              <div className="textarea-footer">
                <div className="char-counter">
                  <span
                    className={
                      data.description.length > 1000
                        ? "text-warning"
                        : "text-muted"
                    }
                  >
                    {data.description.length}
                  </span>
                  /1200 characters
                </div>
                <div className="char-indicator">
                  <div
                    className="char-progress"
                    style={{
                      width: `${(data.description.length / 1200) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            {errors.description && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.description}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

function LocationAreaStep({ data, onChange, errors, builderList = [] }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h4 className="step-title">Location & Area Details</h4>
        <p className="step-subtitle">
          Provide location information and property measurements
        </p>
      </div>

      <Row className="g-4">
        <Col md={6}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilBuilding} className="label-icon" />
              Project/Building Name
              <span className="optional-indicator">(Optional)</span>
            </label>
            <Form.Control
              type="text"
              value={data.projectName}
              onChange={(e) => onChange("projectName", e.target.value)}
              placeholder="Enter project or building name"
              className="form-control-enhanced"
            />
          </div>
        </Col>

        <Col md={6}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilUser} className="label-icon" />
              Builder/Developer Name
              <span className="optional-indicator">(Optional)</span>
            </label>
            <Form.Control
              type="select"
              value={data.builderName}
              onChange={(e) => onChange("builderName", e.target.value)}
              options={builderList.map((builder) => builder.builderName)}
              className="form-control-enhanced"
            />
          </div>
        </Col>

        <Col md={12}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilLocationPin} className="label-icon" />
              Complete Address
              <span className="required-indicator">*</span>
            </label>
            <Form.Control
              as="textarea"
              rows={3}
              value={data.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Enter complete address with landmark and nearby landmarks"
              isInvalid={!!errors.address}
              className="form-control-enhanced textarea-enhanced"
            />
            {errors.address && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.address}
              </div>
            )}
          </div>
        </Col>

        <Col md={6}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilMap} className="label-icon" />
              Locality/Area
              <span className="required-indicator">*</span>
            </label>
            <Form.Control
              type="text"
              value={data.locality}
              onChange={(e) => onChange("locality", e.target.value)}
              placeholder="e.g., Sector 45, Gurgaon"
              isInvalid={!!errors.locality}
              className="form-control-enhanced"
            />
            {errors.locality && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.locality}
              </div>
            )}
          </div>
        </Col>

        <Col md={6}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilLocationPin} className="label-icon" />
              City
              <span className="required-indicator">*</span>
            </label>
            <div className="select-wrapper">
              <Form.Select
                value={data.city}
                onChange={(e) => onChange("city", e.target.value)}
                isInvalid={!!errors.city}
                className="form-control-enhanced"
              >
                <option value="">Choose your city</option>
                <option value="Mumbai">🏙️ Mumbai</option>
                <option value="Delhi">🏛️ Delhi</option>
                <option value="Bangalore">🌆 Bangalore</option>
                <option value="Hyderabad">🏢 Hyderabad</option>
                <option value="Chennai">🏘️ Chennai</option>
                <option value="Pune">🌳 Pune</option>
                <option value="Gurgaon">🏗️ Gurgaon</option>
                <option value="Noida">🏘️ Noida</option>
                <option value="Kolkata">🌉 Kolkata</option>
              </Form.Select>
              <div className="select-arrow"></div>
            </div>
            {errors.city && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.city}
              </div>
            )}
          </div>
        </Col>

        <Col md={6}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilFlagAlt} className="label-icon" />
              State
              <span className="required-indicator">*</span>
            </label>
            <div className="select-wrapper">
              <Form.Select
                value={data.state}
                onChange={(e) => onChange("state", e.target.value)}
                isInvalid={!!errors.state}
                className="form-control-enhanced"
              >
                <option value="">Choose your state</option>
                <option value="Delhi">🏛️ Delhi</option>
                <option value="Maharashtra">🏙️ Maharashtra</option>
                <option value="Karnataka">🌆 Karnataka</option>
                <option value="Telangana">🏢 Telangana</option>
                <option value="Tamil Nadu">🏘️ Tamil Nadu</option>
                <option value="Haryana">🏗️ Haryana</option>
                <option value="Uttar Pradesh">🏘️ Uttar Pradesh</option>
                <option value="West Bengal">🌉 West Bengal</option>
              </Form.Select>
              <div className="select-arrow"></div>
            </div>
            {errors.state && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.state}
              </div>
            )}
          </div>
        </Col>

        <Col md={6}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilEnvelopeOpen} className="label-icon" />
              PIN Code
              <span className="required-indicator">*</span>
            </label>
            <Form.Control
              type="text"
              value={data.pincode}
              onChange={(e) => onChange("pincode", e.target.value)}
              placeholder="6-digit PIN code"
              maxLength={6}
              isInvalid={!!errors.pincode}
              className="form-control-enhanced"
            />
            {errors.pincode && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.pincode}
              </div>
            )}
          </div>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Carpet Area (sq ft) *</Form.Label>
            <Form.Control
              type="number"
              value={data.carpetArea}
              onChange={(e) => onChange("carpetArea", e.target.value)}
              placeholder="Enter carpet area"
              min={50}
              isInvalid={!!errors.carpetArea}
            />
            <Form.Control.Feedback type="invalid">
              {errors.carpetArea}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              <CIcon icon={cilCheck} className="me-1" />
              Used for automatic price calculations
            </Form.Text>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Built-up Area (sq ft)</Form.Label>
            <Form.Control
              type="number"
              value={data.builtUpArea}
              onChange={(e) => onChange("builtUpArea", e.target.value)}
              placeholder="Enter built-up area"
              min={0}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
}

function PricingDetailsStep({ data, onChange, errors }) {
  // Number formatting functions
  const formatNumberWithCommas = (value) => {
    if (!value) return "";
    const num = parseInt(value.toString().replace(/,/g, ""));
    return isNaN(num) ? "" : num.toLocaleString("en-IN");
  };

  const parseNumberFromFormatted = (value) => {
    if (!value) return "";
    return value.toString().replace(/,/g, "");
  };

  // Auto-calculation functions
  const calculatePricePerSqFt = (totalPrice, carpetArea) => {
    if (totalPrice && carpetArea && carpetArea > 0) {
      return Math.round(totalPrice / carpetArea);
    }
    return "";
  };

  const calculateTotalPrice = (pricePerSqFt, carpetArea) => {
    if (pricePerSqFt && carpetArea && carpetArea > 0) {
      return Math.round(pricePerSqFt * carpetArea);
    }
    return "";
  };

  const handleTotalPriceChange = (value) => {
    const cleanValue = parseNumberFromFormatted(value);
    onChange("totalPrice", cleanValue);
    if (cleanValue && data.carpetArea) {
      const calculatedPricePerSqFt = calculatePricePerSqFt(
        parseInt(cleanValue),
        parseInt(data.carpetArea)
      );
      if (calculatedPricePerSqFt) {
        onChange("pricePerSqFt", calculatedPricePerSqFt.toString());
      }
    }
  };

  const handlePricePerSqFtChange = (value) => {
    const cleanValue = parseNumberFromFormatted(value);
    onChange("pricePerSqFt", cleanValue);
    if (cleanValue && data.carpetArea) {
      const calculatedTotalPrice = calculateTotalPrice(
        parseInt(cleanValue),
        parseInt(data.carpetArea)
      );
      if (calculatedTotalPrice) {
        onChange("totalPrice", calculatedTotalPrice.toString());
      }
    }
  };

  return (
    <div className="step-content">
      <h4 className="step-title mb-4">Pricing & Property Details</h4>

      <Row className="g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Total Price (₹)
              <span className="required-indicator">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={formatNumberWithCommas(data.totalPrice)}
              onChange={(e) => handleTotalPriceChange(e.target.value)}
              placeholder="Enter total price (e.g., 50,00,000)"
              isInvalid={!!errors.totalPrice}
              className="form-control-enhanced price-field"
            />
            <Form.Control.Feedback type="invalid">
              {errors.totalPrice}
            </Form.Control.Feedback>
            {data.carpetArea && (
              <Form.Text className="text-muted">
                <CIcon icon={cilCheck} className="me-1" />
                Auto-calculates price per sq ft based on carpet area (
                {data.carpetArea} sq ft)
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Price per sq ft (₹)</Form.Label>
            <Form.Control
              type="text"
              value={formatNumberWithCommas(data.pricePerSqFt)}
              onChange={(e) => handlePricePerSqFtChange(e.target.value)}
              placeholder="Price per square foot (e.g., 5,000)"
              className="form-control-enhanced price-field"
            />
            {data.carpetArea && (
              <Form.Text className="text-muted">
                <CIcon icon={cilCheck} className="me-1" />
                Auto-calculates total price based on carpet area (
                {data.carpetArea} sq ft)
              </Form.Text>
            )}
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Maintenance Charges (₹/month)</Form.Label>
            <Form.Control
              type="text"
              value={formatNumberWithCommas(data.maintenanceCharges)}
              onChange={(e) =>
                onChange(
                  "maintenanceCharges",
                  parseNumberFromFormatted(e.target.value)
                )
              }
              placeholder="Monthly maintenance charges (e.g., 2,500)"
              className="form-control-enhanced price-field"
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Booking Amount (₹)</Form.Label>
            <Form.Control
              type="text"
              value={formatNumberWithCommas(data.bookingAmount)}
              onChange={(e) =>
                onChange(
                  "bookingAmount",
                  parseNumberFromFormatted(e.target.value)
                )
              }
              placeholder="Booking amount (e.g., 1,00,000)"
              className="form-control-enhanced price-field"
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Floor Number *</Form.Label>
            <Form.Control
              type="number"
              value={data.floor}
              onChange={(e) => onChange("floor", e.target.value)}
              placeholder="Floor number"
              isInvalid={!!errors.floor}
            />
            <Form.Control.Feedback type="invalid">
              {errors.floor}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Total Floors *</Form.Label>
            <Form.Control
              type="number"
              value={data.totalFloors}
              onChange={(e) => onChange("totalFloors", e.target.value)}
              placeholder="Total floors in building"
              isInvalid={!!errors.totalFloors}
            />
            <Form.Control.Feedback type="invalid">
              {errors.totalFloors}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Facing</Form.Label>
            <Form.Select
              value={data.facing}
              onChange={(e) => onChange("facing", e.target.value)}
            >
              <option value="">Select Facing</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="North-East">North-East</option>
              <option value="North-West">North-West</option>
              <option value="South-East">South-East</option>
              <option value="South-West">South-West</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Age of Construction</Form.Label>
            <Form.Control
              type="number"
              value={data.ageOfConstruction}
              onChange={(e) => onChange("ageOfConstruction", e.target.value)}
              placeholder="Years since construction"
              min={0}
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
}

function FeaturesAmenitiesStep({ data, onChange, errors }) {
  const amenities = [
    "Swimming Pool",
    "Gym",
    "Parking",
    "Security",
    "Lift",
    "Power Backup",
    "Water Supply",
    "Garden",
    "Club House",
    "Children's Play Area",
    "Shopping Center",
    "Hospital",
    "School",
    "Metro Station",
  ];

  const features = [
    "Fully Furnished",
    "Semi Furnished",
    "Unfurnished",
    "Modular Kitchen",
    "Wooden Flooring",
    "Marble Flooring",
    "Vitrified Tiles",
    "Balcony",
    "Study Room",
    "Pooja Room",
    "Store Room",
    "Servant Room",
  ];

  const handleAmenityChange = (amenity) => {
    const currentAmenities = data.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity];
    onChange("amenities", updatedAmenities);
  };

  const handleFeatureChange = (feature) => {
    const currentFeatures = data.features || [];
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter((f) => f !== feature)
      : [...currentFeatures, feature];
    onChange("features", updatedFeatures);
  };

  return (
    <div className="step-content">
      <h4 className="step-title mb-4">Property Features & Amenities</h4>

      <Row className="g-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Number of Bedrooms *</Form.Label>
            <Form.Select
              value={data.bedrooms}
              onChange={(e) => onChange("bedrooms", e.target.value)}
              isInvalid={!!errors.bedrooms}
            >
              <option value="">Select Bedrooms</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
              <option value="5">5+ BHK</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.bedrooms}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Number of Bathrooms *</Form.Label>
            <Form.Select
              value={data.bathrooms}
              onChange={(e) => onChange("bathrooms", e.target.value)}
              isInvalid={!!errors.bathrooms}
            >
              <option value="">Select Bathrooms</option>
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathrooms</option>
              <option value="3">3 Bathrooms</option>
              <option value="4">4+ Bathrooms</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.bathrooms}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Number of Balconies</Form.Label>
            <Form.Select
              value={data.balconies}
              onChange={(e) => onChange("balconies", e.target.value)}
            >
              <option value="">Select Balconies</option>
              <option value="0">No Balcony</option>
              <option value="1">1 Balcony</option>
              <option value="2">2 Balconies</option>
              <option value="3">3+ Balconies</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Parking</Form.Label>
            <Form.Select
              value={data.parking}
              onChange={(e) => onChange("parking", e.target.value)}
            >
              <option value="">Select Parking</option>
              <option value="No Parking">No Parking</option>
              <option value="1 Covered">1 Covered</option>
              <option value="1 Open">1 Open</option>
              <option value="2 Covered">2 Covered</option>
              <option value="2 Open">2 Open</option>
              <option value="Multiple">Multiple</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Furnishing Status</Form.Label>
            <Form.Select
              value={data.furnished}
              onChange={(e) => onChange("furnished", e.target.value)}
            >
              <option value="">Select Furnishing</option>
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Semi Furnished">Semi Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <h5>Amenities</h5>
          <div className="amenities-grid">
            {amenities.map((amenity) => (
              <div key={amenity} className="amenity-item">
                <Form.Check
                  type="checkbox"
                  id={`amenity-${amenity}`}
                  label={amenity}
                  checked={(data.amenities || []).includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <h5>Features</h5>
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature} className="feature-item">
                <Form.Check
                  type="checkbox"
                  id={`feature-${feature}`}
                  label={feature}
                  checked={(data.features || []).includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <style jsx>{`
        .amenities-grid,
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .amenity-item,
        .feature-item {
          padding: 0.5rem;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          background: #f8f9fa;
        }
      `}</style>
    </div>
  );
}

function MediaContactStep({
  data,
  onChange,
  onImageChange,
  onImageRemove,
  errors,
}) {
  return (
    <div className="step-content">
      <h4 className="step-title mb-4">Media & Contact Information</h4>

      <Row className="g-3">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Property Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={onImageChange}
            />
            <Form.Text className="text-muted">
              Upload multiple images of your property (JPG, PNG, max 5MB each)
            </Form.Text>

            {/* Image Previews */}
            {data.imagePreviews && data.imagePreviews.length > 0 && (
              <div className="image-gallery-container">
                <div className="gallery-header">
                  <div className="gallery-title">
                    <CIcon icon={cilCamera} className="me-2" />
                    <span>Selected Images</span>
                    <Badge bg="primary" className="ms-2">
                      {data.imagePreviews.length}
                    </Badge>
                  </div>
                  <small className="text-muted">
                    Click the remove button to delete images
                  </small>
                </div>

                <div className="image-gallery">
                  {data.imagePreviews.map((imageData, index) => (
                    <div key={imageData.id} className="gallery-item">
                      <div className="image-container">
                        <img
                          src={imageData.preview}
                          alt={`Property image ${index + 1}`}
                          className="gallery-image"
                        />
                        <div className="image-overlay">
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => onImageRemove(imageData.id)}
                            title="Remove this image"
                          >
                            <CIcon icon={cilX} />
                          </button>
                        </div>
                        <div className="image-number">{index + 1}</div>
                      </div>
                      <div className="image-details">
                        <div className="file-name" title={imageData.file.name}>
                          {imageData.file.name}
                        </div>
                        <div className="file-size">
                          {(imageData.file.size / 1024 / 1024).toFixed(1)} MB
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group>
            <Form.Label>Virtual Tour URL</Form.Label>
            <Form.Control
              type="url"
              value={data.virtualTour}
              onChange={(e) => onChange("virtualTour", e.target.value)}
              placeholder="https://example.com/virtual-tour"
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Contact Name *</Form.Label>
            <Form.Control
              type="text"
              value={data.contactName}
              onChange={(e) => onChange("contactName", e.target.value)}
              placeholder="Your full name"
              isInvalid={!!errors.contactName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.contactName}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Contact Phone *</Form.Label>
            <Form.Control
              type="tel"
              value={data.contactPhone}
              onChange={(e) => onChange("contactPhone", e.target.value)}
              placeholder="10-digit mobile number"
              maxLength={10}
              isInvalid={!!errors.contactPhone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.contactPhone}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Contact Email *</Form.Label>
            <Form.Control
              type="email"
              value={data.contactEmail}
              onChange={(e) => onChange("contactEmail", e.target.value)}
              placeholder="your.email@example.com"
              isInvalid={!!errors.contactEmail}
            />
            <Form.Control.Feedback type="invalid">
              {errors.contactEmail}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>Preferred Contact Time</Form.Label>
            <Form.Select
              value={data.preferredTime}
              onChange={(e) => onChange("preferredTime", e.target.value)}
            >
              <option value="">Select Time</option>
              <option value="Morning (9 AM - 12 PM)">
                Morning (9 AM - 12 PM)
              </option>
              <option value="Afternoon (12 PM - 5 PM)">
                Afternoon (12 PM - 5 PM)
              </option>
              <option value="Evening (5 PM - 8 PM)">
                Evening (5 PM - 8 PM)
              </option>
              <option value="Any Time">Any Time</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={12}>
          <Form.Group>
            <Form.Label>Additional Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={data.additionalNotes}
              onChange={(e) => onChange("additionalNotes", e.target.value)}
              placeholder="Any additional information for potential buyers/tenants"
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
}
