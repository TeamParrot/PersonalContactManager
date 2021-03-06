import json
import logging

from bottle import (delete, error, get, install, post, put, redirect, request,
                    response, route, run, static_file)

from config import Config
from contact import Contact, MalformedContactError
from database import (ConflictError, ContactExistsError, Database,
                      UnauthorizedError)

COOKIE_MAX_AGE = 2592000

cfg = Config()
db = Database(cfg)


# https://stackoverflow.com/questions/17262170/
class EnableCors(object):
    name = 'enable_cors'
    api = 2

    def apply(self, fn, context):
        def _enable_cors(*args, **kwargs):
            # set CORS headers
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'DELETE, GET, POST, PUT, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
            response.headers['Access-Control-Allow-Credentials'] = 'true'

            if request.method != 'OPTIONS':
                # actual request; reply with the actual response
                return fn(*args, **kwargs)

        return _enable_cors


install(EnableCors())


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


@get('/')
def serve_root():
    return static_file('index.html', root=cfg.root)


@get('/<path:path>')
def serve_static(path):
    result = static_file(path, root=cfg.root)
    if result.status_code == 404:
        return redirect('/')
    return result


@route('/api/login', method=['OPTIONS', 'POST'])
def login():
    try:
        username, password = extract_credentials()
        logging.info('{} attempting to login...'.format(username))
        token = db.login(username, password)
        response.set_cookie('token', token, path='/', max_age=COOKIE_MAX_AGE)
        logging.info('login success')
    except UnauthorizedError:
        logging.info('login failed. unauthorized')
        response.status = 401
        response.delete_cookie('token')
        return json_error('Invalid credentials.')


@route('/api/logout', method=['OPTIONS', 'POST'])
def logout():
    try:
        token = request.get_cookie('token')
        logging.info('user attempting to log in with token: {}'.format(token))

        if token is None:
            response.status = 401
            return json_error('Token cookie not set.')

        username = db.validate_login(token)
        db.logout(username)
        response.delete_cookie('token')
        logging.info('logged out {}'.format(username))
    except UnauthorizedError:
        logging.info('logout failed')
        response.status = 401
        response.delete_cookie('token')
        return json_error('Invalid credentials.')


@route('/api/register', method=['OPTIONS', 'POST'])
def register():
    try:
        username, password = extract_credentials()
        logging.info('registering a new user: {}'.format(username))
        token = db.insert_user(username, password)
        response.set_cookie('token', token, path='/', max_age=COOKIE_MAX_AGE)
        logging.info('registration successful')
    except ConflictError:
        logging.info('registration failed. username taken')
        response.status = 409
        response.delete_cookie('token')
        return json_error('Username taken.')


@route('/api/contacts', method=['GET', 'OPTIONS'])
def get_contacts():
    try:
        token = request.get_cookie('token')
        logging.info(
            'user attempting to get contacts with token: {}'.format(token))

        if token is None:
            response.status = 401
            return json_error('Token cookie not set.')

        username = db.validate_login(token)
        contacts = db.get_contacts(username)
        logging.info('returning {} contacts for {}'.format(
            len(contacts), username))
        return json.dumps(list(map(Contact.to_dict, contacts)))
    except UnauthorizedError:
        logging.info('unauthorized contacts request')
        response.status = 401
        response.delete_cookie('token')
        return json_error('Invalid credentials.')


@route('/api/contacts', method=['OPTIONS', 'POST'])
def create_contact():
    try:
        token = request.get_cookie('token')
        logging.info(
            'user attempting to create contact with token: {}'.format(token))

        if token is None:
            response.status = 401
            return json_error('Token cookie not set.')

        username = db.validate_login(token)
        contact = Contact(tolerant_request_json())
        contact_id = db.insert_contact(username, contact)
        logging.info('created a new contact {} with an id of {}'.format(
            contact.firstname, contact_id))
        return json.dumps({'id': contact_id})
    except UnauthorizedError:
        logging.info('unauthorized contacts request')
        response.status = 401
        response.delete_cookie('token')
        return json_error('Invalid credentials.')


@route('/api/contacts/<contact_id>', method=['DELETE', 'OPTIONS'])
def delete_contact(contact_id):
    try:
        token = request.get_cookie('token')
        logging.info(
            'user attempting to delete contact with token: {}'.format(token))

        if token is None:
            response.status = 401
            return json_error('Token cookie not set.')

        username = db.validate_login(token)
        db.delete_contact(username, contact_id)
        logging.info('deleted a new contact for {} with an id of {}'.format(
            username, contact_id))
    except UnauthorizedError:
        logging.info('unauthorized contacts request')
        response.status = 401
        response.delete_cookie('token')
        return json_error('Invalid credentials.')


@route('/api/contacts/<contact_id>', method=['OPTIONS', 'PUT'])
def update_contact(contact_id):
    try:
        token = request.get_cookie('token')
        logging.info(
            'user attempting to update contact with token: {}'.format(token))

        if token is None:
            response.status = 401
            return json_error('Token cookie not set.')

        username = db.validate_login(token)
        contact = Contact(tolerant_request_json())
        db.update_contact(username, contact_id, contact)
        logging.info('user {} created a contact for {} with id {}'.format(
            username, contact.firstname, contact_id))
    except UnauthorizedError:
        logging.info('unauthorized contacts request')
        response.status = 401
        response.delete_cookie('token')
        return json_error('Invalid credentials.')
    except ContactExistsError:
        logging.info('contact already exists')
        response.status = 404
        return json_error('No contact exists with contactid: [{}]'.format(contact_id))


try:
    logging.getLogger().setLevel(logging.DEBUG)
    run(host=cfg.host, port=cfg.port)
finally:
    db.close()
