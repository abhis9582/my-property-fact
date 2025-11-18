"use client";
import axios from "axios";
import CommonBreadCrum from "../../components/common/breadcrum";
import CommonHeaderBanner from "../../components/common/commonheaderbanner";
import { useState } from "react";
import Image from "next/image";
import styles from "./../page.module.css";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../contact-us/page";
import { sanitizeHtml } from "@/app/_global_components/sanitize";
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
  //handle form submit
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      setValidated(true);
      event.stopPropagation();
      return;
    } else {
      event.preventDefault();
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
    }
  };

  //handle form input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

              <h1 className="fw-bold mb-3">
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

                <Form.Group className="mb-3" controlId="email">
                  {/* <Form.Label>Phone Number</Form.Label> */}
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid phone number.
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
