// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import logo from "../assets/amenities.png";

// export default function PopupForm() {
//     const [isOpen, setIsOpen] = useState(false);
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         message: "",
//     });
//     const [status, setStatus] = useState("");

//     useEffect(() => {
//         const timer = setTimeout(() => setIsOpen(true), 1000);
//         const handleOpenPopup = () => setIsOpen(true);

//         window.addEventListener("openPopup", handleOpenPopup);

//         return () => {
//             clearTimeout(timer);
//             window.removeEventListener("openPopup", handleOpenPopup);
//         };
//     }, []);

//     const closeModal = () => {
//         setIsOpen(false);
//         setStatus("");
//     };

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setStatus("Submitting...");

//         try {
//             const response = await fetch(
//                 "https://script.google.com/macros/s/AKfycbwFUrsuEzkLUjc07z9MXmKwKSb1zGNo8gCJrmNLI0mCqkhopIjdHYqzvT2zcTKMpqL7Xg/exec",
//                 {
//                     method: "POST",
//                     body: JSON.stringify(formData),
//                 }
//             );

//             const result = await response.json();
//             if (result.result === "success") {
//                 setStatus("Form submitted successfully!");
//                 setFormData({ name: "", email: "", phone: "", message: "" });
//             } else {
//                 setStatus("Failed to submit. Please try again.");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             setStatus("Submission error. Please try again later.");
//         }
//     };

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <>
//                     {/* Backdrop */}
//                     <motion.div
//                         className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
//                         style={{ backdropFilter: "blur(5px)" }}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         onClick={closeModal}
//                     />

//                     {/* Modal Content */}
//                     <motion.div
//                         className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                         style={{ zIndex: 100000000 }}
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                         onClick={closeModal}
//                     >
//                         <div
//                             className="bg-dark rounded-4 shadow-lg position-relative d-flex flex-column overflow-hidden"
//                             style={{
//                                 width: "100%",
//                                 maxWidth: "36rem",
//                                 maxHeight: "90vh",
//                                 backgroundImage: `url(${logo.src})`,
//                                 backgroundSize: "cover",
//                                 backgroundPosition: "center",
//                             }}
//                             onClick={(e) => e.stopPropagation()}
//                         >
//                             {/* Overlay */}
//                             <div
//                                 className="position-absolute top-0 start-0 w-100 h-100"
//                                 style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 0 }}
//                                 aria-hidden="true"
//                             />

//                             {/* Title and Close Button Container */}
//                             <div className="position-relative p-4 p-md-5" style={{ zIndex: 1 }}>
//                                 <div className="d-flex justify-content-between align-items-center mb-4">
//                                     <h2 className="fw-semibold mb-0 text-white">Book a Visit</h2>
//                                     <button
//                                         onClick={closeModal}
//                                         aria-label="Close popup"
//                                         type="button"
//                                         className="btn-close btn-close-white"
//                                         style={{ fontSize: "1.5rem", opacity: 0.9 }}
//                                     />
//                                 </div>

//                                 {/* Form Content */}
//                                 <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 text-white">
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         placeholder="Your Name"
//                                         className="form-control bg-transparent text-white"
//                                         value={formData.name}
//                                         onChange={handleChange}
//                                         required
//                                         style={{ borderColor: "black" }}
//                                     />
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         placeholder="Your Email"
//                                         className="form-control bg-transparent text-white"
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         required
//                                         style={{ borderColor: "black" }}
//                                     />
//                                     <input
//                                         type="tel"
//                                         name="phone"
//                                         placeholder="Your Phone"
//                                         className="form-control bg-transparent text-white"
//                                         value={formData.phone}
//                                         onChange={handleChange}
//                                         required
//                                         style={{ borderColor: "black" }}
//                                     />
//                                     <textarea
//                                         name="message"
//                                         placeholder="Your Message"
//                                         className="form-control bg-transparent text-white"
//                                         rows={3}
//                                         value={formData.message}
//                                         onChange={handleChange}
//                                         required
//                                         style={{ borderColor: "black" }}
//                                     />

//                                     <button
//                                         type="submit"
//                                         className="btn mt-2"
//                                         disabled={status === "Submitting..."}
//                                         style={{
//                                             backgroundColor: "#D0B674",
//                                             color: "white",
//                                             border: "none",
//                                             transition: "background-color 0.3s, color 0.3s",
//                                         }}
//                                     >
//                                         {status === "Submitting..." ? "Submitting..." : "Submit"}
//                                     </button>
//                                 </form>
//                             </div>

//                             <style jsx>{`
//                 input,
//                 textarea {
//                   border-color: black !important;
//                   box-shadow: none !important;
//                 }

//                 input:focus,
//                 textarea:focus {
//                   border-color: #d0b674 !important;
//                   box-shadow: 0 0 0 0.25rem rgba(208, 182, 116, 0.5) !important;
//                   outline: none !important;
//                 }

//                 button[type="submit"]:hover {
//                   background-color: white;
//                   color: #d0b674;
//                   border: 1px solid #d0b674;
//                 }
//               `}</style>
//                         </div>
//                     </motion.div>
//                 </>
//             )}
//         </AnimatePresence>
//     );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import logo from "../assets/amenities.png";

// export default function PopupForm() {
//     const [isOpen, setIsOpen] = useState(false);
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         phone: "",
//         message: "",
//     });
//     const [status, setStatus] = useState("");

//     useEffect(() => {
//         const timer = setTimeout(() => setIsOpen(true), 1000);
//         const handleOpenPopup = () => setIsOpen(true);

//         window.addEventListener("openPopup", handleOpenPopup);

//         return () => {
//             clearTimeout(timer);
//             window.removeEventListener("openPopup", handleOpenPopup);
//         };
//     }, []);

//     const closeModal = () => {
//         setIsOpen(false);
//         setStatus("");
//     };

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setStatus("Submitting...");

//         try {
//             const response = await fetch(
//                 "https://script.google.com/macros/s/AKfycbwFUrsuEzkLUjc07z9MXmKwKSb1zGNo8gCJrmNLI0mCqkhopIjdHYqzvT2zcTKMpqL7Xg/exec",
//                 {
//                     method: "POST",
//                     body: JSON.stringify(formData),
//                 }
//             );

//             const result = await response.json();
//             if (result.result === "success") {
//                 setStatus("Form submitted successfully!");
//                 setFormData({ name: "", email: "", phone: "", message: "" });
//             } else {
//                 setStatus("Failed to submit. Please try again.");
//             }
//         } catch (error) {
//             console.error("Error:", error);
//             setStatus("Submission error. Please try again later.");
//         }
//     };

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <>
//                     <motion.div
//                         className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
//                         style={{ backdropFilter: "blur(5px)" }}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         onClick={closeModal}
//                     />

//                     <motion.div
//                         className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
//                         style={{ zIndex: 100000000 }}
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                         onClick={closeModal}
//                     >
//                         <div
//                             className="bg-dark rounded-4 shadow-lg position-relative overflow-hidden w-100"
//                             style={{
//                                 maxWidth: "36rem",
//                                 maxHeight: "90vh",
//                                 backgroundImage: `url(${logo.src})`,
//                                 backgroundSize: "cover",
//                                 backgroundPosition: "center",
//                             }}
//                             onClick={(e) => e.stopPropagation()}
//                         >
//                             <div
//                                 className="position-absolute top-0 start-0 w-100 h-100"
//                                 style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 0 }}
//                             />

//                             <div className="position-relative p-4 p-md-5 z-1">
//                                 <div className="d-flex justify-content-between align-items-center mb-4">
//                                     <h2 className="fw-semibold mb-0 text-white">Book a Visit</h2>
//                                     <button
//                                         onClick={closeModal}
//                                         aria-label="Close popup"
//                                         type="button"
//                                         className="btn-close btn-close-white"
//                                         style={{ fontSize: "1.5rem", opacity: 0.9 }}
//                                     />
//                                 </div>

//                                 <form onSubmit={handleSubmit} className="text-white">
//                                     <div className="mb-4">
//                                         <input
//                                             type="text"
//                                             name="name"
//                                             placeholder="Your Name"
//                                             className="form-control form-control-lg rounded-0 border-0 border-bottom"
//                                             value={formData.name}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="mb-4">
//                                         <input
//                                             type="email"
//                                             name="email"
//                                             placeholder="Your Email"
//                                             className="form-control form-control-lg rounded-0 border-0 border-bottom"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="mb-4">
//                                         <input
//                                             type="tel"
//                                             name="phone"
//                                             placeholder="Your Phone"
//                                             className="form-control form-control-lg rounded-0 border-0 border-bottom"
//                                             value={formData.phone}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="mb-4">
//                                         <textarea
//                                             name="message"
//                                             placeholder="Your Message"
//                                             className="form-control form-control-lg rounded-0 border-0 border-bottom"
//                                             rows={3}
//                                             value={formData.message}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>

//                                     <div className="text-center">
//                                         <button
//                                             type="submit"
//                                             className="btn btn-lg px-5 py-3 fw-semibold"
//                                             disabled={status === "Submitting..."}
//                                             style={{
//                                                 backgroundColor: "#D0B674",
//                                                 color: "#fff",
//                                                 border: "none",
//                                             }}
//                                         >
//                                             {status === "Submitting..." ? "Submitting..." : "Submit"}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>

//                             <style jsx>{`
//                                 input,
//                                 textarea {
//                                     border-color: #d0b674 !important;
//                                     background-color: transparent;
//                                     color: #fff !important;
//                                 }

//                                 input:focus,
//                                 textarea:focus {
//                                     border-color: #d0b674 !important;
//                                     box-shadow: 0 0 0 0.25rem rgba(208, 182, 116, 0.5) !important;
//                                     outline: none !important;
//                                 }

//                                 button:hover {
//                                     background-color: #fff !important;
//                                     color: #d0b674 !important;
//                                     border: 1px solid #d0b674 !important;
//                                 }
//                             `}</style>
//                         </div>
//                     </motion.div>
//                 </>
//             )}
//         </AnimatePresence>
//     );
// }



"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/amenities.png";

export default function PopupForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [status, setStatus] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setIsOpen(true), 1000);
        const handleOpenPopup = () => setIsOpen(true);

        window.addEventListener("openPopup", handleOpenPopup);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("openPopup", handleOpenPopup);
        };
    }, []);

    const closeModal = () => {
        setIsOpen(false);
        setStatus("");
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Submitting...");

        try {
            const response = await fetch(
                "https://script.google.com/macros/s/AKfycbwFUrsuEzkLUjc07z9MXmKwKSb1zGNo8gCJrmNLI0mCqkhopIjdHYqzvT2zcTKMpqL7Xg/exec",
                {
                    method: "POST",
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();
            if (result.result === "success") {
                setStatus("Form submitted successfully!");
                setFormData({ name: "", email: "", phone: "", message: "" });
            } else {
                setStatus("Failed to submit. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setStatus("Submission error. Please try again later.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                        style={{ backdropFilter: "blur(5px)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                    />

                    <motion.div
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                        style={{ zIndex: 100000000 }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={closeModal}
                    >
                        <div
                            className="bg-dark rounded-4 shadow-lg position-relative overflow-hidden w-100"
                            style={{
                                maxWidth: "42rem", // increased width
                                maxHeight: "90vh",
                                backgroundImage: `url(${logo.src})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="position-absolute top-0 start-0 w-100 h-100"
                                style={{ backgroundColor: "rgba(0,0,0,0.3)", zIndex: 0 }}
                            />

                            <div className="position-relative p-4 p-md-5 z-1">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2 className="fw-semibold mb-0 text-white">Book a Visit</h2>
                                    <button
                                        onClick={closeModal}
                                        aria-label="Close popup"
                                        type="button"
                                        className="btn-close btn-close-white"
                                        style={{ fontSize: "1.5rem", opacity: 0.9 }}
                                    />
                                </div>

                                <form onSubmit={handleSubmit} className="text-white">
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name"
                                            className="form-control form-control-lg transparent-input"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Your Email"
                                            className="form-control form-control-lg transparent-input"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Your Phone"
                                            className="form-control form-control-lg transparent-input"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <textarea
                                            name="message"
                                            placeholder="Your Message"
                                            className="form-control form-control-lg transparent-input"
                                            rows={3}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-lg px-5 py-3 fw-semibold"
                                            disabled={status === "Submitting..."}
                                            style={{
                                                backgroundColor: "#D0B674",
                                                color: "#fff",
                                                border: "none",
                                            }}
                                        >
                                            {status === "Submitting..." ? "Submitting..." : "Submit"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <style jsx>{`
                                .transparent-input {
                                    background-color: transparent !important;
                                    border: none;
                                    border-bottom: 2px solid #fff !important;
                                    color: #fff !important;
                                    box-shadow: none !important;
                                }

                                .transparent-input::placeholder {
                                    color: rgba(255, 255, 255, 0.7);
                                }

                                .transparent-input:focus {
                                    border-color: #D0B674 !important;
                                    box-shadow: 0 0 0 0.25rem rgba(208, 182, 116, 0.4) !important;
                                    outline: none !important;
                                }

                                button:hover {
                                    background-color: #fff !important;
                                    color: #d0b674 !important;
                                    border: 1px solid #d0b674 !important;
                                }
                            `}</style>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
