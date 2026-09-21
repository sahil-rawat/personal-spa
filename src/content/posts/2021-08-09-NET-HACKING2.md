---
title: Network Hacking:Part II
date: 2021-08-09 11:38:00 +0530
categories: [Penetration Testing,Networking]
tags: [networking]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN10.jpg?raw=true)

We learned about Pre-Authentication attacks in the last [tutorial](https://www.sahilsinghrawat.com/posts/NET-HACKING1), now moving forward in this article we will explore techniques of Gaining access to that network.

To gain access to a network we need to know the password or key, we will discuss the methods of how we could get the password or key of the network so that we can connect ourselves to that network without anybody noticing.

## WEP Cracking

**Wired Equivalent Privacy** WEP is quite old encryption and can be cracked easily. It uses an algorithm called RC4 for encryption.

Steps in WEP are:

- Client encrypts the data using the WEP key 🔑
- Encrypted data is transmitted
- Router decrypts the data using the same key 🔑

The Problem with this method is in the way WEP implements the algorithm

So starting with the first step where the client sends the data to the router.

To encrypt it, WEP tries to generate a unique key for each packet, It uses a random 24-bit Initialization Vector **IV** to generate the unique key, then this IV is combined with the password to generate a keystream which is then used to encrypt the data. Then the encrypted data along with the IV is sent to the router, Because the router already had the key and IV is sent in the packet it could decrypt the message.

The weakness in this method is → The IV is sent in plain text, and also the size of the IV is only 24 bit thus IV will start getting repeated in busy networks thus it makes WEP susceptible to Statistical attacks.

### Exploitation

To crack WEP we need:

- To capture large no. of packets → using ```airodump-ng```
- Analyze the **IV** from packets and crack key → using ```aircrack-ng```

Start capturing packets using ```airodump-ng```

```bash
airodump-ng --bssid <MAC:ADDRESS> --channel <Ch. num> --write <filename>
```
Here *--bssid* option is used to specify the MAC address of the router we want to attack, then *--channel* is used to specify the channel of the network, and then save the output by *--write* option and specifying a filename.

Then let it run a few minutes to capture a large no. of packets

Once enough packets are captured we use ```aircrack-ng``` to crack the WEP key

```bash
aircrack-ng <filename.cap>
```

It will find the password and return it you get a KEY and an ASCII password you can use any of them to connect to the network, to use the key just remove colons from it and use it

The success of this attack depends upon the number of packets captured, so capturing a large number of packets will increase the chances of cracking the key, now in the case of a network that isn't busy it would take a lot of time to capture enough IV, Below is a technique which allows us to get enough IV quickly on a not so busy network.

**FAKE AUTHENTICATION METHOD**

In this, we force the Access Point to generate new packets, but before that, we need to associate with the network because if we aren't connected or associated with the network then the Access Point will ignore any packet we send. here associate means we need to tell the Access Point that we want to connect to the network. We can use ```aireplay-ng``` to associate to the network using a fake authentication method

```bash
aireplay-ng --fakeauth 0 -a MAC:ROUTER -h MAC:ADAPTER wlan0mon
```

After running this command we will be associated with the network we are not yet connected to. We can't use the internet but we are associated with it thus if we send the data to the router it won't ignore the request. Thus we can inject packets to increase traffic and generate new IVs quickly.

Now We could use the ARP Request-Replay attack shown below to inject packets.

**ARP Request Replay**

- Wait for an **Address Resolution Protocol** ARP Packet
- Once found capture the packet and retransmit it
- This forces the Access Point to generate a new packet with a new IV
- Repeat this process till we get enough packets

Running this attack is as simple as running

```bash
aireplay-ng --arpreplay -b <MAC:ROUTER> -h <MAC:ADAPTER> wlan0mon
```

here **--arpreplay** option is specifying that we need to perform an ARP Request Replay attack, **-b** option is to provide the MAC address of the access point, **-h** option is to provide the MAC address of your Network Interface Card.

**NOTE:- Perform this Fake Auth and ARP Replay attack in the new tab while airodump is running to capture the packets**

Once enough packets are captured crack the key using ```aircrack-ng``` 
```bash
aircrack-ng <filename.cap>
```

## WPA/WPA2 Cracking

Both WPA and WPA2 are secure than WEP and both are very similar. The only difference between both WPA and WPA2 is in the encryption used to ensure message integrity [WPA uses TKIP and WPA2 uses CCMP], both WPA & WPA2 can be cracked using the same method.

Access Points have a feature called **Wifi Protected Setup** WPS, this is to make the process of connecting a computer or devices like printers to wifi easier. It works only for wireless networks that use a password that is encrypted with the WPA Personal or WPA2 Personal security protocols. WPS doesn't work on wireless networks that are using the deprecated WEP security.

If this feature is enabled then this could be exploited to extract the password of Access Point.

### With WPS Feature Enabled

**NOTE:-This is applicable only if WPS is enabled and It is misconfigured (i.e it is configured to use a PIN instead of PUSH BUTTON) It works only if these two conditions are met.**

This Feature is rarely enabled, But always a good idea to try because WPA/WPA2 is very secure, and also if enabled then confirm that it is configured to use a PIN instead of the PUSH button. 

You could use WPS features in 3 different ways WPS can sometimes simplify the connection process. Here's how WPS connections can be performed.

1. First, press the WPS button on your router to turn on the discovery of new devices. Then, go to your device and select the network you want to connect to. The device is automatically connected to the wireless network without entering the network password.
2. You may have devices like wireless printers or range extenders with their own WPS button that you can use for making quick connections. Connect them to your wireless network by pressing the WPS button on the router and then on those devices.
3. A third method involves the use of an eight-digit PIN. All routers with WPS enabled to have a PIN code that's automatically generated, and it cannot be changed by users. You can find this PIN on the WPS configuration page on your router. Some devices without a WPS button but with WPS support will ask for that PIN. If you enter it, they authenticate themselves and connect to the wireless network.

As the pin is of 8 digits we can try all possible pins in a relatively short time thus it is easier to crack and once we get the pin we can crack the actual password.

To get the list of all the networks in range with WPS enabled we will use the command

```bash
wash --interface wlan0mon
```

Once we got the list we need to associate with the network, we could do so by the Fake Authentication method

```bash
aireplay-ng --fakeauth 30 -a <MAC:OF:ROUTER> -h <MAC:OF:ADAPTER> wlan0mon
```
here **--fakeauth** determines the type of attack and then 30 denotes that after every 30 seconds run this attack **-a** takes the MAC address of the router to associate to, and **-h** takes the MAC address of our Network Interface Card. **Don't press enter after typing the command, open a new terminal window and run a program called reaver which will brute force the pins.**

```bash
reaver --bssid <MAC:OF:ROUTER> --channel <Ch. No.> --interface wlan0mon -vvv --no-associate
```
here **--bssid** is to specify the MAC address of the router we want to attack to **--channel** to specify the channel of the network **-vvv** for verbosity and **--no-associate** because we are manually associating with the network by Fake Authentication Attack and automatic association does not work most of the time, run this and then run the fakeauth command.

**Note:- If got an error send_packetcalled from resend_last_packet() send.c:161 then it is a bug in a newer version of reaver download the older version and try again.**

### WITHOUT WPS FEATURE

If the WPS feature is disabled, then we need to resort to this technique to crack the Password for WPA/WPA2, We need.

- 4-way Handshakes, capture a few handshake packets
- A Wordlist, Containing Passwords which we will use to brute force

#### WPA/WPA2 Handshake Capture

The packets sent using WPA/WPA2 are not useful without a key and the only packets that are useful to us are handshake packets which are shared when a client connects to a network, there are 4 packets sent when a client connect to a network. the handshake does not contain any data to recover or password but only the data to check whether the password is valid or not.

First, we start capturing the packets.

```bash
airodump-ng --bssid <MAC:OF:ROUTER> --channel <Ch. No.> --write <filename>
```

here the **--bssid** option is to specify MAC of the router, **--channel** to specify channel number, and **--write** to save the output to.

We need to keep it running and wait for the handshakes to be captured. The ```airodump-ng``` will show that the handshake is captured, and if there aren't any new devices to join we can perform the Deauth Attack as discussed in [last post](https://www.sahilsinghrawat.com/posts/NET-HACKING1) to disconnect a client and when the client reconnects the handshake will be sent and would be captured.

```bash
aireplay-ng --deauth 4 -a 00:MAC:OF:ROUTER:11 -c 00:MAC:OF:CLIENT:11 wlan0
```
We will send only 4 packets this time so that the client disconnects and connects very quickly

We captured the handshakes now we would use this to crack the password.

#### Creating Wordlist

We will use the tool called crunch to create a wordlist for our attack.

```bash
crunch <min> <max> <characters> -t <pattern> -o <outfile>
``` 

here ```min``` and ```max``` are a range of length of the password to generate, ```characters``` are the characters we need to use like **[a-z][A-Z][0-9][@$]**, etc we can specify a pattern to use using **-t** option and lastly the **-o** option to specify the name of wordlist to be generated.

```crunch 6 8 abc12 -o wordlist.txt```

Some links to wordlist

```text
ftp://ftp.openwall.com/pub/wordlists/
http://www.openwall.com/mirrors/
https://github.com/danielmiessler/SecLists
http://www.outpost9.com/files/WordLists.html
http://www.vulnerabilityassessment.co.uk/passwords.htm
http://packetstormsecurity.org/Crackers/wordlists/
http://www.ai.uga.edu/ftplib/natural-language/moby/
http://www.cotse.com/tools/wordlists1.htm
http://www.cotse.com/tools/wordlists2.htm
http://wordlist.sourceforge.net/
```

#### Cracking

```aircrack-ng``` will take the captured handshake packets and then unpacks the packet to get all the details like SP Address STA Address MIC etc.

The Router looks For the **Message Integrity Code** to verify if the password is correct or not.

The MIC is generated from all the details in the packet combined with a password so the aircrack will take all the unpacked detail and a password from the wordlist and generate the MIC and compares it with the original MIC and if MIC matches, the password is found else moves to next password in the list.

The success of this attack depends on the wordlist, if the password is in the wordlist, then the password will be cracked but if the password is not in the wordlist then the attack fails.

To crack password use.

```bash
aircrack-ng wpa_hand.cap -w wordlist.txt
```

```aircrack-ng``` uses CPU to crack password, however, we could use GPU power to crack passwords more efficiently and faster using ```hashcat``` a GPU based hash cracking tool

To use hashcat to crack packets capture we need to convert our ```.cap``` file to ```.hccap``` format by using ```cap2hccapx``` tool from ```hash-utils```

```bash
cap2hccapx <in.cap> <out.hccapx>
```
this will output the ```hccapx``` file used by hashcat to crack password, now to use hashcat simply run,

```bash
hashcat -m 2500 capture.hccapx rockyou.txt
```

where **-m** is the mode to use, in our case 2500 means cracking wpa2 packets hash, then we provide our ```.hccapx``` file obtained, and then the wordlist to use.

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
