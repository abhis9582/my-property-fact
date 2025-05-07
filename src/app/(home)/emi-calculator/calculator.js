"use client";
import { useState } from 'react';
import CommonHeaderBanner from '../components/common/commonheaderbanner';
import CommonBreadCrum from '../components/common/breadcrum';
import { PieChart } from '@mui/x-charts/PieChart';


export default function Calculator() {
    // States for loan amount, interest rate, and loan tenure
    const [loanAmount, setLoanAmount] = useState(0);
    const [interestRate, setInterestRate] = useState(0);
    const [loanTenure, setLoanTenure] = useState(0);
    const [emi, setEmi] = useState(null);
    const [intrestPayable, setIntrestPayable] = useState(null);
    const [totalAmountPaid, setTotalAmountPaid] = useState(null);
    // EMI calculation logic
    const calculateEMI = () => {
        if (loanAmount && interestRate && loanTenure) {
            const principal = parseFloat(loanAmount);
            const annualRate = parseFloat(interestRate) / 100;
            const months = parseFloat(loanTenure);

            const monthlyRate = annualRate / 12;
            const emi =
                (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);
            const intrest = emi.toFixed(2) * months - principal;
            setIntrestPayable(intrest.toFixed(2));
            setEmi(emi.toFixed(2)); // Set EMI result
            setTotalAmountPaid(emi.toFixed(2) * months);
        } else {
            alert('Please fill in all the fields');
        }
    };

    return (
        <>
            <CommonHeaderBanner image={"contact-banner.jpg"} headerText={"Emi-calculator"} />
            <CommonBreadCrum pageName={"Emi-calculator"} />
            <h1 className='text-center '>Home Loan EMI Calculator</h1>

            <div className="container py-5 custom-shadow my-3 rounded-5 p-5" style={{ maxWidth: '600px' }}>
                <div className="mb-3">
                    <label htmlFor="loanAmount" className="form-label">Loan Amount (₹)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="loanAmount"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        placeholder="Enter loan amount"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="interestRate" className="form-label">Interest Rate (annual %)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="interestRate"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="Enter annual interest rate"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="loanTenure" className="form-label">Loan Tenure (months)</label>
                    <input
                        type="number"
                        className="form-control"
                        id="loanTenure"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(e.target.value)}
                        placeholder="Enter loan tenure in months"
                    />
                </div>

                <div className="d-grid gap-2">
                    <button className="btn btn-background text-white" onClick={calculateEMI}>
                        <h5 className='m-0 p-0'>Calculate EMI</h5>
                    </button>
                </div>

                {emi && (
                    <div className="alert alert-success mt-4 text-center">
                        <h4>Your EMI is: ₹{emi}</h4>
                        <h4>Intrest Payable is: ₹{intrestPayable}</h4>
                        <h4>Total Amount paid: ₹{totalAmountPaid}</h4>
                    </div>
                )}
                {emi && <PieChart
                    series={[
                        {
                            data: [
                                { id: 0, value: intrestPayable, label: 'intrestPayable' },
                                { id: 1, value: totalAmountPaid, label: 'totalAmountPaid' },
                            ],
                        },
                    ]}
                    width={200}
                    height={200}
                />}
            </div>

        </>
    );
}
