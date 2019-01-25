import React, {Component} from 'react';
import {IApiService} from "../services/IApiService";
import App from "../App";
import {Contact} from "../models/Contact";

type ContactItemProps = {
    contact: Contact;
};

type ContactItemState = {
    contact: Contact;
};

export class ContactItem extends Component<ContactItemProps, ContactItemState> {
    private api: IApiService = App.getApiInstance();

    constructor(props: ContactItemProps) {
        super(props);

        this.state = {
            contact: props.contact
        };
    }

    render() {
        return <div className="contact">
            <div className="contact__name">
                {this.state.contact.firstName} {this.state.contact.lastName}
            </div>
            <div className="contact__email">
                {this.state.contact.email}
            </div>
            <div className="contact__phone-number">
                {this.state.contact.phoneNumber}
            </div>
        </div>
    }
}