import type { Timestamp } from "firebase/firestore";

export interface UserData {
    uid: string;
    email: string;
    username: string;
    settings: Settings;
    transactions: Transaction[];
    createdAt: Date;
    salary: number;
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