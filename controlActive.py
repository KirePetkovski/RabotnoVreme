import time
import requests

URL = "http://192.168.100.31/rabotnovremePHP/kontrolerAktiven.php"

kontroler_ip = "192.168.1.100"

def ping_backend():
    data = {
        "IPAddress": kontroler_ip
    }

    try:
        response = requests.post(URL, json=data)
        print("Server Response:", response.json())
    except Exception as e:
        print("Error:", e)

# Ping every 60 seconds
while True:
    ping_backend()
    time.sleep(15)
