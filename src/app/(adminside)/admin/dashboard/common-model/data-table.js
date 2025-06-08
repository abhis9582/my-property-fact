import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function DataTable({ list, columns }) {

    //Defining default rows
    const paginationModel = { page: 0, pageSize: 10 };

    return (
        <>
            <Paper sx={{ height: 'auto', width: "auto" }}>
                <DataGrid
                    rows={list}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[10, 15, 20, 50]}
                    sx={{
                        border: 0,
                        "& .MuiDataGrid-columnHeader": {
                            fontWeight: "bold",
                            fontSize: "16px",
                            backgroundColor: "#68ac78",
                        },
                        "& .centered-cell": {
                            marginLeft: "10px"
                        },
                    }}
                />
            </Paper>
        </>
    )
}