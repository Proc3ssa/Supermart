import { Item, Sheet, SpreadsheetRow } from "@/types/spreadsheet";

const STORAGE_KEY = "spreadsheet-data";

export const loadItems = (): Item[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
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
        rows: [],
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
    rows: [],
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

export const addRow = (itemId: string, sheetId: string, row: Omit<SpreadsheetRow, "id" | "balance">): SpreadsheetRow | null => {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return null;

  const sheet = item.sheets.find((s) => s.id === sheetId);
  if (!sheet) return null;

  const newRow: SpreadsheetRow = {
    ...row,
    id: crypto.randomUUID(),
    balance: row.quantityIn - row.quantityOut,
  };
  sheet.rows.push(newRow);
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
  row.balance = row.quantityIn - row.quantityOut;
  saveItems(items);
};

export const deleteRow = (itemId: string, sheetId: string, rowId: string) => {
  const items = loadItems();
  const item = items.find((i) => i.id === itemId);
  if (!item) return;

  const sheet = item.sheets.find((s) => s.id === sheetId);
  if (!sheet) return;

  sheet.rows = sheet.rows.filter((r) => r.id !== rowId);
  saveItems(items);
};
