# <img src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Dog-1800633.svg" width=50> Vakthund

Self-hosted web dashboard for security researchers to manage and track IoT devices obtained from public sources such as Shodan or ZoomEye.

## 🟍 Features:
🟢 Periodically save devices that match certain criteria on the search engines

🟢 Configure and execute actions targeting certain devices

🟢 Choose what search engine to use for each device

🟢 Confirm whether a host is online directly on the web interface

## Setup
```sh
git clone https://github.com/leonrjg/Vakthund.git
cd Vakthund

# Install Python requirements
python -m pip install -r vakthund-engine/requirements.txt

# Build and start the server
npm install
npm run build
npm run start-server

# Build and start the client
cd vakthund-web
npm install
npm run build
npm run start-client
```

Once the setup is done, go to http://localhost:18000 on your browser.

If the app is not working, the following commands might help.

## Troubleshooting
```sh
pm2 kill # This will kill any zombie processes that might prevent us from trying to start the server again
npm run start-server-sync # This will start the server in blocking mode to allow viewing error logs
...
cd vakthund-web
npm run start-client-sync
```

### Tips
- Make sure the app's source directory is writable since the app will attempt to create a SQLite database there if no other DBMS is configured.
- If you wish to use another DBMS, set the following environment variables accordingly: `db_type` `db_host` `db_user` `db_password` `db_name`

## Configuration
By following the previous steps, you will have the web dashboard working; however, the component responsible for grabbing/updating the devices from the search engines must be executed separately:
```sh
cd vakthund-engine
python main.py
```
- It is recommended to **schedule a cron job** that runs this script at your desired frequency.

- Please remember to add your search engine API keys (Shodan, ZoomEye, or both) by navigating to the _Settings_ page of the web dashboard.

### Mocks
If you do not have API keys and wish to try the app with test data, set the `vk_use_mocks` environment variable to any value and run the previous `vakthund-engine` script.
The web dashboard should then be populated with a few test items.

---

### Disclaimer

**Warning:** do not expose this software on the Internet; some user-submitted input is executed on the shell.
