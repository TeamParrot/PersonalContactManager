import {IApiService} from "./IApiService";
import axios from 'axios';

export class LiveApiService implements IApiService {
    async login(username: string, password: string): Promise<boolean> {
        const body = {
            username,
            password
        };
        
        try {
            const res = await axios.post("/api/login", body);
            console.log(res);
            return true;
        }
        catch (e) {
            alert(e);
            return false;
        }
    }
}