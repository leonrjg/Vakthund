# <img src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Dog-1800633.svg" width=50> Vakthund

Self-hosted web dashboard for security researchers to manage and track IoT devices obtained from public sources such as Shodan or ZoomEye.

![vk example](https://github.com/leonrjg/Vakthund/assets/5253770/63d45f38-7a39-43b0-8003-2a1e91535bed)

## 🟍 Features:
🟢 Periodically save hosts that match certain criteria on IoT search engines

🟢 Configure and execute actions targeting certain hosts

🟢 Add multiple search engine queries for each device

🟢 Filter hosts by tag, device type or any related value

🟢 Confirm whether a host is online directly on the web interface

🟢 See the full result from the search engine on the web interface

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
By following the previous steps, you will have the web dashboard working; however, the component responsible for grabbing/updating the devices from the search engines must be executed separately:
```sh
cd vakthund-engine
python main.py
```
**Running the scan from the web UI is a planned feature.**
- You can add your search engine API keys (Shodan, ZoomEye, etc) on the **Settings** page of the web dashboard.

---
