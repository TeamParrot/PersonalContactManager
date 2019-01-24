export class User {
    username: string;
    sessionToken: string;
    
    constructor(username: string) {
        this.username = username;
    }
}