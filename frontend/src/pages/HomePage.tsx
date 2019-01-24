import React, {Component} from 'react';
import {IApiService} from "../services/IApiService";
import App from "../App";
import {User} from "../models/User";

type HomeProps = {
    user: User;
};

type HomeState = {
    user: User;
};

export class HomePage extends Component<HomeState, HomeProps> {
    private api: IApiService = App.getApiInstance();

    constructor(props: HomeProps) {
        super(props);

        this.state = {
            user: props.user,
        };
    }
    
    render() {
        return <div>
            {
                this.state.user &&
                <h1>Home (Logged In)</h1>
            }
            {
                !this.state.user &&
                <h1>Home (Logged Out)</h1>
            }
        </div>
    }
}