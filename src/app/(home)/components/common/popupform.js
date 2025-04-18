import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../contact-us/page";
import { set } from "jodit/esm/core/helpers";

export default function CommonPopUpform({ show, handleClose }) {
    const [validated, setValidated] = useState(false);
    const intitalData = {
        id: 0,
        name: "",
        email: "",
        phone: "",
        message: "",
    };
    const [formData, setFormData] = useState(intitalData);
    const [showLoading, setShowLoading] = useState(false);
    const [buttonName, setButtonName] = useState("Submit Enquiry");
    //Handlechanging input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    // Reset form when modal closes
    useEffect(() => {
        if (!show) {
            setFormData(intitalData);
            setValidated(false);
        }
    }, [show]);



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
                setShowLoading(true);
                setButtonName("");
                // Make API request
                const response = await axios.post(
                    process.env.NEXT_PUBLIC_API_URL + "enquiry/post",
                    formData
                );
                // Check if response is successful
                if (response.data.isSuccess === 1) {
                    // onSuccess();
                    handleClose(false);
                    setValidated(false); // Reset validation state
                    setFormData(intitalData);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                toast.error(error.data.message);
                console.error("Error submitting form:", error);
            }finally {
                setShowLoading(false);
                setButtonName("Submit Enquiry");
            }
        }
    };

    return (
        <>
            <Modal show={show} onHide={() => handleClose(false)} centered>
                <Modal.Header closeButton className="theme-bg">
                    <Modal.Title className="fw-bold text-light">We will connect you soon.</Modal.Title>
                </Modal.Header>
                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                    className="p-3"
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
                    <Button type="submit" className="fw-bold btn btn-success" disabled={showLoading}>{buttonName} <LoadingSpinner show={showLoading}/></Button>
                </Form>
            </Modal>
        </>
    )
}