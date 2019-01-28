import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import {HomePage} from "./pages/HomePage";
import {LoginPage} from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";
import {IApiService} from "./services/IApiService";
import {MockApiService} from "./services/MockApiService";
import {LiveApiService} from "./services/LiveApiService";
import {User} from "./models/User";

const USE_LIVE_API: boolean = true;

type AppProps = {};
type AppState = {
    user?: User; // The logged in user, if logged in.
}

class App extends Component<AppProps, AppState> {
    private api: IApiService = App.getApiInstance();
    
    constructor(props: AppProps) {
        super(props);

        this.state = {};
    }

    componentWillMount(): void {
        // Check if we are logged in.
        const token = this.getCookieValue("token");
        if (token) {
            const user = new User("Demo User");
            user.sessionToken = token;
            
            this.setState({
                user: user,
            });
        } else {
            console.log("Not logged in");
        }
    }

    render() {
        return (
            <Router>
                <div className="app" id="app">
                    <h1>Contact Manager App</h1>

                    <nav>
                        <ul>
                            <li>
                                <Link to="/" className="button">Home</Link>
                            </li>
                            {
                                !this.state.user &&
                                <li>
                                  <Link to="/login/" className="button">Login</Link>
                                </li>
                            }
                            {
                                !this.state.user &&
                                <li>
                                  <Link to="/register/" className="button">Register</Link>
                                </li>
                            }
                            {
                                this.state.user &&
                                <li>
                                  <a className="button" onClick={this.logout}>Logout</a>
                                </li>
                            }
                        </ul>
                    </nav>

                    <Route path="/" exact component={() => <HomePage user={this.state.user}/>}/>
                    <Route path="/login/" component={() => <LoginPage onLogin={this.userChanged}/>}/>
                    <Route path="/register/" component={() => <RegisterPage onLogin={this.userChanged}/>}/>
                </div>
            </Router>
        );
    }

    private userChanged = user => {
        this.setState({
            user: user
        });
    };

    private logout = async () => {
        await this.api.logout();
        this.setState({
            user: null,
        });
    };

    private getCookieValue(a) {
        // https://stackoverflow.com/a/25490531/1218281
        var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
    }

    public static getApiInstance() {
        return _api = _api || (USE_LIVE_API ? new LiveApiService() : new MockApiService());
    }
}

let _api: IApiService;

export default App;
