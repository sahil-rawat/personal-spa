---
title: "Annotated Game: Me and an AI vs. Ten Bugs in My Website"
date: 2026-11-21 14:00:00 +0530
description: "I rebuilt my personal site with an AI pair-programmer. Here are the ten real bugs we shipped on the way, annotated like a chess game, and what each one taught me."
categories: [Development]
tags: [web, debugging, ai, chess]
---
![Annotated game: me and an AI versus ten bugs, drawn as a chessboard with move annotations](/assets/img/posts/annotated-game-ten-bugs.png)

Chess players annotate their games. After the match, they go back through the moves and mark each one: a brilliant idea, a dull-but-fine move, a mistake, a blunder. It is not about blame. It is about seeing what the position actually was, so the next game goes better.

I rebuilt this website over the last few weeks with an AI coding assistant sitting next to me. It was fast, often impressively so. It also made mistakes, I made mistakes, and a few of them got all the way to the live site before anyone noticed. So here is the game, annotated move by move.

A quick legend, in case you do not play:

- `!!` a brilliant move
- `!?` interesting, worth a second look
- `?!` dubious
- `?` a mistake
- `??` a blunder

Every "move" below is a real bug we hit. None of this is invented for the story, and the quotes and error messages are the ones we actually saw.

> [!NOTE]
> "We" means me and the assistant. It wrote most of the code. I made the taste calls: which theme, what to say about me, what to throw away. That split turns out to be the real subject of this post, and I will come back to it at the end.

## 1. The page that answered every address `?`

The first thing I checked on the live site was a boring one: what happens when you visit a URL that does not exist?

```bash title="terminal"
curl -s -o /dev/null -w "%{http_code}\n" https://www.sahilsinghrawat.com/admin/
200
```

A page that does not exist returned **200 OK**, and the body was my homepage. So did `/rss.xml`, and so did `/sitemap-index.xml`. To a search engine, my site had an infinite number of identical pages. To a human, a typo in the address bar silently showed the homepage as if nothing was wrong.

**Cause:** with no `404.html` in the build, the hosting platform falls back to serving the main page for everything, the way a single-page app would.

**Fix:** add a real 404 page. The status code is now honest, and the page itself is friendlier than a blank error.

**Lesson:** test the failure path, not just the happy path. The pages that exist were all fine. The pages that do not exist were the bug.

## 2. Sixty-seven images that were not mine to rely on `?!`

Almost every old post pulled its images from a different repository, through links like `github.com/.../blob/master/IMG/photo.jpg?raw=true`. That works until the day that other repository changes, and it makes every page depend on a second service.

So we downloaded them all into the site. Sixty-seven unique images, 52 MB, which we squeezed down to about 13 MB. The script reported success for every file.

Then I ran the `file` command on the folder, out of habit:

```bash title="terminal"
file public/assets/img/posts/* | grep -v -E "image|empty"
public/assets/img/posts/DOC_1:      HTML document text, ...
public/assets/img/posts/LEMON_DUCK: HTML document text, ...
```

Two of my "images" were not images. They were links to repository *folders*, and the download had happily saved the HTML page for each one. The download tool treated a successful response as success. A web page is a successful response.

**Lesson:** a `200` is not proof you got the thing you wanted. Check the type, not the exit code.

## 3. Heading links that were not there `?!`

I wanted a small `#` to appear next to each heading so readers could link to a section. The plugin was installed, configured and, according to the config, working.

It produced nothing.

The plugin that adds the link needs each heading to already have an `id` to point at. Mine had none yet at that point in the pipeline, so there was nothing to link to, and it quietly did nothing. Adding a second plugin that creates the ids first fixed it. Then a smaller surprise: the table of contents started showing `Reflected XSS#`, with the stray symbol included.

**Lesson:** plugin order matters, and "it is configured" is not "it works". Open the output and look at it.

## 4. The button that would not hide `??`

This one hurt, because it was in the header of every page.

I had a keyboard-shortcut button in the header meant to appear only on larger screens. On a phone, the header was cramped and the button was right there anyway. The responsive class said `hidden`. The browser disagreed.

```css title="the bug, simplified"
/* my component styles, written outside any layer */
.icon-btn { display: inline-flex; }

/* the framework's "hidden" utility lives inside a layer */
@layer utilities { .hidden { display: none; } }
```

In CSS, styles that are not in a layer beat styles that are. My plain `.icon-btn` rule silently overruled the framework's `hidden` utility, every time, on every screen size.

**Fix:** put my component styles inside a layer too, in an order where the utilities win.

**Lesson:** the cascade has more rules than "later wins". When a class does nothing, ask which rule is winning, not whether the class is spelled right.

## 5. Spaces that vanished `?`

My About page said "I'm active on Hack The Boxand TryHackMe". I did not see it. A reader would have.

When a line break sits between a link and the next word, the template engine trims it, so the two words glue together. The same thing had already happened once before on another page, in a sentence that read "internals.Archive by year". We fixed that one by hand and moved on, which is exactly how the second one got through.

This time we did something better: we searched the finished HTML for any closing link tag immediately followed by a letter.

```bash title="terminal"
grep -o '.\{30\}</a>[A-Za-z][^<]\{0,20\}' dist/*/index.html
```

It found exactly one more. We fixed it.

**Lesson:** when you fix a bug by hand, ask whether it can happen somewhere else. Then write a search for it.

## 6. A search that was too clever `?!`

I added a command palette, the kind you open with `Cmd+K`. For matching, we gave it a "fuzzy" search, which finds a result even if your letters are not in a row. I typed `csrf` to jump to my post on cross-site request forgery.

It showed that post first, correctly. Right under it was "Mobile App Security Testing". Why? Because the letters c, s, r and f do appear, scattered, in that title, in that order.

Technically it matched. Practically, it was noise. We removed the fuzzy matching and kept the simple "contains these letters together" check.

**Lesson:** a smarter feature is not automatically a better one. Test it with a real query from a real person (you).

## 7. A headline nobody could read `??`

I wanted a cover image for a post, in the style of the site: dark card, yellow highlight on one word. The assistant drew it as a vector graphic and rendered it to a PNG.

The headline was almost invisible. It had the dark text on the dark background, with only a thin yellow bar underneath. The first attempt layered two copies of the text and a clipping shape in a way that looked clever in the code and terrible in the picture.

We looked at the render, saw the problem immediately, and fixed it. A second attempt made the same mistake in a smaller way: the yellow highlight box was too short, so the top half of the black letters still sat on a dark background.

Two renders, two blunders. The third one was fine.

**Lesson:** look at the picture. An AI can write correct-looking code for something visual and never see the result. The feedback loop is your eyes.

## 8. A manifest full of someone else's template `?`

Deep in the favicon folder there was a file called `site.webmanifest`. It looked like a normal JSON file, but inside it said:

```text title="site.webmanifest (before)"
"name": "{{ site.title }}",
"short_name": "{{ site.title }}",
```

Those double braces are placeholders from the old Jekyll theme this site used to run on. Nothing fills them in anymore, so the file was invalid JSON, shipped to every visitor for months. No one noticed because browsers just ignore a manifest they cannot parse.

**Lesson:** when you migrate, hunt for leftovers. And validate the machine-readable files with a real parser, because humans will not catch what only machines read.

## 9. The push that said two different things `?!`

I pushed a commit containing all those images. The terminal said:

```text title="terminal"
fatal: the remote end hung up unexpectedly
fatal: the remote end hung up unexpectedly
Everything up-to-date
```

"Everything up-to-date" sounds like a success. It was not. A check of the remote showed my commit was not there. The push was too large for the default buffer, the connection dropped, and the last line was misleading.

Raising the buffer size fixed it.

**Lesson:** do not trust the last line of a command. Check the result: ask the remote what it has.

## 10. A check that cried wolf `!?`

By this point we had written a small script to check that every internal link in the built site points to a real file. It flagged a broken link in one post:

```text title="terminal"
BROKEN /assets/profile_picture/.../avatar.png
   in posts/idor/index.html
```

That path appears in a post about IDOR vulnerabilities, inside a **code sample** showing an example URL. It was never meant to resolve. The script was reading the code block as if it were a real image.

The fix was to ignore anything inside a `<pre>` block. I count this one as interesting, not a mistake. A false alarm from your own checker is a good sign: it means the checker is actually looking.

**Lesson:** a test that has never failed is a test you should be suspicious of.

## The position after ten moves

Looking at the whole game, a pattern shows up.

The assistant was quick at the things that have clear right answers: wiring up a feature, converting files, writing a small script. What it could not do alone was *see*. It did not see the unreadable headline until the picture was rendered and looked at. It did not know that a 200 on a missing page was wrong until someone asked the right question. It did not know that I would find the first warm, cream-colored redesign wrong for me and the clean, minimal one right. I had to decide that, with my own eyes.

Here is how I would split the work after this experience:

- **The AI is good for:** drafting, converting, repeating, and searching the codebase for "everywhere this might also be broken".
- **I am needed for:** taste, noticing when something looks or feels off, and asking "what happens when this fails?"
- **We both need:** a way to check the result, such as a script, a parser, or a human eye. Not just a confident sentence saying it worked.

One of my favourite lines in chess comes from the master Savielly Tartakower:

> The blunders are all there on the board, waiting to be made.

Every one of these ten was already on the board before we made it. A missing 404 page. A rule outranking another. A file nobody had opened in months. None of them were exotic. They were ordinary, and ordinary bugs are the ones that get through, because everyone assumes someone else already checked.

So play the game, annotate it afterwards, and keep the notes. Mine now live in a checklist I run before I push anything:

1. Visit a page that does not exist.
2. Open the output, not just the config.
3. Look at every image, not just the file list.
4. Grep the build for the mistake I just fixed.
5. Ask the remote what it actually has.

It is not clever. That is the point.
