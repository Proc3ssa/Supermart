import { Item, Sheet, SpreadsheetRow } from "@/types/spreadsheet";

const STORAGE_KEY = "spreadsheet-data";
const OPEN_BALANCE_ID = "open-balance-row-id"; // Unique ID for the special row

const createOpenBalanceRow = (): SpreadsheetRow => ({
  id: OPEN_BALANCE_ID,
  description: "Open Balance",
  quantityIn: 600, // Default opening balance
  quantityOut: 0,
  balance: 600, // Initial balance is the quantityIn
  date: new Date().toISOString().split('T')[0], // Set current date
  deliveryDate: "", 
  driver: "",
});

const calculateRunningBalance = (sheet: Sheet) => {
  if (sheet.rows.length === 0) return;

  // Ensure the first row (Open Balance) is calculated correctly first
  if (sheet.rows[0].id === OPEN_BALANCE_ID) {
    sheet.rows[0].balance = sheet.rows[0].quantityIn - sheet.rows[0].quantityOut;
  } else {
    // This is a safety check; ideally, the Open Balance row is always first.
    console.error("First row is not the Open Balance row, running balance calculation may be incorrect.");
  }

  // Calculate the running balance for all subsequent rows
  for (let i = 1; i < sheet.rows.length; i++) {
    const previousBalance = sheet.rows[i - 1].balance;
    const currentRow = sheet.rows[i];
    currentRow.balance = previousBalance + (currentRow.quantityIn - currentRow.quantityOut);
  }
};

export const loadItems = (): Item[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const items: Item[] = stored ? JSON.parse(stored) : [];
  
  // Recalculate balances on load to ensure consistency
  items.forEach(item => 
    item.sheets.forEach(sheet => 
      calculateRunningBalance(sheet)
    )
  );

  return items;
};

export const saveItems = (items: Item[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const addItem = (name: string): Item => {
  const items = loadItems();
  const newItem: Item = {
    id: crypto.randomUUID(),
    name,
    sheets: [
      {
        id: crypto.randomUUID(),
        name: "Sheet 1",
        rows: [createOpenBalanceRow()],
      },
    ],
  };
  items.push(newItem);
  saveItems(items);
  return newItem;
};

export const deleteItem = (itemId: string) => {
  const items = loadItems().filter((item) => item.id !== itemId);
  saveItems(items);
};

export const addSheet = (itemId: string): Sheet | null => {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return null;

  const newSheet: Sheet = {
    id: crypto.randomUUID(),
    name: `Sheet ${item.sheets.length + 1}`,
    rows: [createOpenBalanceRow()],
  };
  item.sheets.push(newSheet);
  saveItems(items);
  return newSheet;
};

export const deleteSheet = (itemId: string, sheetId: string) => {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return;

  item.sheets = item.sheets.filter((s) => s.id !== sheetId);
  saveItems(items);
};

export const renameSheet = (itemId: string, sheetId: string, newName: string) => {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return;

  const sheet = item.sheets.find((s) => s.id === sheetId);
  if (!sheet) return;

  sheet.name = newName;
  saveItems(items);
};

export const addRow = (itemId: string, sheetId: string, row: Omit<SpreadsheetRow, "id" | "balance">): SpreadsheetRow | null => {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return null;

  const sheet = item.sheets.find((s) => s.id === sheetId);
  if (!sheet) return null;

  const newRow: SpreadsheetRow = {
    ...row,
    id: crypto.randomUUID(),
    balance: 0, // Placeholder, calculated below
  };
  sheet.rows.push(newRow);

  // Recalculate all balances in the sheet after adding the row
  calculateRunningBalance(sheet);

  saveItems(items);
  return newRow;
};

export const updateRow = (itemId: string, sheetId: string, rowId: string, updates: Partial<SpreadsheetRow>) => {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return;

  const sheet = item.sheets.find((s) => s.id === sheetId);
  if (!sheet) return;

  const row = sheet.rows.find((r) => r.id === rowId);
  if (!row) return;

  Object.assign(row, updates);

  // Recalculate all balances in the sheet after updating the row
  calculateRunningBalance(sheet);

  saveItems(items);
};

export const deleteRow = (itemId: string, sheetId: string, rowId: string) => {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return;

  const sheet = item.sheets.find((s) => s.id === sheetId);
  if (!sheet) return;

  sheet.rows = sheet.rows.filter((r) => r.id !== rowId);

  // Recalculate all balances in the sheet after deleting the row
  calculateRunningBalance(sheet);
  
  saveItems(items);
};