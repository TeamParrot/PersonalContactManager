import {Contact} from "../models/Contact";
import {User} from "../models/User";

export interface IApiService {
    login(username: string, password: string): Promise<User>
    logout(): Promise<void>
    register(username: string, password: string): Promise<User>
    
    getContacts(): Promise<Contact[]>
    addContact(contact: Contact): Promise<Contact>
    updateContact(contact: Contact): Promise<Contact>
    deleteContact(id: number): Promise<void>
}