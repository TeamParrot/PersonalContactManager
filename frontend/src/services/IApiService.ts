import {Contact} from "../models/Contact";
import {User} from "../models/User";

export interface IApiService {
    login(username: string, password: string): Promise<User>
    logout(): Promise<void>
    register(): Promise<User>
    
    getContacts(): Promise<Contact[]>
    addContact(contact: Contact): Promise<void>
    updateContact(contact: Contact): Promise<void>
    deleteContact(id: number): Promise<void>
}