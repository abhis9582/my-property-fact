"use client";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { exportTOExcel } from "../common-model/exporttoexcel";
import { toast } from "react-toastify";
import DataTable from "../common-model/data-table";
import DashboardHeader from "../common-model/dashboardHeader";
import { useState } from "react";
import CommonModal from "../common-model/common-model";
import { FormControl } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Enquiries({ list }) {
  const [confirmBox, setConfirmBox] = useState(false);
  const [id, setId] = useState(0);
  const router = useRouter();
  //Handle opening confirmation box
  const openConfirmationDialog = (id) => {
    setConfirmBox(true);
    setId(id);
  };

  //Handle Export file to excel
  const exportToExcel = async () => {
    exportTOExcel(list, "Enquiries");
    toast.success("Enquiries exported successfully...");
  };

  //Handle status change with API call
  const handleStatusChange = async (e, enquiryId) => {
    const newStatus = e.target.value;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}enquiry/update-status/${enquiryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        toast.success(`Status updated to ${newStatus} successfully`);
        router.refresh();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  //Get background color for status
  const getStatusColor = (status) => {
    const colors = {
      Shared: "#e3f2fd", // Light blue
      Test: "#fff3e0", // Light orange
      New: "#e8f5e8", // Light green
      Pending: "#fff8e1", // Light yellow
      Rejected: "#ffebee", // Light red
      Duplicate: "#f5f5f5", // Light gray
      Irrelevant: "#f3e5f5", // Light purple
    };
    return colors[status] || "#f8f9fa";
  };

  //Get text color for status
  const getStatusTextColor = (status) => {
    const colors = {
      Shared: "#1565c0", // Darker blue for better contrast
      Test: "#ef6c00", // Darker orange for better contrast
      New: "#2e7d32", // Darker green for better contrast
      Pending: "#f57f17", // Darker yellow for better contrast
      Rejected: "#c62828", // Darker red for better contrast
      Duplicate: "#616161", // Medium gray for better contrast
      Irrelevant: "#7b1fa2", // Darker purple for better contrast
    };
    return colors[status] || "#424242";
  };

  //Status options array
  const statusOptions = ["New", "Shared", "Test", "Pending", "Rejected", "Duplicate", "Irrelevant"];

  //Defining table columns
  const columns = [
    {
      field: "index",
      headerName: "S.no",
      width: 70,
      cellClassName: "centered-cell",
    },
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "message",
      headerName: "Message",
      width: 370,
    },
    {
      field: "enquiryFrom",
      headerName: "Enquiry From",
      width: 370,
    },
    {
      field: "projectLink",
      headerName: "Project Link",
      width: 370,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            padding: "8px",
          }}
        >
          <Link
            href={params.row.projectLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              color: "#1976d2",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "500",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              position: "relative",
            }}
          >
            {params.row.projectLink && params.row.projectLink !== "" ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            ) : null}
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "280px",
              }}
            >
              {params.row.projectLink && params.row.projectLink !== ""
                ? params.row.projectLink.length > 40
                  ? `${params.row.projectLink.substring(0, 40)}...`
                  : params.row.projectLink
                : ""}
            </span>
          </Link>
        </div>
      ),
    },
    {
      field: "pageName",
      headerName: "Page Name",
      width: 200,
    },
    {
      field: "date",
      headerName: "Data & Time",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: "8px",
          }}
        >
          <FormControl
            as="select"
            value={params.row.status || "New"}
            onChange={(e) => handleStatusChange(e, params.row.id)}
            style={{
              backgroundColor: getStatusColor(params.row.status || "New"),
              color: getStatusTextColor(params.row.status || "New"),
              border: `2px solid ${getStatusTextColor(
                params.row.status || "New"
              )}30`,
              borderRadius: "12px",
              padding: "5px 10px",
              minWidth: "150px",
              fontWeight: "600",
              fontSize: "14px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow:
                "0 3px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)",
              outline: "none",
              appearance: "none",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              backgroundSize: "18px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {statusOptions.map((status) => (
              <option
                key={status}
                value={status}
                style={{
                  backgroundColor: getStatusColor(status),
                  color: getStatusTextColor(status),
                  fontWeight: "600",
                  padding: "8px",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {status}
              </option>
            ))}
          </FormControl>
        </div>
      ),
    },
  ];
  return (
    <>
      <DashboardHeader
        buttonName={"Export to excel"}
        functionName={exportToExcel}
        heading={"Manage Enquiries"}
      />
      <div className="mt-5">
        <DataTable columns={columns} list={list} />
      </div>
      <CommonModal
        api={`${process.env.NEXT_PUBLIC_API_URL}enquiry/delete/${id}`}
        setConfirmBox={setConfirmBox}
        confirmBox={confirmBox}
      />
    </>
  );
}
