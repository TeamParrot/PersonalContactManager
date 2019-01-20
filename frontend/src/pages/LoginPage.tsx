import React, {ChangeEvent, Component, FormEvent} from 'react';
import {IApiService} from "../services/IApiService";
import App from "../App";
import {User} from "../models/User";
import {Redirect} from "react-router";

type LoginProps = {
    onLogin: (user: User) => void;
};

type LoginState = {
    user?: User;
    username: string;
};

export class LoginPage extends Component<LoginProps, LoginState> {
    private api: IApiService = App.getApiInstance();

    constructor(props: LoginProps) {
        super(props);

        this.state = {
            username: "",
        };
    }

    public render() {
        // TODO: Finish login form. See controlled components here: https://reactjs.org/docs/forms.html
        return (
            <div>
                {this.state.user &&
                <Redirect push to="/"/>
                }
                <h1>Login Page</h1>

                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Username" name="username" value={this.state.username}
                           onChange={this.handleChange}/>
                    <button type="submit">Login</button>
                </form>
            </div>
        )
    }

    private handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Update the state when an input element is changed.
        if (!event.target) return;
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value
        });
    };

    private handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const user = await this.api.login(this.state.username, "password");
        this.setState({
            ...this.state,
            user: user,
        });
        this.props.onLogin(user);
    }
}