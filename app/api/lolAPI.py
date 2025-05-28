import requests
import time
import json

import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

token = os.getenv("NEXT_PUBLIC_TOKEN")
delay = 1

def fetch_schedule():
    headers = {
        "x-api-key": token
    }
    try:
        response = requests.get("https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=en-US", headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        # uhhhh rip, it got cooked
        return None

def main():
    while True:
        data = fetch_schedule()
        if data:
            print(json.dumps(data, indent=2))
        else:
            print("[]")
        time.sleep(delay)

if __name__ == "__main__":
    main()
