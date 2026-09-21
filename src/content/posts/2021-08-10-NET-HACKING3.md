---
title: Network Hacking:Part III
date: 2021-08-10 18:48:00 +0530
categories: [Penetration Testing,Networking]
tags: [networking]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN7.jpg?raw=true)

By now if you are following the series you were able to gain access to the network. Once we gain the access to the network we could perform the attacks discussed in this post,
We could gather info about the devices connected to the network, we could intercept the data, or modify the data *(inject evil code)*

## Information Gathering 🕵🏻‍♂️

Reconnaissance is one of the most important phases in hacking, once we gained access to the network we need to gather information of all of the connected clients on the network, we discover and gather their MAC addresses, their IP addresses, and try to gather more info about Operating System.

We could use net discover or Nmap for this purpose starting with net discover,

```bash
netdiscover -r 10.0.2.1/24
```

here **-r** is used to specify the range of IP addresses

Nmap shows much more information than netdiscover, it will show open ports, running services, operating systems, and all the clients connected from the IP address or IP range.

```bash
nmap -sn 192.168.0.1/24
```
**-sn** option is for ping scan it will help in identifying alive hosts on the network

```bash
nmap -T4 -F 192.168.0.1/24
```

This is a quick scan that shows the open ports on the discovered device

```bash
nmap -T4 -sV -O -F --version-light 192.168.0.1/24
```
This is a quick scan and also shows the operating system of the discovered device, program, and program version on the discovered port.

## Man In The Middle Attack (MITM)

In a MITM attack, the hacker would be able to place himself in the middle of the connection and be able to intercept see and modify anything transferring between devices.

![](https://github.com/sahil-rawat/assets/blob/master/IMG/NET_HACKING_III_MITM.png?raw=true)

As we can see that all the data/communication transferring between the client and router is going via the attacker's machine

An attacker can sniff the interaction, or can actively modify thus enabling the attacker to be in complete control of what the victim will see over the network, for example, if the user visits a page or downloads a file then the attacker can modify that with any malicious content.

To perform a MITM attack we need to use ARP Spoofing.

Using this technique we can redirect the flow of packets i.e instead of packets being flown between client and router the packets would be redirected to flow through our's machine

ARP (Address Resolution Protocol) It is a simple protocol that allows us to map IP addresses by MAC addresses.

For 2 Devices in the same network if they need to communicate with each other they need to know their MAC address. If one client knows the IP of other clients, then that can use the ARP protocol to get the MAC address of the client, it sends the broadcast message in the network an ARP request asking for the MAC address of the client, for example, an ARP request looks like **Who has 10.0.2.6?** All other devices will ignore the message except the one with this IP the client then replies an ARP response with his own MAC address, for example, **I have 10.0.2.6 my MAC is 11:22:33:44:55:66**

Each Computer has an ARP table that links IP with MAC on the network

We can exploit this protocol by sending two ARP responses one to the router and one to the victim machine we will tell the router that the victim is at the attacker's MAC and tell the victim that the router is at the attacker's MAC in this way the attacker will be in the middle of the connection of victim and router The router and victim will update the ARP table.

This is possible only because

- Clients accept the response even if they did not send the request
- Client trust the response without any verification

### ARP Spoofing using arpspoof tool

arpspoof is a simple and reliable tool, It is used to redirect the flow of packets then we can use a packet sniffer like Wireshark to intercept data. This tool can work against both ethernet and wireless networks.

Running it is as simple as running these two commands in the terminal simultaneously.

```bash
arpspoof -i eth0 -t 10.0.2.7 10.0.2.1
``` 
This command sends spoofed ARP packets to the target IP *10.0.2.7* specifying that the MAC address of *10.0.2.1* is the attacker's MAC address.

```bash
arpspoof -i eth0 -t 10.0.2.1 10.0.2.7
``` 
This command sends spoofed ARP packets to the target IP *10.0.2.1* specifying that the MAC address of *10.0.2.7* is the attacker's MAC address.

After running these commands the attacker would be in the middle of the connection now.

Once it is done we need to enable IP forwarding to make sure the client can access the internet. Because if IP forwarding is disabled then the attacker machine will drop all the packets except the one with destination IP set as attackers IP, thus the victim will experience a DoS attack. The attacker machine need to forward packets to the actual router thus we need to turn ON the forwarding in Linux using the command:

```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
```

### ARP Spoofing using bettercap 

Another tool to perform a MITM attack on any victim is bettercap, This tool can be used to perform ARP Spoofing, Sniff Data, Bypass HTTPS, DNS Spoofing, inject code in loaded pages, and much more.

Install the tool bettercap.
```bash
sudo apt-get install bettercap
```

Then start the tool by,

```bash
bettercap -iface eth0
```
replace **eth0** with your Network Interface.

Once in the tool, the prompt would have been changed to something like,
```bash
10.0.2.0/24 > 10.0.2.5 >>
``` 
here instead of 10.0.2.0/24, the IP range of your network would be shown.

To list all the commands/modules use the *help* command, then to find how to use any particular module we could type **help <modulename>**

To start a MITM attack we will use the module arp.spoof,

use the help command to list all the available options and set the options according to your network.

```bash
set arp.spoof.fullduplex true
```
Set fullduplex to true to perform arp spoofing in both the directions, then start the attack using,
```bash
arp.spoof on
```
Once the attack is started we can sniff the data in the tool itself by simply turning the sniff module ON,

```bash
net.sniff on
```

### HTTPS

While MITM any data that is transmitted via HTTP protocol can be easily intercepted and modified as it is in plaintext, however, if the data is transmitted using HTTPS then all the data is encrypted using **Transport Layer Security** TLS or **Secure Sockets Layer** SSL.

The easiest way to solve this problem is downgrading HTTPS to HTTP as we are in the middle of the connection, If the target requests an HTTPS website we could give him in response the HTTP version of that website. For that we need to strip SSL luckily bettercap has a module that does this (i.e hsts hijack)

This will work but not for all the websites like Facebook and Twitter which uses **HTTP Strict Transport Security** HSTS, It is a mechanism which helps to protect websites against sslstrip attack. It uses an HTTP Strict-Transport-Security response header which tells a browser that only HTTPS could be used to communicate with the website. Thus here the browser only accepts the response for the particular website if it is in HTTPS thus the sslstrip doesn't work here.

Another way to overcome the HSTS challenge is to use similar-looking domains for example if the victim wants to go to *facebook.com* the attacker can redirect him to *Facebook.corn* and thus could help in bypassing the HSTS mechanism.

### Performing DNS Spoofing

DNS is a server that maps domain names to their IP addresses. When we search for any website in browser the request goes to a DNS server the server responds with the IP address then the browser loads the website using IP

So if we are MITM we can respond to DNS requests with any IP we want and redirect the user to any fake website, here we will redirect the victim to the webserver running on our localhost first we will run the server in kali using:

```bash
service apache2 start
``` 

This will start the apache server on the kali machine to replace the default webpage, change the files in the var/www/html folder on kali. 

Then use dns.spoof module of bettercap to perform DNS spoofing

```bash
set dns.spoof.address <IP of the website where to be redirected>
```

To spoof all the addresses run,

```bash
set dns.spoof.all true
```

To specifically mention hosts which you want to spoof then run,
```bash
set dns.spoof.domain <hosts you want to spoof>
```

### Bettercap UI

If you want to use the GUI version of the bettercap tool, then there is a module named **UI** to do so,

If running for the first time, then we need to install the GUI,

```bash
set ui.basepath <path_of_bettercap>
ui.update
```
Once installed GUI can be started by running the command,

```bash
http-ui
```
This will start a server on a localhost, you can access the website from a browser to use bettercap.

default credentials for the website are ```user:pass```

### Wireshark

Using Wireshark an attacker could intercept/sniff all the packets of the victim, Wireshark is a network protocol analyzer. It was designed to help network administrators to keep track of what's happening on the network. It selects an interface and logs all the traffic that passes through that interface. It allows us to analyze the traffic and apply filters, and searches, etc. 

By default It captures only the packets of the machine itself, it won't capture the packets of another computer.

However, in case of a MITM attack, it will capture and analyze the packets generated by the victim as well because all the packets go through the attacker interface

We can use filters to filter the captured packets according to our need for example analyzing a particular protocol say http.


---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
