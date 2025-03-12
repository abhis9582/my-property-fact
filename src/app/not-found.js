"use client";
import Link from 'next/link';
import { useEffect } from "react";

export default function NotFound() {
    useEffect(() => {
        document.title = "Not Found - My Website"; // Manually set the title
    }, []);
    return (
        <div className='p-5 text-center'>
            <div>
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
                <Link href="/">
                    <button className='btn btn-success'>
                        Go to Home
                    </button>
                </Link>
            </div>
        </div >
    );
}