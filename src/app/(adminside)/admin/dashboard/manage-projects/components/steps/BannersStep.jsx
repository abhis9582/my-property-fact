"use client";
import { useState, useEffect, useRef } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

export default function BannersStep({
  projectId,
  onComplete,
  initialData = {},
  isActive = false,
}) {
  const [mobileBanners, setMobileBanners] = useState([]);
  const [desktopBanners, setDesktopBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePopup, setImagePopup] = useState(false);
  const [popupImageSrc, setPopupImageSrc] = useState(null);
  const [deletedMobileIds, setDeletedMobileIds] = useState([]);
  const [deletedDesktopIds, setDeletedDesktopIds] = useState([]);
  const mobileInputRef = useRef(null);
  const desktopInputRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const lastProjectIdRef = useRef(null);

  useEffect(() => {
    // Reset if projectId changed
    if (lastProjectIdRef.current !== projectId) {
      hasInitializedRef.current = false;
      lastProjectIdRef.current = projectId;
      setMobileBanners([]);
      setDesktopBanners([]);
    }

    // Don't load if step is not active
    if (!isActive) return;
    
    // Only initialize once
    if (hasInitializedRef.current) return;
    // Initialize from initialData if available (from projectData)
    if (initialData?.projectMobileBannerDtoList || initialData?.projectDesktopBannerDtoList) {
      const slugURL = initialData.slugURL || initialData.slugurl;
      
      // Load mobile banners from project data
      let mobileBannerList = [];
      if (initialData.projectMobileBannerDtoList && initialData.projectMobileBannerDtoList.length > 0) {
        mobileBannerList = initialData.projectMobileBannerDtoList.map((img) => ({
          id: img.id,
          preview: `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${slugURL}/${img.mobileImage}`,
          isNew: false,
          file: null
        }));
        setMobileBanners(mobileBannerList);
      }
      
      // Load desktop banners from project data
      let desktopBannerList = [];
      if (initialData.projectDesktopBannerDtoList && initialData.projectDesktopBannerDtoList.length > 0) {
        desktopBannerList = initialData.projectDesktopBannerDtoList.map((img) => ({
          id: img.id,
          preview: `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${slugURL}/${img.desktopImage}`,
          isNew: false,
          file: null
        }));
        setDesktopBanners(desktopBannerList);
      }
      
      // Set state - useEffect will sync to parent
      setMobileBanners(mobileBannerList);
      setDesktopBanners(desktopBannerList);
      setDeletedMobileIds([]);
      setDeletedDesktopIds([]);
      hasInitializedRef.current = true;
      return;
    } else if (initialData?.banners) {
      // Handle if data is already in banners format
      if (initialData.banners.mobile) {
        setMobileBanners(initialData.banners.mobile);
      }
      if (initialData.banners.desktop) {
        setDesktopBanners(initialData.banners.desktop);
      }
      if (initialData.banners.deletedMobileIds) {
        setDeletedMobileIds(initialData.banners.deletedMobileIds);
      }
      if (initialData.banners.deletedDesktopIds) {
        setDeletedDesktopIds(initialData.banners.deletedDesktopIds);
      }
      hasInitializedRef.current = true;
      return;
    }

    // Load from API only if projectId exists
    if (projectId) {
      loadProjectBanners();
    } else {
      setMobileBanners([]);
      setDesktopBanners([]);
      hasInitializedRef.current = true;
    }
  }, [projectId, isActive]); // Only depend on projectId and isActive

  const loadProjectBanners = async () => {
    if (!projectId || hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/get-by-id/${projectId}`
      );
      
      if (response.data) {
        const project = response.data;
        const slugURL = project.slugURL || project.slugurl;
        
        // Load mobile banners
        if (project.projectMobileBannerDtoList && project.projectMobileBannerDtoList.length > 0) {
          const mobileBannerList = project.projectMobileBannerDtoList.map((img) => ({
            id: img.id,
            preview: `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${slugURL}/${img.mobileImage}`,
            isNew: false,
            file: null
          }));
          setMobileBanners(mobileBannerList);
        }
        
        // Load desktop banners
        if (project.projectDesktopBannerDtoList && project.projectDesktopBannerDtoList.length > 0) {
          const desktopBannerList = project.projectDesktopBannerDtoList.map((img) => ({
            id: img.id,
            preview: `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${slugURL}/${img.desktopImage}`,
            isNew: false,
            file: null
          }));
          setDesktopBanners(desktopBannerList);
        }
        
        // State is set - useEffect will sync to parent
      }
    } catch (error) {
      console.error("Failed to load banners:", error);
      setError("Failed to load existing banners. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Ref to store onComplete callback
  const onCompleteRef = useRef(onComplete);
  
  // Keep ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Sync state changes to parent using useEffect
  useEffect(() => {
    if (onCompleteRef.current && hasInitializedRef.current) {
      // Defer the call to avoid updating parent during render
      queueMicrotask(() => {
        if (onCompleteRef.current) {
          onCompleteRef.current({
            banners: {
              mobile: mobileBanners,
              desktop: desktopBanners,
              deletedMobileIds: deletedMobileIds,
              deletedDesktopIds: deletedDesktopIds
            }
          });
        }
      });
    }
  }, [mobileBanners, desktopBanners, deletedMobileIds, deletedDesktopIds]);

  const handleMobileFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file.`);
        return null;
      }
      return {
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
        id: null
      };
    }).filter(Boolean);
    
    setMobileBanners((prev) => [...prev, ...newImages]);
  };

  const handleDesktopFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file.`);
        return null;
      }
      return {
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
        id: null
      };
    }).filter(Boolean);
    
    setDesktopBanners((prev) => [...prev, ...newImages]);
  };

  const removeMobileImage = (index) => {
    setMobileBanners((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      
      // Revoke object URL to prevent memory leak
      if (removed.preview && removed.preview.startsWith('blob:')) {
        URL.revokeObjectURL(removed.preview);
      }
      
      // Track deleted IDs for existing images
      if (!removed.isNew && removed.id) {
        setDeletedMobileIds((prevIds) => [...prevIds, removed.id]);
      }
      
      return updated;
    });
  };

  const removeDesktopImage = (index) => {
    setDesktopBanners((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      
      // Revoke object URL to prevent memory leak
      if (removed.preview && removed.preview.startsWith('blob:')) {
        URL.revokeObjectURL(removed.preview);
      }
      
      // Track deleted IDs for existing images
      if (!removed.isNew && removed.id) {
        setDeletedDesktopIds((prevIds) => [...prevIds, removed.id]);
      }
      
      return updated;
    });
  };

  const openImagePopup = (src) => {
    setPopupImageSrc(src);
    setImagePopup(true);
  };

  if (!projectId) {
    return (
      <div>
        <h4 className="mb-4">Project Banners</h4>
        <Alert variant="info">
          Please complete the Basic Info step first to add banners.
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4">Project Banners</h4>
      
      {error && (
        <Alert variant="warning" className="mb-3" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>

          {/* Mobile Banners */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              Mobile Banners <span className="text-danger">*</span>
            </Form.Label>
            <div className="p-3 border rounded" style={{ minHeight: "120px" }}>
              {mobileBanners.length > 0 ? (
                <div className="d-flex flex-wrap gap-3">
                  {mobileBanners.map((img, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <Image
                        className="rounded-2 d-block"
                        src={img.preview}
                        alt="preview"
                        width={100}
                        height={100}
                        style={{ cursor: "pointer", objectFit: "cover" }}
                        onClick={() => openImagePopup(img.preview)}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          borderRadius: "50%",
                          padding: "0px 6px",
                          width: "24px",
                          height: "24px",
                          fontSize: "14px",
                          lineHeight: "1",
                        }}
                        onClick={() => removeMobileImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No mobile banners selected</p>
              )}
            </div>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept="image/*"
                ref={mobileInputRef}
                style={{ display: "none" }}
                onChange={handleMobileFileChange}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => mobileInputRef.current?.click()}
              >
                + Add Mobile Banners
              </Button>
            </div>
            <Form.Text className="text-muted d-block mt-1">
              Recommended size: 390x100 pixels or 792x203 pixels
            </Form.Text>
          </Form.Group>

          {/* Desktop Banners */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              Desktop Banners <span className="text-danger">*</span>
            </Form.Label>
            <div className="p-3 border rounded" style={{ minHeight: "120px" }}>
              {desktopBanners.length > 0 ? (
                <div className="d-flex flex-wrap gap-3">
                  {desktopBanners.map((img, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <Image
                        className="rounded-2 d-block"
                        src={img.preview}
                        alt="preview"
                        width={200}
                        height={100}
                        style={{ cursor: "pointer", objectFit: "cover" }}
                        onClick={() => openImagePopup(img.preview)}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          borderRadius: "50%",
                          padding: "0px 6px",
                          width: "24px",
                          height: "24px",
                          fontSize: "14px",
                          lineHeight: "1",
                        }}
                        onClick={() => removeDesktopImage(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">No desktop banners selected</p>
              )}
            </div>
            <div className="mt-2">
              <input
                type="file"
                multiple
                accept="image/*"
                ref={desktopInputRef}
                style={{ display: "none" }}
                onChange={handleDesktopFileChange}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => desktopInputRef.current?.click()}
              >
                + Add Desktop Banners
              </Button>
            </div>
            <Form.Text className="text-muted d-block mt-1">
              Recommended size: 900x579 pixels or 600x386 pixels
            </Form.Text>
          </Form.Group>

          <small className="text-muted d-block mt-3">
            Changes are saved locally. Use &quot;Save Draft&quot; or &quot;Publish&quot; button in header to save.
          </small>
        </>
      )}

      {/* Image Popup Modal */}
      <Modal
        size="lg"
        show={imagePopup}
        onHide={() => setImagePopup(false)}
        centered
      >
        <Modal.Body className="text-center">
          {popupImageSrc && (
            <Image
              className="rounded-2"
              src={popupImageSrc}
              alt="pop-up-image"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                height: "auto",
                width: "auto",
                maxWidth: "100%",
                maxHeight: "80vh",
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
