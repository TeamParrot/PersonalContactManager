import ReactModal from 'react-modal';
import React, {ChangeEvent, MouseEvent, Component} from 'react';
import {Contact} from "../models/Contact";

type ContactDialogProps = {
    showModal: boolean;
    onCancel: () => void;
    onSubmit: (contact: Contact) => void;
    mode: ContactDialogMode;
    contact?: Contact;
};

type ContactDialogState = {
    error: string;
    contact: Contact;
};

export class ContactDialog extends Component<ContactDialogProps, ContactDialogState> {
    constructor(props: ContactDialogProps) {
        super(props);

        this.resetForm();
    }

    componentDidMount(): void {
        ReactModal.setAppElement('#app');
    }

    render() {
        return (
            <div>
                <ReactModal
                    isOpen={this.props.showModal}
                    className="dialog"
                    contentLabel="Minimal Modal Example"
                >
                    {
                        this.props.mode === ContactDialogMode.Add &&
                        <h2>Add Contact</h2>
                    }
                    {
                        this.props.mode === ContactDialogMode.Edit &&
                        <h2>Edit Contact</h2>
                    }

                    <form onSubmit={this.handleSubmit}>
                        {this.state.error &&
                        <div className="alert alert--error">
                            {this.state.error}
                        </div>
                        }
                        <input type="text" placeholder="First Name" name="firstName"
                               value={this.state.contact.firstName}
                               onChange={this.handleChange} required/>
                        <input type="text" placeholder="Last Name" name="lastName" value={this.state.contact.lastName}
                               onChange={this.handleChange} required/>
                        <input type="tel" placeholder="Phone Number" name="phoneNumber"
                               value={this.state.contact.phoneNumber}
                               onChange={this.handleChange} required/>
                        <input type="email" placeholder="E-Mail" name="email" value={this.state.contact.email}
                               onChange={this.handleChange} required/>
                        <button type="submit">Submit</button>
                        <button onClick={this.handleCancel}>Cancel</button>
                    </form>
                </ReactModal>
            </div>
        );
    }

    private handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Update the state when an input element is changed.
        if (!event.target) return;
        this.state.contact[event.target.name] = event.target.value;
        this.setState({
            ...this.state,
            contact: this.state.contact,
        });
    };

    private handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await this.props.onSubmit(this.state.contact);
        } catch (e) {
            setTimeout(() =>
                this.setState({
                    ...this.state,
                    error: e.message,
                }));
        }
        this.resetForm();
    };

    private handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        this.props.onCancel();
        this.resetForm();
    };

    private resetForm() {
        const state = {
            error: "",
            contact: this.props.contact || new Contact(),
        };

        if (!this.state) this.state = state;
        else this.setState(state);
    }
}

export enum ContactDialogMode {
    Edit,
    Add
}