import {IApiService} from "./IApiService";
import axios from 'axios';
import {User} from "../models/User";
import {Contact} from "../models/Contact";

export class LiveApiService implements IApiService {
    public async login(username: string, password: string): Promise<User> {
        const body = {
            username,
            password
        };
        
        try {
            const res = await axios.post("/api/login", body);
            return new User(res.data["username"]);
        }
        catch (e) {
            alert(e);
        }
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

    public async register(username: string, password: string): Promise<User> {
        return;
    }

    public async updateContact(contact: Contact): Promise<void> {
        return;
    }
}