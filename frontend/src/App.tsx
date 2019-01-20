import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, withRouter} from 'react-router-dom';
import './App.css';
import {HomePage} from "./pages/HomePage";
import {LoginPage} from "./pages/LoginPage";
import {IApiService} from "./services/IApiService";
import {MockApiService} from "./services/MockApiService";
import {LiveApiService} from "./services/LiveApiService";
import {User} from "./models/User";

const USE_LIVE_API: boolean = false;

type AppProps = {};
type AppState = {
    user?: User; // The logged in user, if logged in.
}

class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <Router>
                <div className="app">
                    <h1>Contact Manager App</h1>

                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            {
                                !this.state.user &&
                                <li>
                                  <Link to="/login/">Login</Link>
                                </li>
                            }
                            {
                                this.state.user &&
                                <p>Logged in as {this.state.user.username}</p>
                            }
                        </ul>
                    </nav>

                    <Route path="/" exact component={HomePage}/>
                    <Route path="/login/" component={() => <LoginPage onLogin={this.userChanged}/>}/>
                </div>
            </Router>
        );
    }

    private userChanged = user => {
        this.setState({
            user: user
        });
    };

    public static getApiInstance() {
        return _api = _api || (USE_LIVE_API ? new LiveApiService() : new MockApiService());
    }
}

let _api: IApiService;

export default App;
