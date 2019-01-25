import json

from bottle import delete, get, post, put, request, response, run

from config import Config
from contact import Contact, MalformedContactError
from database import (ConflictError, ContactExistsError, Database,
                      UnauthorizedError)

cfg = Config()
db = Database(cfg)


def extract_credentials():
    raw = tolerant_request_json()
    username = raw['username']
    password = raw['password']
    return username, password


def tolerant_request_json():
    if request.json is not None:
        return request.json
    return json.load(request.body)


def json_error(s):
    return json.dumps({'error': s})


@post('/api/login')
def login():
    try:
        username, password = extract_credentials()
        token = db.login(username, password)
        response.set_cookie('token', token, secret=cfg.secret)
    except UnauthorizedError:
        response.status = 401
        return json_error('Invalid credentials.')


@post('/api/logout')
def logout():
    try:
        token = request.get_cookie('token', secret=cfg.secret)

        if token is None:
            response.status = 401
            return json_error('Token cookie not set.')

        username = db.validate_login(token)
        db.logout(username)
        response.delete_cookie('token')
    except UnauthorizedError:
        response.status = 401
        return json_error('Invalid credentials.')


@post('/api/register')
def register():
    try:
        username, password = extract_credentials()
        token = db.insert_user(username, password)
        response.set_cookie('token', token, secret=cfg.secret)
    except ConflictError:
        response.status = 409
        return json_error('Username taken.')


@get('/api/contacts')
def get_contacts():
    try:
        token = request.get_cookie('token', secret=cfg.secret)

        if token is None:
            response.status = 401
            return json_error('Token cookie not set.')

        username = db.validate_login(token)
        contacts = db.get_contacts(username)
        return json.dumps(list(map(Contact.to_dict, contacts)))
    except UnauthorizedError:
        response.status = 401
        return json_error('Invalid credentials.')


@post('/api/contacts')
def create_contact():
    try:
        token = request.get_cookie('token', secret=cfg.secret)

        if token is None:
            response.status = 401
            return json_error('Token cookie not set.')

        username = db.validate_login(token)
        contact = Contact(tolerant_request_json()['contact'])
        contact_id = db.insert_contact(username, contact)
        return json.dumps({'id': contact_id})
    except UnauthorizedError:
        response.status = 401
        return json_error('Invalid credentials.')


@delete('/api/contacts/<contact_id>')
def delete_contact(contact_id):
    try:
        token = request.get_cookie('token', secret=cfg.secret)

        if token is None:
            response.status = 401
            return json_error('Token cookie not set.')

        username = db.validate_login(token)
        db.delete_contact(username, contact_id)
    except UnauthorizedError:
        response.status = 401
        return json_error('Invalid credentials.')


@put('/api/contacts/<contact_id>')
def update_contact(contact_id):
    try:
        token = request.get_cookie('token', secret=cfg.secret)

        if token is None:
            response.status = 401
            return json_error('Token cookie not set.')

        username = db.validate_login(token)
        contact = Contact(tolerant_request_json()['contact'])
        db.update_contact(username, contact_id, contact)
    except UnauthorizedError:
        response.status = 401
        return json_error('Invalid credentials.')
    except ContactExistsError:
        response.status = 404
        return json_error('No contact exists with contactid: [{}]'.format(contact_id))


try:
    run(host=cfg.host, port=cfg.port)
finally:
    db.close()
