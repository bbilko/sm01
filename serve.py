#!/usr/bin/env python3
"""Minimal HTTP server that doesn't use http.server (avoids getcwd at import)"""
import socket, os, mimetypes
from urllib.parse import unquote

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 3000

MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.otf': 'font/otf',
    '.ttf': 'font/ttf',
}

def get_mime(path):
    ext = os.path.splitext(path)[1].lower()
    return MIME.get(ext, 'application/octet-stream')

def handle(conn):
    try:
        data = conn.recv(4096).decode('utf-8', errors='replace')
        if not data:
            return
        lines = data.split('\r\n')
        req = lines[0].split(' ') if lines else []
        if len(req) < 2:
            return
        path = unquote(req[1].split('?')[0])
        if path == '/':
            path = '/index.html'
        filepath = os.path.join(ROOT, path.lstrip('/'))
        # Safety check
        if not os.path.abspath(filepath).startswith(ROOT):
            conn.send(b'HTTP/1.0 403 Forbidden\r\n\r\n')
            return
        if os.path.isfile(filepath):
            with open(filepath, 'rb') as f:
                body = f.read()
            mime = get_mime(filepath)
            header = f'HTTP/1.0 200 OK\r\nContent-Type: {mime}\r\nContent-Length: {len(body)}\r\nAccess-Control-Allow-Origin: *\r\n\r\n'
            conn.send(header.encode() + body)
        else:
            conn.send(b'HTTP/1.0 404 Not Found\r\nContent-Type: text/html\r\n\r\n<h1>404</h1>')
    except Exception as e:
        try:
            conn.send(b'HTTP/1.0 500 Error\r\n\r\n')
        except:
            pass
    finally:
        conn.close()

srv = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
try:
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(('::', PORT))
except:
    srv.close()
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(('', PORT))

srv.listen(10)
print(f'Serving {ROOT} on port {PORT}')

while True:
    conn, addr = srv.accept()
    handle(conn)
