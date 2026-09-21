---
title: "Google Dorking"
date: 2021-07-25 13:39:50 +0530
categories: [Recon, OSINT]
tags: [Recon]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN.jpg?raw=true)

## Search Engine

Search Engines are huge indexers, specifically indexers of content spread across the World Wide Web. These search engines use 🕸 “Spiders” and “Crawlers” to search for the content across the Internet

Google is the most famous example of “Search Engines”, 

### Crawlers

Crawlers discover content through various means, One being the pure discovery that is a crawler will visit a URL and scrape through information and then returns this back to search engine.

Another way a crawler may work is by finding and following all the URL's from the previously crawled websites and tries to traverse everything it can

Let's Understand how this works

![IMG1](https://github.com/sahil-rawat/assets/blob/master/IMG/GOOGLE_DORK_CRAWLER_I.png?raw=true)

A web crawler discovers a new domain say “somewebsite.com”, so it will scrap the entire content on the domain and look for various keywords like in our example `[Technology, Hacking, Science]` these keywords are discovered on the domain somewebsite.com all  these scraped data will be saved by search engines now anytime a user will search for a query with “Technology”, “Hacking” or “Science” in it the search engine will present “somewebsite.com” to the user.

Now, what if the website contains another URL to a domain “new.somewebsite.com” then the crawler would scrape information from that domain as well and save it.

![IMG2](https://github.com/sahil-rawat/assets/blob/master/IMG/GOOGLE_DORK_CRAWLER_II.png?raw=true)

Again if a new URL is discovered on “new.somewebsite.com” then crawler will traverse that as well, so this goes on and on,

Now What if a user searches for a query with the keyword “Computer” now there may be a lot of websites with that keyword.

![IMG3](https://github.com/sahil-rawat/assets/blob/master/IMG/GOOGLE_DORK_SEARCH_RES.png?raw=true)

Here we can see more than 500 million websites have the keyword computer, now how does the search engine decide in what order the websites should show up,

Now, this ordering is very important for businesses because users tend to click the websites which are on the top of the results, So there is something called Search Engine Optimisation (SEO) which decides the page rank of a website.

Various Factors are responsible for deciding the page rank of a website, like, how responsive is the website, how easy it is to crawl the website, Response time of a website and so on. all these things come under SEO(Search Engine Optimisation)

Now there might be some pages which a domain dont want to be crawled, like hidden admin pages, so how do a domain defines that what should be crawled and what shouldn't, here comes the...

### Robots.txt 🤖

This file is the first thing that is indexed by “Crawlers” when visiting a site.

This file is a text file which defines the permission the “Crawler” has to the website, Infact you can allow or disallow certain Crawlers, like you want Google to index the site but not Bing, using this robots.txt this could be easily done.

Other than that, you can define which pages of the website should be indexed and which shouldn't

A simple Example of a Robots.txt will be 

```yaml
User-Agent: *

Allow: /

sitemap: https://sahilsinghrawat.com/sitemap.xml
```

Lets understand different keywords:

- User-Agent: This helps in Specifying different Crawlers, the “*” after it signifies all crawlers
- Allow: Specifies the directories allowed to be crawled
- Disallow: Specifies the directories disallowed to be crawled
- Sitemap: It provides the reference to a sitemap.xml file, which is like a map of complete site and it includes all the URLs, this helps in SEO

## Google Dorking

What is Google Dork? Basically it is a search string that uses advanced search query to find information that are not easily available on the websites.

Normally Users often consider Google as just a search engine used to find text, images, videos, and news. However, it has a very vast role. Google can be used as a very useful hacking tool.

We can use the web crawling capability which indexes almost anythin within a website to extract useful information.

How to do it? Using special google search operators.

### Google Search Operators

|Operator|Description | 
|--|--|
|**intitle**|This will ask google to find pages with the term in their html title|
|**inurl**|This searches for the term in the url|
|**filetype**|Finds certain filetype|
|**ext**|Works similar to filetype, will list files with the provided extension|
|**intext**|This will search content of the page|
|**site**|This limits the search to specified site only|
|**cache**|shows a cached version of website|
|**\***|Wildcard Can be used to match any thing|

### Examples

Lets look at some common examples of Google dork to find some private/sensitive data 

**Finding Username/Passwords from public sites like pastebin**

Using this we can find the public pastebin pages, files accidentally exposed on the internet, People sometimes use these sites to save Usernames and Passwords unaware of the fact that, those pages can be accessed by anyone out there, and infact google indexes these pages, which we can find by the following dork


```text
site:pastebin.com  intext:username intext:sahil
```

Here site:pastebin.com will limit the results to pastebin site only, then intext:username and intext:sahil will search for pages with the keyword username and sahil in the content

**Finding Username/Passwords from Logfiles**

This are basically LOG files containing clues about what the credentials to the system might be or various user/admin accounts that exists in the system, and developers accidently expose these log files publically, which could be found by the following dork

```text
intext:password  filetype:log

or

intext:password  ext:log
```

Here intext:password will list pages with keyword password in it, then filetype:log or ext:log will limit the pages with log files

**Finding Secrets from Enviorment Configuration**

The Enviorment configurations `.env` file are used to store credentials and configurations of various services running on the server like MySQL database, API_SECRETS, API_KEYS etc.

```text
"PASSWORD" filetype:env

or

"API_SECRET" filetype:env

or

"DB_PASSWORD" filetype:env

...etc
```

Here the pages with term within them and with the filetype as env will be listed.

**Finding Username/Passwords from Logfiles**

```text
intext:password  filetype:log

or

intext:password  ext:log
```

Here intext:password will list pages with keyword password in it, then filetype:log or ext:log will limit the pages with log files


**Finding Username/Passwords from Logfiles**

```text
intext:password  filetype:log

or

intext:password  ext:log
```

Here intext:password will list pages with keyword password in it, then filetype:log or ext:log will limit the pages with log files

**Exploring CCTV cameras**

Most of the time CCTV cameras are misconfigured, and can be accessed via internet, resulting in publically exposing the Camera footage live.

```text
intitle: “Network Camera NetworkCamera”

or

intitle:liveapplet

or

inurl:top.htm inurl:currenttime

or

inurl:”viewerframe?mode=motion”

...etc
```

**Exploring Vulnerable web servers**

We can detect vulnerable or hacked servers that allow appending “/proc/self/cwd/” directly to the URL of the website, these dorks can help in finding these vulnerable web servers and resulting in viewing exposed directories.

```text
inurl:/proc/self/cwd
```

Here intext:password will list pages with keyword password in it, then filetype:log or ext:log will limit the pages with log files

**Finding Exposed SSH keys**

SSH keys are used decrypt information transmitted via SSH protocol, and sometimes to log in to systems via SSH keys, and the following dorks could be used find exposed SSH keys

```text
intitle:index.of id_rsa -id_rsa.pub
```

Here intext:password will list pages with keyword password in it, then filetype:log or ext:log will limit the pages with log files

**Finding Email lists**

We can find email ids or list of email ids which might be exposed publically by the following doek

```text
filetype:xls inurl:"email.xls"
```

**Exploring Exposed phpmyadmin pages**

phpMyadmin is a commonly used tool in LAMP stack, this tool is used to manage or administer MySQL servers.

```text
"Index of" inurl:phpmyadmin
```
---

There are innumerable ways in which google dorks could be used, we discussed only a handfull of them, You can find anything that Google Indexed using these advanced search operators, It completely depends on your creativity how you could use these operators.

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
