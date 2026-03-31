# Security Toolkit Web App

A professional, ethical cybersecurity utility dashboard. Built with **Flask** (Python) and vanilla JavaScript, it offers a clean, modern interface for common security tasks without gimmicky animations.

![Screenshot placeholder](https://via.placeholder.com/800x400?text=Hacker+Toolkit+UI)

## Features

- **Network Scanner** – Threaded port scan over a user‑defined range (1–65535).
- **Hash Generator** – MD5, SHA1, SHA256, SHA512 of any text.
- **Password Generator** – Customizable length, character sets, and strength estimation.
- **Web Info** – HTTP status, headers, response time, and SSL certificate details.
- **Subdomain Finder** – Enumerates common subdomains via DNS resolution.
- **Base64 Encoder/Decoder** – Quick encode/decode for any string.
- **IP Geolocation** – Look up country, region, city, ISP using a free API.
- **File Hash** – Compute MD5 and SHA256 checksums of uploaded files.
- **Copy to Clipboard** – One‑click copying of all results.
- **Clean, Dark UI** – Tabbed layout, monospace font, subtle hover effects.

## Tech Stack

- **Backend**: Python 3, Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Libraries**: `requests`, `socket`, `hashlib`, `ssl`, `concurrent.futures`

## Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hacker-toolkit.git
   cd hacker-toolkit
