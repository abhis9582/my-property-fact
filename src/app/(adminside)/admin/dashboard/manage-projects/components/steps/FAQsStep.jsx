"use client";
import { useState, useEffect, useRef } from "react";
import { Form, Button, Alert, Modal, Accordion, ListGroup } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function FAQsStep({
  projectId,
  onComplete,
  initialData = {},
  isActive = false,
}) {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasInitializedRef = useRef(false);
  const lastProjectIdRef = useRef(null);

  useEffect(() => {
    // Reset if projectId changed
    if (lastProjectIdRef.current !== projectId) {
      hasInitializedRef.current = false;
      lastProjectIdRef.current = projectId;
      setFaqs([]);
    }

    // Don't load if step is not active
    if (!isActive) return;
    
    // Only initialize once
    if (hasInitializedRef.current) return;

    // Initialize from initialData if available (from projectData)
    if (initialData?.projectFaqList && Array.isArray(initialData.projectFaqList) && initialData.projectFaqList.length > 0) {
      const faqList = initialData.projectFaqList.map(faq => ({
        id: faq.id,
        question: faq.question || faq.faqQuestion,
        answer: faq.answer || faq.faqAnswer
      }));
      setFaqs(faqList);
      hasInitializedRef.current = true;
      return;
    } else if (initialData?.projectFaq && Array.isArray(initialData.projectFaq) && initialData.projectFaq.length > 0) {
      const faqList = initialData.projectFaq.map(faq => ({
        id: faq.id,
        question: faq.question || faq.faqQuestion,
        answer: faq.answer || faq.faqAnswer
      }));
      setFaqs(faqList);
      hasInitializedRef.current = true;
      return;
    } else if (initialData?.faqs && Array.isArray(initialData.faqs) && initialData.faqs.length > 0) {
      // Handle if data is already in faqs format
      setFaqs(initialData.faqs);
      hasInitializedRef.current = true;
      return;
    }

    // Load from API only if projectId exists
    if (projectId) {
      loadFAQs();
    } else {
      setFaqs([]);
      hasInitializedRef.current = true;
    }
  }, [projectId, isActive]); // Only depend on projectId and isActive

  const loadFAQs = async () => {
    if (!projectId || hasInitializedRef.current) return;
    
    hasInitializedRef.current = true;
    
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}projects/get-by-id/${projectId}`
      );
      
      if (response.data) {
        const faqList = response.data.projectFaqList || response.data.projectFaq || [];
        const mappedFaqs = faqList.map(faq => ({
          id: faq.id,
          question: faq.question || faq.faqQuestion,
          answer: faq.answer || faq.faqAnswer
        }));
        setFaqs(mappedFaqs);
        if (onComplete) {
          onComplete({ faqs: mappedFaqs });
        }
      }
    } catch (error) {
      console.error("Failed to load FAQs:", error);
      setError("Failed to load existing FAQs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFAQ = () => {
    setQuestion("");
    setAnswer("");
    setEditingId(null);
    setShowModal(true);
  };

  const handleEditFAQ = (faq) => {
    setQuestion(faq.question || "");
    setAnswer(faq.answer || "");
    setEditingId(faq.id);
    setShowModal(true);
  };

  const handleSaveFAQ = async () => {
    if (!question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (!answer.trim()) {
      toast.error("Answer is required");
      return;
    }

    try {
      setLoading(true);
      const data = {
        projectId: projectId,
        question: question.trim(),
        answer: answer.trim(),
      };

      if (editingId) {
        data.id = editingId;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}project-faqs/add-update`,
        data
      );

      if (response.data.isSuccess === 1) {
        toast.success(response.data.message || "FAQ saved successfully");
        setShowModal(false);
        hasInitializedRef.current = false; // Reset to allow reload
        loadFAQs();
      } else {
        toast.error(response.data.message || "Failed to save FAQ");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An error occurred while saving the FAQ. Please try again.";
      toast.error(errorMessage);
      console.error("Error saving FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}project-faqs/delete/${id}`
      );

      if (response.data.isSuccess === 1) {
        toast.success(response.data.message || "FAQ deleted successfully");
        hasInitializedRef.current = false; // Reset to allow reload
        loadFAQs();
      } else {
        toast.error(response.data.message || "Failed to delete FAQ");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "An error occurred while deleting the FAQ. Please try again.";
      toast.error(errorMessage);
      console.error("Error deleting FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!projectId) {
    return (
      <div>
        <h4 className="mb-4">Frequently Asked Questions (FAQs)</h4>
        <Alert variant="info">
          Please complete the Basic Info step first to add FAQs.
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Frequently Asked Questions (FAQs)</h4>
        <Button variant="success" size="sm" onClick={handleAddFAQ}>
          <FontAwesomeIcon icon={faPlus} className="me-1" />
          Add FAQ
        </Button>
      </div>

      {error && (
        <Alert variant="warning" className="mb-3" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && faqs.length === 0 ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : faqs.length === 0 ? (
        <Alert variant="info">
          No FAQs added yet. Click &quot;Add FAQ&quot; to get started.
        </Alert>
      ) : (
        <Accordion defaultActiveKey="0">
          {faqs.map((faq, index) => (
            <Accordion.Item eventKey={index.toString()} key={faq.id || index}>
              <div className="d-flex align-items-center justify-content-between px-3 pt-3">
                <Accordion.Header className="flex-grow-1">
                  <strong>Q{index + 1}:</strong> {faq.question}
                </Accordion.Header>
                <div className="ms-3">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditFAQ(faq);
                    }}
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFAQ(faq.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </div>
              <Accordion.Body>
                <strong>Answer:</strong> {faq.answer}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      <small className="text-muted d-block mt-3">
        Changes are saved immediately. Use &quot;Save Draft&quot; or &quot;Publish&quot; button in header to save the project.
      </small>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit FAQ" : "Add FAQ"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Question <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter the question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Answer <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter the answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="success"
                onClick={handleSaveFAQ}
                disabled={loading || !question.trim() || !answer.trim()}
              >
                {loading ? "Saving..." : editingId ? "Update" : "Add"} FAQ
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
