---
title: "Intro To C : Part II (Variables)"
date: 2021-07-04 13:39:50 +0530
categories: [Languages,C]
tags: [Languages]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN4.jpg?raw=true)

This is the second post in the series [Intro To C](https://www.sahilsinghrawat.com/posts/INTRO-TO-C-I/) In the last post we introduced C language while going through a demo HelloWorld program and how to compile and build a C program.

In this article, we will learn about Variables and Statements in the C language

## Variable and statements

It’s said that “variables hold values”. But another way to think about it is that a variable is a human-readable name that refers to some data in memory.

You can think of memory as a big array of bytes, Data is stored in this “array”. If the data to be stored is larger than a single byte, it is stored in multiple bytes.
Because memory is like an array, each byte of memory can be referred to by its index. This index into memory is also called an *address*, or a *location*, or a *pointer*.

When you have a variable in C, the value of that variable is in memory *somewhere*, at some address. But it’s a pain to refer to a value by its numeric address because the address is somewhat `“0x7ffda2546fc4”` and remembering it is difficult but if we could reference the same by a string like `name = “sahil”` that would be easier, so we make a name for it instead, and that’s what the variable is.

So a variable is a name for some data that are stored in memory at some address.

You can use any characters in the range 0-9, A-Z, a-z, and underscore for variable names, with the following rules:

- You can’t start a variable with a digit 0-9.
- You can’t start a variable name with two underscores.
- You can’t start a variable name with an underscore followed by a capital A-Z.

### Variable Types

Depending on which languages you already work with, you might or might not be familiar with the idea of types. But still starting with a quick refresher on types.

Some example types:

|Type|Example|C Type|
|-|-|-|
|Integer|3410, 123, -1|int|
|Floating Point|1.2, 3.14, -11.345|float|
|Character(Single)|'a', 's', '$'|char|
|Stirng|“Hello World!”|char|

C makes an effort to convert automatically between most numeric types when you ask it to. But other than that, all conversions are manual, notably between string and numeric.

Almost all of the types in C are variants of these types. Before using a variable, we have to *declare* that variable and tell C what type the variable holds. Once we declared, the type of a variable we cannot change it later at runtime. What you set it to is what it is until it falls out of scope.

Let’s take our previous [“HelloWorld”](https://www.sahilsinghrawat.com/posts/INTRO-TO-C-I/) code from last post and add a couple variables to it:

```c
#include <stdio.h>

int main(void)
{
  int i; /* holds signed integers, e.g. -3, -2, 0, 1, 10 */
  float f; /* holds signed floating point numbers, e.g. -3.1416 */
  printf("Hello, World!\n");
}
```

We’ve declared a couple of variables. We haven’t used them yet, and they’re both uninitialized. One holds an integer number, and the other holds a floating-point number.

Uninitialized variables have indeterminate values. They have to be initialized or else you must assume they contain some nonsense number.

This is one of the places C can “get you”. Much of the time, the indeterminate value is zero... but it can vary from run to run! Never assume the value will be zero, even if you see it is. *Always* explicitly initialize variables to some value before you use them!

Let’s go ahead and do that:

```c
int main(void)
{
  int i;
  i = 2; // Assign the value 2 into the variable i
 
  printf("Hello, World!\n");
}
```

We’ve stored a value. Let’s print it.

We’re going to do that by passing *two* amazing parameters to the printf() function. The first argument is a string that describes what to print and how to print it (called the *format string*), and the second is the value to print, namely whatever is in the variable i.

printf() check through the format string for a variety of special sequences which start with a percent sign (%) that tells it what to print. For example, if it finds a %d, it looks to the next parameter that was passed and prints it out as an integer. If it finds a %f, it prints the value out as a float. If it finds a %s, it prints a string, and so on.

As such, we can print out the value of various types like so:

```c
int main(void)
{
  int i = 2;
  float f = 3.14;
  char *s = "Hello, world!"; // char * ("char pointer") is the string type

  printf("%s i = %d and f = %f!\n", s, i, f);
}
```

And the output will be:

```bash
Hello, world! i = 2 and f = 3.14!
```

In this way, printf() might be similar to various types of format or parameterized strings in other languages you’re familiar with.

Historically, C didn’t have a Boolean type, In C, 0 means “false”, and non-zero means “true”. So 1 is true. And 37 is true. And 0 is false. You can just declare Boolean types as ints:

```c
int x = 1;
if (x) {
    printf("x is true!\n");
}
```

If you #include \<stdbool.h\>, you also get access to some symbolic names that might make things look more familiar, namely a bool type and true and false values:

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool x = true;
    if (x) {
        printf("x is true!\n");
    }
}
```

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
