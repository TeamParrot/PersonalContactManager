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
