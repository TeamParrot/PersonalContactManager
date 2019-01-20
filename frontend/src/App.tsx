import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import './App.css';
import {HomePage} from "./pages/HomePage";
import {LoginPage} from "./pages/LoginPage";
import {IApiService} from "./services/IApiService";
import {MockApiService} from "./services/MockApiService";
import {LiveApiService} from "./services/LiveApiService";

let _api: IApiService;

class App extends Component {
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
                            <li>
                                <Link to="/login/">Login</Link>
                            </li>
                        </ul>
                    </nav>

                    <Route path="/" exact component={HomePage}/>
                    <Route path="/login/" component={LoginPage}/>
                </div>
            </Router>
        );
    }
    
    public static getApiInstance() {
        return _api = _api || new LiveApiService();
    }
}

export default App;
