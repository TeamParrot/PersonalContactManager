export interface IApiService {
    login(username: string, password: string): Promise<boolean>
}