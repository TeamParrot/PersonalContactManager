import copy
import os.path
import pickle
import secrets

import mysql.connector as connector


class ConflictError(Exception):
    pass


class ContactExistsError(Exception):
    pass


class UnauthorizedError(Exception):
    pass


class User:
    def __init__(self, username, password, token):
        self.username = username
        self.password = password
        self.token = token
        self.contacts = {}


class Database:
    def __init__(self, cfg):
        if os.path.exists('state.bin'):
            with open('state.bin', 'rb') as f:
                self.users = pickle.load(f)
        else:
            self.users = []

    def close(self):
        with open('state.bin', 'wb') as f:
            print('saving memdb')
            pickle.dump(self.users, f)

    def login(self, username, password):
        """Authenticate the user and return a session token

        Raises:
            UnauthorizedError: The credentials are incorrect.
        """
        for user in self.users:
            if user.username == username and user.password == password:
                user.token = secrets.token_hex()
                return user.token
        raise UnauthorizedError

    def logout(self, username):
        """Removes the user from the session table"""
        for user in self.users:
            if user.username == username:
                user.token = None
                return

    def insert_user(self, username, password):
        """Creates a new user entry and logs them in.

        Returns:
            A login token.

        Raises:
            ConflictError: The username is taken.
        """
        for user in self.users:
            if user.username == username:
                raise ConflictError
        user = User(username, password, secrets.token_hex())
        self.users.append(user)
        return user.token

    def validate_login(self, token):
        """Checks if the given token is in the session table.

        Raises:
            UnauthorizedError: The token isn't logged in.
        """
        if token is None:
            raise UnauthorizedError

        for user in self.users:
            if user.token == token:
                return user.username
        raise UnauthorizedError

    def get_contacts(self, username):
        """Returns a list of Contacts associated with the given username (contact.contact_id set accordingly)."""
        for user in self.users:
            if user.username == username:
                identified_contacts = []
                for ident, contact in user.contacts.items():
                    contact = copy.copy(contact)
                    contact.contact_id = ident
                    identified_contacts.append(contact)
                return identified_contacts
        return []

    def insert_contact(self, username, contact):
        """Creates a new contact and returns the contact_id."""
        for user in self.users:
            if user.username == username:
                key = secrets.token_hex()
                user.contacts[key] = contact
                return key
        raise RuntimeError('User not in table: [{}]'.format(username))

    def delete_contact(self, username, contact_id):
        """Deletes a contact if it exists."""
        for user in self.users:
            if user.username == username:
                if contact_id in user.contacts:
                    del user.contacts[contact_id]
                    return
                break
        raise ContactExistsError

    def update_contact(self, username, contact_id, contact):
        """Replaces the contact corresponding to the contact_id.

        Raises:
            ContactExistsError: No entry with the given contact_id.
        """
        for user in self.users:
            if user.username == username:
                if contact_id not in user.contacts:
                    raise ContactExistsError
                user.contacts[contact_id] = contact
                return
        raise RuntimeError('No username found in table')
