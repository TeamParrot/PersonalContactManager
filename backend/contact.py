class MalformedContactError(Exception):
    pass


class Contact:
    def __init__(self, raw):
        try:
            self.firstname = raw['firstname']
            self.lastname = raw['lastname']
            self.phonenumer = raw['phonenumber']
            self.email = raw['email']
            self.address = raw['address']
            self.city = raw['city']
            self.state = raw['state']
            self.zip = raw['zip']
        except KeyError:
            raise MalformedContactError
