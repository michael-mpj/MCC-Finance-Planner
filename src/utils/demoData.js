import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import demoData from "../data/demoTransactions.json";

export const getDemoTransactions = () => {
  return demoData.map((tx) => ({
    ...tx,
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

export const exportDemoXlsx = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Demo Transactions");

    const headerRow = sheet.addRow([
      "Date",
      "Category",
      "Type",
      "Amount",
      "Note",
      "Tags",
    ]);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    demoData.forEach((tx) => {
      const row = sheet.addRow([
        tx.date || "",
        tx.category || "",
        tx.type || "",
        Number(tx.amount) || 0,
        tx.note || "",
        Array.isArray(tx.tags) ? tx.tags.join(", ") : "",
      ]);
      row.getCell(4).numFmt = "$#,##0.00";
    });

    sheet.columns.forEach((column) => {
      column.width = 18;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "demo-transactions.xlsx");

    return { success: true, message: "Demo XLSX exported" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
