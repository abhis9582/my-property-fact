"use client";
import { useState, useEffect, useRef } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

export default function GalleryStep({
  projectId,
  onComplete,
  initialData = {},
  isActive = false,
}) {
  const [images, setImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePopup, setImagePopup] = useState(false);
  const [popupImageSrc, setPopupImageSrc] = useState(null);
  const fileInputRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const lastProjectIdRef = useRef(null);

  useEffect(() => {
    // Reset if projectId changed
    if (lastProjectIdRef.current !== projectId) {
      hasInitializedRef.current = false;
      lastProjectIdRef.current = projectId;
      setImages([]);
    }

    // Don't load if step is not active
    if (!isActive) return;
    
    // Only initialize once
    if (hasInitializedRef.current) return;

    // Initialize from initialData if available (from projectData)
    if (initialData?.projectGalleryImageList && Array.isArray(initialData.projectGalleryImageList) && initialData.projectGalleryImageList.length > 0) {
      const slugURL = initialData.slugURL || initialData.slugurl;
      const galleryList = initialData.projectGalleryImageList.map((img) => ({
        id: img.id,
        preview: `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${slugURL}/${img.galleyImage || img.image}`,
        isNew: false,
        file: null
      }));
      setImages(galleryList);
      if (onComplete) {
        onComplete({ gallery: galleryList });
      }
      hasInitializedRef.current = true;
      return;
    } else if (initialData?.gallery && Array.isArray(initialData.gallery) && initialData.gallery.length > 0) {
      // Handle if data is already in gallery format
      setImages(initialData.gallery);
      if (onComplete) {
        onComplete({ gallery: initialData.gallery });
      }
      hasInitializedRef.current = true;
      return;
    }

    // Load from API only if projectId exists
    if (projectId) {
      loadGalleryImages();
    } else {
      setImages([]);
      hasInitializedRef.current = true;
    }
  }, [projectId, isActive]); // Only depend on projectId and isActive

  const loadGalleryImages = async () => {
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
        const galleryList = project.projectGalleryImageList || project.galleryImage || [];
        
        if (galleryList.length > 0) {
          const mappedGallery = galleryList.map((img) => ({
            id: img.id,
            preview: `${process.env.NEXT_PUBLIC_IMAGE_URL}properties/${slugURL}/${img.galleyImage || img.image}`,
            isNew: false,
            file: null
          }));
          setImages(mappedGallery);
          setDeletedImageIds([]);
        }
      }
    } catch (error) {
      console.error("Failed to load gallery images:", error);
      setError("Failed to load existing gallery images. Please try again.");
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
          console.log("GalleryStep syncing to parent:", { 
            gallery: images, 
            deletedImageIds: deletedImageIds,
            galleryLength: images.length,
            deletedCount: deletedImageIds.length
          });
          onCompleteRef.current({
            gallery: images,
            deletedImageIds: deletedImageIds
          });
        }
      });
    }
  }, [images, deletedImageIds]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file.`);
        return null;
      }
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        return null;
      }
      return {
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
        id: null
      };
    }).filter(Boolean);
    
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      
      // Revoke object URL to prevent memory leak
      if (removed.preview && removed.preview.startsWith('blob:')) {
        URL.revokeObjectURL(removed.preview);
      }
      
      // Track deleted IDs for existing images
      if (!removed.isNew && removed.id) {
        setDeletedImageIds((prevIds) => {
          if (!prevIds.includes(removed.id)) {
            return [...prevIds, removed.id];
          }
          return prevIds;
        });
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
        <h4 className="mb-4">Project Gallery</h4>
        <Alert variant="info">
          Please complete the Basic Info step first to add gallery images.
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4">Project Gallery</h4>
      
      {error && (
        <Alert variant="warning" className="mb-3" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && images.length === 0 ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="p-3 border rounded mb-3" style={{ minHeight: "200px" }}>
            {images.length > 0 ? (
              <div className="d-flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <Image
                      className="rounded-2"
                      src={img.preview}
                      alt={`Gallery ${index + 1}`}
                      width={150}
                      height={150}
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
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-4 mb-0">
                No gallery images selected. Click &quot;Add Images&quot; to upload.
              </p>
            )}
          </div>

          <div className="mb-3">
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              + Add Gallery Images
            </Button>
          </div>

          <Form.Text className="text-muted d-block mb-3">
            Upload multiple images for the project gallery. Maximum file size: 10MB per image.
          </Form.Text>

          <small className="text-muted d-block">
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
