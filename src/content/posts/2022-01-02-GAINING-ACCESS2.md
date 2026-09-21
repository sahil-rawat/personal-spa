---
title: Gaining Access:Part II
date: 2022-01-02 11:18:00 +0530
categories: [Penetration Testing,Access]
tags: [networking]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/GAIN_ACCESS2.jpg?raw=true)

This is the Second Article in Gaining Access Series where we will be focussing on What is Social Engineering Attack? and how can we get started with it?

# Social Engineering Attack

Social engineering attacks focus on manipulating humans rather than hacking computer systems directly. As always *Information Gathering* is a crucial step. Since the target is a person, you need to gather as much information as possible—such as the websites they visit, their friends, email IDs, family members, and more.

## **Maltego**

It is an is a powerful open-source intelligence (OSINT) tool used for information gathering. It can be used to collect data about people, companies, websites, and more, and it visualizes this information in the form of detailed relationship graphs.

Gather Info about a person:

1. Start a new graph 
2. Add a person entity from the left panel
3. Go to property and set name
4. Right click on entity -> go to transform -> Run various transforms to gather details like:
    - Email addresses
    - Phone numbers
    - Social media accounts (Twitter, Facebook, LinkedIn, etc.) 
5. Manually verify each result. There may be multiple people with the same name.
6. Delete irrelevant entities and keep only valid ones.
7. Explore linked social media profiles to gather further personal or professional data.
8. From these entities (e.g., email), you can:
    - Transform to domain names
    - Discover colleagues or associates
    - Identify linked email addresses or phone numbers

Once you gather sufficient information, analyze the data and build an attack strategy based on behavioral or contextual cues.


## **Combine Backdoor with another file**

Using this method when we can combine the backdoor with pdf, song or any image when run would seem to be normal file but instead run our backdoor,

We will be using a download and execute script which when run will download our backdoor and run it on the target system. 

We will write the download and execute script in autoit and then compile it to exe using autoit compiler and set the icon of trojan as well. 

Once the user runs it it will open the pdf or image or song any file you combined it with and at the same time in the background it executes the backdoor as well.

**We can spoof the .exe to any extension like pdf jpg mp3 etc.** 



> For this we will be going to us a character called  Right-To-Left Override (RTLO) (U+202E) which makes the text after it to be shown as right to left 
>
>for ex: Abc|gpj.exe will be converted to abcexe.jpg (**|** is denoted as right to left override)


Note : But few browsers remove this character when downloading thus we need to make a zip file of it and then serve it on the website.

## **Spoofing** **Email**

Spoofing emails makes them appear as if they were sent from someone the victim trusts (like a friend, colleague, or support team). It's a popular method in social engineering attacks for delivering malicious payloads.

It relies on The Information we gathered we could act like one of the friends or a colleague or support member of a website.

You can use online services that allow us to send spoofed mail but some of this would end up in spam directory on the mailbox *[As these services are public many people use this to send spoofed mail thus google yahoo etc blacklisted these servers, Thus any email comes from these server is marked as spam]*.

We can use our own server if we have a web hosting plan or sign up for a free web hosting plan to use it to send spoofed emails.

Or Even better you can sign up for an SMTP/Mail server, You can search for SMTP server most of them are paid you can use them or you can search for free servers like send grid it is a paid website but it also offers free plans to send mail the mail sent from this server are not marked as spam 

Example with SendGrid:

1. Sign up for SendGrid (offers a free tier).
2. Create an API key.
3. Use the **sendemail** tool:

```bash
 sendemail -s smtp.sendgrid.net:587 \
          -xu your_username \
          -xp your_api_key \
          -f "spoofed@domain.com" \
          -t "victim@example.com" \
          -u "Subject here" \
          -m "Your message body" \
          -o message-header="From: Fake Name <fake@domain.com>"
```
>
>1. -s option to specify the server and port 
>1. -xu to specify username
>1. -xp to set the api key
>1. -f “” specify from email
>1. -t “” specify to email
>1. -u “” subject of email
>1. -m “” specify message to send
>1. -o to specify set additional email options
>
>This -o option is specifying a custom email header — in this case, it's overriding the From: field that the recipient sees.

## **BeEF Attack**

BEEF ***[Browser Exploitation Framework]*** It is a framework allow attackers to hook a victim’s browser and execute various exploits or payloads.

How It Works:

1. The victim visits a malicious URL or webpage containing the BeEF hook JavaScript.
1. Once the browser is hooked, you gain control and can launch various client-side attacks (e.g., stealing credentials, redirecting, phishing).

Hooking Techniques:

1. Use social engineering or DNS spoofing to trick the user into opening the URL.
1. If you have a Man-in-the-Middle (MITM) setup:
1. Inject the hook.js into the target webpage.
1. Use hstshijack and bettercap to hijack secure sessions.
1. Run the caplet and inject the hook dynamically.


--- 

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
