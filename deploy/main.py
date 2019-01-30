import configparser
import subprocess

from bottle import post, request, run

ROOT_PATH = '/home/bpglaser/PersonalContactManager/'
FRONTEND_PATH = '/home/bpglaser/PersonalContactManager/frontend/'
BACKEND_PATH = '/home/bpglaser/PersonalContactManager/backend/'


server_proc = None


def update_instance():
    if server_proc is not None:
        server_proc.terminate()
        try:
            server_proc.wait(timeout=30)
        except subprocess.TimeoutExpired:
            server_proc.kill()

    print('PULLING')
    subprocess.run(['git', 'pull'], check=True, cwd=ROOT_PATH, text=True)
    print('BUILDING')
    subprocess.run(['npm', 'run', 'build'], check=True,
                   cwd=FRONTEND_PATH, text=True)
    print('RUNNING')
    server_proc = subprocess.Popen(['python3', 'main.py'], cwd=BACKEND_PATH)


@post('/')
def handle_webhook():
    if request.json is not None and request.json['ref'] == 'refs/heads/prod':
        update_instance()


cfg = configparser.ConfigParser()
with open('config.ini') as f:
    cfg.read_file(f)
run(host=cfg['server']['host'], port=cfg['server']['port'])
