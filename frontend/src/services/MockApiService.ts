import {IApiService} from "./IApiService";

export class MockApiService implements IApiService {
    async login(username: string, password: string): Promise<boolean> {
        return true;
    }
}