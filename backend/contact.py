import json


class MalformedContactError(Exception):
    pass


class Contact:
    def __init__(self, raw):
        try:
            self.firstname = raw['firstName']
            self.lastname = raw['lastName']
            self.phonenumber = raw['phoneNumber']
            self.email = raw['email']
        except KeyError:
            raise MalformedContactError

    def to_dict(self):
        return {
            'firstName': self.firstname,
            'lastName': self.lastname,
            'phoneNumber': self.phonenumber,
            'email': self.email,
        }
