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

## Setup
Requirements: Node.js 18+, Python 3
```sh
git clone https://github.com/leonrjg/Vakthund.git
cd Vakthund

# Install Python requirements
# If this fails, see the troubleshooting section below
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
# Python package issues
    # If you're getting the "This environment is externally managed" error and you're running this on a container or otherwise don't mind cluttering your Python installation, you can ignore it and append "--break-system-packages"
    python -m pip install -r vakthund-engine/requirements.txt --break-system-packages
    
    # If you're not running this on a container, use VirtualEnv
    python -m venv .venv
    source .venv/bin/activate
    python -m pip install -r vakthund-engine/requirements.txt

# General debug
    pm2 kill # This will kill any zombie processes that might prevent us from trying to start the server again
    npm run start-server-sync # This will start the server in blocking mode to allow viewing error logs
    ...
    cd vakthund-web
    npm run start-client-sync
    
# Example setup on a Debian container
    apt update && apt install build-essential git python3 python3-pip python-is-python3 npm --no-install-recommends -y && git clone https://github.com/leonrjg/Vakthund.git && cd Vakthund && python -m pip install --break-system-packages -r vakthund-engine/requirements.txt && npm install && npm run build && npm run start-server && cd vakthund-web && npm install && npm run build && npm run start-client
```

### Tips
- Make sure the app's source directory is writable since the app will attempt to create a SQLite database there if no other DBMS is configured.
- If you wish to use another DBMS, set the following environment variables accordingly: `db_type=[sqlite|mysql|postgres]` `db_host` `db_user` `db_password` `db_name`
- If using a container, expose ports 18000 (web UI) and 18001 (web API).

## Configuration
By following the previous steps, you will have the web dashboard working; however, the component responsible for grabbing/updating the devices from the search engines must be executed separately:
```sh
cd vakthund-engine
python main.py
```
- Make sure **at least one device exists** before running the engine, even if using [vk-use-mocks](#mock-data).
- It is recommended to **schedule a cron job** that runs this script at your desired frequency.
- You can add your search engine API keys (Shodan, ZoomEye, or both) by navigating to the _Settings_ page of the web dashboard.

### Mock data
If you do not have API keys and wish to try the app with test data, set the `vk_use_mocks` environment variable to any value and run the previous `vakthund-engine` script.
The web dashboard should then be populated with a few test items.

---

### Disclaimer

**Warning:** do not expose this software on the Internet; some user-submitted input is executed on the shell.
