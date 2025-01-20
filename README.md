# <img src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Dog-1800633.svg" width=50> Vakthund

Self-hosted web dashboard for security researchers to manage and track IoT devices obtained from public sources such as Shodan or ZoomEye.

![vk example](https://github.com/leonrjg/Vakthund/assets/5253770/63d45f38-7a39-43b0-8003-2a1e91535bed)



## 🟍 Features:
🟢 Periodically save hosts that match certain criteria on the search engines

🟢 Configure and execute actions targeting certain hosts

🟢 Choose what search engine to use for each device

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

If the app is not working, the following commands might help.

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
- Make sure **at least one device exists** before running the engine, even if using [vk-use-mocks](#mock-data).
- You can add your search engine API keys (Shodan, ZoomEye, or both) by navigating to the _Settings_ page of the web dashboard.

### Mock data
If you do not have API keys and wish to try the app with test data, set the `vk_use_mocks` environment variable to any value and run the previous `vakthund-engine` script.
The web dashboard should then be populated with a few test items.

---

### Disclaimer
Do not expose this software on the Internet; some user-submitted input is executed on the shell.
