export interface CashClosingData {
  id?: string;
  date: string;
  store_id: string;
  cashier: string;
  expected_balance: number;
  actual_balance: number;
  discrepancy: number;
  transactions_count: number;
  bills_count: {
    bills100: number;
    bills50: number;
    bills20: number;
    bills10: number;
    bills5: number;
    bills1: number;
    other: number;
  };
  notes?: string;
  created_at?: string;
}

export interface CashClosingFilters {
  date?: string;
  store_id?: string;
  cashier?: string;
}
