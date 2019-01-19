import React, {Component} from 'react';

export class LoginPage extends Component {
    render() {
        return (
            <div>
                <h1>Login Page</h1>
                <form>
                    <input type="text" placeholder="Username"/>
                    <button type="submit">Login</button>
                </form>
            </div>
        )
    }
}