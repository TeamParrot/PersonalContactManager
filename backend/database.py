
import secrets
import sqlalchemy
import bcrypt



class ConflictError(Exception):
    pass


class ContactExistsError(Exception):
    pass


class UnauthorizedError(Exception):
    pass


class Database:

    def __init__(self, cfg):
        '''@sydney will work on putting the variables for the config in but for now it works'''
        self.engine = create_engine('mysql://root:cop4331@35.237.160.233/small_project')
        self.conn = self.engine.connect()
        self.meta = sqlalchemy.MetaData(self.engine, reflect=True)


    def close(self):
        self.conn.close()

    def login(self, username, password):
        """Authenticate the user and return a session token

        Raises:
            UnauthorizedError: The credentials are incorrect.
        """
        users = self.meta.tables['Users']
        login = self.meta.tables['Login']
        selectUser = sqlalchemy.select([users]).where(users.c.username == username)
        checkUser = self.conn.execute(selectUser).first()
        checkPassword = checkUser['password']
        insertID = checkUser['ID']
        if bcrypt.checkpw(password.encode('utf-8'), checkPassword.encode('utf-8')):
            tokenVal = secrets.token_hex(8)
            insertToken = login.insert().values(userID=insertID, token=tokenVal)
            self.conn.execute(insertToken)
            return insertToken
        else:
            raise UnauthorizedError

    def logout(self, username):
        """Removes the user from the session table"""
        users = self.meta.tables['Users']
        login = self.meta.tables['Login']
        selectUser = sqlalchemy.select([users]).where(users.c.username == username)
        user = self.conn.execute(selectUser).first()
        userID = user['ID']
        deleteUser = login.delete().where(login.c.userID == userID)
        self.conn.execute(deleteUser)

    '''registers user and returns login token'''
    def insert_user(self, username, password):
        users = self.meta.tables['Users']
        checkUsername = sqlalchemy.select([users]).where(users.c.username == username)
        result = self.conn.execute(checkUsername).first()
        if result is not None:
            raise ConflictError
        else:
            hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12))
            insertUser = users.insert().values(username=username, password=hashed_pw)
            self.conn.execute(insertUser)
            getID = self.conn.execute(sqlalchemy.select([users]).where(users.c.username == username)).first()
            insertID = getID['ID']
            login = self.meta.tables['Login']
            tokenVal = secrets.token_hex(8)
            insertToken = login.insert().values(userID=insertID, token=tokenVal)
            self.conn.execute(insertToken)
            return tokenVal


    def validate_login(self, token):

        """Checks if the given token is in the session table.

        Raises:
            UnauthorizedError: The token isn't logged in.
        """
        login = self.meta.tables['Login']
        users = self.meta.tables['Users']
        checkToken = sqlalchemy.select([login]).where(login.c.token == token)
        result = self.conn.execute(checkToken).first()
        if result is not None:
            userID = result['userID']
            getUsername = sqlalchemy.select([users]).where(users.c.ID == userID)
            user = self.conn.execute(getUsername).first()
            return user['username']
        else:
            raise UnauthorizedError


    def get_contacts(self, username):
        users = self.meta.tables['Users']
        contacts = self.meta.tables['Contacts']
        selectUser = sqlalchemy.select([users]).where(users.c.username == username)
        user = self.conn.execute(selectUser).first()
        userID = user['ID']
        selectContacts = sqlalchemy.select(['Contacts']).where(contacts.c.userID == userID)
        contacts = self.conn.execute(selectContacts)
        for contact in contacts:
            '''TODO:'''
            '''@Brad fill in with creating contacts'''


    def insert_contact(self, username, contact):
        """Creates a new contact and returns the contact_id."""
        users = self.meta.tables['Users']
        contacts = self.meta.tables['Contacts']
        getUser = sqlalchemy.select([users]).where(users.c.username == username)
        user = self.conn.execute(getUser).first()
        userID = user['ID']
        insertContact = contacts.insert().values(firstName=contact.firstname,
                                                 lastName=contact.lastname,
                                                 phoneNumber=contact.phonenumber,
                                                 email=contact.email,
                                                 userID=userID)
        self.conn.execute(insertContact)
        '''this is not the best way to do this but it works for now'''
        selectContactID = sqlalchemy.select([contacts]).where(contacts.c.email == contact.email)
        getContactID = self.conn.execute(selectContactID).first()
        contactID = getContactID['ID']
        return contactID



    def delete_contact(self, username, contact_id):
        """Deletes a contact if it exists."""
        contacts = self.meta.tables['Contacts']
        users = self.meta.tables['Users']
        getUserID = sqlalchemy.select([users]).where(users.c.username == username)
        user = self.conn.execute(getUserID).first()
        userID = user['ID']
        checkUser = sqlalchemy.select([contacts]).where(sqlalchemy.and_(contacts.c.userID == userID,
                                                                        contacts.c.userID == userID))
        resultCheck = self.conn.execute(checkUser)
        if resultCheck is not None:
            deleteContact = contacts.delete().where(contacts.c.ID == contact_id)
            self.conn.execute(deleteContact)

    def update_contact(self, username, contact_id, contact):
        """Replaces the contact corresponding to the contact_id.

        Raises:
            ContactExistsError: No entry with the given contact_id.
        """
        contacts = self.meta.tables['Contacts']
        users = self.meta.tables['Users']
        getUserID = sqlalchemy.select([users]).where(users.c.username == username)
        user = self.conn.execute(getUserID).first()
        userID = user['ID']
        checkUser = sqlalchemy.select([contacts]).where(sqlalchemy.and_(contacts.c.userID == userID,
                                                                        contacts.c.ID == contact_id))
        resultCheck = self.conn.execute(checkUser)
        if resultCheck is not None:
            checkContact = sqlalchemy.select([contacts]).where(contacts.c.ID == contact_id)
            resContactCheck = self.conn.execute(checkContact)
            if resContactCheck is not None:
                updateContact = contacts.update().where(contacts.c.ID == contact_id).\
                    values(firstName=contact.firstname,
                                                 lastName=contact.lastname,
                                                 phoneNumber=contact.phonenumber,
                                                 email=contact.email,
                                                 userID=userID)
                self.conn.execute(updateContact)
