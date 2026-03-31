import requests

def get_ip_info(ip):
    # Using free ip-api.com (no API key required)
    try:
        response = requests.get(f'http://ip-api.com/json/{ip}?fields=status,message,country,regionName,city,isp,org,query')
        data = response.json()
        if data.get('status') == 'success':
            return {
                'ip': data['query'],
                'country': data.get('country', 'N/A'),
                'region': data.get('regionName', 'N/A'),
                'city': data.get('city', 'N/A'),
                'isp': data.get('isp', 'N/A'),
                'org': data.get('org', 'N/A')
            }
        else:
            return {'error': data.get('message', 'Unknown error')}
    except Exception as e:
        raise Exception(f"Failed to fetch IP info: {str(e)}")