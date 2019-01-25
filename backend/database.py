from collections import namedtuple
import secrets
import mysql.connector as connector


class ConflictError(Exception):
    pass


class ContactExistsError(Exception):
    pass


class UnauthorizedError(Exception):
    pass


User = namedtuple('User', ['username', 'password', 'token', 'contacts'])

class Database:
    def __init__(self, cfg):
        self.users = []

    def close(self):
        pass

    def login(self, username, password):
        """Authenticate the user and return a session token
        
        Raises:
            UnauthorizedError: The credentials are incorrect.
        """
        for user in self.users:
            if user.username == username and user.password:
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
        self.users.append(User(username, password, None, {}))

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
        """Returns a list of Contacts associated with the given username."""
        for user in self.users:
            if user.username == username:
                return user.contacts.values()
        return []

    def insert_contact(self, username, contact):
        """Creates a new contact and returns the contact_id."""
        for user in self.users:
            if user.username == username:
                key = secrets.token_hex()
                user.contacts[key] = contact
                return key

    def delete_contact(self, username, contact_id):
        """Deletes a contact if it exists."""
        for user in self.users:
            if user.username == username:
                if contact_id in user.contacts:
                    del user.contacts[contact_id]
                    return
        raise ContactExistsError

    def update_contact(self, username, contact_id, contact):
        """Equivalent to deleting the old contact and creating a new one.

        Returns:
            A contact_id associated with the new entry.
        
        Raises:
            ContactExistsError: No entry with the given contact_id.
        """
        self.delete_contact(username, contact_id)
        self.insert_contact(username, contact)
