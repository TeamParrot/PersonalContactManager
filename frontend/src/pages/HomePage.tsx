import React, {ChangeEvent, Component} from 'react';
import {IApiService} from "../services/IApiService";
import App from "../App";
import {User} from "../models/User";
import {Contact} from "../models/Contact";
import {ContactItem} from "../components/ContactItem";

type HomeProps = {
    user: User;
};

type HomeState = {
    user: User;
    search: string,
    contacts?: Contact[],
};

export class HomePage extends Component<HomeProps, HomeState> {
    private api: IApiService = App.getApiInstance();

    constructor(props: HomeProps) {
        super(props);

        this.state = {
            user: props.user,
            search: "",
        };
    }

    async componentDidMount(): Promise<void> {
        if (this.state.user) {
            // Load contacts from the API once the component is loaded if the user is logged in.
            const contacts = await this.api.getContacts();
            this.setState({
                ...this.state,
                contacts: contacts,
            });
        }
    }

    render() {
        return <div>
            {
                this.state.user &&
                <div>
                    {
                        !this.state.contacts &&
                        <div>
                          <p>Loading contacts...</p>
                        </div>
                    }
                    {
                        this.state.contacts &&
                        <div>
                          <h2>My Contacts ({this.state.contacts.length})</h2>
                          <input type="text" className="search-box" value={this.state.search} placeholder="Search..."
                                 onChange={this.searchChanged}/>
                          <div className="contact-list">
                              {
                                  this.filterContacts(this.state.contacts)
                                      .sort((a, b) => a.firstName.localeCompare(b.firstName))
                                      .map(c => <ContactItem key={c.id} contact={c}/>)
                              }
                          </div>
                        </div>
                    }
                </div>
            }
            {
                !this.state.user &&
                <div>
                  <h2>Welcome to Parrot Contact Manager</h2>
                  <p>Create an account or login to manage your contacts.</p>
                </div>
            }
        </div>
    }

    private searchChanged = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            ...this.state,
            search: e.target.value,
        });
    };

    private filterContacts(contacts: Contact[]): Contact[] {
        if (!this.state.search.trim()) return contacts;

        return contacts.filter(c => (c.firstName + " " + c.lastName + " "
            + c.email + " " + c.phoneNumber).indexOf(this.state.search) !== -1);
    }
}