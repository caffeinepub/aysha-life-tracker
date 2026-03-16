import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    done: boolean;
    description: string;
}
export interface CheckedItems {
    nETPrep: Array<string>;
    students: Array<string>;
    riyalah: Array<string>;
    certificates: Array<string>;
    mABooks: Array<string>;
}
export interface UserData {
    dailyTasks: Array<Task>;
    checkedItems: CheckedItems;
    monthlyIncome: bigint;
}
export interface backendInterface {
    isUserDataPersisted(): Promise<boolean>;
    loadUserData(): Promise<UserData>;
    saveUserData(checkedItems: CheckedItems, monthlyIncome: bigint, dailyTasks: Array<Task>): Promise<void>;
}
