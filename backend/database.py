class ConflictError(Exception):
    pass


class ContactExistsError(Exception):
    pass


class UnauthorizedError(Exception):
    pass


class Database:
    def login(self, username, password):
        pass

    def logout(self, username):
        pass

    def insert_user(self, username, password):
        pass

    def validate_login(self):
        pass

    def get_contacts(self, username):
        pass

    def insert_contact(self, username, contact):
        pass

    def delete_contact(self, username, contact_id):
        pass

    def update_contact(self, username, contact_id, contact):
        pass
