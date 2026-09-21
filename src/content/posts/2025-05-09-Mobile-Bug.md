---
title: Mobile App Security Testing - A Beginner-Friendly Guide 
date: 2025-05-09 08:34:00 +0530
categories: [BugBounty,mobile]
tags: [mobile]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MOBILE1.jpg?raw=true)



> ⚠️ Mobile testing requires setup, but if you're familiar with testing web apps, you’ll feel right at home.
>
> Many critical mobile bugs are just web bugs in disguise.

`💡 Fun Fact: Far fewer people test mobile apps than web apps so there’s gold in the hills!`


## 📱 Types of Mobile Apps

### 1. Pure Native Apps

These are those apps that dont make use of web views at all. These includes games and simple apps that don't connect out to web services, These are entirely written in the native UI toolkit, its written in `Objective C and swift` for IoS and `java and kotlin` for Android

These are by far the least common type of app. It takes most effort to build and also most effort to test.

### 2. Hybrid Apps

These generally uses a combination of both native views and web views, These are easy to build and easy to test.

These are the most common types of application, with functionality able to be implemented in whatever means is best for development.

### 3. Web Wrapper Apps

These are exactly what they sound, the app entry point just opens a mobile specific web application in a web view. 

These allows the most code to be shared between the standard web frontend and mobile specific apps. In this case, effectively every common web vulnerability applies here


## 🧠 Languages to Know

| Platform | Languages          |
| -------- | ------------------ |
| iOS      | Objective-C, Swift |
| Android  | Java               |
| Both     | JavaScript         |

---

## 🎯 Choosing a Target App

Look for apps that:

* Use many WebViews or wrap web apps
* Expose broad functionality through APIs
* Games wthat include features like **leaderboards** (often vulnerable to stored XSS or SQLi)


### Get the Source Code

First step is to get the source code of the application, if the source code is open source and available its good,

But if not then we can decompile the application to get a gist of source code, the source code would not be perfect but still having it is better than having none.

### Set Up a Proxy

If using Burp proxy then make sure the proxy listner is listning on all interface by default it listens only on loclahost, change it to listne on all interfaces.

Then we need to install CA and bypass certificate pinning,
Certificate pinning is where the mobile application will open ssl connection only with server having known good certificates in order to prevent MITM attacks

How to bypass this will be discussed later in the ppost.

# 🛠️ Testing Methodology

## Look for Standard Web Bugs

The first step is to look for standard web bugs, Most bugs associated with web are possible in mobile apps, commonly found are 

* SQL Injection (SQLi)
* Insecure Direct Object Reference (IDOR)
* Improper authorization/authentication
* Insecure Uploads


## Check Credential Storage

Check how credentials are stored, Both Android and IOS provide secure credentials storage for saved logins `keychain on IOS`, and `smartlock on android` which application should use.

If they aren't using those APIs, Its very possible they are storing them improperly. look for credentials encryption in the source, as well as plaintext credentials on disk.


## Look for Insecure Connections

All connections from the mobile apps to various web services should be over HTTPS
If you see plain HTTP connections in your proxy, this is a sign that critical data may go over the wire in plaintext

The mobile application sends a session key every time a request is made, thus even if unimportant data like banner images are over HTTP then the session data could be stolen and then could result in session takeover.

## Search for Hardcoded Secrets

Many mobile application contains embedded secret keys for web services access. Developers assume that because they are distributing a binary, people wont be able to find these keys, but decompilation could allow recovery for those discovery.

If we have the source code with us then simply grep for any value like key, secret, token etc.

Also `strings` command in unix can be used to search for any strings in the binary

## Check Session Handling

* Mobile apps use headers for sessions, unlike web cookies
* Check if headers go to every domain (🚩 red flag!)
* Headers should be HTTPS-only and destination-restricted


## Hunt for Debug Interfaces

This not common but still some mobile application have secret development interfaces which may allow you to change target web services, see communications modify sessions etc.

while these generally wont contain bugs but may simply testing, like they could reveal test servers or internal endpoints which could further help in escalating to SSRF

## Inspect App Data

Both IOS and android have app-specific location for data, These may contain cached credentials, transaction histories and more.

This is a source of low hanging fruit in many mobile applications.

## Audit Cryptography

* Look for:

  * Weak cipher modes (e.g., ECB)
  * Deprecated algorithms
* Many apps roll their own crypto—usually insecure


## Check for Screenshot Leakage

* Sensitive data visible in the app switcher = **vulnerability**
* Apps should mask sensitive screens when backgrounded


# 🤖 Android-Specific Insights

## APK Structure

* APK = ZIP archive
* Contains:

  * Code (DEX)
  * Manifest (permissions)
  * Resources (layouts, strings, images)

### Tools

| Tool                        | Purpose                              |
| --------------------------- | ------------------------------------ |
| `apktool`                   | Extract APK contents and decode XML  |
| `dex2jar`                   | Convert DEX to JAR                   |
| `JD-GUI`                    | View JAR files as readable Java code |
| `Frida`                     | Runtime app instrumentation          |
| `adb logcat`                | View real-time device logs           |
| Android Studio / Genymotion | Emulators for testing                |

---

## Android App Decompilation

```bash
dex2jar -f app.apk
```

* Open the resulting JAR in **JD-GUI**
* Save `.java` files using "Save All Sources"
* Open in your favorite IDE for inspection

---

## Setting Up Burp Proxy with Android

### Step 1: Enable Proxy

* Set listener to **all interfaces**
* Emulator: Configure via "Extended Controls"
* Real Device: Modify WiFi network → Proxy settings

### Step 2: Install Burp Certificate

* Visit `http://burp` from device
* Download CA certificate
* Install via Android settings:

  * Security → Encryption & Credentials → Install from SD

### ⚠️ Watch Out!

* Some apps make **direct socket connections**
* Others use **certificate pinning**

🔧 Solutions:

* Use Android VPN feature to route all traffic to proxy
* Use **Frida** or custom patches to disable cert pinning

---

## Rooting (Optional)

* Gives superuser access to system files
* Helps in testing deeper app behavior
* ⚠️ **NEVER root your primary device**

---

# 🛠️ Common Android Vulnerabilities

### 1. Activities and Intents

* Activities = Screens/controllers
* Intents = Messages that launch activities

```xml
<activity android:name="com.example.app.MyActivity"
          android:label="@string/title_my_activity">
</activity>
```

```java
Intent call = new Intent(Intent.ACTION_DIAL);
call.setData(Uri.parse("tel:2125554240"));
startActivity(call);
```

* Intents can be **broadcasted** or **redirected**
* Misconfigured activities can be hijacked

---

### 2. Cross-App Scripting (XAS)

* Like XSS, but inside WebViews
* Dangerous if `loadUrl()` or `evaluateJavascript()` use untrusted input

---

### 3. Intent Redirection

* If intents aren't validated, attackers can craft custom ones
* Leads to unauthorized access or functionality misuse

---

## ✅ Pro Tips

* Use `adb logcat` to view real-time debug logs
* Search through decoded resources for hidden views or keys
* Monitor file reads/writes with Frida

---

# 🧠 Conclusion

Mobile app testing might seem tough at first—but most issues are well-known web vulnerabilities repackaged for mobile. With the right tools, a good methodology, and a curious mindset, you'll uncover plenty of bugs that others miss.

Happy hacking! 🔍📱💥


---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)

