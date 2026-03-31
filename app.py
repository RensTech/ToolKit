import os
import tempfile
from flask import Flask, render_template, request, jsonify
from modules.scanner import scan_ports
from modules.crypto import generate_hashes
from modules.password import generate_password, estimate_strength
from modules.webinfo import get_web_info
from modules.subdomain import find_subdomains
from modules.base64_utils import base64_encode, base64_decode
from modules.ipinfo import get_ip_info
from modules.filehash import compute_file_hashes

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB file upload limit

@app.route('/')
def index():
    return render_template('index.html')

# ---------- Network Scanner ----------
@app.route('/scan', methods=['POST'])
def scan():
    data = request.get_json()
    target = data.get('target', '').strip()
    start_port = int(data.get('start_port', 1))
    end_port = int(data.get('end_port', 1024))
    if not target:
        return jsonify({'error': 'Target IP/hostname is required'}), 400
    try:
        open_ports = scan_ports(target, start_port, end_port)
        return jsonify({'open_ports': open_ports})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------- Hash Generator ----------
@app.route('/hash', methods=['POST'])
def hash_text():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'Text is required'}), 400
    try:
        hashes = generate_hashes(text)
        return jsonify(hashes)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------- Password Generator ----------
@app.route('/generate-password', methods=['POST'])
def password():
    data = request.get_json()
    length = data.get('length', 12)
    use_upper = data.get('use_upper', True)
    use_lower = data.get('use_lower', True)
    use_digits = data.get('use_digits', True)
    use_symbols = data.get('use_symbols', True)
    try:
        length = int(length)
        if length < 4:
            return jsonify({'error': 'Length must be at least 4'}), 400
        password = generate_password(length, use_upper, use_lower, use_digits, use_symbols)
        strength = estimate_strength(password)
        return jsonify({'password': password, 'strength': strength})
    except ValueError:
        return jsonify({'error': 'Invalid length value'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------- Web Info ----------
@app.route('/webinfo', methods=['POST'])
def webinfo():
    data = request.get_json()
    url = data.get('url', '').strip()
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    try:
        info = get_web_info(url)
        return jsonify(info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------- Subdomain Finder ----------
@app.route('/subdomains', methods=['POST'])
def subdomains():
    data = request.get_json()
    domain = data.get('domain', '').strip()
    if not domain:
        return jsonify({'error': 'Domain is required'}), 400
    try:
        found = find_subdomains(domain)
        return jsonify({'subdomains': found})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------- Base64 ----------
@app.route('/base64', methods=['POST'])
def base64():
    data = request.get_json()
    text = data.get('text', '')
    mode = data.get('mode', 'encode')  # 'encode' or 'decode'
    if not text:
        return jsonify({'error': 'Text is required'}), 400
    try:
        if mode == 'encode':
            result = base64_encode(text)
        else:
            result = base64_decode(text)
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------- IP Info ----------
@app.route('/ipinfo', methods=['POST'])
def ipinfo():
    data = request.get_json()
    ip = data.get('ip', '').strip()
    if not ip:
        return jsonify({'error': 'IP address is required'}), 400
    try:
        info = get_ip_info(ip)
        return jsonify(info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------- File Hash ----------
@app.route('/filehash', methods=['POST'])
def filehash():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    # Save temporarily
    tmp = tempfile.NamedTemporaryFile(delete=False)
    file.save(tmp.name)
    tmp.close()
    try:
        hashes = compute_file_hashes(tmp.name)
        os.unlink(tmp.name)  # Clean up
        return jsonify(hashes)
    except Exception as e:
        os.unlink(tmp.name)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)