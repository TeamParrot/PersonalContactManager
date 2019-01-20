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
            self.address = raw['address']
            self.city = raw['city']
            self.state = raw['state']
            self.zip = raw['zip']
        except KeyError:
            raise MalformedContactError
    
    def sererialize(self):
        table = {
            'firstName': self.firstname,
            'lastName': self.lastname,
            'phoneNumber': self.phonenumber,
            'email': self.email,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zip': self.zip
        }
        return json.dumps(table)
