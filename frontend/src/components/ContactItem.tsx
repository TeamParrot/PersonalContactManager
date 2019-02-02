import React, {Component} from 'react';
import {IApiService} from "../services/IApiService";
import App from "../App";
import {Contact} from "../models/Contact";
import "./ContactItem.scss";
import {ContactDialog, ContactDialogMode} from "./ContactDialog";

type ContactItemProps = {
    contact: Contact;
    onDelete: () => void,
};

type ContactItemState = {
    contact: Contact;
    showContactDialog?: boolean;
};

export class ContactItem extends Component<ContactItemProps, ContactItemState> {
    private api: IApiService = App.getApiInstance();

    constructor(props: ContactItemProps) {
        super(props);

        this.state = {
            contact: props.contact,
        };
    }

    render() {
        return <div>
            <div className="contact">
                <div className="contact__info">
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
                <div className="contact__controls">
                    <button onClick={this.editContact}>Edit</button>
                    <button onClick={this.deleteContact}>Delete</button>
                </div>
            </div>
            <ContactDialog showModal={this.state.showContactDialog}
                           mode={ContactDialogMode.Edit}
                           contact={{...this.state.contact}}
                           onCancel={this.contactDialogCancel}
                           onSubmit={this.contactDialogSubmit}/>
        </div>
    }


    private contactDialogCancel = () => {
        this.setState({
            ...this.state,
            showContactDialog: false,
        });
    };

    private contactDialogSubmit = async (contact: Contact) => {
        const editedContact = await this.api.updateContact(contact);
        this.setState({
            ...this.state,
            contact: editedContact,
            showContactDialog: false,
        });
    };

    private deleteContact = async () => {
        await this.api.deleteContact(this.state.contact.id);
        this.props.onDelete();
    };

    private editContact = () => {
        this.setState({
            ...this.state,
            showContactDialog: true,
        });
    };
}