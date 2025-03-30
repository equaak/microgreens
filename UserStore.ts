import { makeAutoObservable } from "mobx";

export interface User {
    user_id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    location: string | null;
}

class UserStore {
    user: User | null = null;
    isAuthenticated: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    // Set user data when logged in or registered
    setUser(userData: User) {
        this.user = userData;
        this.isAuthenticated = true;
    }

    // Logout user
    logout() {
        this.user = null;
        this.isAuthenticated = false;
    }

    // Update user details
    updateUser(updatedUserData: Partial<User>) {
        if (this.user) {
            this.user = { ...this.user, ...updatedUserData };
        }
    }
}

const userStore = new UserStore();
export default userStore;
