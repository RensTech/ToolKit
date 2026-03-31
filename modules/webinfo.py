import requests
import time
import ssl
import socket
from requests.exceptions import RequestException

def get_web_info(url):
    # Add scheme if missing
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    try:
        start_time = time.time()
        response = requests.get(url, timeout=5, allow_redirects=True)
        elapsed = round((time.time() - start_time) * 1000, 2)  # ms
        headers = dict(response.headers)
        # Get SSL info if HTTPS
        ssl_info = {}
        if url.startswith('https://'):
            hostname = url.split('/')[2]
            try:
                ctx = ssl.create_default_context()
                with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
                    s.connect((hostname, 443))
                    cert = s.getpeercert()
                    ssl_info = {
                        'issuer': dict(x[0] for x in cert.get('issuer', [])),
                        'subject': dict(x[0] for x in cert.get('subject', [])),
                        'expiry': cert.get('notAfter')
                    }
            except Exception:
                ssl_info = {'error': 'Could not retrieve SSL info'}
        return {
            'status_code': response.status_code,
            'headers': {k: v for k, v in headers.items() if k.lower() in ['server', 'content-type', 'x-powered-by', 'set-cookie']},
            'response_time_ms': elapsed,
            'final_url': response.url,
            'ssl_info': ssl_info
        }
    except RequestException as e:
        raise Exception(f"Request failed: {str(e)}")