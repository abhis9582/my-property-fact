"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Tab, Nav, Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faSave,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import "./multi-step-form.css";

// Import step components
import BasicInfoStep from "./steps/BasicInfoStep";
import AmenitiesStep from "./steps/AmenitiesStep";
import BannersStep from "./steps/BannersStep";
import FloorPlansStep from "./steps/FloorPlansStep";
import GalleryStep from "./steps/GalleryStep";
import FAQsStep from "./steps/FAQsStep";
import ProjectAboutStep from "./steps/ProjectAboutStep";
import ProjectWalkthroughStep from "./steps/ProjectWalkthroughStep";
import LocationBenefitsStep from "./steps/LocationBenefitsStep";

const STEPS = [
  { id: "basic", label: "Basic Info", icon: "📝" },
  { id: "amenities", label: "Amenities", icon: "🏢" },
  { id: "banners", label: "Banners", icon: "🖼️" },
  { id: "floor-plans", label: "Floor Plans", icon: "📐" },
  { id: "gallery", label: "Gallery", icon: "🖼️" },
  { id: "faqs", label: "FAQs", icon: "❓" },
  { id: "about", label: "About", icon: "📄" },
  { id: "walkthrough", label: "Walkthrough", icon: "🎥" },
  { id: "location-benefits", label: "Location", icon: "📍" },
];

export default function MultiStepProjectForm({
  projectId = null,
  projectData = null,
  builderList = [],
  typeList = [],
  countryData = [],
  projectStatusList = [],
  amenityList = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeStep, setActiveStep] = useState("basic");
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState(projectId);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track if formData has been initialized to prevent overwriting user edits
  const formDataInitializedRef = useRef(false);

  useEffect(() => {
    const stepParam = searchParams.get("step");
    const projectIdParam = searchParams.get("projectId");
    
    if (stepParam && STEPS.find((s) => s.id === stepParam)) {
      setActiveStep(stepParam);
    }
    
    if (projectIdParam && !savedProjectId) {
      setSavedProjectId(parseInt(projectIdParam));
    }
    
    // Only initialize formData once when projectData is first available
    // This prevents overwriting user edits if projectData prop changes later
    if (projectData && !formDataInitializedRef.current) {
      // Map project data to formData structure
      const mappedData = {
        ...projectData,
        // Map nested data structures
        amenities: projectData.projectAmenityList || [],
        banners: {
          mobile: projectData.projectMobileBannerDtoList || [],
          desktop: projectData.projectDesktopBannerDtoList || [],
          deletedMobileIds: [],
          deletedDesktopIds: []
        },
        gallery: projectData.projectGalleryImageList || [],
        faqs: projectData.projectFaqList || projectData.projectFaq || [],
        floorPlans: projectData.projectFloorPlanList || projectData.floorPlans || [],
        about: projectData.projectsAbout ? {
          id: projectData.projectsAbout.id,
          shortDesc: projectData.projectsAbout.shortDesc || projectData.projectAboutShortDescription || "",
          longDesc: projectData.projectsAbout.longDesc || projectData.projectAboutLongDescription || ""
        } : {
          shortDesc: projectData.projectAboutShortDescription || "",
          longDesc: projectData.projectAboutLongDescription || ""
        },
        walkthrough: projectData.projectWalkthrough ? {
          id: projectData.projectWalkthrough.id,
          walkthroughDesc: projectData.projectWalkthrough.walkthroughDesc || projectData.projectWalkthroughDescription || ""
        } : {
          walkthroughDesc: projectData.projectWalkthroughDescription || ""
        },
        locationBenefits: projectData.projectLocationBenefitList || projectData.locationBenefits || []
      };
      setFormData(mappedData);
      formDataInitializedRef.current = true;
    }
    
    // Reset initialization flag if projectId changes (new project)
    if (projectId !== savedProjectId) {
      formDataInitializedRef.current = false;
    }
  }, [searchParams, projectId, projectData, savedProjectId]);

  const handleStepChange = useCallback(
    (stepId) => {
      // Only require Basic Info to be saved for new projects
      if (!savedProjectId && stepId !== "basic") {
        toast.warning("Please save Basic Info first");
        return;
      }      
      setActiveStep(stepId);
      const params = new URLSearchParams();
      params.set("step", stepId);
      if (savedProjectId) {
        params.set("projectId", savedProjectId.toString());
      }
      router.push(`/admin/dashboard/manage-projects/edit?${params.toString()}`, {
        scroll: false,
      });
    },
    [savedProjectId, router]
  );

  // Handle step data update (no auto-save, just update local state)
  const handleStepDataUpdate = useCallback((stepId, stepData) => {
    console.log(`Step data update for ${stepId}:`, stepData);
    setFormData((prev) => {
      // Map step IDs to their specific data keys
      const stepDataKeys = {
        'amenities': ['amenities'],
        'banners': ['banners'],
        'gallery': ['gallery', 'deletedImageIds'], // Gallery step also manages deletedImageIds
        'faqs': ['faqs'],
        'floor-plans': ['floorPlans'],
        'about': ['about'],
        'walkthrough': ['walkthrough'],
        'location-benefits': ['locationBenefits']
      };
      
      // Get the keys this step is allowed to update
      const allowedKeys = stepDataKeys[stepId] || [];
      
      // Start with previous formData to preserve all existing data
      const updated = { ...prev };
      
      // Merge stepData
      Object.keys(stepData).forEach((key) => {
        // If this is a step-specific key, only update if this step owns it
        if (allowedKeys.includes(key)) {
          // This step owns this key - update it
          updated[key] = stepData[key];
        } else if (!stepDataKeys[stepId]) {
          // BasicInfoStep (no stepDataKeys entry) - update all non-step-specific fields
          // But don't overwrite step-specific keys that belong to other steps
          const isStepSpecificKey = Object.values(stepDataKeys).some(keys => keys.includes(key));
          if (!isStepSpecificKey) {
            // Not a step-specific key, safe to update
            updated[key] = stepData[key];
          }
          // If it's a step-specific key but not owned by this step, preserve existing value
        }
      });
      
      console.log(`Updated formData:`, updated);
      return updated;
    });
    setHasUnsavedChanges(true);
  }, []);

  // Helper to create FormData - memoized to avoid recreating on every render
  const createFormData = useCallback((data) => {
    const formDataObj = new FormData();
    const dto = { ...data };
    
    // Handle files if they exist
    if (data.projectLogo instanceof File) {
      formDataObj.append("projectLogo", data.projectLogo);
    }
    if (data.locationMap instanceof File) {
      formDataObj.append("locationMap", data.locationMap);
    }
    // Remove file objects and previews from DTO
    delete dto.projectLogo;
    delete dto.locationMap;
    delete dto.projectLogoPreview;
    delete dto.locationMapPreview;

    formDataObj.append(
      "addUpdateProjectDto",
      new Blob([JSON.stringify(dto)], { type: "application/json" })
    );

    return formDataObj;
  }, []);

  // Common function to save project steps (reduces code duplication)
  const saveProjectSteps = useCallback(async (projectId, formData) => {
    const errors = [];

    // 1. Save amenities - always save to ensure they're updated (even if empty array)
    try {
      const amenities = formData.amenities || [];
      const amenityList = Array.isArray(amenities)
        ? amenities
            .filter(a => a && (a.id || a.amenityId))
            .map(a => ({ id: a.id || a.amenityId }))
        : [];
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}projects/add-update-amenity`,
        { projectId, amenityList }
      );
    } catch (error) {
      console.error("Error saving amenities:", error);
      errors.push("amenities");
    }

    // 2. Save banners - only if there are changes
    if (formData.banners) {
      try {
        const bannerFormData = new FormData();
        bannerFormData.append("projectId", projectId.toString());
        
        if (formData.banners.deletedMobileIds?.length > 0) {
          bannerFormData.append("deletedMobileImageIds", formData.banners.deletedMobileIds.join(","));
        }
        if (formData.banners.deletedDesktopIds?.length > 0) {
          bannerFormData.append("deletedDesktopImageIds", formData.banners.deletedDesktopIds.join(","));
        }
        
        const mobileFiles = formData.banners.mobile?.filter(img => img?.file instanceof File) || [];
        const desktopFiles = formData.banners.desktop?.filter(img => img?.file instanceof File) || [];
        
        mobileFiles.forEach(img => bannerFormData.append("projectMobileBannerImageList", img.file));
        desktopFiles.forEach(img => bannerFormData.append("projectDesktopBannerImageList", img.file));

        const hasChanges = mobileFiles.length > 0 || desktopFiles.length > 0 || 
                          formData.banners.deletedMobileIds?.length > 0 ||
                          formData.banners.deletedDesktopIds?.length > 0;

        if (hasChanges) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}project-banner/add-banner`,
            bannerFormData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }
      } catch (error) {
        console.error("Error saving banners:", error);
        errors.push("banners");
      }
    }

    // 3. Save gallery - only if there are changes
    if (formData.gallery !== undefined) {
      try {
        const galleryFormData = new FormData();
        galleryFormData.append("projectId", projectId.toString());
        
        const deletedIds = formData.deletedImageIds || formData.gallery?.deletedImageIds || [];
        if (Array.isArray(deletedIds) && deletedIds.length > 0) {
          galleryFormData.append("deletedImageIds", deletedIds.join(","));
        }
        
        const galleryArray = Array.isArray(formData.gallery) ? formData.gallery : [];
        const newFiles = galleryArray.filter(img => img?.file instanceof File);
        
        newFiles.forEach(img => galleryFormData.append("galleryImageList", img.file));

        const hasChanges = newFiles.length > 0 || deletedIds.length > 0;
        if (hasChanges) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}project-gallery/add-new`,
            galleryFormData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }
      } catch (error) {
        console.error("Error saving gallery:", error);
        errors.push("gallery");
      }
    }

    // 4. Save about
    if (formData.about !== undefined) {
      try {
        const aboutData = {
          projectId,
          shortDesc: formData.about?.shortDesc || "",
          longDesc: formData.about?.longDesc || ""
        };
        if (formData.about?.id) {
          aboutData.id = formData.about.id;
        }
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}project-about/add-update`,
          aboutData
        );
      } catch (error) {
        console.error("Error saving about:", error);
        errors.push("about");
      }
    }

    // 5. Save walkthrough
    if (formData.walkthrough !== undefined) {
      try {
        const walkthroughData = {
          projectId,
          walkthroughDesc: formData.walkthrough?.walkthroughDesc || ""
        };
        if (formData.walkthrough?.id) {
          walkthroughData.id = formData.walkthrough.id;
        }
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}project-walkthrough/add-update`,
          walkthroughData
        );
      } catch (error) {
        console.error("Error saving walkthrough:", error);
        errors.push("walkthrough");
      }
    }

    return errors;
  }, []);

  // Save as Draft
  const handleSaveDraft = async () => {
    if (!savedProjectId) {
      toast.error("Please save Basic Info first");
      return;
    }

    try {
      setIsSaving(true);
      
      // 1. Save main project data with status=false (draft)
      const dataToSave = { 
        ...formData, 
        status: false, 
        id: savedProjectId,
        slugURL: formData.slugURL || formData.slugurl || ""
      };
      const formDataObj = createFormData(dataToSave);
      
      const projectResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}projects/add-new`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (projectResponse.data.isSuccess !== 1) {
        const errorMsg = projectResponse.data.message || "Failed to save project. Please try again.";
        toast.error(errorMsg);
        setIsSaving(false);
        return;
      }

      // 2. Save all project steps
      const errors = await saveProjectSteps(savedProjectId, formData);
      
      if (errors.length > 0) {
        toast.warning(`Project saved but failed to update: ${errors.join(", ")}. Please try updating them separately.`);
      } else {
        toast.success("Project saved as draft!");
      }
      
      setHasUnsavedChanges(false);
      router.refresh();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An error occurred while saving the draft. Please check your input and try again.";
      toast.error(errorMessage);
      console.error("Error saving draft:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Project
  const handlePublish = async () => {
    if (!savedProjectId) {
      toast.error("Please save Basic Info first");
      return;
    }

    try {
      setIsSaving(true);
      
      // 1. Save main project data with status=true (published)
      const dataToSave = { 
        ...formData, 
        status: true, 
        id: savedProjectId,
        slugURL: formData.slugURL || formData.slugurl || ""
      };
      const formDataObj = createFormData(dataToSave);
      
      const projectResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}projects/add-new`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (projectResponse.data.isSuccess !== 1) {
        const errorMsg = projectResponse.data.message || "Failed to publish project. Please try again.";
        toast.error(errorMsg);
        setIsSaving(false);
        return;
      }

      // 2. Save all project steps
      const errors = await saveProjectSteps(savedProjectId, formData);
      
      if (errors.length > 0) {
        toast.warning(`Project published but failed to update: ${errors.join(", ")}. Please try updating them separately.`);
      } else {
        toast.success("Project published successfully!");
      }
      
      setHasUnsavedChanges(false);
      router.push("/admin/dashboard/manage-projects");
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An error occurred while publishing the project. Please check your input and try again.";
      toast.error(errorMessage);
      console.error("Error publishing project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isStepAccessible = useCallback(
    (stepId) => {
      if (stepId === "basic") return true;
      return !!savedProjectId;
    },
    [savedProjectId]
  );

  const currentStepIndex = STEPS.findIndex((s) => s.id === activeStep);
  const progressPercentage = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="multi-step-form-container">
      {/* Header */}
      <div className="admin-page-header">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h1 className="mb-0" style={{ fontSize: '2rem', fontWeight: 700, color: '#2c3e50' }}>
              {savedProjectId ? "Edit Project" : "Add New Project"}
              {savedProjectId && (
                <Badge bg="success" className="ms-2" style={{ fontSize: '0.875rem' }}>
                  ID: {savedProjectId}
                </Badge>
              )}
              {hasUnsavedChanges && (
                <Badge bg="warning" className="ms-2" style={{ fontSize: '0.875rem' }}>
                  Unsaved Changes
                </Badge>
              )}
            </h1>
            <p className="text-muted mb-0 mt-2" style={{ fontSize: '0.9rem' }}>
              {savedProjectId 
                ? "Fill all steps and save as draft or publish" 
                : "Start by filling Basic Info and save to continue"}
            </p>
          </div>
          <div className="d-flex gap-2 mt-2 mt-md-0">
            {savedProjectId && (
              <>
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={isSaving || !hasUnsavedChanges}
                >
                  <FontAwesomeIcon icon={faSave} className="me-1" />
                  Save Draft
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handlePublish}
                  disabled={isSaving}
                >
                  <FontAwesomeIcon icon={faEye} className="me-1" />
                  Publish
                </Button>
              </>
            )}
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => router.back()}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="admin-content-card progress-section">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-muted">
            Step {currentStepIndex + 1} of {STEPS.length}
          </small>
          <Badge bg="success">{Math.round(progressPercentage)}%</Badge>
        </div>
        <div className="progress" style={{ height: "6px" }}>
          <div
            className="progress-bar bg-success"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Step Tabs */}
      <div className="admin-content-card step-tabs-container">
        <Nav variant="tabs" className="step-tabs">
          {STEPS.map((step) => {
            const isActive = activeStep === step.id;
            const isAccessible = isStepAccessible(step.id);

            return (
              <Nav.Item key={step.id}>
                <Nav.Link
                  eventKey={step.id}
                  disabled={!isAccessible}
                  active={isActive}
                  onClick={() => isAccessible && handleStepChange(step.id)}
                  className="step-tab"
                >
                  <span className="step-icon">{step.icon}</span>
                  <span className="step-label">{step.label}</span>
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>
      </div>

      {/* Content Area */}
      <div className="admin-content-card form-content">
        <Tab.Container activeKey={activeStep} onSelect={handleStepChange}>
          <Tab.Content>
            <Tab.Pane eventKey="basic">
              <BasicInfoStep
                projectId={savedProjectId}
                projectData={projectData}
                builderList={builderList}
                typeList={typeList}
                countryData={countryData}
                projectStatusList={projectStatusList}
                onComplete={(data) => {
                  // Update formData
                  handleStepDataUpdate("basic", data);
                  // If this is a save operation (ID changed or new project got ID), update savedProjectId
                  if (data.id && data.id !== savedProjectId) {
                    setSavedProjectId(data.id);
                    setHasUnsavedChanges(false);
                    toast.success("Basic info saved!");
                  }
                }}
                initialData={formData}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="amenities">
              <AmenitiesStep
                projectId={savedProjectId}
                amenityList={amenityList}
                onComplete={(data) => handleStepDataUpdate("amenities", data)}
                initialData={formData}
                isActive={activeStep === "amenities"}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="banners">
              <BannersStep
                projectId={savedProjectId}
                onComplete={(data) => handleStepDataUpdate("banners", data)}
                initialData={formData}
                isActive={activeStep === "banners"}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="floor-plans">
              <FloorPlansStep
                projectId={savedProjectId}
                onComplete={(data) => handleStepDataUpdate("floor-plans", data)}
                initialData={formData}
                isActive={activeStep === "floor-plans"}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="gallery">
              <GalleryStep
                projectId={savedProjectId}
                onComplete={(data) => handleStepDataUpdate("gallery", data)}
                initialData={formData}
                isActive={activeStep === "gallery"}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="faqs">
              <FAQsStep
                projectId={savedProjectId}
                onComplete={(data) => handleStepDataUpdate("faqs", data)}
                initialData={formData}
                isActive={activeStep === "faqs"}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="about">
              <ProjectAboutStep
                projectId={savedProjectId}
                onComplete={(data) => handleStepDataUpdate("about", data)}
                initialData={formData}
                isActive={activeStep === "about"}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="walkthrough">
              <ProjectWalkthroughStep
                projectId={savedProjectId}
                onComplete={(data) => handleStepDataUpdate("walkthrough", data)}
                initialData={formData}
                isActive={activeStep === "walkthrough"}
              />
            </Tab.Pane>

            <Tab.Pane eventKey="location-benefits">
              <LocationBenefitsStep
                projectId={savedProjectId}
                onComplete={(data) => handleStepDataUpdate("location-benefits", data)}
                initialData={formData}
                isActive={activeStep === "location-benefits"}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>

      {/* Footer Navigation */}
      <div className="admin-content-card form-footer">
        <Button
          variant="outline-secondary"
          size="sm"
          disabled={currentStepIndex === 0 || isSaving}
          onClick={() => {
            if (currentStepIndex > 0) {
              handleStepChange(STEPS[currentStepIndex - 1].id);
            }
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
          Previous
        </Button>

        <div className="step-indicator-dots">
          {STEPS.map((step) => (
            <span
              key={step.id}
              className={`dot ${activeStep === step.id ? "active" : ""}`}
              onClick={() => isStepAccessible(step.id) && handleStepChange(step.id)}
            ></span>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={currentStepIndex === STEPS.length - 1 || isSaving}
          onClick={() => {
            if (currentStepIndex < STEPS.length - 1) {
              handleStepChange(STEPS[currentStepIndex + 1].id);
            }
          }}
        >
          Next
          <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
        </Button>
      </div>
    </div>
  );
}
