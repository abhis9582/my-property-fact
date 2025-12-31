"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Tab, Nav, Row, Col, Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircle,
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
  const isLoadingFromStorageRef = useRef(false);

  // Get localStorage key for this project
  const getStorageKey = useCallback(() => {
    const currentProjectId = savedProjectId || projectId || 'new';
    return `project-form-data-${currentProjectId}`;
  }, [savedProjectId, projectId]);

  // Save formData to localStorage
  const saveToLocalStorage = useCallback((data) => {
    try {
      const storageKey = getStorageKey();
      // Don't save File objects to localStorage - they can't be serialized
      const dataToSave = { ...data };
      // Remove File objects and blob URLs
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] instanceof File) {
          delete dataToSave[key];
        }
        if (typeof dataToSave[key] === 'string' && dataToSave[key].startsWith('blob:')) {
          delete dataToSave[key];
        }
        // Handle nested objects (like banners)
        if (dataToSave[key] && typeof dataToSave[key] === 'object' && !Array.isArray(dataToSave[key])) {
          Object.keys(dataToSave[key]).forEach(nestedKey => {
            if (dataToSave[key][nestedKey] instanceof File) {
              delete dataToSave[key][nestedKey];
            }
            if (Array.isArray(dataToSave[key][nestedKey])) {
              dataToSave[key][nestedKey] = dataToSave[key][nestedKey].map(item => {
                if (item && typeof item === 'object') {
                  const cleaned = { ...item };
                  if (cleaned.file instanceof File) {
                    delete cleaned.file;
                  }
                  if (cleaned.preview && cleaned.preview.startsWith('blob:')) {
                    delete cleaned.preview;
                  }
                  return cleaned;
                }
                return item;
              });
            }
          });
        }
        // Handle arrays that might contain File objects
        if (Array.isArray(dataToSave[key])) {
          dataToSave[key] = dataToSave[key].map(item => {
            if (item && typeof item === 'object') {
              const cleaned = { ...item };
              if (cleaned.file instanceof File) {
                delete cleaned.file;
              }
              if (cleaned.preview && cleaned.preview.startsWith('blob:')) {
                delete cleaned.preview;
              }
              return cleaned;
            }
            return item;
          });
        }
      });
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      console.log('✅ Saved to localStorage:', storageKey, {
        amenities: dataToSave.amenities?.length || 0,
        banners: dataToSave.banners ? 'exists' : 'none',
        gallery: dataToSave.gallery?.length || 0,
        faqs: dataToSave.faqs?.length || 0,
        floorPlans: dataToSave.floorPlans?.length || 0,
        about: dataToSave.about ? 'exists' : 'none',
        walkthrough: dataToSave.walkthrough ? 'exists' : 'none',
        locationBenefits: dataToSave.locationBenefits?.length || 0,
      });
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [getStorageKey]);

  // Load formData from localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const storageKey = getStorageKey();
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        console.log('📦 Loaded from localStorage:', storageKey, {
          amenities: data.amenities?.length || 0,
          banners: data.banners ? 'exists' : 'none',
          gallery: data.gallery?.length || 0,
          faqs: data.faqs?.length || 0,
          floorPlans: data.floorPlans?.length || 0,
          about: data.about ? 'exists' : 'none',
          walkthrough: data.walkthrough ? 'exists' : 'none',
          locationBenefits: data.locationBenefits?.length || 0,
        });
        return data;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    return null;
  }, [getStorageKey]);

  // Clear localStorage for this project
  const clearLocalStorage = useCallback(() => {
    try {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
      console.log('✅ Cleared localStorage for project:', storageKey);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, [getStorageKey]);

  useEffect(() => {
    const stepParam = searchParams.get("step");
    const projectIdParam = searchParams.get("projectId");
    
    if (stepParam && STEPS.find((s) => s.id === stepParam)) {
      setActiveStep(stepParam);
    }
    
    if (projectIdParam && !savedProjectId) {
      setSavedProjectId(parseInt(projectIdParam));
    }

    // Initialize formData - merge localStorage, projectData, and defaults
    const localStorageData = loadFromLocalStorage();
    
    if (projectData) {
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
      
      // Merge with localStorage data (localStorage takes precedence for step-specific data)
      const mergedData = { ...mappedData };
      if (localStorageData) {
        // Merge step-specific data from localStorage
        const stepSpecificKeys = ['amenities', 'banners', 'gallery', 'faqs', 'floorPlans', 'about', 'walkthrough', 'locationBenefits'];
        stepSpecificKeys.forEach(key => {
          if (localStorageData[key] !== undefined && localStorageData[key] !== null) {
            mergedData[key] = localStorageData[key];
          }
        });
        // Merge other fields from localStorage (but projectData takes precedence for basic info)
        Object.keys(localStorageData).forEach(key => {
          if (!stepSpecificKeys.includes(key) && mergedData[key] === undefined) {
            mergedData[key] = localStorageData[key];
          }
        });
      }
      
      setFormData(mergedData);
    } else if (localStorageData) {
      // No projectData, but we have localStorage data
      setFormData(localStorageData);
    }
  }, [searchParams, projectId, projectData, loadFromLocalStorage]);

  const handleStepChange = useCallback(
    (stepId) => {
      // Only require Basic Info to be saved for new projects
      if (!savedProjectId && stepId !== "basic") {
        toast.warning("Please save Basic Info first");
        return;
      }
      
      // Reload from localStorage before switching steps to ensure we have latest data
      const localStorageData = loadFromLocalStorage();
      if (localStorageData && Object.keys(localStorageData).length > 0) {
        setFormData((prev) => {
          // Merge localStorage data with current formData, preserving all step-specific data
          const merged = { ...prev };
          const stepSpecificKeys = ['amenities', 'banners', 'gallery', 'faqs', 'floorPlans', 'about', 'walkthrough', 'locationBenefits'];
          
          // Update step-specific keys from localStorage
          stepSpecificKeys.forEach(key => {
            if (localStorageData[key] !== undefined && localStorageData[key] !== null) {
              merged[key] = localStorageData[key];
            }
          });
          
          // Update other fields from localStorage if not already set
          Object.keys(localStorageData).forEach(key => {
            if (!stepSpecificKeys.includes(key) && (merged[key] === undefined || merged[key] === null)) {
              merged[key] = localStorageData[key];
            }
          });
          
          return merged;
        });
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
    [savedProjectId, router, loadFromLocalStorage]
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
      // Save to localStorage
      saveToLocalStorage(updated);
      return updated;
    });
    setHasUnsavedChanges(true);
  }, [saveToLocalStorage]);

  // Save formData to localStorage whenever it changes (as backup)
  useEffect(() => {
    // Don't save if we're currently loading from storage to avoid loops
    if (!isLoadingFromStorageRef.current && Object.keys(formData).length > 0) {
      saveToLocalStorage(formData);
    }
  }, [formData, saveToLocalStorage]);

  // Reload from localStorage when active step changes to ensure steps have latest data
  useEffect(() => {
    isLoadingFromStorageRef.current = true;
    const localStorageData = loadFromLocalStorage();
    if (localStorageData && Object.keys(localStorageData).length > 0) {
      setFormData((prev) => {
        // Merge localStorage data with current formData
        const stepSpecificKeys = ['amenities', 'banners', 'gallery', 'faqs', 'floorPlans', 'about', 'walkthrough', 'locationBenefits'];
        const merged = { ...prev };
        let hasUpdates = false;
        
        // Update step-specific keys from localStorage (always prefer localStorage for these)
        stepSpecificKeys.forEach(key => {
          if (localStorageData[key] !== undefined && localStorageData[key] !== null) {
            // Special handling for gallery: preserve File objects from current state
            if (key === 'gallery' && Array.isArray(prev[key]) && Array.isArray(localStorageData[key])) {
              // Merge: use localStorage data but preserve File objects from current state
              const mergedGallery = localStorageData[key].map(savedItem => {
                // Find matching item in current state by id or preview (non-blob)
                const currentItem = prev[key].find(curr => 
                  (savedItem.id && curr.id === savedItem.id) ||
                  (savedItem.preview && curr.preview === savedItem.preview && !savedItem.preview.startsWith('blob:'))
                );
                // If current item has a File object, preserve it
                if (currentItem && currentItem.file instanceof File) {
                  return { ...savedItem, file: currentItem.file, preview: currentItem.preview };
                }
                return savedItem;
              });
              // Add any new items from current state that aren't in localStorage (newly added files)
              prev[key].forEach(currentItem => {
                if (currentItem.file instanceof File) {
                  const exists = mergedGallery.some(saved => 
                    saved.preview === currentItem.preview && currentItem.preview.startsWith('blob:')
                  );
                  if (!exists) {
                    mergedGallery.push(currentItem);
                  }
                }
              });
              merged[key] = mergedGallery;
              hasUpdates = true;
            } else if (key === 'banners' && prev[key] && localStorageData[key] && 
                       typeof prev[key] === 'object' && typeof localStorageData[key] === 'object') {
              // Special handling for banners: preserve File objects from current state
              const currentBanners = prev[key];
              const savedBanners = localStorageData[key];
              const mergedBanners = { ...savedBanners };
              
              // Preserve File objects for mobile banners
              if (Array.isArray(savedBanners.mobile) && Array.isArray(currentBanners.mobile)) {
                mergedBanners.mobile = savedBanners.mobile.map(savedItem => {
                  const currentItem = currentBanners.mobile.find(curr => 
                    (savedItem.id && curr.id === savedItem.id) ||
                    (savedItem.preview && curr.preview === savedItem.preview && !savedItem.preview.startsWith('blob:'))
                  );
                  if (currentItem && currentItem.file instanceof File) {
                    return { ...savedItem, file: currentItem.file, preview: currentItem.preview };
                  }
                  return savedItem;
                });
                // Add new mobile banner files
                currentBanners.mobile.forEach(currentItem => {
                  if (currentItem.file instanceof File) {
                    const exists = mergedBanners.mobile.some(saved => 
                      saved.preview === currentItem.preview && currentItem.preview.startsWith('blob:')
                    );
                    if (!exists) {
                      mergedBanners.mobile.push(currentItem);
                    }
                  }
                });
              }
              
              // Preserve File objects for desktop banners
              if (Array.isArray(savedBanners.desktop) && Array.isArray(currentBanners.desktop)) {
                mergedBanners.desktop = savedBanners.desktop.map(savedItem => {
                  const currentItem = currentBanners.desktop.find(curr => 
                    (savedItem.id && curr.id === savedItem.id) ||
                    (savedItem.preview && curr.preview === savedItem.preview && !savedItem.preview.startsWith('blob:'))
                  );
                  if (currentItem && currentItem.file instanceof File) {
                    return { ...savedItem, file: currentItem.file, preview: currentItem.preview };
                  }
                  return savedItem;
                });
                // Add new desktop banner files
                currentBanners.desktop.forEach(currentItem => {
                  if (currentItem.file instanceof File) {
                    const exists = mergedBanners.desktop.some(saved => 
                      saved.preview === currentItem.preview && currentItem.preview.startsWith('blob:')
                    );
                    if (!exists) {
                      mergedBanners.desktop.push(currentItem);
                    }
                  }
                });
              }
              
              merged[key] = mergedBanners;
              hasUpdates = true;
            } else {
              // Check if data is different
              const currentStr = JSON.stringify(prev[key] || []);
              const savedStr = JSON.stringify(localStorageData[key]);
              if (currentStr !== savedStr) {
                merged[key] = localStorageData[key];
                hasUpdates = true;
              }
            }
          }
        });
        
        // Update other fields from localStorage if they're missing in current formData
        Object.keys(localStorageData).forEach(key => {
          if (!stepSpecificKeys.includes(key)) {
            if (merged[key] === undefined || merged[key] === null) {
              merged[key] = localStorageData[key];
              hasUpdates = true;
            }
          }
        });
        
        // Only update state if there are actual changes to avoid infinite loops
        return hasUpdates ? merged : prev;
      });
    }
    // Reset flag after a short delay to allow state update to complete
    setTimeout(() => {
      isLoadingFromStorageRef.current = false;
    }, 100);
  }, [activeStep, loadFromLocalStorage]);

  // Handle Basic Info save (creates/updates project and gets projectId)
  const handleBasicInfoSave = useCallback(
    async (stepData) => {
      try {
        setIsSaving(true);
        const savedId = stepData.id || savedProjectId;
        if (savedId) {
          setSavedProjectId(savedId);
          setFormData((prev) => {
            const updated = { ...prev, ...stepData };
            saveToLocalStorage(updated);
            return updated;
          });
          setHasUnsavedChanges(false);
          toast.success("Basic info saved!");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSaving(false);
      }
    },
    [savedProjectId, saveToLocalStorage]
  );

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
        return;
      }

      // 2. Save amenities - always save to ensure they're updated (even if empty array)
      try {
        // Get amenities from formData, default to empty array if not set
        const amenities = formData.amenities || [];
        
        // Ensure amenities have id property and filter out invalid entries
        const amenityList = Array.isArray(amenities)
          ? amenities
              .filter(a => a && (a.id || a.amenityId)) // Support both id and amenityId
              .map(a => ({ id: a.id || a.amenityId }))
          : [];
        
        console.log("Saving amenities:", { projectId: savedProjectId, amenityList, originalAmenities: amenities });
        
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}projects/add-update-amenity`,
          {
            projectId: savedProjectId,
            amenityList: amenityList
          }
        );
        console.log("Amenities saved successfully");
      } catch (error) {
        console.error("Error saving amenities:", error);
        console.error("Error response:", error.response?.data);
        console.error("Amenities data:", formData.amenities);
        toast.warning("Project saved but failed to update amenities. Please try updating them separately.");
      }

      // 3. Save banners - always attempt to save if banners data exists
      if (formData.banners) {
        try {
          const bannerFormData = new FormData();
          bannerFormData.append("projectId", savedProjectId.toString());
          
          // Handle deletions
          if (formData.banners.deletedMobileIds && formData.banners.deletedMobileIds.length > 0) {
            bannerFormData.append("deletedMobileImageIds", formData.banners.deletedMobileIds.join(","));
          }
          if (formData.banners.deletedDesktopIds && formData.banners.deletedDesktopIds.length > 0) {
            bannerFormData.append("deletedDesktopImageIds", formData.banners.deletedDesktopIds.join(","));
          }
          
          // Handle new mobile banner files
          const mobileFiles = formData.banners.mobile && Array.isArray(formData.banners.mobile)
            ? formData.banners.mobile.filter(img => img && img.file instanceof File)
            : [];
          
          mobileFiles.forEach(img => {
            bannerFormData.append("projectMobileBannerImageList", img.file);
          });
          
          // Handle new desktop banner files
          const desktopFiles = formData.banners.desktop && Array.isArray(formData.banners.desktop)
            ? formData.banners.desktop.filter(img => img && img.file instanceof File)
            : [];
          
          desktopFiles.forEach(img => {
            bannerFormData.append("projectDesktopBannerImageList", img.file);
          });

          const hasChanges = mobileFiles.length > 0 || desktopFiles.length > 0 || 
                            (formData.banners.deletedMobileIds && formData.banners.deletedMobileIds.length > 0) ||
                            (formData.banners.deletedDesktopIds && formData.banners.deletedDesktopIds.length > 0);

          console.log("Saving banners:", { 
            projectId: savedProjectId, 
            mobileFiles: mobileFiles.length,
            desktopFiles: desktopFiles.length,
            deletedMobile: formData.banners.deletedMobileIds?.length || 0,
            deletedDesktop: formData.banners.deletedDesktopIds?.length || 0,
            hasChanges: hasChanges,
            bannersData: formData.banners
          });

          // Only send request if there are changes (new files or deletions)
          if (hasChanges) {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}project-banner/add-banner`,
              bannerFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log("Banners saved successfully");
          } else {
            console.log("Banners: No changes to save (no new files or deletions)");
          }
        } catch (error) {
          console.error("Error saving banners:", error);
          console.error("Error response:", error.response?.data);
          console.error("Full error:", error);
          console.error("Banners data:", formData.banners);
          toast.warning("Project saved but failed to update banners. Please try updating them separately.");
        }
      }

      // 4. Save gallery - always attempt to save if gallery data exists
      if (formData.gallery !== undefined) {
        try {
          const galleryFormData = new FormData();
          galleryFormData.append("projectId", savedProjectId.toString());
          
          // Handle deletions - check both formData.deletedImageIds and formData.gallery?.deletedImageIds
          const deletedIds = formData.deletedImageIds || formData.gallery?.deletedImageIds || [];
          if (Array.isArray(deletedIds) && deletedIds.length > 0) {
            galleryFormData.append("deletedImageIds", deletedIds.join(","));
          }
          
          // Handle new gallery files
          const galleryArray = Array.isArray(formData.gallery) ? formData.gallery : [];
          const newFiles = galleryArray.filter(img => img && img.file instanceof File);
          
          newFiles.forEach(img => {
            galleryFormData.append("galleryImageList", img.file);
          });

          const hasChanges = newFiles.length > 0 || deletedIds.length > 0;

          console.log("Saving gallery:", { 
            projectId: savedProjectId, 
            newFiles: newFiles.length,
            deletedIds: deletedIds.length,
            totalGalleryItems: galleryArray.length,
            hasChanges: hasChanges,
            formDataKeys: Object.keys(formData),
            deletedImageIds: formData.deletedImageIds,
            galleryDeletedIds: formData.gallery?.deletedImageIds,
            galleryData: formData.gallery
          });

          // Only send request if there are new files or deletions (API requirement)
          if (hasChanges) {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}project-gallery/add-new`,
              galleryFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log("Gallery saved successfully");
          } else {
            console.log("Gallery: No changes to save (no new files or deletions)");
          }
        } catch (error) {
          console.error("Error saving gallery:", error);
          console.error("Error response:", error.response?.data);
          console.error("Full error:", error);
          console.error("Gallery data:", formData.gallery);
          console.error("Deleted IDs:", formData.deletedImageIds);
          toast.warning("Project saved but failed to update gallery. Please try updating it separately.");
        }
      } else {
        console.warn("Gallery not found in formData:", formData);
      }

      // 5. Save about - always attempt to save if about data exists
      if (formData.about !== undefined) {
        try {
          const aboutData = {
            projectId: savedProjectId,
            shortDesc: formData.about?.shortDesc || "",
            longDesc: formData.about?.longDesc || ""
          };
          
          // Try to get existing about ID if available
          if (formData.about?.id) {
            aboutData.id = formData.about.id;
          }

          console.log("Saving about:", { 
            projectId: savedProjectId, 
            hasShortDesc: !!aboutData.shortDesc,
            hasLongDesc: !!aboutData.longDesc,
            aboutId: aboutData.id
          });

          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}project-about/add-update`,
            aboutData
          );
          console.log("About saved successfully");
        } catch (error) {
          console.error("Error saving about:", error);
          console.error("Error response:", error.response?.data);
          console.error("About data:", formData.about);
          toast.warning("Project saved but failed to update about section. Please try updating it separately.");
        }
      }

      // 6. Save walkthrough - always attempt to save if walkthrough data exists
      if (formData.walkthrough !== undefined) {
        try {
          const walkthroughData = {
            projectId: savedProjectId,
            walkthroughDesc: formData.walkthrough?.walkthroughDesc || ""
          };
          
          // Try to get existing walkthrough ID if available
          if (formData.walkthrough?.id) {
            walkthroughData.id = formData.walkthrough.id;
          }

          console.log("Saving walkthrough:", { 
            projectId: savedProjectId, 
            hasDescription: !!walkthroughData.walkthroughDesc,
            walkthroughId: walkthroughData.id
          });

          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}project-walkthrough/add-update`,
            walkthroughData
          );
          console.log("Walkthrough saved successfully");
        } catch (error) {
          console.error("Error saving walkthrough:", error);
          console.error("Error response:", error.response?.data);
          console.error("Walkthrough data:", formData.walkthrough);
          toast.warning("Project saved but failed to update walkthrough. Please try updating it separately.");
        }
      }

      // Clear localStorage only after all data is successfully saved
      clearLocalStorage();
      toast.success("Project saved as draft!");
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
        return;
      }

      // 2. Save amenities - always save to ensure they're updated (even if empty array)
      try {
        // Get amenities from formData, default to empty array if not set
        const amenities = formData.amenities || [];
        
        // Ensure amenities have id property and filter out invalid entries
        const amenityList = Array.isArray(amenities)
          ? amenities
              .filter(a => a && (a.id || a.amenityId)) // Support both id and amenityId
              .map(a => ({ id: a.id || a.amenityId }))
          : [];
        
        console.log("Saving amenities:", { projectId: savedProjectId, amenityList, originalAmenities: amenities });
        
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}projects/add-update-amenity`,
          {
            projectId: savedProjectId,
            amenityList: amenityList
          }
        );
        console.log("Amenities saved successfully");
      } catch (error) {
        console.error("Error saving amenities:", error);
        console.error("Error response:", error.response?.data);
        console.error("Amenities data:", formData.amenities);
        toast.warning("Project published but failed to update amenities. Please try updating them separately.");
      }

      // 3. Save banners - always attempt to save if banners data exists
      if (formData.banners) {
        try {
          const bannerFormData = new FormData();
          bannerFormData.append("projectId", savedProjectId.toString());
          
          // Handle deletions
          if (formData.banners.deletedMobileIds && formData.banners.deletedMobileIds.length > 0) {
            bannerFormData.append("deletedMobileImageIds", formData.banners.deletedMobileIds.join(","));
          }
          if (formData.banners.deletedDesktopIds && formData.banners.deletedDesktopIds.length > 0) {
            bannerFormData.append("deletedDesktopImageIds", formData.banners.deletedDesktopIds.join(","));
          }
          
          // Handle new mobile banner files
          const mobileFiles = formData.banners.mobile && Array.isArray(formData.banners.mobile)
            ? formData.banners.mobile.filter(img => img && img.file instanceof File)
            : [];
          
          mobileFiles.forEach(img => {
            bannerFormData.append("projectMobileBannerImageList", img.file);
          });
          
          // Handle new desktop banner files
          const desktopFiles = formData.banners.desktop && Array.isArray(formData.banners.desktop)
            ? formData.banners.desktop.filter(img => img && img.file instanceof File)
            : [];
          
          desktopFiles.forEach(img => {
            bannerFormData.append("projectDesktopBannerImageList", img.file);
          });

          const hasChanges = mobileFiles.length > 0 || desktopFiles.length > 0 || 
                            (formData.banners.deletedMobileIds && formData.banners.deletedMobileIds.length > 0) ||
                            (formData.banners.deletedDesktopIds && formData.banners.deletedDesktopIds.length > 0);

          console.log("Saving banners (publish):", { 
            projectId: savedProjectId, 
            mobileFiles: mobileFiles.length,
            desktopFiles: desktopFiles.length,
            deletedMobile: formData.banners.deletedMobileIds?.length || 0,
            deletedDesktop: formData.banners.deletedDesktopIds?.length || 0,
            hasChanges: hasChanges,
            bannersData: formData.banners
          });

          // Only send request if there are changes (new files or deletions)
          if (hasChanges) {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}project-banner/add-banner`,
              bannerFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log("Banners saved successfully (publish)");
          } else {
            console.log("Banners (publish): No changes to save (no new files or deletions)");
          }
        } catch (error) {
          console.error("Error saving banners:", error);
          console.error("Error response:", error.response?.data);
          console.error("Full error:", error);
          console.error("Banners data:", formData.banners);
          toast.warning("Project published but failed to update banners. Please try updating them separately.");
        }
      }

      // 4. Save gallery - always attempt to save if gallery data exists
      if (formData.gallery !== undefined) {
        try {
          const galleryFormData = new FormData();
          galleryFormData.append("projectId", savedProjectId.toString());
          
          // Handle deletions - check both formData.deletedImageIds and formData.gallery?.deletedImageIds
          const deletedIds = formData.deletedImageIds || formData.gallery?.deletedImageIds || [];
          if (Array.isArray(deletedIds) && deletedIds.length > 0) {
            galleryFormData.append("deletedImageIds", deletedIds.join(","));
          }
          
          // Handle new gallery files
          const galleryArray = Array.isArray(formData.gallery) ? formData.gallery : [];
          const newFiles = galleryArray.filter(img => img && img.file instanceof File);
          
          newFiles.forEach(img => {
            galleryFormData.append("galleryImageList", img.file);
          });

          const hasChanges = newFiles.length > 0 || deletedIds.length > 0;

          console.log("Saving gallery (publish):", { 
            projectId: savedProjectId, 
            newFiles: newFiles.length,
            deletedIds: deletedIds.length,
            totalGalleryItems: galleryArray.length,
            hasChanges: hasChanges,
            formDataKeys: Object.keys(formData),
            deletedImageIds: formData.deletedImageIds,
            galleryDeletedIds: formData.gallery?.deletedImageIds,
            galleryData: formData.gallery
          });

          // Only send request if there are new files or deletions (API requirement)
          if (hasChanges) {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}project-gallery/add-new`,
              galleryFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log("Gallery saved successfully (publish)");
          } else {
            console.log("Gallery (publish): No changes to save (no new files or deletions)");
          }
        } catch (error) {
          console.error("Error saving gallery:", error);
          console.error("Error response:", error.response?.data);
          console.error("Full error:", error);
          console.error("Gallery data:", formData.gallery);
          console.error("Deleted IDs:", formData.deletedImageIds);
          toast.warning("Project published but failed to update gallery. Please try updating it separately.");
        }
      } else {
        console.warn("Gallery not found in formData (publish):", formData);
      }

      // 5. Save about - always attempt to save if about data exists
      if (formData.about !== undefined) {
        try {
          const aboutData = {
            projectId: savedProjectId,
            shortDesc: formData.about?.shortDesc || "",
            longDesc: formData.about?.longDesc || ""
          };
          
          // Try to get existing about ID if available
          if (formData.about?.id) {
            aboutData.id = formData.about.id;
          }

          console.log("Saving about (publish):", { 
            projectId: savedProjectId, 
            hasShortDesc: !!aboutData.shortDesc,
            hasLongDesc: !!aboutData.longDesc,
            aboutId: aboutData.id
          });

          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}project-about/add-update`,
            aboutData
          );
          console.log("About saved successfully (publish)");
        } catch (error) {
          console.error("Error saving about:", error);
          console.error("Error response:", error.response?.data);
          console.error("About data:", formData.about);
          toast.warning("Project published but failed to update about section. Please try updating it separately.");
        }
      }

      // 6. Save walkthrough - always attempt to save if walkthrough data exists
      if (formData.walkthrough !== undefined) {
        try {
          const walkthroughData = {
            projectId: savedProjectId,
            walkthroughDesc: formData.walkthrough?.walkthroughDesc || ""
          };
          
          // Try to get existing walkthrough ID if available
          if (formData.walkthrough?.id) {
            walkthroughData.id = formData.walkthrough.id;
          }

          console.log("Saving walkthrough (publish):", { 
            projectId: savedProjectId, 
            hasDescription: !!walkthroughData.walkthroughDesc,
            walkthroughId: walkthroughData.id
          });

          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}project-walkthrough/add-update`,
            walkthroughData
          );
          console.log("Walkthrough saved successfully (publish)");
        } catch (error) {
          console.error("Error saving walkthrough:", error);
          console.error("Error response:", error.response?.data);
          console.error("Walkthrough data:", formData.walkthrough);
          toast.warning("Project published but failed to update walkthrough. Please try updating it separately.");
        }
      }

      // Clear localStorage only after all data is successfully saved
      clearLocalStorage();
      toast.success("Project published successfully!");
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

  // Helper to create FormData
  const createFormData = (data) => {
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
