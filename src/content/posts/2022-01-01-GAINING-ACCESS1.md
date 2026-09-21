---
title: Gaining Access:Part I
date: 2022-01-01 11:14:00 +0530
categories: [Penetration Testing,Access]
tags: [networking]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/GAIN_ACCESS1.jpg?raw=true)


# Gaining Access

In this series we will start with various methods to get an initial foothold on the target system, We will look at various techniques to gain access to Computer devices(Devices like Phone, laptop, TV, web server, website a network a router all this are the Computers), Every Device is a Computer, We can make our PC act like a web server or TV or Phone.

These system have Operating system, Programs installed on them and a user using them

Two main Approaches to attacking these Systems are-

- Server Side Attacks: In this we don't require any User interaction we will need only the IP and then we will try to gain access without any user interaction { This basically applies to web server, and devices which doesn't need much user interaction the user configures it and they runs it automatically} our main entry point will be Operating System and Applications installed on the target
- Client Side Attacks: It requires user interaction like opening a file,installing an update, Basically here we learn how to create trojans and how to create backdoors.


## Server Side Attack

To start with we need the IP address of the target system, the target system in question here will be a web server, because in case of a PC even if we get the IP address of the system the computer is hiding behind a router and thus we can't do much. thus we consider web servers which are directly connected to the internet and have a Public IP associated to them. It can also work if the PC is on the same network and we can ping the PC using its IP address.

To get the IP →

- If PC on same Network using nmap netdiscover
- If a web server using ping to get the IP

`NOTE: Getting the IP is tricker if the target is a personal computer, might be useless if the target is accessing the internet through a network as the IP will be the router IP and not the target's, client side attacks are more effective in this case as reverse connection can be used.`

### Information Gathering

First step in any kind of hacking is Information Gathering, The success of an attack depends on the outcome of Recon/Information Gathering phase,
Here we will try to gather information like OS of the system, Services running on the system, Open ports, Versions of the services installed etc. 

There are varoius tools available to scan the target, the most commonly used is nmap, Perform a nmap scan on the target's IP and then go through the output service by service google the service or version to find any known vulnerabilities in it.

Try Default Credentials or Anonymous login to services,example ssh,ftp.

### Metasploit

Once found an vulnerability in the system we need a way to exploit it, The best framework out there for this purpose is metasploit, It is used to create or use exploits after finding a vulnerability, It is an exploit development and execution tool.

Start metasploit framework by typing **`msfconsole`**

Basic commands in msfconsole are:

**`help`** → shows help

**`search <something>`** → Search for a vulnerability.

**`show <something>`** → something can be exploit, payload, auxiliary,option it shows information about it

**`use <something>`** → use a certain exploit payload, module

**`set <option> <value>`** → set the option in particular exploit

**`expolit`** → runs the current exploit

We can use Metasploit community which is a web based GUI tool.


## Client Side Attack

This should be used if Server Side Attack fails or the target is hidden behind a router (i.e we cant ping the target), This requires the interaction of client in order to be successful Here Information Gathering is crucial because the attacker need to design the attack vector very carefully from the information gathered.

These attacks can work if devices are on different networks as well. The client or the victim needs to open a link or pdf or any program in order for the attack to be successful.

### **Veil**

It is a Framework used to create undetectable backdoors, Backdoor is a file that gives us full control over the machine it gets executed on, Backdoors are generally caught by AntiVirus Softwares, This Tool is used to generate undetectable backdoors.

**Installing Veil:-**

- clone the git repository (veil official project)
- Now we got the tool but to use it we need to install all the libraries that veil depends on fi=or that we need to run the setup.sh script in config folder(Veil>config>setup.sh)
- Once the script is done our tool is ready to be executed just go Veil folder and run Veil.py

Veil has two main tools 1)Evasion 2)Ordnance we can look using list command

Evasion is the one which will generate undetectable backdoors for us whereas Ordnance is used to generate payloads that's used by evasion; it can be considered as a help or secondary part(Payload as in the thing we want to do it could be a reverse connection, download something on the target, or literally anything)

We select a tool by typing `***use evasion`***  or `***use 1`*** once in the veil evasion we can list and select a payload from the list once selected It will show the info. About the payload and the req options

The backdoor generated by veil will be bypassed by every AV except AVG, To bypass AVG as well we need to modify the Optional options a little bit:

- set processors 1
- set sleep 6 (or any no.)

[Note these options doesn't really make much difference in functionality but it makes the backdoor seems different thus able to be evaded by AVG as well]

Once done generate the backdoor by typing `***generate`***, name the backdoor

To check whether the backdoor is detectable or not we will use a website called **no distribute**, just upload the file and check if it gets detected or not.

Before the backdoor gets executed we need to setup the listener to get incoming connection(Incase of Reverse connection) we will use metasploit framework for the same:

`***msfconsole`*** {to start msfconsole}

***`use exploit/multi/handler`*** {module to listen for connection}

***`set payload ---`*** {set the payload to one which we created in veil i.e rev_https}

***`set LHOST ---`*** {set the lhost to IP you chose}

***`set LPORT ---`*** {set the lhost to IP you chose}

***`exploit`*** {It runs the exploit and listener starts}

**Delivery Method(FAKE update) 1**

We will spoof an update, Here if any specific program on victim pc checks for an update it will show an update and instead of updating our backdoor will get installed, It works only if you are MITM.

It works Like Every Program has specific domains to check Updates, The program will request the IP for the update server and then the program will send a direct request to the update server checking for updates if there are any updates the server will respond back.

In our scenario when the victim asks for the IP of the update server we will respond with our server instead of the original server and our server will be ri\unning a tool called evilgrade which will help in installing the backdoor.

First we need to install evilgrade in kali,

Once in evilgrade we will type show modules it will show us all the apps whose update it can hijack we will select one and configure it using `***configure modulename`*** it will show us all the options available to configure (we need to change the agent to our backdoor file). Once all set we will type ***`start`*** to start the server then we need to become MITM and then we need to run a DNS spoofing attack to spoof the update domain to our server.

Note:- It won't work if you download using https page

**Delivery Method(backdooring exe downloads) 2**

In this method we are going to wait for our victim to download an exe file and then we will backdoor this executable while it's being downloaded. It will eventually give the victim the exe he’s downloading but at the same time we got full access via our backdoor, We need to be MITM for this method as well.

We are going to use a tool called backdoor factory proxy.{first install bdfproxy}

Configure the tool in bdfproxy.cfg and then run bdfproxy.py to start the tool, Now we need to redirect the requests to the tool so we need to become the MITM.

Now to get the request in bdfproxy we need to link all the data intercepted in bettercap or any tool used for MITM , so we need to use a firewall called iptables using it we can specify rules the packet needs to follow. Ex

`***iptables -t nat -A PREROUTING -p tcp --destination-port 80-j REDIRECT --to-port 8080`*** {here we appended a rule to nat it is a prerouting rule where all tcp packets destined for port 80 will be redirected to 8080 port}

Then simply run the multi handler and whenever the victim downloads a file it get backdoored with our executable and we get full access once the user runs it.

Note:- It won't work if you download using https page


--- 

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
