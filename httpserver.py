#!/usr/bin/env python

from argparse import ArgumentParser
from http.server import SimpleHTTPRequestHandler, test

class DevelopmentRequestHandler(SimpleHTTPRequestHandler):

    # overrides
    def end_headers(self):
        self.add_no_cache_headers()
        super(SimpleHTTPRequestHandler, self).end_headers()
    
    def add_no_cache_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('port', action='store', default=8000, type=int, nargs='?', help='Specify alternate port [default: 8000]')
    args = parser.parse_args()
    
    test(HandlerClass=DevelopmentRequestHandler, port=args.port)