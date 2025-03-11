import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export async function exportTOExcel(dataToExport, fileName) {
    if (dataToExport.length === 0) {
        alert("No data available to export");
        return;
    }

    // Convert data to a worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Enquiries");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(data, fileName+".xlsx");
}