---
title: HTTP:Where, What, Why?
date: 2025-05-01 13:31:00 +0530
categories: [BugBounty,Web]
tags: [web]
---

![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN.jpg?raw=true)

I am going to start a series on web application security 🧑🏻‍💻, which will contain posts related to topics ranging from how a website works to various common vulnerabilities found in websites. This series will be helpful for beginners who are starting in web application security or 🐞 bug-bounty.

This is the first post in the series where i will start with introducing basic concepts of HTTP Protocol.

Let's get Started! 💯

# HTTP

What is a protocol? A protocol is a system of rules that defines how data is exchanged within or between computers.

![](https://github.com/sahil-rawat/assets/blob/master/IMG/HTTP_WWW_INTRO.png?raw=true)

The HTTP protocol allows us to fetch or send resources from or to the server, In Simple terms, It is a pre-defined set of rules that need to be followed while communicating with the server. 
For example, if we want to fetch data we need to initiate a GET request, and the format of this request is pre-defined which we need to follow while sending this request.

## What Happens When a request is made to a website?

As you enter a URL in the browser to open a website, An HTTP Request is made by the browser to fetch the Data from Server.

The HTTP request which the browser sent will look something like this ⬇️:

```HTTP
GET /  HTTP/1.1 /
Host: https://sahilsinghrawat.com
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*,q=0.8
Authorization: Bearer Something_Here
Refferer: https://google.com/
```

Now Breaking apart the request line by line:

> 1. First Line determines What page (or endpoint) to fetch
>
> 2. Second line tells What website (or host) to fetch from
>
> 3. Third line is used by the server to determine information about the browser who is sending the request, It includes Browser Name, Version, etc
>
> 4. Fourth line specifies What type of data to send/receive, for example, text, JSON, etc
>
> 5. Fifth line is used to specify authorization for example if the browser uses some kind of access control on the data then the user needs to send an authorization token that specifies that the user is allowed to view the resource.
>
> 6. Sixth line tells the browser from where the user is redirected/referred to

Now looking at the corresponding response from the server

```http
200 OK
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Mon, 13 Jul 2021 16:06:00 GMT
Keep-Alive: timeout=5, max=997
Server: Apache
Set-Cookie: mykey=myvalue; expires=Mon, 17-Jul-2017 16:06:00 GMT; Max-Age=31449600; 
```

Similarly Breaking down the response line by line:

> 1. First Line determines the response code, for example. success, redirect, etc. More about this in the next section
>
> 2. Second line tells the browser to keep the connection alive for further more requests.
>
> 3. Third line determines the encoding applied to the response data, this is useful for the browser so that browser could decode this data before rendering
>
> 4. Fourth line specifies the type of data that is received, for example, HTML.
>
> 5. Fifth line is the date which is pretty self-explanatory.
>
> 6. Sixth line hints to the browser about how the connection may be used to set a timeout and a maximum amount of requests.
>
> 7. Seventh line is the server that is sending the response.
>
> 8. Eighth line sends the cookie from the server to the browser, to set multiple cookies this header needs to be defined multiple times.

These are just some of the common headers associated with HTTP Requests and Responses, There are many more headers apart from it that are used depending on the underlying server.

Follow this guide to learn more about the [List of Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)

## HTTP methods

The Requests shown above was only one of the ways to interact with the server from the browser, below are the different types of HTTP methods that could be used by the browser to interact with the server.

- **GET** - This is the request we discussed above, it is used to fetch resources/data from the server. This request should only be used to retrieve the data
- **HEAD** - This method asks for a response identical to the GET request, but without the response data, This is used to look at the response headers only.
- **POST** - This method is used to create or change data on the server for example creating a user on the server will result in sending a POST request.
- **PUT** - This is used to modify or replace the data on to the server, It replaces all current representation of the target with the request's payload
- **DELETE** - This method as the name suggests is used to delete a specified resource
- **TRACE** - This method does a message loop-back test, this is usually done for debugging purposes, the response received is the same request that the server received, this is done to check if the response headers are modified before reaching the server (in case of a proxy).
- **OPTIONS** - This method is used simply to specify the communication methods available.

## HTTP response codes

These response codes are used by the server to hint the browser about the response, as we have seen above in the HTTP response the first line consists of a code,

Some common HTTP response codes are ⬇️

- **200 range** -- Successful Range, This determines that the request was successfully handled by the server

* **300 range** -- Redirect, This hints browser to redirect to some other link
* **400 range** --
  * **401** - Unauthorised or unauthenticated
  * **403** - Forbidden or no access to the resource
  * **404** - Not Found or File doesn't Exist
  * **405**- HTTP Method not allowed
* **500 range** - Internal Server Error, Where the server doesn't know how to handle the request

# Tools

If you want to explore more about how these HTTP requests are made and about various request and response headers, then below are two interesting tools which are one of the favorites of most bug bounty hunter, This section is just to introduce you about these tools to learn more about the HTTP protocol however complete guide of these tools is left out for another post.

## chrome devtools

The built-in functionality of chrome dev tools in chrome browser is a great tool and used by many bug bounty hunters, This tool helps in breaking down every request made to the server when we visit a website or click a button.

![](https://github.com/sahil-rawat/assets/blob/master/IMG/HTTP_WWW_DEVTOOL.gif?raw=true)

The usage is simple to open the website in a chrome browser then open the dev tools either right-click and then select *inspect* or use the shortcut key for Windows: *Ctrl+Shift+J* and Mac: *Cmd+ Opt+J*

Using chrome dev tools is a complete topic in itself and there are many more things we could do using dev tools, that are left to explore or for another blog post.

## burp suite

This is yet another great tool, this tool simply acts as a proxy between your browser and the web server, so each request made from the webserver is first sent to the burp suite, and once we forward this request then only it reaches the server.

For using it we need to change the proxy setting in the browser and add a proxy to the 127.0.0.1:8080 address where the burp suite is listening, also there is an easy way to set up the burp suite using extensions.

here as we can see that the GET request is logged into the burp suite before going to the server.

![](https://github.com/sahil-rawat/assets/blob/master/IMG/HTTP_WWW_BURP.png?raw=true)

Happy Hunting 🔍🐞 
--- 

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
