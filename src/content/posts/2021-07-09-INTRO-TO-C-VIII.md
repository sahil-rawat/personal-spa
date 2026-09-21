---
title: "Intro To C : Part VIII (Strings)"
date: 2021-07-09 13:39:50 +0530
categories: [Languages,C]
tags: [Languages]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN3.jpg?raw=true)

This is the eighth post in the series [Intro To C](https://www.sahilsinghrawat.com/posts/INTRO-TO-C-I/) In the last post we learned Arrays

In this article, we will learn about Strings

## Strings

Well, turns out strings aren’t strings in C. That’s right! They’re pointers! Much like arrays, strings in C *barely exist*.

### Constant Strings

Before we start, let’s talk about constant strings in C. These are sequences of characters in *double* quotes (").

Examples:

```
"Hello, world!\n"
"This is a test."
"To use quotes inside a string we need to it escape them, \" like so.\" "
```

The first one has a newline at the end quite a common thing to see.

The last one has quotes embedded within it, but you see each is preceded by (we say “escaped by”) a backslash (\) indicating that a literal quote belongs in the string at this point. This is how the C compiler can tell the difference between printing a double quote and the double quote at the end of the string.

### String Variables

Now that we know how to make a constant string, let’s assign it to a variable so we can do something with it.

```c
 char *s = "Hello, world!";
```

Check out that type: pointer to a char. The string variable s is a pointer to the first character in that string, namely the H. And we can print it with the %s (for “string”) format specifier:

```c
char *s = "Hello, world!";
printf("%s\n", s); // "Hello, world!"
```


### String Variables as Arrays

Another option is this, equivalent to the above char* usage:

```c
char s[14] = "Hello, world!";  

//or 

char s[] = "Hello, world!";
```

This means you can use array notation to access characters in a string. Let’s do exactly that to print all the characters in a string:

```c
#include <stdio.h>

int main(void)
{
    char s[] ="Hello World!";
    for (int i=0;i<13;i++)
    {
        printf("%c\n",s[i])
	}
}
```

Note that we’re using the format specifier %c to print a single character.

Also, check this out. The program will still work fine if we change the definition of s to be a char* type:

```c
#include <stdio.h>

int main(void)
{
    char *s ="Hello World!"
    for (int i=0;i<13;i++)
    {
        printf("%c\n",s[i])
    }
}
```

And we still can use array notation to get the job done when printing it out! 

This is yet another hint that arrays and pointers are the same things, deep down.

### String Initialisers

We’ve already seen some examples with initializing string variables with constant strings:

```c
char *s = "Hello, world!";
char t[] = "Hello, again!";
```

But these two are subtly different. 
The following one is a pointer to a constant string (i.e. a pointer to the first character in a constant string):

```c
char *s = "Hello, world!";

// If you try to mutate it

s[0] = 'z';  // BAD NEWS: tried to mutate a constant string!
```

The behavior is undefined. Probably, depending on your system, a crash will result. 

But declaring it as an array is different. The following one is a non-constant, mutable *copy* of the constant string that we can change.

```c
char t[] = "Hello, again!"; // t is an array copy of the string
t[0] = 'z'; // No problem*
printf("%s\n", t); // "zello, again!"
```

### Getting String Length

C dosen't track the length of the string however, There’s a function in <string.h> called strlen() that can be used to compute the length of any string.

```c
#include <stdio.h>
#include <string.h>

int main(void)
{
	char *s = "Hello, world!";
	
	printf("The string is %zu characters long.\n", strlen(s));
}
```

The strlen() function returns type size_t, which is an integer type so you can use it for integer math. We print size_t with %zu.

So it *is* possible to get the string length!
But... if C doesn’t track the length of the string anywhere, how does it know how long the string is

### String Termination

C does strings a little differently than many programming languages, and differently than almost every modern programming language.

When you’re making a new language, you have two options for storing a string in memory:
1. Store the bytes of the string along with a number indicating the length of the string.
2. Store the bytes of the string, and mark the end of the string with a special byte called the *terminator*.

If you want strings longer than 255 characters, option 1 requires at least two bytes to store the length. Whereas option 2 only requires one byte to terminate the string. So a bit of saving there.

In C, a “string” is defined by two basic characteristics:

- A pointer to the first character in the string.
- A zero-valued byte (or NULL character) somewhere in memory after the pointer that indicates the end of the string

A NULL character can be written in C code as \0, though you don’t often have to do this.
When you include a constant string in your code, the NULL character is automatically, implicitly included

```c
char *s = "Hello!"; // Actually "Hello!\0" behind the scenes
```

So with this in mind, let’s write our strlen() function that counts characters in a string until it finds a NULL.
The procedure is to look down the string for a single NULL character, counting as we go:

```c
int my_strlen(char *s)
{
	int count=0;
	while(s[count]!='\0'){ //Single quotes for single char
	    count++
	    return count
	}
}
```

And that’s basically how the built-in strlen() gets the job done.

### Copying a String

You can’t copy a string through the assignment operator (=). All that does is make a copy of the pointer to the first character... so you end up with two pointers to the same string:

```c
#include <stdio.h>

int main(void)
{
	char s[] = "Hello, world!";
	char *t;
	t=s; // This makes a copy of the pointer, not a copy of the string!

	// We modify t
	t[0]='z'

	printf("%s",s) //zello world!
}

```

If you want to make a copy of a string, you have to copy it a byte at a time but this is made easier with the strcpy() function.

Before you copy the string, make sure you have room to copy it into, i.e. the destination array that’s going to hold the characters needs to be at least as long as the string you’re copying.

```c
#include <stdio.h>
#include <string.h>

int main(void)
{
    char s[] = "Hello, world!";
    char t[100]; // Each char is one byte, so plenty of room

    // This makes a copy of the string!
    strcpy(t, s);

    // We modify t
    t[0] = 'z';
	
    // And s remains unaffected because it's a different string
    printf("%s\n", s); // "Hello, world!"

    // But t has been changed
    printf("%s\n", t); // "zello, world!"*
}
```

Notice with strcpy(), the destination pointer is the first argument, and the source pointer is the second.

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
