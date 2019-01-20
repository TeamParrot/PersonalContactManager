import React, {Component} from 'react';
import {IApiService} from "../services/IApiService";
import App from "../App";

export class HomePage extends Component {
    private api: IApiService = App.getApiInstance();
    
    render() {
        return <h1>Home Page</h1>
    }
}