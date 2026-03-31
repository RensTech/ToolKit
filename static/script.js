document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Switching ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // --- Helper: post JSON request, handle loading & errors ---
    async function postRequest(url, data, outputElem, copyBtn, processResult = null) {
        outputElem.textContent = 'Processing...';
        outputElem.classList.add('loading');
        copyBtn.style.display = 'none';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Request failed');
            }
            let formatted = '';
            if (processResult) {
                formatted = processResult(result);
            } else {
                formatted = JSON.stringify(result, null, 2);
            }
            outputElem.textContent = formatted;
            copyBtn.style.display = 'inline-block';
        } catch (err) {
            outputElem.textContent = `Error: ${err.message}`;
            copyBtn.style.display = 'none';
        } finally {
            outputElem.classList.remove('loading');
        }
    }

    // --- Network Scanner ---
    const scanBtn = document.getElementById('scan-btn');
    const scanTarget = document.getElementById('scan-target');
    const scanStart = document.getElementById('scan-start');
    const scanEnd = document.getElementById('scan-end');
    const scanOutput = document.getElementById('scan-output');
    const scanCopy = document.querySelector('#scan-output + .copy-btn');
    scanBtn.addEventListener('click', () => {
        const target = scanTarget.value.trim();
        const start = parseInt(scanStart.value, 10);
        const end = parseInt(scanEnd.value, 10);
        if (!target) {
            scanOutput.textContent = 'Please enter a target IP/hostname.';
            return;
        }
        if (isNaN(start) || isNaN(end) || start < 1 || end > 65535 || start > end) {
            scanOutput.textContent = 'Invalid port range.';
            return;
        }
        postRequest('/scan', { target, start_port: start, end_port: end }, scanOutput, scanCopy,
            (res) => `Open ports:\n${res.open_ports.join(', ') || 'None found'}`);
    });

    // --- Hash Generator ---
    const hashBtn = document.getElementById('hash-btn');
    const hashText = document.getElementById('hash-text');
    const hashOutput = document.getElementById('hash-output');
    const hashCopy = document.querySelector('#hash-output + .copy-btn');
    hashBtn.addEventListener('click', () => {
        const text = hashText.value;
        if (!text) {
            hashOutput.textContent = 'Please enter text to hash.';
            return;
        }
        postRequest('/hash', { text }, hashOutput, hashCopy,
            (res) => `MD5: ${res.md5}\nSHA1: ${res.sha1}\nSHA256: ${res.sha256}\nSHA512: ${res.sha512}`);
    });

    // --- Password Generator ---
    const passBtn = document.getElementById('pass-btn');
    const passLength = document.getElementById('pass-length');
    const passUpper = document.getElementById('pass-upper');
    const passLower = document.getElementById('pass-lower');
    const passDigits = document.getElementById('pass-digits');
    const passSymbols = document.getElementById('pass-symbols');
    const passOutput = document.getElementById('pass-output');
    const passStrength = document.getElementById('pass-strength');
    const passCopy = document.querySelector('#pass-output + .copy-btn');
    passBtn.addEventListener('click', () => {
        const length = parseInt(passLength.value, 10);
        if (isNaN(length) || length < 4) {
            passOutput.textContent = 'Length must be at least 4.';
            return;
        }
        const data = {
            length,
            use_upper: passUpper.checked,
            use_lower: passLower.checked,
            use_digits: passDigits.checked,
            use_symbols: passSymbols.checked
        };
        postRequest('/generate-password', data, passOutput, passCopy,
            (res) => {
                passStrength.textContent = `Strength: ${res.strength}`;
                return res.password;
            });
    });

    // --- Web Info ---
    const webBtn = document.getElementById('web-btn');
    const webUrl = document.getElementById('web-url');
    const webOutput = document.getElementById('web-output');
    const webCopy = document.querySelector('#web-output + .copy-btn');
    webBtn.addEventListener('click', () => {
        const url = webUrl.value.trim();
        if (!url) {
            webOutput.textContent = 'Please enter a URL.';
            return;
        }
        postRequest('/webinfo', { url }, webOutput, webCopy,
            (res) => `Status: ${res.status_code}\nResponse time: ${res.response_time_ms} ms\nFinal URL: ${res.final_url}\nHeaders:\n${JSON.stringify(res.headers, null, 2)}\nSSL Info:\n${JSON.stringify(res.ssl_info, null, 2)}`);
    });

    // --- Subdomain Finder ---
    const subBtn = document.getElementById('sub-btn');
    const subDomain = document.getElementById('sub-domain');
    const subOutput = document.getElementById('sub-output');
    const subCopy = document.querySelector('#sub-output + .copy-btn');
    subBtn.addEventListener('click', () => {
        const domain = subDomain.value.trim();
        if (!domain) {
            subOutput.textContent = 'Please enter a domain.';
            return;
        }
        postRequest('/subdomains', { domain }, subOutput, subCopy,
            (res) => `Found subdomains:\n${res.subdomains.join('\n') || 'None found'}`);
    });

    // --- Base64 ---
    const base64Btn = document.getElementById('base64-btn');
    const base64Text = document.getElementById('base64-text');
    const base64Mode = document.querySelectorAll('input[name="base64-mode"]');
    const base64Output = document.getElementById('base64-output');
    const base64Copy = document.querySelector('#base64-output + .copy-btn');
    base64Btn.addEventListener('click', () => {
        const text = base64Text.value;
        if (!text) {
            base64Output.textContent = 'Please enter text.';
            return;
        }
        let mode = 'encode';
        for (let r of base64Mode) if (r.checked) mode = r.value;
        postRequest('/base64', { text, mode }, base64Output, base64Copy,
            (res) => res.result);
    });

    // --- IP Info ---
    const ipBtn = document.getElementById('ip-btn');
    const ipAddress = document.getElementById('ip-address');
    const ipOutput = document.getElementById('ip-output');
    const ipCopy = document.querySelector('#ip-output + .copy-btn');
    ipBtn.addEventListener('click', () => {
        const ip = ipAddress.value.trim();
        if (!ip) {
            ipOutput.textContent = 'Please enter an IP address.';
            return;
        }
        postRequest('/ipinfo', { ip }, ipOutput, ipCopy,
            (res) => `IP: ${res.ip}\nCountry: ${res.country}\nRegion: ${res.region}\nCity: ${res.city}\nISP: ${res.isp}\nOrganization: ${res.org}`);
    });

    // --- File Hash ---
    const fileBtn = document.getElementById('filehash-btn');
    const fileInput = document.getElementById('file-input');
    const fileOutput = document.getElementById('filehash-output');
    const fileCopy = document.querySelector('#filehash-output + .copy-btn');
    fileBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            fileOutput.textContent = 'Please select a file.';
            return;
        }
        fileOutput.textContent = 'Uploading and processing...';
        fileOutput.classList.add('loading');
        fileCopy.style.display = 'none';
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('/filehash', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }
            fileOutput.textContent = `MD5: ${result.md5}\nSHA256: ${result.sha256}`;
            fileCopy.style.display = 'inline-block';
        } catch (err) {
            fileOutput.textContent = `Error: ${err.message}`;
            fileCopy.style.display = 'none';
        } finally {
            fileOutput.classList.remove('loading');
        }
    });

    // --- Copy to clipboard (generic) ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const outputElem = document.getElementById(targetId);
            if (outputElem && outputElem.textContent) {
                navigator.clipboard.writeText(outputElem.textContent)
                    .then(() => {
                        const original = btn.textContent;
                        btn.textContent = 'Copied!';
                        setTimeout(() => { btn.textContent = original; }, 2000);
                    })
                    .catch(err => console.error('Copy failed:', err));
            }
        });
    });
});