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
    error?: string;
    contact?: Contact;
    firstnameValid: boolean;
    lastnameValid: boolean;
    phonenumberValid: boolean;
    emailValid: boolean;
    formValid: boolean;

};

export class ContactDialog extends Component<ContactDialogProps, ContactDialogState> {
    constructor(props: ContactDialogProps) {
        super(props);

        //this.resetForm();

        this.state = {
            firstnameValid: false,
            lastnameValid: false,
            phonenumberValid: false,
            emailValid: false,
            formValid: false
        };
        
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
                        // Check for valid First name entry A-Za-z
                        <input type="text" placeholder="First Name" name="firstName"
                               value={this.state.contact.firstName}
                               onChange={this.handleChange} required/>

                        // Check for valid last name entry A-Za-z
                        <input type="text" placeholder="Last Name" name="lastName" value={this.state.contact.lastName}
                               onChange={this.handleChange} required/>

                        // Check for valid phone number 0-9(10)      
                        <input type="tel" placeholder="Phone Number" name="phoneNumber"
                               value={this.state.contact.phoneNumber}
                               onChange={this.handleChange} required/>

                        // Check for valid email A-Za-z0-9@A-Za-z0-9.a-z
                        <input type="email" placeholder="E-Mail" name="email" value={this.state.contact.email}
                               onChange={this.handleChange} required/>

                        <button type="submit" disabled={!this.state.formValid} >Submit</button>
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
        // this.setState({
        //     ...this.state,
        //     contact: this.state.contact,
        // });

        const name = event.target.name;
        const value = event.target.value;

        this.setState( { ...this.state,[name]: value},
            () => {this.validateField(name,value) });
    };

    validateField(fieldName, value) {
        let firstnameValid = this.state.firstnameValid;
        let lastnameValid = this.state.lastnameValid;
        let phonenumberValid = this.state.phonenumberValid;
        let emailValid = this.state.emailValid;

        switch(fieldName) {
            case 'firstname':
                if( value.match(/[a-zA-Z]{3, }/) ) {
                    firstnameValid = true;
                } else {
                    firstnameValid = false;
                }

                break;
            case 'lastname':
                if(value.match(/[a-zA-Z]{3, }/) ) {
                    lastnameValid = true;
                } else {
                    lastnameValid = false;
                }

                break;
            case 'phonenmber':
                
                if( value.match(/[0-9]{10}$/i) ) {
                    phonenumberValid = true;
                } else {
                    phonenumberValid = false;
                }
                
                break;
            case 'email':
                if(value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i) ) {
                    emailValid = true;
                } else {
                    emailValid = false;
                }
                break;
            default:
                break;
        }
        this.setState( {
            firstnameValid: firstnameValid,
            lastnameValid: lastnameValid,
            phonenumberValid: phonenumberValid,
            emailValid: emailValid
        }, this.validateForm);

    }

    validateForm() {
        this.setState({formValid: this.state.firstnameValid 
            && this.state.lastnameValid 
            && this.state.phonenumberValid
            && this.state.emailValid});
    }

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
            firstnameValid: false,
            lastnameValid: false,
            phonenumberValid: false,
            emailValid: false,
            formValid: false
        };

        if (!this.state) this.state = state;
        else this.setState(state);
    }
}

export enum ContactDialogMode {
    Edit,
    Add
}