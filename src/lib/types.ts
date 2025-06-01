import type { Timestamp } from "firebase/firestore";

export interface UserData {
    uid: string;
    email: string;
    username: string;
    settings: Settings;
    accounts: Account[];
    createdAt: Date;
}

export interface Account {
    id: string;
    balance: number;
    name: string;
    salary: number;
    currency: string;
    budget: Budget;
    transactions: Transaction[];
}
interface Settings {
    theme: 'light' | 'dark';
    notifications: boolean;
}
interface Transaction {
    amount: number;
    date: Timestamp;
    type: 'income' | 'expense';
    description: string;
}
export interface FormattedTransaction {
    amount: number;
    date: Timestamp;
    formattedDate: String;
    type: 'income' | 'expense';
    description: string;
}

export interface Budget {
    total: number;
    remaining: number;
    items: BudgetItem[];
}
export interface BudgetItem {
    description: string;
    category: string;
    amount: number;
}