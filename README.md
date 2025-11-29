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

## Supported Search Engines
- Shodan <img src="data:image/webp;base64,UklGRigCAABXRUJQVlA4TBwCAAAvD8ADEKcEKZIkR1JUz+7e6/jT1Loyg4bjRpIUKauP6Xv+O7m80+m4kSRFyoHjO/+NvB/TdCXk2raWNRt3d4cOrBt6og0ayCh9ZJTMXP4R7hAA9SGKERcRSCA4ad7OmxKIECABSPHrh4Ioxo9vNv75Q4RSw2hHKQEiWBaBqhZFUkChrCUuv/78HT9NactSjOVPFYoqBo3/+uNUKMpDDDVBMEFGVIUywfd4UwkIJnDw2F6hmDNlfF0QTaSLJRUH33tkG+tUkp8yZki3kt+ssMMzcOqa12KEkx9ki8RKAuFGex16erpFbN5rYup1QsBoEXQlvtGchTxX61zoE8KbdfOa+dyoXo/ROnRDe6I5uRI8lt2pu8/tIBaEl2O7jj2Y0S5jDw1c6ZbdXoXz7I2rx+ha5/Ix7dMv/+uOO7On33ZxatwveniKFLTH4zHHFLFGz7nsAUGybdPO3t+2Hds2fmzbtm3byYzfzRwi+j8BEK5P9n5t3UL8go2/tNiUyqknyfXOx+dAqoXquIZzADdvBclJGRGSpoppAIt5LpXMmUDSHp0B0JeoJBkKa42FP6cAeuJlJL111e3Du/cA3rP0JNN/95vLSlvmr7DZmu13Z3YeFEcctpiiiWdsf3d0D+01BRSkPK5+BbhYXlhbyjWTpLXkCMKTHINEV3UoWq31SIJtx6K7/nyfRumPjj6IcDbYWF7TNfKI/y9nx8bnXgE=" />
- ZoomEye <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAtUExURQAAAGaZzDOZzDNmzJnMzJmZzGbMzDNmmQAzmWZmmTMzmWZmzGaZmZnM/////0pgi2cAAAABdFJOUwBA5thmAAAAAWJLR0QOb70wTwAAAAd0SU1FB+kCFg4NM/LNiZgAAACcSURBVCjPY2AYSMAoZKSIwlcSYQhSgrJdAoUYwLKMChARZTEGRghLCEIxITQqwCgHBgbxAiATqkcFiNk7qwrgekCUFANDA1w3iKpkYKgG6haAGCIAFqhEGKIA0sIK1MIAdS2QYl9ecQDIcoYIMAMxJ1AfCwMTxBAoxYAwBKpVgMHJCGqxAsQ9iiJXoIqFRBkclRAaQSLKSgEDGkMARewOvFPqfbQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjUtMDItMjJUMTQ6MTM6NTErMDA6MDD5pciUAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI1LTAyLTIyVDE0OjEzOjUxKzAwOjAwiPhwKAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNS0wMi0yMlQxNDoxMzo1MSswMDowMN/tUfcAAAAASUVORK5CYII=" />
- <s>Censys</s> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAY1BMVEX/izz/hjj/ciH/gTL+dST/YA7+gzb/k0X/j0D/ZRP/eSn/fCv+ahf+XAj/fy7/bhz/VwT78ef79/D/mEr6lFf77N760bT62MD6oWn6ikb6q3n75dP6wJv6uI363cf6x6X8//264kn+AAAB5klEQVQ4y2XSibKjIBAFUEDkPRZFGHbc/v8rp0GTmJlbqUqqcuxusBFj+A668wv5gfzpQezKE71EJ2joeRH0Jv+Ap/lug+aWW2D4oKvIWyAp5W0klQMbpMTo2aaBlllSd1Tv/b7l+TkIEi1SUhztvqVUDm/X4dHlBsTZmJWikiqR/I57kQfQ7twUKdEbHxxxZ02/8y0QbRFm42y3B7QIpvrdnOZoBwaBCKFUrVXNPgpNqHb2jPTHbrXmXgMA0cI6HnZFhRTYbtgWHQKtcXgBnrzKlmlBhT52QjZPk8XZJgYCaU3GNSxbVJS0YRKR2boBvkNogwLQY1iXsHIAJBtMpfCF+kK2OjSg1AvAuDobBncB/36BCVqsEQAQ44hgxsneQl5ATamO2VIFQIWgdPFwsZjZ0u+TQ4jN0x4mDSfGZ6K28COqWCW+gZqOuAi7wi89OmOigqejgbfaRKswEpsW5n3J2K0W3kc9bcCyrRhCI4RP7kwLL9XA406505QM2zN0MfaAWPUyaaqmMe+VaSrbkn0AX+ZqD8eGXKI9BOlL1kugaZquLpMLHlrUFSvSl+wDLgGEU0EV121BQFw90LLcYuSqHVn3C/0Cy7sGh3vX+gXkG9ziCWgHMwzRwfIBSn/1+AL/9ejgLw53K7c0Ig+xAAAAAElFTkSuQmCC" /> (Coming soon)
- Fofa.so <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAjVBMVEUOFB8AAAAOERxFnP8G9vYOGCUQITFEmv4XLEgG+flAke83e8sH8/MNQUohRnMI6usNWGBCl/kJ2twpW5YOKTQMz9ElUocMcHcK4eMLlpwLxccH8PAeQWo8iN8bOFwNjZMNn6MwbLENZGsLvL8NMTsMgYgNNkALrLANsLUtZqcrX5sNeoALpasNTFUOqK0fgmTmAAABr0lEQVQ4y63T25qiMAwA4JomoZyhwxlRDoqOOvv+j7eFGRT9Zr3aXgH924YkFZvNRqwGwPptmlwBAOIkYXqgJwDkH09Vmla3fBTwC/DbAu1poKf3B3gFlGvEsLqV5SmtEdPoBdAxxPAW8RRk0g81Fv0zyEPUPQkVZNk2ATZcf8EDgK9RR6A6x5LSai48LRiS1Q4l1jnsGimdpnGkdJUoPfNlATBqPJNqpPOhmHefsXT5kOLAd5B7dS866Wyn/wfKYpnBHgsfliNKLEblyMtP/siVLkW1ly+ATnbK2zje/eQPMukov8D9HZztigLLUQvYmudxDf7YabJ73SHE4wLmgLiRHX3P8xRDX9f9HZiArnCRcWYqDcCfVhyIFvV4B0mKVWLWxV2gVOBaZi8T44kemTx63l4o1+TZMYm0OuYzhhE8apFUGF6JMzc2xA2IWw9bWtUCvjSG5cEcL62MhH/2cDjAutwQafTSCD6kFYhrgVj58NxR4A+1Xc6AKjtsv3tu3ZPAeenPAKI2Ivil7cH02wxgaerXe2HMDP55cf4TkO/BrjEN+wYIwSzeg+dhJv8C3gAcxODP0gUAAAAASUVORK5CYII=" />

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
