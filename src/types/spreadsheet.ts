export interface SpreadsheetRow {
  id: string;
  date: string;
  description: string;
  quantityIn: number;
  quantityOut: number;
  balance: number;
  deliveryDate: string;
  driver: string;
}

export interface Sheet {
  id: string;
  name: string;
  rows: SpreadsheetRow[];
}

export interface Item {
  id: string;
  name: string;
  sheets: Sheet[];
}
