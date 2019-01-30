import React, {ChangeEvent, Component, FormEvent} from 'react';
import {IApiService} from "../services/IApiService";
import App from "../App";
import {User} from "../models/User";
import {Redirect} from "react-router";
import { FormErrors } from './FormErrors';

type RegisterProps = {
    onRegister: (user: User) => void;
};

type RegisterState = {
    user?: User;
    username: string;
    password: string;
    confirmpassword: string;
    error?: string;
    formErrors;
    usernameValid: boolean;
    passwordValid: boolean;
    confirmpasswordValid: boolean;
    formValid: boolean;

};

export class RegisterPage extends Component<RegisterProps, RegisterState> {
    private api: IApiService = App.getApiInstance();

    constructor(props: RegisterProps) {
        super(props);

        this.state = {
            username: "",
            password: "",
            confirmpassword: "",
            formErrors: {email: '', password: '', confirmpassword: ''},
            usernameValid: false,
            passwordValid: false,
            confirmpasswordValid: false,
            formValid: false

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
                <div className="panel panel-default">
                
                    <FormErrors formErrors={this.state.formErrors} />

                </div>
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
                    <input type="password" placeholder="Confirm Password" name="confirmpassword" value={this.state.confirmpassword} 
                        onChange={this.handleChange} required/>
                    <div id="checkPassword"></div>



                    <button type="submit" disabled={true} >Register</button>
                </form>
            </div>
        )
    }

    private handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Update the state when an input element is changed.
        
        const name = event.target.name;
        const value = event.target.value;

        this.setState( { ...this.state,[name]: value},
            () => {this.validateField(name,value) });
    };

    validateField(fieldName, value) {
        let feiledValidationErrors = this.state.formErrors;
        let usernameValid = this.state.usernameValid;
        let passwordValid = this.state.passwordValid;
        let confirmpasswordValid = this.state.confirmpasswordValid;

        switch(fieldName) {
            case 'username':
                usernameValid = true;
                feiledValidationErrors.username = usernameValid ? '': 'Username is invalid';
                break;
            case 'password':
                passwordValid = value.length >=6;
                feiledValidationErrors.password = passwordValid ? '': 'Password is to short';
                break;
            case 'confirmpassword':
                confirmpasswordValid = (this.state.password == this.state.confirmpassword);
                if( this.state.passwordValid == true)
                    feiledValidationErrors.confirmpassword = confirmpasswordValid ? '': 'Passwords do not match';

            default:
                break;
        }
        this.setState({formErrors: feiledValidationErrors,
            usernameValid: usernameValid,
            passwordValid: passwordValid
        }, this.validateForm);

    }

    validateForm() {
        this.setState({formValid: this.state.usernameValid && this.state.passwordValid});
    }


    private handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        // Clear the error message.
        this.setState({
            ...this.state,
            error: "",
        });

        try {
            // Make an API call to log the user in.
            const user = await this.api.register(this.state.username, this.state.password);
            this.setState({
                ...this.state,
                user: user,
            });
            this.props.onRegister(user);

        } catch (e) {
            // Display an error message if we couldn't login (e.g. invalid password)
            this.setState({
                ...this.state,
                error: e.message,
            });
        }
    }
}