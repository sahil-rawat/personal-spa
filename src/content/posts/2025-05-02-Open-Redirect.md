---
title: A guide to Open Redirect
date: 2025-05-02 13:39:37 +0530
categories: [BugBounty,Web]
tags: [web]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/BUG1.jpg?raw=true)

Open Redirect also known as Unvalidated redirects and forwards is a very common vulnerability, It happens when a website takes untrusted input from the user and redirects the user from the web application to an untrusted site or resource that would be used further for malicious purposes.

> 📌 The Impact of this Vulnerability is **LOW** unless you are using it to escalate other vulnerabilities

For example, suppose I utilize the following URL to redirect users to my projects website:

```https://www.sahilsinghrawat.com?redirect=https://projects.sahilsinghrawat.com```

Visiting this URL, The server would receive a GET HTTP request and use the redirect parameter to decide where the user is to be redirected, Then the server would send a 302 HTTP response, instructing the user's browser to make a GET request to *https://projects.sahilsinghrawat.com*

Now, suppose the attacker changed the original URL to:

```https://www.sahilsinghrawat.com?redirect_to=https://www.attacker.com```

If the server is not validating the redirect parameter, It will instruct the browser to redirect to attacker.com instead, Attackers could use this to perform phishing campaigns as the URL will seem to be of my domain but instead it will redirect to a domain attacker control.

The parameter will not be always as obvious, It could be checkout_url=,to=, domain=, next=, or simply any random string of chars as well, all depends on the developer, But the idea is to look after the parameters which look like taking a URL or domain as a value.

This vulnerability relies on abuse of trust, as victims are here tricked into visiting an attacker’s/malicious website thinking they will be visiting a site they recognize.

Sometimes an application may have some security measures in place where the developers define a list of either trusted or untrusted resources. In Some Cases, You might be able to bypass it If you fully understand how it works

## Filtering and Bypass

> ✅ https://examplesite.com/login/?next=https://mysite.com  --  **Allowed**
>
> 🚫 https://examplesite.com/login/?next=https://evilsite.com  -- **Not Allowed**
>
> ✅ https://examplesite.com/login/?next=https://evilsite.com/?mysite.com --  **Allowed**
>
> ✅ https://examplesite.com/login/?next=https://mysite.evilsite.com --  **Allowed**

In this example, the developers tried to implement a Filtering or Validation mechanism where they defined the list of trusted resources, and the server is checking that the next parameter's value contains a trusted domain or not from the list for example *mysite* is in their trusted resources list however *evilsite* is not, thus the 1st request is allowed but the second is not.

But there is a flaw in this validation technique that is a web application is expecting *mysite* in someplace in the link so if someone types *mysite* after the “?” it works or in some cases mysite.evilsite.com works as well thus we need to try different variations to bypass the filter.

Bypassing a filter is not as easy always, we need to fuzz the value to find what works for us. Below are some examples of how an open redirect could be exploited,

## Examples

*```Ex1: http://examplesite.com/?redirect=http://home.examplesite.com```*

This URL redirects the user to *home.examplesite.com*, any user can replace the redirect parameter value with any arbitrary link to redirect to that website, This is a very basic example, where we simply need to change a parameter value like *http://examplesite.com/?redirect=http://evilsite.com*

*```Ex2: http://examplesite.com/?redirect=http://home.examplesite.com```*

In this scenario, suppose there is a filter in place which is not allowing us to redirect to any host other than the trusted one, so we need to try to find different variations that could work, 

so here the filter is looking for complete string “home.examplesite.com”

we need to find this by trial and error method, say if we type any other domian it shows not allowed however if i type sahil.home.examplesite.com or home.examplesite.com.sahil it shows domain not found error

There is a way to Bypass this every 💡

Browsers has functionality that if we would type, any domain and a “@” and then the website we want to go to after it, then the  browser will redirect to the website after “@”, you can try it by typing in your browser or click on the link *[http://www.anydomain.com@www.sahilsinghrawat.com](http://www.google.com@www.sahilsinghrawat.com)* you will be redirected to my website, Following this, we could redirect the user by a link like *http://examplesite.com/?redirect=http://home.examplesite.com@www.sahilsinghrawat.com*

## 🧠 Real-World Scenario (OAuth Abuse)

Some applications use OAuth for authentication. If the redirect_uri parameter isn't properly validated, an attacker can:

> - Initiate login via OAuth.
> - Set redirect_uri=https://evil.com.
> - After the user logs in, the token is sent to evil.com.
> - This is called OAuth Misconfiguration and can lead to Account Takeovers (ATO).

## ⚠️ Real-World Tips

- Look for redirect-like parameters while browsing or testing.
- Always test both full URLs and partial injections.
- Fuzz the values to see what patterns are allowed.
- Use open redirect to chain with OAuth misconfigurations or login flows.
- Try the `@` bypass technique with caution modern browsers may handle it differently.


## 🧠 Key Takeaways

- Open Redirects are often overlooked due to low standalone impact.
- Their real power comes when **chained with other vulnerabilities**.
- Always test thoroughly don’t rely on surface-level checks.
- Even simple filters can be bypassed using creative payloads.

Happy Hunting 🔍🐞 

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
