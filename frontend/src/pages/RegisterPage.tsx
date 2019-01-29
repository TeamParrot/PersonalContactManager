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
    password: string;
    error?: string;
};

export class RegisterPage extends Component<LoginProps, LoginState> {
    private api: IApiService = App.getApiInstance();

    constructor(props: LoginProps) {
        super(props);

        this.state = {
            username: "",
            password: "",
        };
    }

    public render() {
        // TODO: Finish login form. See controlled components here: https://reactjs.org/docs/forms.html
        return (
            <div>
                {this.state.user &&
                <Redirect push to="/"/>
                }
                <h1>Register Page</h1>
                <form onSubmit={this.handleSubmit}>
                    {this.state.error &&
                    <div className="alert alert--error">
                        {this.state.error}
                    </div>
                    }
                    <input type="text" placeholder="Username" name="username" value={this.state.username}
                        onChange={this.handleChange} required/>
                    <input type="password" placeholder="Password" name="password" value={this.state.password}
                        onChange={this.handleChange} required/>



                    <button type="submit">Register</button>
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

        // Clear the error message.
        this.setState({
            ...this.state,
            error: "",
        });

        try {
            // Make an API call to log the user in.
            const user = await this.api.login(this.state.username, this.state.password);
            this.setState({
                ...this.state,
                user: user,
            });
            this.props.onLogin(user);
        } catch (e) {
            // Display an error message if we couldn't login (e.g. invalid password)
            this.setState({
                ...this.state,
                error: e.message,
            });
        }
    }
}