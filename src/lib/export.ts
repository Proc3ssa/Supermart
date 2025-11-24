import * as XLSX from "xlsx";
import { SpreadsheetRow } from "@/types/spreadsheet";

export const exportToCSV = (rows: SpreadsheetRow[], sheetName: string) => {
  const headers = ["Date", "Description", "Quantity In", "Quantity Out", "Balance", "Delivery Date", "Driver"];
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => [
      row.date,
      `"${row.description}"`,
      row.quantityIn,
      row.quantityOut,
      row.balance,
      row.deliveryDate || "",
      `"${row.driver}"`
    ].join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${sheetName}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (rows: SpreadsheetRow[], sheetName: string) => {
  const data = rows.map(row => ({
    "Date": row.date,
    "Description": row.description,
    "Quantity In": row.quantityIn,
    "Quantity Out": row.quantityOut,
    "Balance": row.balance,
    "Delivery Date": row.deliveryDate || "",
    "Driver": row.driver
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${sheetName}.xlsx`);
};
