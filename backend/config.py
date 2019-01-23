import configparser
import secrets
import os.path
import sys


class Config:
    def __init__(self, path='config.ini'):
        parser = configparser.ConfigParser()
        if os.path.exists(path):
            with open(path) as f:
                parser.read_file(f)

            self.secret = parser['server']['secret']
            self.db_host = parser['database']['host']
            self.db_name = parser['database']['name']
            self.db_user = parser['database']['user']
            self.db_passwd = parser['database']['passwd']
        else:
            parser['server'] = {'secret': secrets.token_hex()}
            parser['database'] = {
                'host': 'hostname',
                'name': 'databasename',
                'user': 'username',
                'passwd': 'password'
            }
            with open(path, 'w') as f:
                parser.write(f)
            print('Cookies secret automatically generated!')
            print('Please configure the server! [{}]'.format(path))
            sys.exit(1)
