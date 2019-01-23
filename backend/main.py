import json

from bottle import delete, get, post, put, request, response, run

from config import Config
from contact import Contact, MalformedContactError
from database import (ConflictError, ContactExistsError, Database,
                      UnauthorizedError)

cfg = Config()
db = Database(cfg)


def extract_credentials():
    username = request.json['username']
    password = request.json['password']
    return username, password


@post('/api/login')
def login():
    try:
        username, password = extract_credentials()
        db.login(username, password)
        response.set_cookie('username', username, secret=cfg.secret)
    except UnauthorizedError:
        response.status = 401


@post('/api/logout')
def logout():
    try:
        username = db.validate_login()
        db.logout(username)
        response.delete_cookie('username')
    except UnauthorizedError:
        response.status = 401


@post('/api/register')
def register():
    try:
        username, password = extract_credentials()
        db.insert_user(username, password)
        response.set_cookie('username', username, secret=cfg.secret)
    except ConflictError:
        response.status = 409


@get('/api/contacts')
def get_contacts():
    try:
        username = db.validate_login()
        return json.dumps(db.get_contacts(username))
    except UnauthorizedError:
        response.status = 401


@post('/api/contacts')
def create_contact():
    try:
        username = db.validate_login()
        contact = Contact(request.json)
        contact_id = db.insert_contact(username, contact)
        return json.dumps({'id': contact_id})
    except UnauthorizedError:
        response.status = 401


@delete('/api/contacts/<contact_id>')
def delete_contact(contact_id):
    try:
        username = db.validate_login()
        db.delete_contact(username, contact_id)
    except UnauthorizedError:
        response.status = 401


@put('/api/contacts/<contact_id>')
def update_contact(contact_id):
    try:
        username = db.validate_login()

        contact_id = request.json['id']
        raw = request.json.copy()
        del raw['id']
        contact = Contact(raw)

        db.update_contact(username, contact_id, contact)
    except UnauthorizedError:
        response.status = 401
    except ContactExistsError:
        response.status = 404


try:
    run()
finally:
    db.close()
