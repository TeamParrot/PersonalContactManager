import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import './App.css';
import {HomePage} from "./pages/HomePage";
import {LoginPage} from "./pages/LoginPage";

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
}

export default App;
