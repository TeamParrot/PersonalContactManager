import json


class MalformedContactError(Exception):
    pass


class Contact:
    def __init__(self, raw, contact_id=None):
        try:
            self.contact_id = contact_id
            self.firstname = raw['firstName']
            self.lastname = raw['lastName']
            self.phonenumber = raw['phoneNumber']
            self.email = raw['email']
        except KeyError:
            raise MalformedContactError

    def to_dict(self):
        raw = {
            'firstName': self.firstname,
            'lastName': self.lastname,
            'phoneNumber': self.phonenumber,
            'email': self.email,
        }
        if self.contact_id is not None:
            raw['id'] = self.contact_id
        return raw
