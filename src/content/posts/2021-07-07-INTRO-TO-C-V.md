---
title: "Intro To C : Part V (Functions)"
date: 2021-07-07 13:39:50 +0530
categories: [Languages,C]
tags: [Languages]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN3.jpg?raw=true)

This is the fifth post in the series [Intro To C](https://www.sahilsinghrawat.com/posts/INTRO-TO-C-I/) In the last post we learned about Flow Control Statements

In this article, we will learn a little bit about Functions

## Functions

Very much like other languages, you’re used to, C has the concept of *functions*.
Functions can accept a variety of *arguments* and return a value. One important thing, though: the arguments and return value types are predeclared.

Let’s take a look at a function. This is a function that takes an int as an argument and returns an int.

```c
int plus_1337(int n) // The "definition"
{
	return n + 1337;
}
```

The int before the plus_1337 indicates the return type.
The int n indicates that this function takes one int argument, stored in *parameter* n.

Continuing the program down into main(), we can see the call to the function, where we assign the return value into local variable j:

```c
int main(void){

	int i = 10 , j;
	j = plus_one(i); // The function "call"

	printf("i + 1 is %d\n", j);
}
```

Notice that I defined the function before I used it. If hadn’t done that, the compiler wouldn’t know about it yet when it compiles main() and it would have given an unknown function call error. There is a more proper way to do the above code with *function prototypes*, but we’ll talk about that later.

Also, notice that main() is a function! It returns an int.

But what’s this void thing? This is a keyword that’s used to indicate that the function accepts no arguments.

You can also return void to indicate that you don’t return a value:

```c
// This function takes no parameters and returns no value:

void hello(void)
{
	printf("Hello, world!\n");
}

int main(void)
{
	hello(); // Prints "Hello, world!"
}

```

### Passing by Value

When you pass a value to a function, *a copy of that value* gets made in this magical mystery world known as *the stack*. (The stack is just a hunk of memory somewhere that the program allocates memory on. Some of the stack is used to hold the copies of values that are passed to functions.)

For now, the important part is that *a copy* of the variable or value is being passed to the function. The practical upshot of this is that since the function is operating on a copy of the value, you can’t affect the value back in the calling function directly. Like if you wanted to increment a value by one, this would NOT work:

```c
void increment(int a)
{
	a++
}

int main(void)
{
	int i=10;
	increment(i);
}
```

You might somewhat sensibly think that the value of i after the call would be 11, since that’s what the ++ does, right? This would be incorrect. What is  happening here?

Well, when you pass i to the increment() function, a copy gets made on the stack, right? It’s the copy that increment() works on, not the original; the original i is unaffected. We even gave the copy a name “a”, It’s right there in the parameter list of the function definition. So we increment “a”, sure enough, but what good does that do us out in main()? 

That’s why in the previous example with the plus_1337() function, we returned the locally modified value so that we could see it again in main(). Seems a little bit restrictive, Like you can only get one piece of data back from a function, is what you’re thinking. 

There is, however, another way to get data back; C folks call it *passing by reference*. But no fancy name will distract you from the fact that *EVERYTHING* you pass to a function *WITH-OUT EXCEPTION* is copied onto the stack and the function operates on that local copy, *NO MATTER WHAT*. Remember that, even when we’re talking about this so-called passing by reference.

### Function Prototype

So if you recall back in the ice age a few sections ago, I mentioned that you had to define the function before you used it, otherwise the compiler wouldn’t know about it ahead of time, and would bomb out with an error.

This isn’t quite strictly true. You can notify the compiler in advance that you’ll be using a function of a certain type that has a certain parameter list and that way the function can be defined anywhere at all, as long as the *function prototype* has been declared first.

Fortunately, the function prototype is really quite easy. It’s merely a copy of the first line of the function definition with a semicolon tacked on the end for good measure. For example, this code calls a function that is defined later, because a prototype has been declared first:

```c
int foo(void);

int main(void)
{
    int i;
    i = foo()
}

int foo(void)
{
	return 1337
}
```

You might notice something about the sample code we’ve been using...that is, we’ve been using the good old printf() function without defining it or declaring a prototype! There is a prototype; it’s in that header file stdio.h that we included with #include.

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
