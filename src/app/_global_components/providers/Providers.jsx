"use client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ProjectProvider } from "@/app/_global_components/contexts/projectsContext";

export default function Providers({ children }) {
    return (
        <ProjectProvider>
            {children}
            <ToastContainer />
        </ProjectProvider>
    );
}