"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Form, Alert } from "react-bootstrap";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function ProjectWalkthroughStep({
  projectId,
  onComplete,
  initialData = {},
  isActive = false,
}) {
  const editor = useRef(null);
  const [walkthroughDesc, setWalkthroughDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasInitializedRef = useRef(false);
  const lastProjectIdRef = useRef(null);
  const isEditingRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const walkthroughIdRef = useRef(null); // Store walkthrough ID to prevent duplicates

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const loadWalkthrough = useCallback(async () => {
    if (!projectId || hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/get-by-id/${projectId}`
      );
      
      if (response.data) {
        const walkthrough = response.data.projectWalkthrough;
        if (walkthrough) {
          setWalkthroughDesc(walkthrough.walkthroughDesc || "");
          // Store the walkthrough ID to prevent duplicate creation
          walkthroughIdRef.current = walkthrough.id || null;
          if (onCompleteRef.current) {
            onCompleteRef.current({ walkthrough: walkthrough });
          }
        }
      }
    } catch (error) {
      console.error("Failed to load walkthrough:", error);
      setError("Failed to load existing walkthrough. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    // Reset if projectId changed
    if (lastProjectIdRef.current !== projectId) {
      hasInitializedRef.current = false;
      lastProjectIdRef.current = projectId;
      setWalkthroughDesc("");
    }

    // Don't load if step is not active
    if (!isActive) return;
    
    // Only initialize once
    if (hasInitializedRef.current) return;

    // Initialize from initialData if available (only if not currently editing)
    if (initialData?.walkthrough && initialData.walkthrough.walkthroughDesc && !isEditingRef.current) {
      const desc = initialData.walkthrough.walkthroughDesc;
      // Store the walkthrough ID to prevent duplicate creation
      walkthroughIdRef.current = initialData.walkthrough.id || null;
      // Use functional update to avoid dependency on current state value
      setWalkthroughDesc((prevDesc) => prevDesc !== desc ? desc : prevDesc);
      if (onCompleteRef.current) {
        onCompleteRef.current({ walkthrough: initialData.walkthrough });
      }
      hasInitializedRef.current = true;
      return;
    }

    // Load from API only if projectId exists
    if (projectId) {
      loadWalkthrough();
    } else {
      setWalkthroughDesc("");
      hasInitializedRef.current = true;
    }
  }, [projectId, isActive, initialData?.walkthrough, loadWalkthrough]);

  const handleWalkthroughChange = useCallback((newContent) => {
    // Mark as editing to prevent value updates from parent
    isEditingRef.current = true;
    setWalkthroughDesc(newContent);
  }, []);

  const handleWalkthroughBlur = useCallback((newContent) => {
    // Update local state and notify parent
    isEditingRef.current = false;
    setWalkthroughDesc(newContent);
    // Always call onComplete, even if content is empty (to allow clearing)
    // Defer the call to avoid updating parent during render
    queueMicrotask(() => {
      if (onCompleteRef.current) {
        // Preserve existing walkthrough ID to prevent duplicate creation
        const walkthroughData = {
          walkthroughDesc: newContent || ""
        };
        // Always include ID if we have it stored (from initial load or initialData)
        if (walkthroughIdRef.current) {
          walkthroughData.id = walkthroughIdRef.current;
        } else if (initialData?.walkthrough?.id) {
          walkthroughData.id = initialData.walkthrough.id;
          walkthroughIdRef.current = initialData.walkthrough.id; // Store it for future use
        }
        onCompleteRef.current({
          walkthrough: walkthroughData
        });
      }
    });
  }, [initialData?.walkthrough?.id]);

  const walkthroughConfig = useMemo(() => ({
    height: 400,
    placeholder: "Enter walkthrough description. You can embed videos using iframe or video tags...",
    toolbar: true,
    spellcheck: true,
    allowResizeX: false,
    allowResizeY: true,
    readonly: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    disablePlugins: [],
  }), []);

  if (!projectId) {
    return (
      <div>
        <h4 className="mb-4">Project Walkthrough</h4>
        <Alert variant="info">
          Please complete the Basic Info step first to add walkthrough information.
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-4">Project Walkthrough</h4>
      
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
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">
              Walkthrough Description <span className="text-danger">*</span>
            </Form.Label>
            <JoditEditor
              key={`walkthrough-${projectId}`}
              ref={editor}
              value={walkthroughDesc}
              onChange={handleWalkthroughChange}
              onBlur={handleWalkthroughBlur}
              config={walkthroughConfig}
            />
            {/* <Form.Text className="text-muted">
              Add a detailed walkthrough description. You can embed videos (YouTube, Vimeo, etc.) using iframe tags.
              Example: &lt;iframe src="https://www.youtube.com/embed/VIDEO_ID"&gt;&lt;/iframe&gt;
            </Form.Text> */}
          </Form.Group>

          <small className="text-muted d-block mt-3">
            Changes are saved locally. Use &quot;Save Draft&quot; or &quot;Publish&quot; button in header to save.
          </small>
        </>
      )}
    </div>
  );
}
