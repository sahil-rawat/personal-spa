---
title: "Intro To C : Part III (Operators)"
date: 2021-07-04 13:39:50 +0530
categories: [Languages,C]
tags: [Languages]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN5.jpg?raw=true)

This is the third post in the series [Intro To C](https://www.sahilsinghrawat.com/posts/INTRO-TO-C-I/) In the last post we peeked into variables and data types in C language.

In this article, we will learn about Operators and Expressions in the C language

## Operators and Expressions

Following are various operators that are commonly used in C Language:

### The sizeof Operator 📏

This operator tells you the size (in bytes) that a particular variable or data type uses in memory.

More particularly, it tells you the size (in bytes) that the *type of a particular expression* (which might be just a single variable) uses in memory.

This can be different on different systems, except for char (which is always 1 byte). And this might not seem very useful now, but we’ll be referring to it here and there, so it’s worth covering.
You can take the sizeof a variable or expression by:

```c
int a = 999       
// %zu is the format specifier for type size_t ("t" is for "type", but
// it's pronounced "size tee"), which is what is returned by sizeof.
// More on size_t later.

printf("%zu", sizeof a);       // Prints 4 on my system
printf("%zu", sizeof (2 + 7)); // Prints 4 on my system
printf("%zu", sizeof 3.14);    // Prints 8 on my system
```

> Remember: it’s the size in bytes of the *type* of the expression, not the size of the expression itself. That’s why the size of 2+7 is the same as the size of variable “a” they’re both type int. Also, you can simply use the sizeof operator to find the bytes that a particular data type uses in memory

```c
printf("%zu", sizeof(int));  // Prints 4 on my system
printf("%zu", sizeof(char)); // Prints 1 on all systems
```

It’s important to note that sizeof is a *compile-time* operation. The result of the expression is determined entirely at the time of compilation, not at runtime.

### Arithmetic

Hopefully these are familiar:

```c
i = i + 3; // addition (+) and assignment (=) operators, add 3 to i
i = i - 8; // subtraction, subtract 8 from i
i = i * 9; // multiplication
i = i / 2; // division
i = i % 5; // modulo (division remainder)
```

There are shorthand variants for all of the above. Each of those lines could more tersely be written as: Except for with variable length arrays—but that’s a story for another time.

```c
i+=3; // Same as "i=i+3",add 3 to i
i-=8; // Same as "i=i-8"
i*=9; // Same as "i=i*9"
i/=2; // Same as "i=i/2"
i%=5; // Same as "i=i%5"
```

There is no exponentiation. You’ll have to use one of the pow() function variants from **“math.h”**. Let’s get into some of the weirder stuff you might not have in your other languages!

### Ternary Operator

C also includes the *ternary operator*. This is an expression whose value depends on the result of a conditional embedded in it.

```c
// If x > 10, add 17 to y. Otherwise add 37 to y.

y += x > 10? 17: 37;

```

You’ll get used to it the more you read it. To help out a bit, lets rewrite the above expression

using if statements:

```c
// This expression:
   
y += x > 10? 17: 37;

// is equivalent to this non-expression:

if (x > 10)
	y += 17;
else
	y += 37;

//Or, another example that prints if a number stored in x is odd or even:

printf("The number %d is %s.\n", x, x % 2 == 0?"even": "odd")

```

The %s format specifier in printf() means to print a string. If the expression x % 2 evaluates to 0, the value of the entire ternary expression evaluates to the string “even”. Otherwise, it evaluates to the string “odd”.

It’s important to note that the ternary operator isn’t flow control like the if statement is. It’s just an expression that evaluates to a value.

### Pre-and-Post Increment-and-Decrement

These are the legendary post-increment and post-decrement operators:

```c
i++; // Add one to i (post-increment)
i--; // Subtract one from i (post-decrement)

// Very commonly, these are just used as shorter versions of:

i += 1; // Add one to i
i -= 1; // Subtract one from i
```

but they’re more subtly different than that, Let’s take a look at this variant, pre-increment and pre-decrement:

```c
++i; // Add one to i (pre-increment)
--i; // Subtract one from i (pre-decrement)
```

With pre-increment and pre-decrement, the value of the variable is incremented or decremented *before* the expression is evaluated. Then the expression is evaluated with the new value. With post-increment and post-decrement, the value of the expression is first computed with the value as-is, and *then* the value is incremented or decremented after the value of the expression has been determined. You can embed them in expressions, like this:

```c
i = 10;
j = 5 + i++; // Compute 5 + i, then increment i

printf("%d, %d\n", i, j); //Prints 11, 15

// Let’s compare this to the pre-increment operator:

i = 10;
j = 5 + ++i; // Increment i, then compute 5 + i
printf("%d, %d\n", i, j); // Prints 11, 16

```

This technique is used frequently with array and pointer access and manipulation. It gives you a way to use the value in a variable, and also increment or decrement that value before or after it is used. But by far the most commonplace you’ll see this is in a for loop.

### The Comma Operator

This is an uncommonly used way to separated expressions that will run left to right:

```c
x=10,y=20; //First assign 10 to x,then 20 to y

//Seems a bit silly since you could just replace the comma with a semicolon, right?

x=10;y=20; //First assign 10 to x,then 20 to y
```

But that’s a little different. The latter is two separate expressions, while the former is a single expression! 

But even that’s pretty contrived. One common place the comma operator is used is in for loops to do multiple things in each section of the statement:

```c
for(i = 0, j = 10; i < 100; i++, j++)
		printf("%d, %d\n", i, j);
```

### Conditional Operators

For Boolean values, we have a raft of standard operators:

```c
a == b;  // True if a is equivalent to b
a != b;  // True if a is not equivalent to b
a < b;   // True if a is less than b
a > b;   // True if a is greater than b
a <= b;  // True if a is less than or equal to b
a >= b;  // True if a is greater than or equal to b
```

Don’t mix up assignment **“=”** with comparison **“==”** Use two equals to compare, one to assign.
We can use the comparison expressions with if statements:

```c
if (a <= 10)
	printf("Success!\n");

```

### Boolean Operators

We can chain together or alter conditional expressions with Boolean operators for *and*, *or*, and *not*.

|Operator|Meaning|
|-|-|
|“&&”|and|
|“\|\|”|or|
|“!”|not|

```c
// An example of Boolean "and":

if (x < 10 && y > 20)
		printf("Doing something!\n");

// An example of Boolean "not":

if (!(x < 12))
		printf("x is not less than 12\n");

// ! has higher precedence than the other Boolean operators, 
// so we have to use parentheses in that case. Its same as:

if (x >= 12)
	printf("x is not less than 12\n");

```

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
