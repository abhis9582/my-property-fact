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
import NextImage from "next/image";

export default function ModernPropertyListing({ listingId }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProperty, setCreatedProperty] = useState(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [propertyStatus, setPropertyStatus] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBuilders, setLoadingBuilders] = useState(false);
  const getInitialFormState = () => ({
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
    builderId: null,
    address: "",
    locality: "",
    city: "",
    cityId: null,
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
    ownershipType: "",
    reraId: "",
    reraState: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactPreference: "Phone",
    preferredTime: "",
    additionalNotes: "",
    truthfulDeclaration: true,
    dpdpConsent: true,
  });

  const [formData, setFormData] = useState(getInitialFormState);

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
      message: "Description must be between 50 and 1200 characters",
    },
    status: { required: true, message: "Please select property status" },

    // Step 2 validations
    projectName: { required: true, message: "Project/Building name is required" },
    address: { required: true, message: "Address is required" },
    locality: { required: true, message: "Locality is required" },
    city: { required: true, message: "City is required" },
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

    // Step 4 validations (conditional based on listing type)
    bedrooms: { 
      required: true, 
      message: "Number of bedrooms is required",
      conditional: (data) => data.listingType === "Residential"
    },
    bathrooms: { 
      required: true, 
      message: "Number of bathrooms is required",
      conditional: (data) => data.listingType === "Residential" || data.listingType === "Commercial"
    },

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
    truthfulDeclaration: {
      required: true,
      message: "You must confirm the information is truthful",
    },
    dpdpConsent: {
      required: true,
      message: "You must consent to data processing",
    },
    images: {
      required: true,
      minCount: 1,
      message: "At least one property image is required",
    },
  };

  const validateStep = (step) => {
    const stepErrors = {};

    // Define which fields belong to which step (with conditional logic)
    const stepFields = {
      1: ["listingType", "transaction", "subType", "description", "status"],
      2: ["projectName", "address", "locality", "city", "pincode", "carpetArea"],
      3: ["totalPrice", "floor", "totalFloors"],
      4: [], // Will be populated conditionally
      5: ["contactName", "contactPhone", "contactEmail", "truthfulDeclaration", "dpdpConsent", "images"],
    };

    // Conditionally add Step 4 fields based on listing type
    if (step === 4) {
      if (formData.listingType === "Residential") {
        stepFields[4] = ["bedrooms", "bathrooms"];
      } else if (formData.listingType === "Commercial") {
        stepFields[4] = ["bathrooms"]; // Only bathrooms required for commercial
      }
    }

    const fieldsToValidate = stepFields[step] || [];

    fieldsToValidate.forEach((field) => {
      const rule = validationRules[field];
      if (!rule) return; // Skip if rule doesn't exist
      
      // Check conditional requirement
      if (rule.conditional && !rule.conditional(formData)) {
        return; // Skip validation if condition not met
      }

      const value = formData[field];

      if (rule.required) {
        // Handle checkbox fields
        if (field === "truthfulDeclaration" || field === "dpdpConsent") {
          if (!value || value === false) {
            stepErrors[field] = rule.message;
          }
        }
        // Handle image array
        else if (field === "images") {
          if (!formData.imagePreviews || formData.imagePreviews.length < (rule.minCount || 1)) {
            stepErrors[field] = rule.message;
          }
        }
        // Handle string/number fields
        else if (!value || value.toString().trim() === "") {
          stepErrors[field] = rule.message;
        }
      }

      // Additional validations for non-empty values
      if (value && value.toString().trim() !== "") {
        if (rule.minLength && value.length < rule.minLength) {
          stepErrors[field] = rule.message;
        } else if (rule.maxLength && value.length > rule.maxLength) {
          stepErrors[field] = rule.message;
        } else if (rule.min && Number(value) < rule.min) {
          stepErrors[field] = rule.message;
        } else if (rule.pattern && !rule.pattern.test(value)) {
          stepErrors[field] = rule.message;
        }
      }
    });

    // Cross-field validation for Step 3
    if (step === 3) {
      const floor = Number(formData.floor);
      const totalFloors = Number(formData.totalFloors);
      if (floor && totalFloors && floor > totalFloors) {
        stepErrors.floor = `Floor number cannot be greater than total floors (${totalFloors})`;
      }
    }

    // Virtual tour URL validation (if provided)
    if (step === 5 && formData.virtualTour && formData.virtualTour.trim() !== "") {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.virtualTour)) {
        stepErrors.virtualTour = "Please enter a valid URL (e.g., https://example.com)";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Reset dependent fields when listing type changes
      if (field === "listingType") {
        // Reset subType when listing type changes
        newData.subType = "";
        // Reset residential-specific fields if switching to commercial
        if (value === "Commercial") {
          newData.bedrooms = "";
          newData.balconies = "";
        }
        // Reset commercial-specific fields if switching to residential
        if (value === "Residential") {
          // Keep bathrooms as it's common
        }
      }

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

  // Validate image aspect ratio (must be rectangular, not square or extreme)
  const validateImageRatio = (file) => {
    return new Promise((resolve) => {
      // Use window.Image to explicitly use browser's native Image constructor
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const aspectRatio = width / height;
        
        // Check if image is square (aspect ratio close to 1:1)
        const isSquare = Math.abs(aspectRatio - 1) < 0.1;
        
        // Check if image is too extreme (more than 3:1 or less than 1:3)
        const isTooExtreme = aspectRatio > 3 || aspectRatio < 1/3;
        
        // Valid rectangular ratio: not square and not too extreme
        const isValid = !isSquare && !isTooExtreme;
        
        resolve({
          isValid,
          width,
          height,
          aspectRatio,
          error: isSquare 
            ? "Image must be rectangular, not square" 
            : isTooExtreme 
            ? "Image aspect ratio is too extreme. Please use rectangular images (between 3:1 and 1:3)" 
            : null
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ 
          isValid: false, 
          error: "Failed to load image. Please ensure the file is a valid image." 
        });
      };
      
      img.src = url;
    });
  };

  // Handle image selection
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    // First filter by type and size
    const typeAndSizeValidFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (typeAndSizeValidFiles.length !== files.length) {
      alert(
        "Some files were skipped. Please select only image files under 5MB."
      );
    }

    // Validate aspect ratio for each file
    for (const file of typeAndSizeValidFiles) {
      const validation = await validateImageRatio(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file, error: validation.error });
      }
    }

    // Show error for invalid aspect ratio files
    if (invalidFiles.length > 0) {
      const errorMessages = invalidFiles.map(({ error }) => error).join("\n");
      alert(`Some images were rejected due to invalid aspect ratio:\n${errorMessages}`);
    }

    if (validFiles.length === 0) {
      return;
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

  // Load project status, types, cities, builders, and states on component mount
  useEffect(() => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005").replace(/\/$/, "");

    const loadProjectStatus = async () => {
      try {
        const response = await fetchProjectStatus();
        setPropertyStatus(response.data || []);
      } catch (error) {
        console.error("Error loading project status:", error);
        setPropertyStatus([]);
      }
    };

    const loadProjectTypes = async () => {
      try {
        const response = await fetchProjectTypes();
        setPropertyTypes(response.data || []);
      } catch (error) {
        console.error("Error loading project types:", error);
        setPropertyTypes([]);
      }
    };

    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const response = await axios.get(`${baseUrl}/city/all`);
        // Handle different response formats
        const cityData = response.data?.data || response.data || [];
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    const loadBuilders = async () => {
      setLoadingBuilders(true);
      try {
        const response = await axios.get(`${baseUrl}/builder/get-all-builders`);
        // Handle different response formats
        const builderData = response.data?.data || response.data || [];
        setBuilders(Array.isArray(builderData) ? builderData : []);
      } catch (error) {
        console.error("Error loading builders:", error);
        // Fallback to existing function
        try {
          const builderData = await fetchBuilderData();
          setBuilders(builderData?.data || builderData?.builders || []);
        } catch (fallbackError) {
          console.error("Error loading builders (fallback):", fallbackError);
          setBuilders([]);
        }
      } finally {
        setLoadingBuilders(false);
      }
    };

    // Load all data in parallel
    loadProjectStatus();
    loadProjectTypes();
    loadCities();
    loadBuilders();
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
      const token = Cookies.get("authToken") || Cookies.get("token");

      if (!token) {
        alert("You must be logged in to submit a property");
        setIsSubmitting(false);
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

      // Prepare property data using shared function
      const propertyData = preparePropertyData();

      // Add property data as JSON string (backend will parse it)
      formDataObj.append("property", JSON.stringify(propertyData));
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005"
      ).replace(/\/$/, "");

      const response = await fetch(
        `${baseUrl}/api/user/property-listings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type, browser will set it with boundary
          },
          body: formDataObj,
        }
      );

      const responseText = await response.text();
      let result = null;
      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse response JSON", parseError);
        }
      }

      if (!response.ok || !(result && result.success)) {
        const message =
          result?.message || `Failed to create property (status ${response.status})`;
        throw new Error(message);
      }

      setCreatedProperty(result.property || null);
      setFormData(getInitialFormState());
      setErrors({});
      setCurrentStep(1);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting property:", error);
      alert(error.message || "Error submitting property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setCreatedProperty(null);
  };

  // Helper function to prepare property data (shared between draft and submit)
  const preparePropertyData = () => {
    const toNumber = (value, parser = parseFloat) => {
      if (value === undefined || value === null || value === "") {
        return null;
      }
      const num = parser(value);
      return Number.isNaN(num) ? null : num;
    };

    const toInteger = (value) => toNumber(value, (val) => parseInt(val, 10));
    const emptyToNull = (value) =>
      value === undefined || value === null || value === "" ? null : value;

    const extractParkingSlots = (value) => {
      if (!value) return null;
      const match = value.match(/(\d+)/);
      return match ? parseInt(match[0], 10) : null;
    };

    // Generate title from property details if not provided
    const generateTitle = () => {
      const parts = [];
      if (formData.bedrooms) parts.push(`${formData.bedrooms} BHK`);
      if (formData.subType) parts.push(formData.subType);
      if (formData.locality) parts.push(`in ${formData.locality}`);
      if (formData.city) parts.push(formData.city);
      return parts.length > 0 ? parts.join(" ") : "Property Listing";
    };

    return {
      // Basic Information
      listingType: emptyToNull(formData.listingType),
      transaction: emptyToNull(formData.transaction),
      subType: emptyToNull(formData.subType),
      title: generateTitle(),
      description: emptyToNull(formData.description),
      status: emptyToNull(formData.status),
      possession: emptyToNull(formData.possession),
      occupancy: emptyToNull(formData.occupancy),
      noticePeriod: toInteger(formData.noticePeriod),

      // Location
      projectName: emptyToNull(formData.projectName),
      builderName: emptyToNull(formData.builderName),
      address: emptyToNull(formData.address),
      locality: emptyToNull(formData.locality),
      city: emptyToNull(formData.city),
      pinCode: emptyToNull(formData.pincode),
      latitude: toNumber(formData.latitude),
      longitude: toNumber(formData.longitude),

      // Area
      carpetArea: toNumber(formData.carpetArea),
      builtUpArea: toNumber(formData.builtUpArea),
      superBuiltUpArea: toNumber(formData.superBuiltUpArea),
      plotArea: toNumber(formData.plotArea),

      // Pricing
      totalPrice: toNumber(formData.totalPrice),
      pricePerSqft: toNumber(formData.pricePerSqFt),
      maintenanceCam: toNumber(formData.maintenanceCharges),
      bookingAmount: toNumber(formData.bookingAmount),
      waterSupply: emptyToNull(formData.waterSupply),
      towerBlock: emptyToNull(formData.towerBlock),

      // Property Details
      floorNo: toInteger(formData.floor),
      totalFloors: toInteger(formData.totalFloors),
      facing: emptyToNull(formData.facing),
      unitFacing: emptyToNull(formData.facing),
      ageOfConstruction: toInteger(formData.ageOfConstruction),
      ageOfProperty: toInteger(formData.ageOfConstruction),
      carParkingSlots: extractParkingSlots(formData.parking),
      parkingType: emptyToNull(formData.parking),
      powerBackup: emptyToNull(formData.powerBackup),

      // Configuration
      bedrooms: toInteger(formData.bedrooms),
      bathrooms: toInteger(formData.bathrooms),
      balconies: toInteger(formData.balconies),
      furnishingLevel: emptyToNull(formData.furnished),
      additionalRooms:
        formData.features && formData.features.length
          ? formData.features.join(", ")
          : null,
      includedItems: formData.features || [],
      societyFeatures: formData.amenities || [],
      pointsOfInterest: formData.pointsOfInterest || [],
      taxesCharges: formData.taxesCharges || [],
      restrictions: emptyToNull(formData.restrictions),
      renovationHistory: emptyToNull(formData.additionalNotes),

      // Amenities
      amenityIds: formData.amenityIds || [],

      // Contact Information
      videoUrl: emptyToNull(formData.virtualTour),
      ownershipType: emptyToNull(formData.ownershipType),
      reraId: emptyToNull(formData.reraId),
      reraState: emptyToNull(formData.reraState),
      contactPreference:
        emptyToNull(formData.contactPreference) || "Phone",
      contactName: emptyToNull(formData.contactName),
      contactPhone: emptyToNull(formData.contactPhone),
      contactEmail: emptyToNull(formData.contactEmail),
      primaryContact: emptyToNull(formData.contactPhone),
      primaryEmail: emptyToNull(formData.contactEmail),
      preferredTime: emptyToNull(formData.preferredTime),
      truthfulDeclaration:
        formData.truthfulDeclaration !== undefined
          ? formData.truthfulDeclaration
          : true,
      dpdpConsent:
        formData.dpdpConsent !== undefined ? formData.dpdpConsent : true,

      // Legacy/contact
      additionalNotes: emptyToNull(formData.additionalNotes),

      // Relationship placeholders
      cityId: formData.cityId || null,
      localityId: formData.localityId || null,
      builderId: formData.builderId || null,
    };
  };

  // Handle save draft (saves without validation)
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    setDraftSaved(false);

    try {
      const token = Cookies.get("authToken") || Cookies.get("token");

      if (!token) {
        alert("You must be logged in to save a draft");
        setIsSavingDraft(false);
        return;
      }

      // Create FormData for file upload
      const formDataObj = new FormData();

      // Add images to form data (optional for draft)
      formData.imagePreviews.forEach((imagePreview) => {
        if (imagePreview.file) {
          formDataObj.append("images", imagePreview.file);
        }
      });

      // Prepare property data
      const propertyData = preparePropertyData();

      // Add property data as JSON string
      formDataObj.append("property", JSON.stringify(propertyData));
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005"
      ).replace(/\/$/, "");

      const response = await fetch(
        `${baseUrl}/api/user/property-listings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataObj,
        }
      );

      const responseText = await response.text();
      let result = null;
      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse response JSON", parseError);
        }
      }

      if (!response.ok || !(result && result.success)) {
        const message =
          result?.message || `Failed to save draft (status ${response.status})`;
        throw new Error(message);
      }

      // Show success message
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);

      // If property was created, we could optionally redirect or update state
      if (result.property) {
        console.log("Draft saved with ID:", result.property.id);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      alert(error.message || "Error saving draft. Please try again.");
    } finally {
      setIsSavingDraft(false);
    }
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
            cities={cities}
            loadingCities={loadingCities}
            loadingBuilders={loadingBuilders}
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
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={handleSaveDraft}
              disabled={isSavingDraft}
            >
              <CIcon icon={cilSave} className="me-1" />
              {isSavingDraft ? "Saving..." : "Save Draft"}
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
          {draftSaved && (
            <Alert variant="success" className="mb-4" dismissible onClose={() => setDraftSaved(false)}>
              <CIcon icon={cilCheck} className="me-2" />
              <strong>Draft saved successfully!</strong> You can continue editing and submit when ready.
            </Alert>
          )}

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
        onHide={handleCloseSuccessModal}
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
            Your property has been submitted successfully and is pending
            approval. Our team will review the details and notify you once
            it&apos;s published.
          </p>
          {createdProperty && (
            <div className="mb-3">
              <strong>Reference ID:</strong> #{createdProperty.id}
            </div>
          )}
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
              onClick={handleCloseSuccessModal}
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
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.3s ease;
        }

        .image-gallery-container:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12), 0 4px 6px rgba(0, 0, 0, 0.08);
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
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          padding: 1.5rem;
          max-height: 600px;
          overflow-y: auto;
          justify-content: flex-start;
          align-items: flex-start;
        }

        .gallery-item {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid #e9ecef;
          width: 300px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }

        .gallery-item:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 200px;
          min-height: 200px;
          max-height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
          max-width: 100%;
          max-height: 100%;
        }

        .gallery-item:hover .gallery-image {
          transform: scale(1.08);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(2px);
        }

        .gallery-item:hover .image-overlay {
          opacity: 1;
        }

        .remove-btn {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
          z-index: 10;
        }

        .remove-btn:hover {
          background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
          transform: scale(1.15) rotate(90deg);
          box-shadow: 0 6px 16px rgba(220, 53, 69, 0.5);
        }

        .remove-btn:active {
          transform: scale(1.05) rotate(90deg);
        }

        .image-number {
          position: absolute;
          top: 10px;
          left: 10px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
          color: white;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          z-index: 5;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .image-details {
          padding: 1rem 1.25rem;
          background: #ffffff;
          border-top: 1px solid #f1f3f4;
          flex-grow: 1;
        }

        .file-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #212529;
          margin-bottom: 0.375rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
        }

        .file-size {
          font-size: 0.75rem;
          color: #6c757d;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .file-size::before {
          content: "📦";
          font-size: 0.7rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .image-gallery {
            gap: 1rem;
            padding: 1rem;
            justify-content: center;
          }

          .gallery-item {
            width: 100%;
            max-width: 300px;
            min-width: 280px;
          }

          .image-container {
            height: 200px;
          }

          .gallery-header {
            padding: 0.75rem 1rem;
          }

          .gallery-title {
            font-size: 1rem;
          }

          .image-details {
            padding: 0.875rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .image-gallery {
            gap: 0.75rem;
            padding: 0.75rem;
            justify-content: center;
          }

          .gallery-item {
            width: 100%;
            max-width: 100%;
            min-width: auto;
          }

          .image-container {
            height: 200px;
          }

          .remove-btn {
            width: 38px;
            height: 38px;
            font-size: 16px;
          }

          .image-number {
            width: 24px;
            height: 24px;
            font-size: 0.75rem;
            top: 8px;
            left: 8px;
          }

          .image-details {
            padding: 0.75rem;
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

function LocationAreaStep({ 
  data, 
  onChange, 
  errors, 
  builderList = [], 
  cities = [], 
  loadingCities = false,
  loadingBuilders = false
}) {
  const [builderSearchTerm, setBuilderSearchTerm] = useState("");
  const [showBuilderDropdown, setShowBuilderDropdown] = useState(false);
  const [builderInputFocused, setBuilderInputFocused] = useState(false);
  const [builderHighlightedIndex, setBuilderHighlightedIndex] = useState(-1);

  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cityInputFocused, setCityInputFocused] = useState(false);
  const [cityHighlightedIndex, setCityHighlightedIndex] = useState(-1);

  // Filter builders based on search term
  const filteredBuilders = builderList.filter((builder) => {
    if (!builderSearchTerm.trim()) return false; // Don't show all when empty
    const builderName = (builder.builderName || builder.name || "").toLowerCase();
    const searchLower = builderSearchTerm.toLowerCase();
    return builderName.includes(searchLower);
  }).slice(0, 10); // Limit to 10 results for better UX

  // Filter cities based on search term
  const filteredCities = cities.filter((city) => {
    if (!citySearchTerm.trim()) return false; // Don't show all when empty
    const cityName = (city.cityName || city.name || city).toLowerCase();
    const searchLower = citySearchTerm.toLowerCase();
    return cityName.includes(searchLower);
  }).slice(0, 10); // Limit to 10 results for better UX

  // Handle builder input change
  const handleBuilderInputChange = (value) => {
    setBuilderSearchTerm(value);
    onChange("builderName", value);
    onChange("builderId", null); // Clear ID when typing custom text
    setShowBuilderDropdown(true);
    setBuilderHighlightedIndex(-1);
  };

  // Handle city input change
  const handleCityInputChange = (value) => {
    setCitySearchTerm(value);
    onChange("city", value);
    onChange("cityId", null); // Clear ID when typing
    setShowCityDropdown(true);
    setCityHighlightedIndex(-1);
  };

  // Handle keyboard navigation for builder
  const handleBuilderKeyDown = (e) => {
    if (!showBuilderDropdown || filteredBuilders.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setBuilderHighlightedIndex((prev) => 
        prev < filteredBuilders.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setBuilderHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && builderHighlightedIndex >= 0) {
      e.preventDefault();
      handleBuilderSelect(filteredBuilders[builderHighlightedIndex]);
    } else if (e.key === "Escape") {
      setShowBuilderDropdown(false);
      setBuilderInputFocused(false);
    }
  };

  // Handle keyboard navigation for city
  const handleCityKeyDown = (e) => {
    if (!showCityDropdown || filteredCities.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCityHighlightedIndex((prev) => 
        prev < filteredCities.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCityHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && cityHighlightedIndex >= 0) {
      e.preventDefault();
      handleCitySelect(filteredCities[cityHighlightedIndex]);
    } else if (e.key === "Escape") {
      setShowCityDropdown(false);
      setCityInputFocused(false);
    }
  };

  // Handle builder selection from dropdown
  const handleBuilderSelect = (builder) => {
    const builderName = builder.builderName || builder.name;
    setBuilderSearchTerm(builderName);
    onChange("builderName", builderName);
    if (builder.id) {
      onChange("builderId", builder.id);
    }
    setShowBuilderDropdown(false);
    setBuilderInputFocused(false);
  };

  // Handle city selection from dropdown
  const handleCitySelect = (city) => {
    const cityName = city.cityName || city.name || city;
    setCitySearchTerm(cityName);
    onChange("city", cityName);
    if (city.id) {
      onChange("cityId", city.id);
    }
    setShowCityDropdown(false);
    setCityInputFocused(false);
  };

  // Handle input focus
  const handleBuilderFocus = () => {
    setBuilderInputFocused(true);
    setShowBuilderDropdown(true);
  };

  const handleCityFocus = () => {
    setCityInputFocused(true);
    setShowCityDropdown(true);
  };

  // Handle input blur (with delay to allow click on dropdown)
  const handleBuilderBlur = () => {
    setTimeout(() => {
      setShowBuilderDropdown(false);
      setBuilderInputFocused(false);
    }, 200);
  };

  const handleCityBlur = () => {
    setTimeout(() => {
      setShowCityDropdown(false);
      setCityInputFocused(false);
    }, 200);
  };

  // Initialize search term from data
  useEffect(() => {
    if (data.builderName && !builderSearchTerm) {
      setBuilderSearchTerm(data.builderName);
    }
    if (data.city && !citySearchTerm) {
      setCitySearchTerm(data.city);
    }
  }, [data.builderName, data.city]);

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
              <span className="required-indicator">*</span>
            </label>
            <Form.Control
              type="text"
              value={data.projectName}
              onChange={(e) => onChange("projectName", e.target.value)}
              placeholder="Enter project or building name"
              className="form-control-enhanced"
              isInvalid={!!errors.projectName}
            />
            {errors.projectName && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.projectName}
              </div>
            )}
          </div>
        </Col>

        <Col md={6}>
          <div className="form-group-enhanced">
            <label className="form-label-enhanced">
              <CIcon icon={cilUser} className="label-icon" />
              Builder/Developer Name
              <span className="optional-indicator">(Optional)</span>
            </label>
            <div className="searchable-select-wrapper" style={{ position: "relative" }}>
              <Form.Control
                type="text"
                value={builderSearchTerm}
                onChange={(e) => handleBuilderInputChange(e.target.value)}
                onFocus={handleBuilderFocus}
                onBlur={handleBuilderBlur}
                onKeyDown={handleBuilderKeyDown}
                placeholder={loadingBuilders ? "Loading builders..." : "Type to search or enter custom builder name"}
                className="form-control-enhanced"
                disabled={loadingBuilders}
                autoComplete="off"
              />
              {loadingBuilders && (
                <div className="position-absolute" style={{ right: "15px", top: "50%", transform: "translateY(-50%)" }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              
              {/* Dropdown with filtered results */}
              {showBuilderDropdown && builderInputFocused && (
                <div 
                  className="builder-dropdown"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #e9ecef",
                    borderRadius: "0 0 10px 10px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    marginTop: "2px",
                  }}
                >
                  {filteredBuilders.length > 0 ? (
                    filteredBuilders.map((builder, index) => {
                      const builderName = builder.builderName || builder.name;
                      const isHighlighted = index === builderHighlightedIndex;
                      return (
                        <div
                          key={builder.id || builderName}
                          onClick={() => handleBuilderSelect(builder)}
                          onMouseEnter={() => setBuilderHighlightedIndex(index)}
                          style={{
                            padding: "0.75rem 1rem",
                            cursor: "pointer",
                            borderBottom: "1px solid #f1f3f4",
                            transition: "background-color 0.2s",
                            backgroundColor: isHighlighted ? "#f8f9fa" : "white",
                          }}
                          onMouseLeave={() => setBuilderHighlightedIndex(-1)}
                        >
                          {builderName}
                        </div>
                      );
                    })
                  ) : builderSearchTerm ? (
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        color: "#28a745",
                        fontWeight: "500",
                      }}
                    >
                      ✓ Custom builder: &quot;{builderSearchTerm}&quot; will be saved
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        color: "#6c757d",
                      }}
                    >
                      {loadingBuilders ? "Loading..." : "Start typing to search or enter a custom builder name"}
                    </div>
                  )}
                </div>
              )}
            </div>
            <Form.Text className="text-muted" style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
              <CIcon icon={cilCheck} className="me-1" />
              Type to search from list or enter a custom builder name
            </Form.Text>
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
            <div className="searchable-select-wrapper" style={{ position: "relative" }}>
              <Form.Control
                type="text"
                value={citySearchTerm}
                onChange={(e) => handleCityInputChange(e.target.value)}
                onFocus={handleCityFocus}
                onBlur={handleCityBlur}
                onKeyDown={handleCityKeyDown}
                placeholder={loadingCities ? "Loading cities..." : "Type to search city"}
                className="form-control-enhanced"
                disabled={loadingCities}
                isInvalid={!!errors.city}
                autoComplete="off"
              />
              {loadingCities && (
                <div className="position-absolute" style={{ right: "15px", top: "50%", transform: "translateY(-50%)" }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              
              {/* Dropdown with filtered results */}
              {showCityDropdown && cityInputFocused && (
                <div 
                  className="city-dropdown"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: "white",
                    border: "1px solid #e9ecef",
                    borderRadius: "0 0 10px 10px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    zIndex: 1000,
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    marginTop: "2px",
                  }}
                >
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city, index) => {
                      const cityName = city.cityName || city.name || city;
                      const isHighlighted = index === cityHighlightedIndex;
                      return (
                        <div
                          key={city.id || cityName}
                          onClick={() => handleCitySelect(city)}
                          onMouseEnter={() => setCityHighlightedIndex(index)}
                          style={{
                            padding: "0.75rem 1rem",
                            cursor: "pointer",
                            borderBottom: "1px solid #f1f3f4",
                            transition: "background-color 0.2s",
                            backgroundColor: isHighlighted ? "#f8f9fa" : "white",
                          }}
                          onMouseLeave={() => setCityHighlightedIndex(-1)}
                        >
                          {cityName}
                          {city.state && (
                            <span style={{ color: "#6c757d", fontSize: "0.85rem", marginLeft: "0.5rem" }}>
                              ({city.state})
                            </span>
                          )}
                        </div>
                      );
                    })
                  ) : citySearchTerm ? (
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        color: "#6c757d",
                        fontStyle: "italic",
                      }}
                    >
                      No matching cities found. Please select from the list.
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        color: "#6c757d",
                      }}
                    >
                      {loadingCities ? "Loading..." : "Start typing to search cities"}
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.city && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.city}
              </div>
            )}
            <Form.Text className="text-muted" style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
              <CIcon icon={cilCheck} className="me-1" />
              Type to search from available cities
            </Form.Text>
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
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Only allow digits
                onChange("pincode", value.slice(0, 6)); // Limit to 6 digits
              }}
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

        {/* Facing - More relevant for residential properties */}
        {data.listingType === "Residential" && (
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
        )}

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
  const isResidential = data.listingType === "Residential";
  const isCommercial = data.listingType === "Commercial";

  // Common amenities for both types
  const commonAmenities = [
    "Parking",
    "Security",
    "Lift",
    "Power Backup",
    "Water Supply",
    "Shopping Center",
    "Hospital",
    "Metro Station",
  ];

  // Residential-specific amenities
  const residentialAmenities = [
    "Swimming Pool",
    "Gym",
    "Garden",
    "Club House",
    "Children's Play Area",
    "School",
  ];

  // Commercial-specific amenities
  const commercialAmenities = [
    "Conference Room",
    "Reception Area",
    "Cafeteria",
    "Fire Safety",
    "Air Conditioning",
    "High-Speed Elevator",
    "Banking Facility",
    "ATM",
  ];

  // Combine amenities based on listing type
  const amenities = isResidential
    ? [...commonAmenities, ...residentialAmenities]
    : isCommercial
    ? [...commonAmenities, ...commercialAmenities]
    : commonAmenities;

  // Residential-specific features
  const residentialFeatures = [
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

  // Commercial-specific features
  const commercialFeatures = [
    "Fully Furnished",
    "Semi Furnished",
    "Unfurnished",
    "Air Conditioning",
    "False Ceiling",
    "Carpeted Flooring",
    "Modular Workstations",
    "Conference Room",
    "Pantry",
    "Reception Area",
    "Storage Space",
    "Parking Space",
  ];

  const features = isResidential ? residentialFeatures : isCommercial ? commercialFeatures : [];

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
      <h4 className="step-title mb-4">
        {isResidential ? "Residential" : isCommercial ? "Commercial" : "Property"} Features & Amenities
      </h4>

      {!data.listingType && (
        <Alert variant="warning" className="mb-4">
          <CIcon icon={cilWarning} className="me-2" />
          Please select a listing type in Step 1 to see relevant fields.
        </Alert>
      )}

      <Row className="g-3">
        {/* Residential-specific fields */}
        {isResidential && (
          <>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Number of Bedrooms (BHK) *</Form.Label>
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
          </>
        )}

        {/* Commercial-specific fields */}
        {isCommercial && (
          <>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Number of Floors/Levels</Form.Label>
                <Form.Select
                  value={data.bedrooms}
                  onChange={(e) => onChange("bedrooms", e.target.value)}
                >
                  <option value="">Select Levels</option>
                  <option value="1">Ground Floor</option>
                  <option value="2">1st Floor</option>
                  <option value="3">2nd Floor</option>
                  <option value="4">3rd Floor</option>
                  <option value="5">4+ Floors</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Number of Washrooms</Form.Label>
                <Form.Select
                  value={data.bathrooms}
                  onChange={(e) => onChange("bathrooms", e.target.value)}
                >
                  <option value="">Select Washrooms</option>
                  <option value="1">1 Washroom</option>
                  <option value="2">2 Washrooms</option>
                  <option value="3">3 Washrooms</option>
                  <option value="4">4+ Washrooms</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </>
        )}

        {/* Common fields for both */}
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

        {/* Furnishing - more relevant for residential but available for commercial too */}
        {(isResidential || isCommercial) && (
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
        )}
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

      {features.length > 0 && (
        <Row className="mt-4">
          <Col md={12}>
            <h5>{isResidential ? "Residential" : "Commercial"} Features</h5>
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
      )}

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
            <Form.Label className="d-flex align-items-center gap-2 mb-2">
              Property Images
              <span className="required-indicator">*</span>
              {data.imagePreviews && data.imagePreviews.length > 0 && (
                <Badge bg="primary" className="ms-2">
                  {data.imagePreviews.length} {data.imagePreviews.length === 1 ? 'file' : 'files'}
                </Badge>
              )}
            </Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={onImageChange}
              isInvalid={!!errors.images}
              className="form-control-enhanced"
            />
            {errors.images && (
              <Form.Control.Feedback type="invalid">
                {errors.images}
              </Form.Control.Feedback>
            )}
            <Form.Text className="text-muted">
              Upload at least one image of your property (JPG, PNG, max 5MB each). Images must be rectangular (not square).
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
                        <NextImage
                          src={imageData.preview}
                          alt={`Property image ${index + 1}`}
                          className="gallery-image"
                          height={200}
                          width={300}
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
              isInvalid={!!errors.virtualTour}
            />
            {errors.virtualTour && (
              <Form.Control.Feedback type="invalid">
                {errors.virtualTour}
              </Form.Control.Feedback>
            )}
            <Form.Text className="text-muted">
              Optional: Enter a valid URL for virtual tour (e.g., YouTube, Matterport)
            </Form.Text>
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
            <Form.Label>Preferred Contact Method</Form.Label>
            <Form.Select
              value={data.contactPreference}
              onChange={(e) => onChange("contactPreference", e.target.value)}
            >
              <option value="Phone">Phone</option>
              <option value="Email">Email</option>
              <option value="Any">Any</option>
            </Form.Select>
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

        <Col md={6}>
          <Form.Group>
            <Form.Label>Ownership Type</Form.Label>
            <Form.Control
              type="text"
              value={data.ownershipType}
              onChange={(e) => onChange("ownershipType", e.target.value)}
              placeholder="e.g., Freehold, Leasehold"
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>RERA ID</Form.Label>
            <Form.Control
              type="text"
              value={data.reraId}
              onChange={(e) => onChange("reraId", e.target.value)}
              placeholder="Enter RERA registration number"
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>RERA State</Form.Label>
            <Form.Control
              type="text"
              value={data.reraState}
              onChange={(e) => onChange("reraState", e.target.value)}
              placeholder="State where RERA is registered"
            />
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

        <Col md={12}>
          <div className="d-flex flex-column gap-2 mt-2">
            <Form.Check
              type="checkbox"
              id="truthfulDeclaration"
              label="I confirm that the information provided is true and accurate"
              checked={!!data.truthfulDeclaration}
              onChange={(e) => onChange("truthfulDeclaration", e.target.checked)}
              isInvalid={!!errors.truthfulDeclaration}
            />
            {errors.truthfulDeclaration && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.truthfulDeclaration}
              </div>
            )}
            <Form.Check
              type="checkbox"
              id="dpdpConsent"
              label="I consent to MyPropertyFact storing and processing my data"
              checked={!!data.dpdpConsent}
              onChange={(e) => onChange("dpdpConsent", e.target.checked)}
              isInvalid={!!errors.dpdpConsent}
            />
            {errors.dpdpConsent && (
              <div className="error-message">
                <CIcon icon={cilWarning} className="error-icon" />
                {errors.dpdpConsent}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
