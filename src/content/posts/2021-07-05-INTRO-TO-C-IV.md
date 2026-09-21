---
title: "Intro To C : Part IV (Flow Control)"
date: 2021-07-05 13:39:50 +0530
categories: [Languages,C]
tags: [Languages]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN7.jpg?raw=true)

This is the fourth post in the series [Intro To C](https://www.sahilsinghrawat.com/posts/INTRO-TO-C-I/) In the last post we learned about various operators in C Language

In this article, we will learn about Flow Control Statements in the C language

## Flow Control

Booleans are all good, but of course, we’re nowhere if we can’t control program flow. Let’s take a look at several constructs: if, for, while, and do-while.

After something like an if or while statement, you can either put a single statement to be executed, or a block of statements to all be executed in sequence.

Let’s start with a single statement:

```c
if (x == 10) printf("x is 10");

// This is also sometimes written on a separate line.
// Whitespace is largely irrelevant in C it’s not like Python

if(x == 10)
	printf("x is 10\n");

// But what if you want multiple things to happen due to the conditional?
// You can use curly braces to mark a block or compound statement.

if(x == 10) {
	printf("x is 10\n");
	printf("And also this happens when x is 10\n");
}

// It’s a really common style to always use curly braces
// even if they aren’t necessary:

if (x == 10) {
	printf("x is 10\n");
}
```

Some devs feel the code is easier to read and avoids errors like this where things visually look like they’re in the if block, but they aren’t.

```c
// ❌ BAD ERROR EXAMPLE
if (x == 10)
    printf("x is 10\n");
    printf("And also this happens ALWAYS\n"); 

// Surprise!! Unconditional!
```

while and for and the other looping constructs work the same way as the examples above. If you want to do multiple things in a loop or after an if, wrap them up in curly braces.

In other words, the if is going to run the one thing after the if. And that one thing can be a single
statement or a block of statements.

### The if statement

We’ve already been using if for multiple examples, since it’s likely you’ve seen it in a language before, but here’s another:

```c
int i = 10;
if(i > 10) {
	printf("Yes, i is greater than 10.\n");
	printf("And this will also print if i is greater than 10.\n");
}

if (i <= 10) printf("i is less than or equal to 10.\n");
```

In the example code, the message will print if i is greater than 10, otherwise, execution continues to the next line. Notice the curly braces after the if statement; if the condition is true, either the first statement or expression right after the if will be executed, or else the collection of code in the curly braces after the if will be executed. This sort of *code block* behavior is common to all statements.

### The while statement

while is your average run-of-the-mill looping construct. Do a thing while a condition expression is true. Let’s do one!

```c
// print the following output:
//
// i is now 0!
// i is now 1!
// [more of the same between 2 and 7]
// i is now 8!
// i is now 9!

i = 0;

while (i < 10) {
	printf("i is now %d!\n", i);
	i++;
}

```

That gets you a basic loop. C also has a for loop which would have been cleaner for that example.
A not uncommon use of while is for infinite loops where you repeat while true:

```c
while (1) {
	printf("1 is always true, so this repeats forever.\n");
}
```

### The do-while statement

So now that we’ve gotten the while statement under control, let’s take a look at its closely related cousin, do-while.
They are basically the same, except if the loop condition is false on the first pass, do-while will execute once, but while won’t execute at all. Let’s see by example:

```c
// using a while statement: 
i = 10;

// this is not executed because i is not less than 10:

while(i < 10) {
	printf("while: i is %d\n", i);
	i++;
}

//using a do-while statement:

i = 10;

// this is executed once, because the loop condition is not checked until
// after the body of the loop runs:

do{
	printf("do-while: i is %d\n", i);
	i++;
}while (i < 10);

printf("All done!\n");
```

Notice that in both cases, the loop condition is false right away. So in the while, the loop fails, and
the following block of code is never executed. With the do-while, however, the condition is checked *after* the block of code executes, so it always executes at least once. In this case, it prints the message, increments i, then the condition fails , and continues to the “All done!” output.

The moral of the story is this: if you want the loop to execute at least once, no matter what the loop condition, use do-while.

All these examples might have been better done with a for loop. Let’s do something less deterministic repeat until a certain random number comes up!

```c
#include <stdio.h> // For printf
#include <stdlib.h> // For rand

int main(void)
{
	int r;
	do { 
		r=rand() % 100; // Get a random number between 0 and 99
		printf("%d\n",r)

	} while (r!=37); // Repeat untill 37 comes up
}
```

### The for statement

Welcome to one of the most popular loops in the world! The for loop! This is a great loop if you know the number of times you want to loop in advance. You could do the same thing using just a while loop, but the for loop can help keep the code cleaner. Here are two pieces of equivalent code note how the for loop is just a more compact representation:

```c
// Print numbers between 0 and 9, inclusive...
// Using a while statement:

i = 0;

while (i < 10) {
	printf("i is %d\n", i);
	i++
}

// Do the exact same thing with a for-loop:

for(i=0;i<10;i++){
	printf("i is %d\n",i);
}
```

That’s right, folks they do the same thing. But you can see how the for statement is a little more compact and easy on the eyes. (JavaScript users will fully appreciate its C origins at this point.)

It’s split into three parts, separated by semicolons. The first is the initialization, the second is the loop condition, and the third is what should happen at the end of the block if the loop condition is true. All three of these parts are optional.

```text
for(initialize things; loop if this is true; do this after each loop)

Note that the loop will not execute even a single time if the loop 
condition starts off false.
```

```c
//You can use the comma operator to do multiple things in each clause of the for loop!

for (i = 0, j = 999; i < 10; i++, j--) {
    printf("%d, %d\n", i, j);
}
```

An empty for will run forever:

```c
for(;;) { // "forever"
    printf("I will print this again and again and again\n" );
    printf("for all eternity until the cold-death of the universe.\n");
}
```

### The switch Statement

Depending on what languages you’re coming from, you might or might not be familiar with switch, or C’s version might even be more restrictive than you’re used to. This is a statement that allows you to take a variety of actions depending on the value of an integer expression.

It evaluates an expression to an integer value, jumps to the case that corresponds to that value. Execution resumes from that point. If a break statement is encountered, then execution jumps out of the switch.

Let’s do an example where the user enters a number of goats and we print out a gut-feel of how many goats that is.

```c
#include <stdio.h>

int main(void)
{
	int goat_count;
	printf("Enter a goat count: ");
	scanf("%d", &goat_count); // Read an integer from the keyboard
	switch (goat_count) {
		case 0:
			printf("You have no goats.\n");
			break;
		case 1:
			printf("You have a singular goat.\n");
			break;
		case 2:
			printf("You have a brace of goats.\n");
			break;
		default:
			printf("You have a bona fide plethora of goats!\n");
			break;
	}
}
```

In that example, if the user enters, say, 2, the switch will jump to case 2 and execute from there. When (if) it hits a break, it jumps out of the switch.

Also, you might see that default label there at the bottom. This is what happens when no cases match. Every case, including default, is optional. And they can occur in any order, but it’s typical for default, if any, to be listed last.
So the whole thing acts like an if-else cascade:

```c
if (goat_count == 0)
    printf("You have no goats.\n");

else if (goat_count == 1)
    printf("You have a singular goat.\n");

else if (goat_count == 2)
    printf("You have a brace of goats.\n");

else
    printf("You have a bona fide plethora of goats!\n");
```

With some key differences:

- switch is often faster to jump to the correct code (though the spec makes no such guarantee).
- if-else can do things like relational conditionals like < and >= and floating point and other types, while switch cannot.

There’s one more neat thing about switch that you sometimes see that is quite interesting: *fall through*.
Remember how break causes us to jump out of the switch?
Well, what happens if we *don’t* break?
Turns out we just keep on going into the next case! Demo!

```c
switch (x) {
	case 1:            
		printf("1\n");
		// fall through!
	case 2:
		printf("2\n");
		break;
	case 3:
		printf("3\n");
		break;
}
```

If x == 1, this switch will first hit case 1, it’ll print the 1, but then it just continues  to the next line
of code... which prints 2!

And then, at last, we hit a break so we jump out of the switch.

if x == 2, then we just it the case 2, print 2, and break as normal. Not having a break is called *fall through*.

ProTip: *ALWAYS* put a comment in the code where you intend to fall through as like I did above. It will
save other programmers from wondering if you meant to do that.

This is one of the common places to introduce bugs in C programs: forgetting to put a break in your case. You gotta do it if you don’t want to just roll into the next case.

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
