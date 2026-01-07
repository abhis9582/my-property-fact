"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
export default function FixedForm({ resetTrigger, onSuccess }) {
  const [validated, setValidated] = useState(false);
  const formRef = useRef(null);
  const intitalData = {
    id: 0,
    name: "",
    email: "",
    phone: "",
    message: "",
  };
  const [formData, setFormData] = useState(intitalData);

  //Validation errors state
  const [errors, setErrors] = useState({
    phone: "",
  });

  //Validation function for phone
  const validatePhone = (phone) => {
    if (!phone.trim()) {
      return "Phone number is required";
    }
    // Remove spaces, dashes, and parentheses for validation
    const cleanedPhone = phone.toString().replace(/[\s\-\(\)]/g, "");
    // Check if it's all digits
    if (!/^\d+$/.test(cleanedPhone)) {
      return "Phone number can only contain digits, spaces, dashes, and parentheses";
    }
    // Check length (exactly 10 digits)
    if (cleanedPhone.length !== 10) {
      return "Phone number must be exactly 10 digits";
    }
    // Check if first digit is between 6-9
    if (!/^[6-9]/.test(cleanedPhone)) {
      return "Phone number must start with 6, 7, 8, or 9";
    }
    return "";
  };

  //Handle setting form data 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  //Handle blur validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const error = validatePhone(value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  //handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    // Validate phone
    const phoneError = validatePhone(formData.phone);
    const newErrors = {
      phone: phoneError,
    };
    setErrors(newErrors);

    // Check if form is valid
    const isFormValid =
      form.checkValidity() &&
      !phoneError;

    if (!isFormValid) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // Make API request
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "enquiry/post",
        formData
      );
      // Check if response is successful
      if (response.data.isSuccess === 1) {
        onSuccess();
        formRef.current.reset(); // Reset form fields
        setValidated(false); // Reset validation state
        setFormData(intitalData);
        setErrors({ phone: "" });
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Reset form when resetTrigger changes
  useEffect(() => {
    if (resetTrigger && formRef.current) {
      formRef.current.reset(); // Reset form fields
      setValidated(false); // Reset validation state
      setFormData(intitalData);
    }
  }, [resetTrigger]);
  return (
    <>
      <div>
        <Form
          ref={formRef}
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Form.Group className="mb-3" controlId="full_name">
            <Form.Control
              type="text"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => handleChange(e)}
              name="name"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="email_id">
            <Form.Control
              type="email"
              placeholder="Email id"
              value={formData.email}
              onChange={(e) => handleChange(e)}
              name="email"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone_number">
            <Form.Control
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
              name="phone"
              isInvalid={!!errors.phone || (validated && !formData.phone.trim())}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone || "Please provide a valid phone number."}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="message">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Message"
              value={formData.message}
              onChange={(e) => handleChange(e)}
              name="message"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid message.
            </Form.Control.Feedback>
          </Form.Group>
          <Button className="btn-background border-0" type="submit">Submit</Button>
        </Form>
      </div>
    </>
  );
}
