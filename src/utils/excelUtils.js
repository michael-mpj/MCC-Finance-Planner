import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * Safely export transactions to Excel format using ExcelJS
 * Avoids prototype pollution by using explicit array-based data handling
 * 
 * @param {Array} transactions - Array of transaction objects
 * @param {string} filename - Optional filename (defaults to 'transactions.xlsx')
 */
export const exportTransactions = async (transactions, filename = 'transactions.xlsx') => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Transactions');

    // Set up header with styling
    const headerRow = sheet.addRow(['Date', 'Title', 'Description', 'Category', 'Type', 'Amount', 'Tags']);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows - explicitly map each field to avoid prototype pollution
    transactions.forEach(tx => {
      const row = sheet.addRow([
        tx.date || '',
        tx.title || tx.note || tx.category || '',
        tx.description || tx.note || '',
        tx.category || '',
        tx.type || '',
        Number(tx.amount) || 0,
        Array.isArray(tx.tags) ? tx.tags.join(', ') : ''
      ]);
      
      // Format amount column as currency
      row.getCell(6).numFmt = '$#,##0.00';
    });

    // Auto-fit columns
    sheet.columns.forEach(column => {
      column.width = 15;
    });

    // Generate buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, filename);
    
    return { success: true, message: `Exported ${transactions.length} transactions` };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Export failed:', error);
    return { success: false, message: 'Export failed: ' + error.message };
  }
};

/**
 * Safely import transactions from Excel file using ExcelJS
 * Uses array-based parsing to avoid prototype pollution vulnerabilities
 * 
 * @param {File} file - Excel file to import
 * @returns {Promise<Object>} Result object with success status and data/error
 */
export const importTransactions = async (file) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await file.arrayBuffer());
    
    const sheet = workbook.getWorksheet(1);
    if (!sheet) {
      throw new Error('No worksheet found in the Excel file');
    }

    const transactions = [];
    const errors = [];

    sheet.eachRow((row, rowNumber) => {
      // Skip header row
      if (rowNumber === 1) return;
      
      try {
        // Safely extract values using array indexing (skip first empty cell)
        const values = row.values.slice(1);
        const [date, category, type, amount, note, tags] = values;

        // Validate required fields
        if (!date || !category || !type || amount === undefined) {
          errors.push(`Row ${rowNumber}: Missing required fields`);
          return;
        }

        // Create transaction object with explicit field mapping
        const transaction = {
          id: `import_${Date.now()}_${rowNumber}`,
          date: date instanceof Date ? date.toISOString().split('T')[0] : String(date),
          category: String(category),
          type: String(type).toLowerCase(),
          amount: Number(amount) || 0,
          note: note ? String(note) : '',
          tags: tags ? String(tags).split(',').map(tag => tag.trim()).filter(Boolean) : [],
          imported: true,
          importedAt: new Date().toISOString()
        };

        // Validate transaction type
        if (!['income', 'expense'].includes(transaction.type)) {
          errors.push(`Row ${rowNumber}: Invalid type '${transaction.type}' (must be 'income' or 'expense')`);
          return;
        }

        transactions.push(transaction);
      } catch (error) {
        errors.push(`Row ${rowNumber}: ${error.message}`);
      }
    });

    return {
      success: true,
      data: transactions,
      errors: errors,
      message: `Imported ${transactions.length} transactions${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Import failed:', error);
    return {
      success: false,
      message: 'Import failed: ' + error.message,
      data: [],
      errors: [error.message]
    };
  }
};

/**
 * Export budget data to Excel
 * 
 * @param {Array} budgets - Array of budget objects
 * @param {string} filename - Optional filename
 */
export const exportBudgets = async (budgets, filename = 'budgets.xlsx') => {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Budgets');

    // Add header
    const headerRow = sheet.addRow(['Category', 'Planned Amount', 'Spent Amount', 'Remaining', 'Period', 'Status']);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows
    budgets.forEach(budget => {
      const remaining = Number(budget.planned || 0) - Number(budget.spent || 0);
      const row = sheet.addRow([
        budget.category || '',
        Number(budget.planned) || 0,
        Number(budget.spent) || 0,
        remaining,
        budget.period || '',
        budget.status || ''
      ]);
      
      // Format currency columns
      [2, 3, 4].forEach(colNum => {
        row.getCell(colNum).numFmt = '$#,##0.00';
      });
    });

    // Auto-fit columns
    sheet.columns.forEach(column => {
      column.width = 15;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, filename);
    
    return { success: true, message: `Exported ${budgets.length} budgets` };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Budget export failed:', error);
    return { success: false, message: 'Budget export failed: ' + error.message };
  }
};

/**
 * Create a comprehensive financial report in Excel
 * 
 * @param {Object} data - Object containing transactions, budgets, and summary data
 * @param {string} filename - Optional filename
 */
export const exportFinancialReport = async (data, filename = 'financial-report.xlsx') => {
  try {
    const workbook = new ExcelJS.Workbook();
    
    // Transactions sheet
    if (data.transactions && data.transactions.length > 0) {
      const txSheet = workbook.addWorksheet('Transactions');
      const headerRow = txSheet.addRow(['Date', 'Category', 'Type', 'Amount', 'Note']);
      headerRow.font = { bold: true };
      
      data.transactions.forEach(tx => {
        const row = txSheet.addRow([
          tx.date, tx.category, tx.type, Number(tx.amount), tx.note
        ]);
        row.getCell(4).numFmt = '$#,##0.00';
      });
    }
    
    // Summary sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.addRow(['Financial Summary Report']).font = { bold: true, size: 16 };
    summarySheet.addRow(['Generated on:', new Date().toLocaleDateString()]);
    summarySheet.addRow([]); // Empty row
    
    if (data.summary) {
      summarySheet.addRow(['Total Income:', Number(data.summary.totalIncome || 0)]);
      summarySheet.addRow(['Total Expenses:', Number(data.summary.totalExpenses || 0)]);
      summarySheet.addRow(['Net Amount:', Number(data.summary.netAmount || 0)]);
      
      // Format currency
      [4, 5, 6].forEach(rowNum => {
        summarySheet.getRow(rowNum).getCell(2).numFmt = '$#,##0.00';
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, filename);
    
    return { success: true, message: 'Financial report exported successfully' };
  } catch (error) {
    console.error('Report export failed:', error);
    return { success: false, message: 'Report export failed: ' + error.message };
  }
};

export const exportYearlyReport = async (transactions, year = new Date().getFullYear()) => {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'MCC Finance Planner';
    workbook.created = new Date();

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const sheetName = months[monthIndex];
      const sheet = workbook.addWorksheet(sheetName);

      const headerRow = sheet.addRow(['ID', 'Title', 'Description', 'Category', 'Type', 'Amount', 'Date']);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      const monthTransactions = transactions.filter(tx => {
        const d = new Date(tx.date);
        return d.getFullYear() === year && d.getMonth() === monthIndex;
      });

      monthTransactions.forEach(tx => {
        const row = sheet.addRow([
          tx.id,
          tx.title || tx.note || tx.category || 'Untitled',
          tx.description || tx.note || '',
          tx.category,
          tx.type,
          Number(tx.amount) || 0,
          tx.date
        ]);
        row.getCell(6).numFmt = '$#,##0.00';
      });

      sheet.columns.forEach(column => {
        column.width = 18;
      });

      if (monthTransactions.length === 0) {
        sheet.addRow(['No transactions for this month']);
      }
    }

    const filename = `MccTransaction-${year}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename);

    return { success: true, message: `Exported yearly report for ${year}` };
  } catch (error) {
    console.error('Yearly export failed:', error);
    return { success: false, message: 'Yearly export failed: ' + error.message };
  }
};