import mysql.connector as connector


class ConflictError(Exception):
    pass


class ContactExistsError(Exception):
    pass


class UnauthorizedError(Exception):
    pass


class Database:
    def __init__(self, cfg):
        self.conn = connector.connect(
            host=cfg.db_host, database=cfg.db_name,
            user=cfg.db_user, password=cfg.db_passwd)

    def close(self):
        self.conn.close()

    def login(self, username, password):
        """Authenticate the user and return a session token

        Raises:
            UnauthorizedError: The credentials are incorrect.
        """
        pass

    def logout(self, username):
        """Removes the user from the session table"""
        pass

    def insert_user(self, username, password):
        """Creates a new user entry and logs them in.

        Returns:
            A login token.

        Raises:
            ConflictError: The username is taken.
        """
        pass

    def validate_login(self, token):
        """Checks if the given token is in the session table.

        Raises:
            UnauthorizedError: The token isn't logged in.
        """
        pass

    def get_contacts(self, username):
        """Returns a list of Contacts associated with the given username (contact.id set accordingly)."""
        pass

    def insert_contact(self, username, contact):
        """Creates a new contact and returns the contact_id."""
        pass

    def delete_contact(self, username, contact_id):
        """Deletes a contact if it exists."""
        pass

    def update_contact(self, username, contact_id, contact):
        """Replaces the contact corresponding to the contact_id.

        Raises:
            ContactExistsError: No entry with the given contact_id.
        """
        pass
