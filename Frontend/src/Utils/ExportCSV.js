import React from 'react';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default function ExportToExport({ apiData, fileName }) {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(apiData);

    // Set column widths
    const wscols = [
      { wpx: 200 },  
      { wpx: 200 },  
      { wpx: 200 },  
      { wpx: 200 }, 
      { wpx: 200 }, 
      { wpx: 200 }, 
    ];
    ws['!cols'] = wscols;

    // Optional: Add styles
    const cellStyle = { font: { name: "Arial", sz: 12, bold: true }, alignment: { vertical: "center", horizontal: "center" } };
    for (const cell in ws) {
      if (cell[0] === "!") continue; 
      ws[cell].s = cellStyle;
    }

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button
      onClick={(e) => exportToCSV(apiData, fileName)}
      type="button"
      className="btn btn-primary float-end"
      data-toggle="tooltip"
      data-placement="top"
      title="Export To Excel"
      delay={{ show: "0", hide: "100" }}
      style={{ margin: "10px 0" }}  
    >
      <i className="fa fa-download" aria-hidden="true"></i> Export-Excel
    </button>
  );
}
