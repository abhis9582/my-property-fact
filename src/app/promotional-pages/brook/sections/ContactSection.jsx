"use client";

export default function ContactSection() {
    return (
        <section id="contact" className="bg-light py-5 px-3 text-center">
            <div className="container position-relative z-1">
                <h5 className="text-uppercase text-secondary fw-semibold mb-3">
                    Contact Us
                </h5>
                <h2 className="display-3 fw-bold text-dark mb-3">
                    Let’s Help You Find Your Perfect Home at The Brook
                </h2>
                <p className="lead text-muted mb-5">
                    Please fill in your details and our team will get in touch shortly.
                </p>

                <div
                    className="mx-auto bg-white rounded shadow p-2 p-md-3 border border-secondary"
                    style={{ maxWidth: '900px' }}
                >
                    <form
                        className="border border-warning rounded p-5 p-md-5"
                        style={{ minHeight: '100px' }}
                    >
                        <div className="row g-4 mb-4">
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="form-control form-control-lg rounded-0 border-0 border-bottom border-warning"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="form-control form-control-lg rounded-0 border-0 border-bottom border-warning"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="email"
                                    placeholder="Email ID"
                                    className="form-control form-control-lg rounded-0 border-0 border-bottom border-warning"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <select
                                required
                                className="form-select form-select-lg rounded-0 border-0 border-bottom border-warning"
                            >
                                <option value="">Preferred Unit Type</option>
                                <option value="3bhk">3 BHK</option>
                                <option value="4bhk">4 BHK</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Message (Optional)"
                                className="form-control form-control-lg rounded-0 border-0 border-bottom border-warning"
                            />
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="btn btn-lg px-5 py-3 fw-semibold"
                            >
                                Get In Touch
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                input:focus,
                select:focus {
                    border-color: #D0B674 !important;
                    box-shadow: 0 0 0 0.25rem rgba(208, 182, 116, 0.5) !important;
                    outline: none !important;
                }

                .form-control,
                .form-select,
                button {
                    border-color: #D0B674 !important;
                }

                button {
                    color: #D0B674 !important;
                    transition: color 0.3s, background-color 0.3s;
                }

                button:hover {
                    color: #fff !important;
                    background-color: #D0B674 !important;
                }

                #contact {
                    background: #fff !important;
                    margin-bottom: 5rem;
                }
            `}</style>
        </section>
    );
}
