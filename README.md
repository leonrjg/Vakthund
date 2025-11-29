# <img src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Dog-1800633.svg" width=50> Vakthund

Self-hosted web dashboard for security researchers to manage IoT devices from public sources such as Shodan or ZoomEye.

<img width="1185" height="656" alt="image" src="https://github.com/user-attachments/assets/4bf47359-5f4a-44c5-b93b-d2c845e90e46" />


## 🟍 Features:
🟢 Periodically save hosts that match certain criteria on IoT search engines

🟢 Configure and execute actions targeting certain hosts

🟢 Add multiple search engine queries for each device

🟢 Filter hosts by tag, device type or any related value

🟢 Confirm whether a host is online directly on the web interface

🟢 See the full result from the search engine on the web interface

## Screenshots
<img width="1430" height="636" alt="image" src="https://github.com/user-attachments/assets/a79e9062-a51c-4eb6-8243-2bd939b9ab2c" />

<img width="1430" height="578" alt="image" src="https://github.com/user-attachments/assets/a5098b2c-693f-4cf9-9dcb-ab6d98152d31" />

<img width="1430" height="651" alt="image" src="https://github.com/user-attachments/assets/5859095b-9b2e-41e8-ac37-ad8ecd34da9b" />


## Supported Search Engines
- Shodan
- ZoomEye
- <s>Censys</s> (Coming soon)
- Fofa.so

## Setup (Docker)
Requirements: Node.js 18+, Python 3
```sh
git clone https://github.com/leonrjg/Vakthund.git
cd Vakthund
docker compose up
```

Once the setup is done, go to http://localhost:18000 on your browser.
If the app is not working, the following commands might help:

## Troubleshooting

### Tips
- Make sure the "data" directory is writable since the app will attempt to create a SQLite database there if no other DBMS is configured.
- If you wish to use another DBMS, set the following environment variables accordingly: `db_type=[sqlite|mysql|postgres]` `db_host` `db_user` `db_password` `db_name`

## Configuration
By following the previous steps, you will have the web dashboard working. 

You can run scans to grab/update results from the **Logs** page.

You can also run scans manually via CLI:
```sh
cd vakthund-engine
python main.py
```
You can add your search engine API keys (Shodan, ZoomEye, etc) on the **Settings** page of the web dashboard.
