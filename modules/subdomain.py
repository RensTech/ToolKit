import socket

COMMON_SUBDOMAINS = [
    'www', 'mail', 'ftp', 'blog', 'webmail', 'admin', 'test', 'dev',
    'api', 'secure', 'vpn', 'portal', 'cpanel', 'whm', 'm', 'mobile',
    'shop', 'store', 'support', 'forum', 'docs', 'news', 'media', 'static'
]

def find_subdomains(domain):
    found = []
    for sub in COMMON_SUBDOMAINS:
        full = f"{sub}.{domain}"
        try:
            socket.gethostbyname(full)
            found.append(full)
        except socket.error:
            pass
    return found