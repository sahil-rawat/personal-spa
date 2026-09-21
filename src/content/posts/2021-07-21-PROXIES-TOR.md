---
title: Proxies and Proxychains
date: 2021-07-21 13:39:50 +0530
categories: [Penetration Testing,Networking]
tags: [networking]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN2.jpg?raw=true)

# Proxy

Proxies are used for Anonymizing purposes or to Bypass Firewalls like accessing the services which are not allowed in a certain part of the country, It may also be used in a scenario where we need to scan a target whose traffic primarily originates from a single area, so we need to scan it using a proxy from that area otherwise the network administrator might get suspicious.

In proxies you are routing your packet from several different points, It can be very slow depending on the speed of the proxy elsewhere, As you know nothing about the server your packets pass through it is potentially dangerous to pass sensitive data through it, However, you can use it to scan a target by being anonymous.

If privacy is the concern then you can use VPNs for the same, VPNs are faster and more secure as they encrypt the data between the client and the VPN server, Prefer the Service Provider who doesn't log the connection.

## Proxychains

Used to anonymize network traffic, These are chains of proxies where traffic routes from various proxies that's why the name proxychains. Install proxychains using apt-get, In kali Linux it is installed by default. To check for configuration of proxychains go to `/etc/proxychains.conf`
Proxies are slower so they might be useful sometimes but not in the case where speed is a factor like brute-forcing a login Because the traffic flows through various servers and some servers might be slower thus it is not feasible to do tasks where we need speed

There are three types of proxies:

- HTTP → Used to anonymize HTTP traffic only
- SOCKS5 → This is the preferred proxy it is used to anonymize all sorts of network traffic.
- SOCKS4 → This is similar to SOCKS5 but it does not support ipv6 and UDP protocols


Options in proxychains.conf:

- dynamic_chain → It is the most common and preferable used option, In this, the traffic is routed from the Proxy servers as provided in the list and it skips the server if it is down.
- strict_chain → In this method the traffic is routed from the given list and if a server is down the traffic does not reach the destination it is useful when we ensure that all the proxy servers are up always{in a scenario where we pay for the proxy server because free proxy servers are down now and then}
- random_chain → In this method the traffic every time takes a different route, or we can specify that we go through this route many times and so on. It is like resetting the service and getting a new IP every time.
- proxy_dns → this ensures that the DNS requests are also routed through proxies to make sure there are no DNS leaks.

The syntax for adding a proxy server:

`paid proxy servers have username and passwords, free one generally does not have`

Example

|type|host|port|username|password|
|socks5|192.168.0.122|1234|user|pass|
|socks5|192.168.0.122|1234|-|-|
|http|192.168.0.12|1334|-|-|

Add these proxy servers at the end of the file 

To route traffic through the proxychains append proxychains in the front, for example,

`proxychains firefox` 

### Importing custom Proxychains

First get a socks proxy , A free one by searching on the internet or buy a paid proxy. Prefer a country that is reputed for not sharing information like Netherlands, Germany,Russia, China

Select a few proxies from the list and then add them to the end of the proxychains.conf file in the syntax shown before.

Free proxies generally won't work, so you might need to search for various sites and then check by trying if they work.

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
