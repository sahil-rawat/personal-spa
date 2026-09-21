---
title: Network Hacking:Part IV 
date: 2021-08-12 19:39:50 +0530
categories: [Penetration Testing,Networking]
tags: [networking]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN5.jpg?raw=true)

This is the last post in our Network Hacking series, Here we would be learning about attacks on the router, changing the settings of the router, etc.

## Wireless Router Attacks

We can directly attack routers and do pretty much everything like excluding people from firewalls, changing DNS settings, setting up Proxy, etc, by using an already known vulnerability that might be there on the router.

Some routers allow you to pull the credentials w/o even connecting to them. Home routers are more prone to this vulnerability as they are generally not updated, people rarely upgrade the firmware.

First Scan the router via Nmap and try to go to the router's web page, Each router has a web page that could be reached by entering its IP address in the browser, This web page is meant to manage the settings of the router, this settings page is password protected, but the password is rarely changed and is set to default i.e ```admin: admin``` or ```admin: password``` etc, you could try out few of the default passwords. Find the make and model of the router, Search on the web for any vulnerability in the router.

### Pre Authentication Attack

If you aren't connected to the network, then you need to have the external IP address of the router because the private IP is useless and can't be accessed until we are a part of that private network. however, it is not easy to get an external IP address without authenticating or getting connected with the router.

There have been cases where attackers ran a Nmap script to scan all the external IP ranges within an area, or country and using NSE(Nmap Scripting Engine) exploited the vulnerable router, pulled the credentials. Then searching for the one the attacker needs using the ```ESSID```

**Note- This method works only if the router is configured to be accessed from the internet using external IP addresses**

### Post Authentication Attacks

If you are already a part of the network then attacking the router is quite easy, as we know the private IP address of the router and that address can also be accessible.

For changing any settings associated with the router simply go to the IP address in the browser a web page will open asking for the username and password, so mostly this is set to default creds, like ```admin: admin```,```admin: password``` or ```admin:123456```, Try to use default credentials to gain access to the settings portal. Once logged in, you can change DNS settings, MAC filtering, Passwords, etc.

**DNS Spoofing**

DNS spoofing is one of the most interesting attack vectors, So when a user opens a browser and goes to a site then the address of the site is mapped to the IP address of the server via a DNS server and, then the browser uses this IP address to connect to the website, For example, if I open [www.facebook.com](http://www.facebook.com/) in the browser, The browser will first query DNS server for an IP address of that website, the DNS server replies with the IP address and, then browser uses this IP address to get to the Facebook server.

An Attacker can spoof this and provide the IP address of any malicious website or attacker's machine, instead of the real IP address to the victim, where the attacker is running an exact clone on his server and once the user gets to the attacker's server, and logs in with the credentials, the attacker gets those credentials.

To perform DNS spoofing open the router's web page, enter the credentials to get to the settings portal, open DNS settings, and then set the DNS server to the address of the attacker machine where a Fake DNS server is running. 

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
