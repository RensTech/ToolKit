import hashlib

def compute_file_hashes(filepath):
    md5 = hashlib.md5()
    sha256 = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            md5.update(chunk)
            sha256.update(chunk)
    return {
        'md5': md5.hexdigest(),
        'sha256': sha256.hexdigest()
    }