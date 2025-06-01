import type { Timestamp } from "firebase/firestore";

export interface UserData {
    uid: string;
    email: string;
    username: string;
    settings: Settings;
    accounts: Account[];
    createdAt: Date;
}

interface Account {
    id: string;
    balance: number;
    name: string;
    salary: number;
    currency: string;
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