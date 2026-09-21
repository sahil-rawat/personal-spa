---
title: Network Hacking:Part I
date: 2021-08-08 13:14:00 +0530
categories: [Penetration Testing,Networking]
tags: [networking]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN11.jpg?raw=true)

In this series, we will start with the basics of network hacking.

A typical Network consists of various clients connected to share resources such as files, printers, and mostly 🌐 INTERNET, etc. 

All networks whether be it wireless or wired works on the same principle, i.e they have a device that is considered as server ```for example router in home networks``` also referred to as Access Point, this Access Point is the only device that has access to the internet, none of the other clients have direct access to the resource they can only access the resource through the router or the Access Point.

All the data in the network is transmitted in the form of packets all the requests and responses are transmitted as packets, and the data from the server like URLs, messages, images go through the router to the client, thus any computer connected to the same network can capture and analyze these packets. 

In Wifi Network these packets are transmitted in the Air, Thus anyone with a Wireless card can capture these requests and responses. 

There are three main stages in Network hacking:

1. Pre Connection Attacks - Attacks to do before connecting to the network
2. Gaining Access - Trying to gain access to the network, like cracking wifi keys, WEP, WPA, WPA2, etc.
3. Post Connection Attacks - Attacks to perform after connecting to the network

In this post, we will learn about Pre Connection attacks.

## Pre-requisite

Before getting into the attacking phase, Let's learn about some pre-requisites like how to change MAC address to stay anonymous while attacking, and enabling the monitor mode of the wireless card to capture the packets.

This tutorial assumes that you are working on a Linux environment (*preferably kali Linux*) and you have a network card with monitor mode capability

### MAC Address

**Media Access Control** MAC Address is a Physical, Permanent, and unique address associated with every network card, It is assigned by the manufacturer. An IP address is used to identify the computers on the internet and communicate with each other, Whereas MAC addresses are used to identify devices within a network and transfer data between devices. So each Packet of data within a network contains a source MAC and a destination MAC.

*MAC address doesn't leave the default gateway it stays in the LAN, people outside the LAN cant be able to find the MAC of a device.*

#### Why changing MAC address

Now addressing the question that why do we need to change the MAC address before getting into the attacking phase. As MAC Address is used to identify devices, thus changing it will increase anonymity, Even Sometimes MAC Addresses are used as a filter to prevent devices from connecting thus by changing the MAC address we can impersonate as other Device or Bypass Filters.

To check the current MAC address of your device, Open Terminal, and type:
```bash
ifconfig
```
This will return information about all the interfaces and their MAC address ```MAC Address will be shown as ether:```:

- eth0 → If running inside a virtual machine, It is a Virtual Interface Created by VirtualBox while Using the NAT Network.
- lo → loopback Address
- wlan0 → This is the real wireless adapter

To change the MAC address follow the steps given below:

1. Disable the Interface by typing
```bash
ifconfig wlan0 down
```
2. Then change the MAC address to anything of your choice by typing, replace 00:11:22:33:44:55 with the MAC address of your choice
```bash
ifconfig wlan0 hw ether 00:11:22:33:44:55
```
2. Then enable the interface again by typing
```bash
ifconfig wlan0 up
```

Now the MAC address would have been changed.

These Steps Will Change The MAC Address only in memory and does not physically change the MAC address thus If you restart the system the MAC would revert to the original one.

If you need to randomly generate a MAC address you could do so by typing the following command in your terminal
```bash
openssl rand -hex 6 | sed 's/\(..\)/\1:/g; s/.$//'
```

### Monitor Mode 🔍

Within a Network, data are sent in packets, and the packet contains the source and destination MAC addresses, Thus by default, the device only receives the packets which have destination MAC as their own MAC, and rejects all other packets, But as packets are sent in the air any device within range can sniff these packets by changing the mode of Network card to Monitor Mode

To check if the wireless interface is in Monitor mode or not type

```bash
iwconfig
```

This will list all the wireless interfaces and their details

By default, the mode is set to managed which makes the device receive only the packets destined for it.

1. To change the mode to monitor mode first we disable the device, replace wlan0 with the name of your wireless interface card.
```bash
ifconfig wlan0 down
```

2. Now, we need to kill all processes that might interfere with, Network card while in monitor mode.
```bash
airmon-ng check kill
```

3. Then change the mode to monitor mode, replace wlan0 with the name of your wireless interface card.
```bash
iwconfig wlan0 mode monitor
```

4. Then Finally enable the interface.
```bash
ifconfig wlan0 up
```

An alternative way to enable monitor mode:

1. To change the mode to monitor mode first we disable the device, replace wlan0 with the name of your wireless interface card.
```bash
ifconfig wlano down
```

2. Now, we need to kill all processes that might interfere with, Network card while in monitor mode.
```bash
airmon-ng check kill
```

3. Then change the mode to monitor mode, replace wlan0 with the name of your wireless interface card.
```bash
airmon-ng start wlan0 
```

4. Then Finally enable the interface.
```bash
ifconfig wlan0 up
```

Your interface will be shown as ```wlan0mon``` which is in monitor mode.

## Pre Connection Attacks

Once in monitor mode, the interface would be able to capture all the packets in a range of the device, even the ones not destined for the device, even if the device is not connected to the network, and even if we don't know the key or password to the network. So we need a program that would be able to capture these packets. The program we would be using is called ```airodump-ng``` it is a part of ```aircrack-ng``` suite and it is a packet sniffer. It is a program designed to capture the packets while we are in monitor mode.

It Provides us detailed information about all the wifi networks around us, their MAC address, their channels, their encryptions, the clients connected to these networks, etc.

To start Packet Sniffer type in the terminal

```bash
airodump-ng wlan0
``` 
It will start the Packet sniffer and shows information about wifi networks around us

The program outputs the details about the network in the first section and the second section, all the clients/devices connected to the network are shown.

![](https://github.com/sahil-rawat/assets/blob/master/IMG/NET_HACKING_I_AIRDUMP.png?raw=true)

Now breaking down each column of the output of the above command as shown in the image:

1. BSSID - MAC address of the Access point.
2. PWR - Signal Strength or Power, 
3. Beacons - These are the frames sent/broadcasted by the access point to show its existent, 
4. #Data - No. of Data Packets. 
5. #/s - this is the no. of data packets sent in the last 10 seconds.
6. CH - Channel of the network works on.
7. MB - Maximum speed supported by the network. 
8. ENC - Type of encryption used by the network. 
9. CIPHER - Cipher used by the network.
10. AUTH - Type of authentication used by the network.
11. ESSID - The name of the network.

### Wifi Bands

The Band of a network defines what frequency it could use to broadcast the signal and also the client need to support this frequency to connect to the network (Frequencies used are 2.4 and 5 GHz)

By default ```airodump-ng``` sniffs only on 2.4 GHz, but if the wireless adapter supports 5GHz we want to sniff on that network we need to specifically tell ```airodump-ng``` to sniff on 5 GHz by using command

```bash
airodump-ng --band a wlan0
```
the *--band* argument is used to specify the band we need to sniff on, band “a” uses 5GHz thus we specified 5GHz we can specify various bands together ex:

```bash
airodump-ng --band abg wlan0
```
This will sniff on both 2.4 and 5 GHz frequencies.

**NOTE:- Using multiple bands will result in slower scanning and also a strong adapter is required to sniff on two bands simultaneously**

### Targeted Packet Sniffing

After finding the network's MAC address from the commands given above, we can select a network and perform targeted sniffing on that network, i.e perform sniffing and run ```airodump-ng``` around that particular network only

We can perform this by typing

```bash
airodump-ng --bssid <MAC:OF:ROUTER> --channel <Ch. Num> --write <filename> wlan0mon
```

Here *--bssid* option is used to specify the network's MAC address, by *--channel* we specify the channel number, and then we are saving the output using the *--write* parameter and providing a filename to write to, and lastly, we need to specify the interface name “wlan0mon” in our case


We selected the *--write* option so the program will create output file in different extension for us mainly .csv .netxm and .cap formats.

We would be using the .cap file which contains all the packets that were sent to and from the devices on that network. But all the data sent between device and router would be encrypted by the encryption used by the network (like WPA, WEP, WPA2, etc) we can use Wireshark to analyze the data in .cap format.

### Deauthentication Attack

This attack allows us to disconnect any device from any network and that too without needing the password.

The idea behind this attack is that

Firstly We pretend to be the device by changing our MAC to the device's MAC and request the router to disconnect.

Then Secondly we will pretend to be a router by changing our MAC to the router's MAC and send a message telling you are being disconnected.

This allows us to successfully disconnect or de-authenticate any device from any network.

We are not going to do this manually but are going to use a program ```aireplay-ng```, replace MAC:OF:ROUTER with MAC address and MAC:OF:CLIENT with MAC address of client we need to disconnect

```bash
aireplay-ng --deauth <No. Of Packets> -a <MAC:OF:ROUTER> -c >MAC:OF:CLIENT> wlan0
``` 
Here we used *--deauth* option to specify that we are using deauth attack and sending a very large no. of deauth packets by specifying 10000000 ensuring that the client gets disconnected for a long time then *-a* option takes the MAC address of the router and *-c* for MAC address of Client, to disconnect all the clients remove the -c option.

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
