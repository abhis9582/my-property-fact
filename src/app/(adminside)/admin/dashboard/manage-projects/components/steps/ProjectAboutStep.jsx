"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Form, Alert } from "react-bootstrap";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function ProjectAboutStep({
  projectId,
  onComplete,
  initialData = {},
  isActive = false,
}) {
  const shortDescEditor = useRef(null);
  const longDescEditor = useRef(null);
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasInitializedRef = useRef(false);
  const lastProjectIdRef = useRef(null);
  const isEditingShortRef = useRef(false);
  const isEditingLongRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const loadProjectAbout = useCallback(async () => {
    if (!projectId || hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/get-by-id/${projectId}`
      );
      
      if (response.data) {
        const about = response.data.projectAbout;
        if (about) {
          setShortDesc(about.shortDesc || "");
          setLongDesc(about.longDesc || "");
          if (onCompleteRef.current) {
            onCompleteRef.current({ about: about });
          }
        }
      }
    } catch (error) {
      console.error("Failed to load project about:", error);
      setError("Failed to load existing project about. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // Reset if projectId changed
    if (lastProjectIdRef.current !== projectId) {
      hasInitializedRef.current = false;
      lastProjectIdRef.current = projectId;
      setShortDesc("");
      setLongDesc("");
    }

    // Don't load if step is not active
    if (!isActive) return;
    
    // Only initialize once
    if (hasInitializedRef.current) return;

    // Initialize from initialData if available (only if not currently editing)
    if (initialData?.about && !isEditingShortRef.current && !isEditingLongRef.current) {
      const short = initialData.about.shortDesc || "";
      const long = initialData.about.longDesc || "";
      // Use functional updates to avoid dependency on current state values
      setShortDesc((prevShort) => prevShort !== short ? short : prevShort);
      setLongDesc((prevLong) => prevLong !== long ? long : prevLong);
      if (onCompleteRef.current) {
        onCompleteRef.current({ about: initialData.about });
      }
      hasInitializedRef.current = true;
      return;
    }

    // Load from API only if projectId exists
    if (projectId) {
      loadProjectAbout();
    } else {
      setShortDesc("");
      setLongDesc("");
      hasInitializedRef.current = true;
    }
  }, [projectId, isActive, initialData?.about, loadProjectAbout]);

  const handleShortDescChange = useCallback((newContent) => {
    // Mark as editing to prevent value updates from parent
    isEditingShortRef.current = true;
    setShortDesc(newContent);
  }, []);

  const handleLongDescChange = useCallback((newContent) => {
    // Mark as editing to prevent value updates from parent
    isEditingLongRef.current = true;
    setLongDesc(newContent);
  }, []);

  const handleShortDescBlur = useCallback((newContent) => {
    // Update local state and notify parent
    isEditingShortRef.current = false;
    setShortDesc((currentShort) => {
      setLongDesc((currentLong) => {
        // Defer the call to avoid updating parent during render
        queueMicrotask(() => {
          if (onCompleteRef.current) {
            onCompleteRef.current({
              about: {
                shortDesc: newContent,
                longDesc: currentLong
              }
            });
          }
        });
        return currentLong;
      });
      return newContent;
    });
  }, []);

  const handleLongDescBlur = useCallback((newContent) => {
    // Update local state and notify parent
    isEditingLongRef.current = false;
    setLongDesc((currentLong) => {
      setShortDesc((currentShort) => {
        // Defer the call to avoid updating parent during render
        queueMicrotask(() => {
          if (onCompleteRef.current) {
            onCompleteRef.current({
              about: {
                shortDesc: currentShort,
                longDesc: newContent
              }
            });
          }
        });
        return currentShort;
      });
      return newContent;
    });
  }, []);

  const shortDescConfig = useMemo(() => ({
    height: 300,
    placeholder: "Enter a brief description about the project...",
    toolbar: true,
    spellcheck: true,
    readonly: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    disablePlugins: [],
  }), []);

  const longDescConfig = useMemo(() => ({
    height: 400,
    placeholder: "Enter a detailed description about the project...",
    toolbar: true,
    spellcheck: true,
    readonly: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    disablePlugins: [],
  }), []);

  if (!projectId) {
    return (
      <div>
        <h4 className="mb-4">Project About</h4>
        <Alert variant="info">
          Please complete the Basic Info step first to add project about information.
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4">Project About</h4>
      
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
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">
              Short Description <span className="text-danger">*</span>
            </Form.Label>
            <JoditEditor
              key={`short-desc-${projectId}`}
              ref={shortDescEditor}
              value={shortDesc}
              onChange={handleShortDescChange}
              onBlur={handleShortDescBlur}
              config={shortDescConfig}
            />
            <Form.Text className="text-muted">
              A brief summary of the project (displayed in listings and previews)
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              Long Description <span className="text-danger">*</span>
            </Form.Label>
            <JoditEditor
              key={`long-desc-${projectId}`}
              ref={longDescEditor}
              value={longDesc}
              onChange={handleLongDescChange}
              onBlur={handleLongDescBlur}
              config={longDescConfig}
            />
            <Form.Text className="text-muted">
              A detailed description of the project (displayed on the project detail page)
            </Form.Text>
          </Form.Group>

          <small className="text-muted d-block mt-3">
            Changes are saved locally. Use &quot;Save Draft&quot; or &quot;Publish&quot; button in header to save.
          </small>
        </>
      )}
    </div>
  );
}
