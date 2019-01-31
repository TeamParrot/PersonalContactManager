#!/usr/bin/env bash

(cd frontend && npm install && npm run build)
(cd backend && pip3 install -r requirements.txt && python3 main.py)