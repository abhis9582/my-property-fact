"use client";
import axios from "axios";
import CommonHeaderBanner from "../../components/common/commonheaderbanner";
import { useState } from "react";
import Image from "next/image";
import styles from "./../page.module.css";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../contact-us/page";
import { usePathname } from "next/navigation";
export default function BlogDetail({ blogDetail }) {
  const [showLoading, setShowLoading] = useState(false);
  const [buttonName, setButtonName] = useState("Submit Enquiry");
  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    message: "",
    enquiryFrom: "",
    projectLink: "",
    pageName: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [validated, setValidated] = useState(false);
  const pathname = usePathname();

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
      setValidated(true);
      event.stopPropagation();
      return;
    }

    try {
      setShowLoading(true);
      setButtonName("");
      // Make API request
      formData.enquiryFrom = blogDetail.blogTitle.replace(/\u00A0/g, " ")
      formData.projectLink = process.env.NEXT_PUBLIC_UI_URL + pathname;
      formData.pageName = "Blog Page";
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "enquiry/post",
        formData
      );
      // Check if response is successful
      if (response.data.isSuccess === 1) {
        setFormData(initialFormData); // Reset form data
        setValidated(false); // Reset validation state
        setErrors({ phone: "" });
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.data.message);
      console.error("Error submitting form:", error);
    } finally {
      setShowLoading(false);
      setButtonName("Submit Enquiry");
    }
  };

  //handle form input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

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

  const blogTitle = blogDetail.blogTitle.replace(/\u00A0/g, " ");
  return (
    <div>
      <CommonHeaderBanner
        image={"builder-banner.jp"}
        headerText={"Blog-Detail"}
        pageName={blogTitle}
        firstPage={"Blog"}
      />
      {/* <CommonBreadCrum pageName={blogDetail.slugUrl} firstPage={"Blog"} /> */}
      <div className="container py-5">
        <div className="row g-5">
          {/* Blog Content */}
          {
            <div className="col-lg-8">
              {blogDetail.blogImage && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}blog/${blogDetail.blogImage}`}
                  alt={blogDetail.blogTitle || ""}
                  className="img-fluid rounded shadow-sm mb-4"
                  width={1200}
                  height={648}
                />
              )}

              <h1 className="mb-3 blog-typography-title">
                {blogDetail.blogTitle.replace(/\u00A0/g, " ")}
              </h1>

              <div
                className="blog-content"
                dangerouslySetInnerHTML={{
                  __html: blogDetail.blogDescription,
                  // __html: sanitizeHtml(blogDetail.blogDescription),
                }}
              ></div>
              <div className="d-flex flex-wrap gap-2 mt-4">
                {(blogDetail.blogKeywords || "")
                  .split(",")
                  .map((keyword, index) => (
                    <span key={index} className={styles.keywordTag}>
                      {keyword.trim()}
                    </span>
                  ))}
              </div>
            </div>
          }

          {/* Contact Form */}
          <div className="col-lg-4">
            <div
              className={`card shadow-sm rounded-4 p-4 ${styles.blogContactForm}`}
            >
              <h4 className="fw-semibold mb-4">Get in Touch</h4>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter your name.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  {/* <Form.Label>Email Address</Form.Label> */}
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email address.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="phone">
                  {/* <Form.Label>Phone Number</Form.Label> */}
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={!!errors.phone || (validated && !formData.phone.trim())}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone || "Please enter a valid phone number."}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="message">
                  {/* <Form.Label>Message</Form.Label>/ */}
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Write your message here..."
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 btn-background text-white border-0"
                  disabled={showLoading}
                >
                  {buttonName} <LoadingSpinner show={showLoading} />
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
