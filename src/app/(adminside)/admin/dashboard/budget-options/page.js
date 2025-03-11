"use client";
import { useState } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

export default function BudgetOptions() {
  const [validated, setValidated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [formData, setFormData] = useState({
    budgetOption: "",
  });
  const [confirmBox, setConfirmBox] = useState(false);

  //Handle submitting form
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  //Handle opening add model
  const openAddModel = () => {
    setShowModal(true);
    setTitle("Add New Budget Option");
    setButtonName("Add");
  };
  //handle edit model
  const openEditModel = () => {
    setShowModal(true);
    setTitle("Update Budget Option");
    setButtonName("Update");
  };
  //handle setting form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((preValue) => ({
      ...preValue,
      [name]: value,
    }));
  };
  return (
    <div>
      <div className="d-flex justify-content-between mt-3">
        <p className="h1">Manage Budget Options</p>
        <Button className="btn btn-success" onClick={openAddModel}>
          + Add New
        </Button>
      </div>
      {/* Modal for adding a new city */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                className="mb-3"
                md="12"
                controlId="validationCustom01"
              >
                <Form.Control
                  required
                  type="text"
                  placeholder="Budget Option"
                  name="budgetOption"
                  value={formData.budgetOption}
                  onChange={handleChange}
                />
                <Form.Control.Feedback>
                  Budget Option is required !
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Button type="submit" className="btn btn-success">
              {buttonName}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={confirmBox} onHide={() => setConfirmBox(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete ?</Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body> */}
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={() => setConfirmBox(false)}>
            Close
          </Button>
          <Button variant="danger">Delete</Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}
