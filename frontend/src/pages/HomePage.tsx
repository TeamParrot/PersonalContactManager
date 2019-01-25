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
            contacts: [],
        };
    }

    async componentDidMount(): Promise<void> {
        if (this.state.user) {
            const contacts = await this.api.getContacts();
            console.log(contacts);
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
                  <h1>Home (Logged In)</h1>
                  <input type="text" className="search-box" value={this.state.search} placeholder="Search..."
                         onChange={this.searchChanged}/>
                  <div className="contact-list">
                      {
                          this.filterContacts(this.state.contacts)
                              .sort((a,b) => a.firstName.localeCompare(b.firstName))
                              .map(c => <ContactItem key={c.id} contact={c}/>)
                      }
                  </div>
                </div>
            }
            {
                !this.state.user &&
                <div>
                  <h1>Home (Logged Out)</h1>
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