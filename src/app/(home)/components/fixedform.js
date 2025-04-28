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

  //Handle setting form data 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //handle form submit
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    } else {
      event.preventDefault();
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
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
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
              type="number"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange(e)}
              name="phone"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid phone number.
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
