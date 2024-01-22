# Vakthund

Self-hosted web dashboard for security researchers to manage and track IoT devices obtained from public sources such as Shodan or ZoomEye.

```sh
./vakthund
```

### Features:
- Periodically save devices that match certain criteria on the search engines
- Configure and execute actions targeting certain devices
- Choose what search engine to use for each device
- Confirm whether a host is online directly on the web interface

**Warning:** do not expose this software on the Internet; some user-submitted input is executed on the shell.