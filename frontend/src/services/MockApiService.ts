import {IApiService} from "./IApiService";
import {Contact} from "../models/Contact";
import {User} from "../models/User";

export class MockApiService implements IApiService {
    public async login(username: string, password: string): Promise<User> {
        //throw new Error("Invalid password!");
        return new User("Demo Account")
    }
    
    public async addContact(contact: Contact): Promise<Contact> {
        contact.id = Math.floor(Math.random() * 100000);
        return contact;
    }

    public async deleteContact(id: number): Promise<void> {
        return;
    }

    public async getContacts(): Promise<Contact[]> {
        return [
            {
                "id": 1,
                "firstName": "bob",
                "lastName": "dole",
                "phoneNumber": "4075559999",
                "email": "dummy@fakemail.net",
            },
            {
                "id": 2,
                "firstName": "jim",
                "lastName": "henson",
                "phoneNumber": "4075558888",
                "email": "elmo@fakemail.net",
            }
        ]
    }

    public async logout(): Promise<void> {
        return;
    }

    public async register(username: string, password: string): Promise<User> {
        return;
    }

    public async updateContact(contact: Contact): Promise<Contact> {
        return contact;
    }
}