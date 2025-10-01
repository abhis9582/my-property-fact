"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashboardHeader from "../common-model/dashboardHeader";
import DataTable from "../common-model/data-table";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function ManageLocationBenefits({ allBenefits }) {
  const openAddModel = () => {};

  //Defining table columns
  const columns = [
    {
      field: "index",
      headerName: "S.no",
      width: 100,
      cellClassName: "centered-cell",
    },
    {
      field: "benefitName",
      headerName: "Benefit Name",
      flex: 1,
      cellClassName: "text-capitalize",
    },
    { field: "benefitIcon", headerName: "Benefit Icon", flex: 1,
      renderCell: (params) => (
        <div>
          <Image 
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}location-benefit/${params.row.benefitIcon}`}
            width={50}
            height={50}
            alt={`${params.row.altTag}`}
          />
        </div>
      )
     },
    {
      field: "altTag",
      headerName: "Alt Tag",
      flex: 1,
      cellClassName: "text-capitalize",
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <div>
          <FontAwesomeIcon
            className="mx-3 text-danger"
            style={{ cursor: "pointer" }}
            icon={faTrash}
            // onClick={() => openConfirmationDialog(params.row.id)}
          />
          <FontAwesomeIcon
            className="text-warning"
            style={{ cursor: "pointer" }}
            icon={faPencil}
            // onClick={() => openEditPopUp(params.row)}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      {/* header section  */}
      <DashboardHeader
        buttonName={"Add New Benefit"}
        functionName={openAddModel}
        heading={"Manage Location Benefit"}
      />

      {/* table section  */}
      <div className="mt-5">
        <DataTable columns={columns} list={allBenefits} />
      </div>
    </>
  );
}
