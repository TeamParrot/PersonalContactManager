import {IApiService} from "./IApiService";
import {Contact} from "../models/Contact";
import {User} from "../models/User";

export class MockApiService implements IApiService {
    public async login(username: string, password: string): Promise<User> {
        return new User("Demo Account")
    }
    
    public async addContact(contact: Contact): Promise<void> {
        return;
    }

    public async deleteContact(id: number): Promise<void> {
        return;
    }

    public async getContacts(): Promise<Contact[]> {
        return;
    }

    public async logout(): Promise<void> {
        return;
    }

    public async register(): Promise<User> {
        return;
    }

    public async updateContact(contact: Contact): Promise<void> {
        return;
    }
}