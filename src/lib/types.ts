export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    settings: Settings;
    transactions: Transaction[];
    createdAt: Date;
}
interface Settings {
    theme: 'light' | 'dark';
    notifications: boolean;
}
interface Transaction {
    amount: number;
    date: Date;
    type: 'income' | 'expense';
    description: string;
}