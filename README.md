# <img src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Dog-1800633.svg" width=50> Vakthund

Self-hosted web dashboard for security researchers to manage IoT devices from public sources such as Shodan or ZoomEye.

![image](https://github.com/user-attachments/assets/cca71b4c-8ae5-4156-bdd1-6c91683c6ddd)


## 🟍 Features:
🟢 Periodically save hosts that match certain criteria on IoT search engines

🟢 Configure and execute actions targeting certain hosts

🟢 Add multiple search engine queries for each device

🟢 Filter hosts by tag, device type or any related value

🟢 Confirm whether a host is online directly on the web interface

🟢 See the full result from the search engine on the web interface

## Screenshots
![image](https://github.com/user-attachments/assets/b1dad4e9-24f7-4f1c-8afc-715b1efc03b6)


![image](https://github.com/user-attachments/assets/2dfa2c34-978a-416e-aa91-9c72964f4366)


![image](https://github.com/user-attachments/assets/f069e83a-4539-46f9-a7f9-6f2533acf295)


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
You can add your search engine API keys (Shodan, ZoomEye, etc) on the **Settings** page of the web dashboard.

---
