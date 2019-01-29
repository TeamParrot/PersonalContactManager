import {IApiService} from "./IApiService";
import axios from 'axios';
import {User} from "../models/User";
import {Contact} from "../models/Contact";

const HOST = "http://127.0.0.1:8080";

export class LiveApiService implements IApiService {
    public async login(username: string, password: string): Promise<User> {
        const body = {
            username,
            password
        };
        
        try {
            const res = await axios.post(`${HOST}/api/login`, body);
            return new User(res.data.username);
        }
        catch (e) {
           throw new Error(e.response.data.error);
        }
    }

    public async addContact(contact: Contact): Promise<Contact> {
        try {
            const res = await axios.post(`${HOST}/api/contacts`, contact);
            contact.id = res.data.id;
            return contact;
        }
        catch (e) {
            throw new Error(e.response.data.error);
        }
    }   

    public async deleteContact(id: number): Promise<void> {
        try {
            await axios.delete(`${HOST}/api/contacts/${id}`);
        }
        catch (e) {
            throw new Error(e.response.data.error);
        }
    }

    public async getContacts(): Promise<Contact[]> {
        const res = await axios.get(`${HOST}/api/contacts`);
        return res.data;
    }

    public async logout(): Promise<void> {
        try {
            await axios.post(`${HOST}/api/logout`);
        }
        catch (e) {
            throw new Error(e.response.data.error);
        }
    }

    public async register(username: string, password: string): Promise<User> {
        const body  = {
            username,
            password
        }

        try {
            const res = await axios.post(`${HOST}/api/register`, body);
            return new User(res.data.username);
        }
        catch (e) {
            throw new Error(e.response.data.error);
        }
        
    }

    public async updateContact(contact: Contact): Promise<Contact> {
        try {
            await axios.put(`${HOST}/api/contacts/${contact.id}`, contact);
            return contact;
        }
        catch (e) {
            throw new Error(e.response.data.error);
        }
    }
}