---
title: "How to Ask AI Better Questions: Patterns That Save Me Time"
date: 2026-11-21 10:00:00 +0530
description: "A practical guide to asking AI better questions: simple, repeatable patterns for debugging, code review and learning that get you useful answers faster."
categories: [Development]
tags: [ai, productivity, prompting]
draft: true
---

Most disappointing answers from an AI assistant are not the model's fault. They are the question's fault.

I notice this every time I get a vague, generic, slightly wrong answer. When I go back and read what I actually typed, it is usually something like *"why is this not working?"* followed by a pasted error and nothing else. A human colleague would have asked me five questions before answering. The AI, being polite and eager to help, just guessed.

The good news is that this is fixable, and the fix is not "prompt engineering" in the mystical sense. There are no magic words, just a handful of habits, the same ones that make you good at asking questions on a team. This post covers the patterns I keep coming back to for three jobs: **debugging**, **reviewing** and **learning**.

## The mental model: a brilliant colleague who just walked in

Imagine a very capable engineer who has just joined your project. They read fast, they have seen a huge amount of code, and they never get tired. But they know nothing about *your* system. They do not know your goal, your constraints, what you already tried, or what "done" looks like.

If you stop them in the corridor and say "why is it slow?", you will get a lecture about performance in general. If you sit them down and explain the situation, you will get a useful answer.

That is the whole idea. The quality of the answer is limited by the quality of the context you provide. Everything below is a way of providing better context with less effort.

Four ingredients cover almost every good question:

1. **Goal:** what are you actually trying to achieve?
2. **Context:** what is the situation (language, versions, environment, what the code does)?
3. **Constraints:** what must be true (no new dependencies, must run on Java 21, can't change the schema)?
4. **Output:** what should the answer look like (a diff, a short list, an explanation for a beginner)?

Here is the same request, before and after:

```text title="before.txt"
Why is my API slow?
```

```text title="after.txt"
Goal: find why the /orders endpoint takes ~2s under light load.
Context: Spring Boot 3, PostgreSQL, about 50k rows in orders.
The endpoint loads an order with its items and returns JSON.
I already checked: CPU is low, the database is local.
Constraint: I can't change the API response shape.
Output: a ranked list of the 3 most likely causes, and for each
one a quick way to confirm or rule it out.
```

The second version takes thirty seconds longer to write and saves ten minutes of back and forth. It also gets a better answer because it contains a hypothesis space, a boundary and a format.

> [!TIP]
> If you only remember one thing, remember this: **say what you are trying to achieve, not just what you are stuck on.** The goal lets the AI suggest a better approach, not just fix the one you picked.

## Pattern 1: Start with the goal, not the attempt

There is a classic trap in technical questions, sometimes called the XY problem. You want to do X, you decide Y is the way, you get stuck on Y, and you ask about Y. People (and AIs) then spend an hour helping you with Y when X had a much simpler solution.

Compare:

- *"How do I extract the last three characters of a string in a bash variable?"*
- *"I need to get the file extension from a filename in bash. I was going to take the last three characters, but that breaks for `.jpeg`. What's a robust way?"*

The first question gets you a clever slicing trick. The second gets you `${filename##*.}`, which is what you actually needed. Giving the goal is cheap and it lets the AI challenge your approach instead of obediently polishing it.

## Pattern 2: Show, don't describe

Describing code in words loses information. Pasting the real thing keeps it.

When something is broken, include:

- the **exact error message** or unexpected output, copied, not paraphrased
- the **smallest piece of code** that reproduces it
- **versions** of the language, framework and anything relevant
- **what you expected** versus **what happened**

The "smallest piece of code" part matters more than it looks. Trimming a problem down to a minimal example is a debugging technique in its own right. Half the time, the act of cutting it down shows you the bug before you even send the question.

> [!WARNING]
> Before pasting anything, scan it for secrets: API keys, tokens, passwords, internal hostnames, customer data. Treat a chat window like any third-party service. If you would not post it in a public issue tracker, redact it or replace it with a placeholder like `<API_KEY>`. This one is non-negotiable, especially if you work in security.

## Pattern 3: Constrain the answer

Left alone, an AI will often give you a long, balanced, slightly padded answer. Telling it the shape you want makes a big difference.

Useful constraints I reach for:

- **Length and format:** "Answer in five bullets." "Give me only the diff." "Table with columns: option, pros, cons."
- **Audience:** "Explain it to someone who knows Python but has never used async."
- **Assumptions:** "List any assumptions you're making before answering." This is one of my favourites, because it exposes the places the answer might not fit your situation.

The "tell me which you'd choose" part is important. Without it you tend to get a neutral list of options and no judgement, which pushes the thinking back onto you.

## Debugging patterns

Debugging is where good questions pay off most, because the cost of a wrong guess is wasted time.

### Ask for ranked hypotheses, not a single fix

The worst debugging answer is a confident, single fix for a problem the AI cannot actually see. Instead, ask for hypotheses:

```text title="debug-prompt.txt"
Here's the error and the relevant code. Give me the 3 most likely
causes, ranked by probability. For each one, tell me:
- why it would produce this exact symptom
- the fastest check that would confirm or rule it out
Don't suggest a fix yet.
```

"Don't suggest a fix yet" keeps you in control. You run the cheap checks, report back, and narrow things down together. This mirrors how a good debugger works: form hypotheses, test them, eliminate.

### Tell it what you already tried

If you skip this, you will get the same three suggestions you already ruled out. A line like *"I've already restarted the service and checked the logs for exceptions, nothing there"* saves a whole round trip.

### Use it as a rubber duck that talks back

Sometimes I do not know what the problem is well enough to describe it. In that case I flip the roles:

```text title="rubber-duck.txt"
I'm stuck on a bug and I'm not sure I understand the problem.
Ask me questions one at a time to help me figure out what's going on.
Start with the most useful one.
```

Being questioned one step at a time often surfaces the missing piece: the thing I assumed but never verified.

### Ask how to verify, not just what to change

A fix you cannot verify is a guess. After any suggested fix, I ask: *"How would I confirm this actually fixed the root cause, and not just hid the symptom?"* That one question catches a lot of patches that silence an error without solving it.

## Reviewing patterns

AI is a good second pair of eyes for code, as long as you tell it what to look for. A bare "review this" produces a polite summary and a few style nits.

### Give it a role and explicit criteria

```text title="review-prompt.txt"
Review this change as a careful senior engineer.
Focus on, in this order:
1. Correctness: logic errors, edge cases, off-by-one, null handling
2. Security: injection, authorisation, unsafe input handling
3. Failure modes: what happens when a dependency is slow or down
4. Readability: only if it genuinely hurts maintainability
Rank findings by severity. For each, quote the line and explain
the impact in one sentence. If something is fine, don't mention it.
```

Notice the last line. "If something is fine, don't mention it" cuts the noise dramatically. And ranking by severity means you read the important findings first.

### Ask it to argue against the change

A review prompt that only asks "is this good?" invites agreement. These work better:

- *"Give me three reasons this change should not be merged."*
- *"What is the most likely way this breaks in production?"*
- *"What test would you write that I probably haven't?"*

Asking for the case against the code forces a more critical read. Models tend to agree with whatever frame you give them, so give them a frame that finds problems.

> [!IMPORTANT]
> Treat AI review findings as leads, not verdicts. It will occasionally invent a bug that is not there and miss one that is. Always verify a finding by reading the code or writing a test before acting on it.

## Learning patterns

Used well, AI is a patient tutor. Used badly, it is a machine that gives you plausible-sounding answers you never really absorb. The difference is whether you make yourself do some of the work.

### Set the level

Say who you are: *"I'm comfortable with Java but new to reactive programming."* Without that, the answer is pitched at no one in particular.

### Ask for an analogy, then ask where it breaks

Analogies make ideas stick, but they are always slightly wrong. So I ask for one and then follow up: *"Where does this analogy fail?"* The breaking point is often where the real understanding lives.

### Make it quiz you

After an explanation, try:

```text title="learn-prompt.txt"
Now test me. Ask me three questions about what you just explained,
one at a time, starting easy. Wait for my answer before giving
feedback. Tell me what I got wrong and why.
```

Retrieval, pulling an answer out of your own head, is far more effective than rereading an explanation. Letting the AI run the quiz makes that effortless.

### Compare, then decide

When choosing between two ideas, ask for a side-by-side comparison first, then ask which one fits your specific situation, and when you would pick the other. Facts turn into a decision, and you see the limits of your choice.

## Habits that apply everywhere

A few meta-habits improve every kind of question.

**Iterate, don't restart.** Treat the first answer as a draft. Follow up with "shorter", "more concrete", "that doesn't match my version, which is 3.12". Conversation is the interface.

**Ask what it is unsure about.** *"What parts of this answer are you least confident in?"* surfaces the guesses. Models can be most fluent exactly when they are most wrong, so this is a useful safety net.

**Run the code.** Always. A suggestion that compiles in the AI's imagination is not the same as one that runs on your machine. Tests, type checks and a quick manual run are your ground truth.

## A reusable template

When I am not sure how to phrase something, I fall back on this skeleton and delete the parts I do not need:

```text title="template.txt"
Goal: <what I'm trying to achieve>
Context: <language, versions, what the code does, what I've tried>
Problem: <the exact error or unexpected behaviour>
Constraints: <what must stay true>
Output: <format, length, level of detail>
Before answering, list any assumptions you're making.
```

It is not a spell. It is a checklist that stops me from sending a half-formed question.

## Closing thoughts

The pattern behind all of this is simple. Slow down for thirty seconds before you press enter. Say what you want, give the context a colleague would need, tell it the shape of the answer, and plan how you will check the result.

That small pause is where the time savings come from. A good question gets a good answer the first time, and, just as importantly, it keeps you in the driver's seat: you are thinking, the AI is accelerating, and you are the one deciding what is true.
