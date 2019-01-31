import React, {ChangeEvent, Component, FormEvent} from 'react';
import {IApiService} from "../services/IApiService";
import App from "../App";
import {User} from "../models/User";
import {Redirect} from "react-router";
// import { FormErrors } from './FormErrors';

type RegisterProps = {
    onRegister: (user: User) => void;
};

type RegisterState = {
    user?: User;
    username: string;
    password: string;
    confirmpassword: string;
    error?: string;
    //formErrors;
    usernameValid: boolean;
    passwordInvalid: boolean;
    confirmpasswordInvalid: boolean;
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
            //formErrors: {username: '', password: '', confirmpassword: ''},
            usernameValid: false,
            passwordInvalid: false,
            confirmpasswordInvalid: false,
            formValid: false

        };
    }

    public render() {
        // TODO: Finish login form. See controlled components here: https://reactjs.org/docs/forms.html
        const { passwordInvalid, confirmpasswordInvalid } = this.state;
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
                    <input type="text"  placeholder="Username" name="username" value={this.state.username}
                        onChange={this.handleChange} required/>

                    <input type="password" placeholder="Password" name="password" value={this.state.password}
                        onChange={this.handleChange} required/>

                    <div className="Password Error">
                        { passwordInvalid
                            ? <div>Invalid Password</div>
                            : null
                        }
                    </div>

                    <input type="password" placeholder="Confirm Password" name="confirmpassword" value={this.state.confirmpassword} 
                        onChange={this.handleChange} required/>

                    <div className="Confirm Password Error">
                        { confirmpasswordInvalid
                            ? <div>Passwords do not match</div>
                            : null
                        }
                    </div>

                    <button type="submit" disabled={!this.state.formValid} >Register</button>
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
        let usernameValid = this.state.usernameValid;
        let passwordInvalid = this.state.passwordInvalid;
        let confirmpasswordInvalid = this.state.confirmpasswordInvalid;

        switch(fieldName) {
            case 'username':
                usernameValid = true;

                break;
            case 'password':
                if(value.length == 0 || value.length >= 6) {
                    passwordInvalid = false;
                } else {
                    passwordInvalid = true;
                }

                break;
            case 'confirmpassword':
                
                if((value.length == 0 || (this.state.password == this.state.confirmpassword)) && !passwordInvalid) {
                    confirmpasswordInvalid = false;
                } else {
                    confirmpasswordInvalid = true;
                }
                
                break;
            default:
                break;
        }
        this.setState( {
            usernameValid: usernameValid,
            passwordInvalid: passwordInvalid,
            confirmpasswordInvalid: confirmpasswordInvalid
        }, this.validateForm);

    }

    validateForm() {
        this.setState({formValid: this.state.usernameValid 
            && this.state.passwordInvalid 
            && this.state.confirmpasswordInvalid});
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