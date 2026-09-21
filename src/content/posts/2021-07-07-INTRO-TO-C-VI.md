---
title: "Intro To C : Part VI (Pointers)"
date: 2021-07-07 13:39:50 +0530
categories: [Languages,C]
tags: [Languages]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN7.jpg?raw=true)

This is the sixth post in the series [Intro To C](https://www.sahilsinghrawat.com/posts/INTRO-TO-C-I/) In the last post we learned about Flow Control Statements

In this article, we will learn about Pointers

## Pointers 👉🏻

Pointers are one of the most feared things in the C language. They are the one thing that makes this language challenging at all. But why?

Because they can cause huge headaches if you don't know what you're doing when you try to mess with them.

Depending on what language you came from, you might already understand the concept of *references*, where a variable refers to an object of some type.

This is very much the same, except we have to be more explicit with C about when we're talking about the reference or the thing it refers to.

### Memory and Variables

Computer memory holds data of all kinds, right? It'll hold floats, ints, or whatever you have. 

To make memory easy to cope with, each byte of memory is identified by an integer. These integers increase sequentially as you move up through memory. You can think of it as a bunch of numbered boxes, where each box holds a byte of data. Or like a big array where each element holds a byte if you come from a language with arrays. The number that represents each box is called its *address*.

Now, not all data types use just a byte. For instance, an int is often four bytes, as is a float, but it depends on the system. You can use the sizeof operator to determine how many bytes of memory a certain type uses.

When you have a data type that uses more than a byte of memory, the bytes that make up the data are always adjacent to one another in memory. Sometimes they're in order, and sometimes they're not, but that's platform-dependent, and often taken care of for you without you needing to worry about byte orderings.

`A pointer is a variable that holds an address.`

They are the address of data. Just like an int variable can hold the value 12, a pointer variable can hold the address of data.

So if we have an int, say, and we want a pointer to it, what we want is some way to get the address of that int, right? After all, the pointer just holds the *address of* the data. What operator do you suppose we'd use to find the *address of* the int?

We use the address-of operator (which happens to be an ampersand: “&”) to find the address of the data.

So for a quick example, we'll introduce a new *format specifier* for printf() so you can print a pointer. You know already how %d prints a decimal integer, yes? 

Well, %p prints a pointer. Now, this pointer is going to look like a garbage number (and it might be printed in hexadecimal instead of a decimal), but it is merely the index into memory the data is stored in. (Or the index into memory that the first byte of data is stored in, if the data is multi-byte.) 

In virtually all circumstances, including this one, the actual value of the number printed is unimportant to you, and I show it here only for demonstration of the address-of operator.

```c
#include <stdio.h>

int main(void)
{
	int i = 10;
	printf("The value of i is %d, and its address is %p\n", i, &i);
}
```

On my computer, this prints:

```text 
The value of i is 10, and its address is 0x7ffda2546fc4
```

If you're curious, that hexadecimal number is the index into memory where the variable i's data is stored. It's the address of i. It's the location of i. It's a pointer to i.

It's a pointer because it lets you know where i is in memory.

Again, we don't care what the address's exact number is, generally. We just care that it's a pointer to i.

That is base 16 with digits 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, and F.

### Pointer Types

You can identify the *pointer type* because there's an asterisk (*) before the variable name and after its type:

```c
int main(void)
{
    int i; // i's type is "int"
    int *p; // p's type is "pointer to an int", or "int-pointer"
}
```

So we have here a variable that is a pointer itself, and it can point to other ints. 
That is, it can hold the address of other ints. 

We know it points to ints since it's of type int* 

When you do an assignment into a pointer variable, the type of the right-hand side of the assignment has to be the same type as the pointer variable. Fortunately for us, when you take the address-of a variable, the resultant type is a pointer to that variable type, so assignments like the following are perfect:

```c
int i;
int *p; // p is a pointer, but is uninitialized and points to garbage
p = &i; // p is assigned the address of i --> p now "points to" i
```

On the left of the assignment, we have a variable of type pointer-to-int (int*), and on the right side, we have the expression of type pointer-to-int since i is an int (because address-of int gives you a pointer to int). The address of a thing can be stored in a pointer to that thing.

let's introduce you to the anti-address-of, operator.

### Dereferencing

A pointer variable can be thought of as *referring* to another variable by pointing to it. You'll rarely hear anyone in C land talking about “referring” or “references”, but I bring it up just so that the name of this operator will make a little more sense.

When you have a pointer to a variable (roughly “a reference to a variable”), you can use the original variable through the pointer by *dereferencing* the pointer. (You can think of this as “depointering” the pointer, but no one ever says “depointering”.)

What do I mean by “get access to the original variable”? Well, if you have a variable called i, and you have a pointer to i called p, you can use the dereferenced pointer p *exactly as if it were the original variable i*

What is the dereference operator? It is the asterisk, again: *. Now, don't get this confused with the asterisk you used in the pointer declaration, earlier. They are the same character, but they have different meanings in different contexts.

```c
#include <stdio.h>

int main(void)
{
    int i;
    int *p; // this is NOT a dereference--> this is a type "int*" p=&i; 
    
    p=&i    // p now points to i,p holds the address of i
    
    i=10;  //i is now 10
    *p=20; // i(yesi!) is now 20!!

    printf("i is %d\n", i); // prints "20"
    printf("i is %d\n", *p); // "20"! dereference-p is the same as i!
}
```

Remember that p holds the address of i, as you can see where we did the assignment to p on line 8. What the dereference operator does is tells the computer to *use the object the pointer points to* instead of using the pointer itself. In this way, we have turned *p into an alias of sorts for i.

Great, but *why*? Why do any of this?

### Passing Pointers as Parameters

What use is *p if you could just simply say i instead?

Well, the real power of pointers comes into play when you start passing them to functions. Why is this a big deal? You might recall from before that you could pass all kinds of parameters to functions and they'd be dutifully copied onto the stack, and then you could manipulate local copies of those variables from within the function, and then you could return a single value.

What if you wanted to bring back more than one single piece of data from the function? I mean, you can only return one thing.

What happens when you pass a pointer as a parameter to a function? Does a copy of the pointer get put on the stack? Yes, it does, The function will get a copy of the pointer.

But, and this is the clever part: we will have set up the pointer in advance to point at a variable...and then the function can dereference its copy of the pointer to get back to the original variable! The function can't see the variable itself, but it can certainly dereference a pointer to that variable!

Example!

```c
#include <stdio.h>

void increment(int *p) // note that it accepts a pointer to an int*
{
	*p = *p + 1;
}

int main(void)
{
	int i = 10;
	int *j = &i; // note the address-of; turns it into a pointer to i

	// add one to the thing p points to
	
	printf("i is %d\n", i); // prints "10"
	printf("i is also %d\n", *j); // prints "10"

	increment(j); // j is an int* --> to i

	printf("i is %d\n", i); // prints "11"!
}
```

There are a couple of things to see here...not the least of which is that the increment() function takes an int* as a parameter. We pass it an int* in the call by changing the int variable i to an int* using the address-of operator. (Remember, a pointer holds an address, so we make pointers to variables by running them through the address-of operator.)

The increment() function gets a copy of the pointer on the stack. Both the original pointer j (in main()) and the copy of that pointer p (the parameter in increment()) point to the same address, namely the one holding the value i. (Again, by analogy, like two pieces of paper with the same home address written on them.) Dereferencing either will allow you to modify the original variable i! The function can modify a variable in another scope! Rock on!

The above example is often more concisely written in the call just by using address-of right in the argument list:

```c
printf("i is %d\n", i); // prints "10"

increment(&i);

printf("i is %d\n", i); // prints "11"!
```

Pointer enthusiasts will recall from early on in the guide, we used a function to read from the keyboard, scanf().

In Switch example, scanf(“%d”, &goat_count); 

...and, although you might not have recognized it at the time, we used the address-of to pass a pointer to a value to scanf(). We had to pass a pointer, see because scanf() reads from the keyboard (typically) and stores the result in a variable. The only way it can see that variable that is local to that calling function is if we pass a pointer to that variable:

```c
int i = 0;
scanf("%d", &i); // pretend you typed "1337"
printf("i is %d\n", i); // prints "i is 1337"
```

See, scanf() dereferences the pointer we pass it to modify the variable it points to.

### The NULL Pointer

Any pointer variable of any pointer type can be set to a special value called NULL. This indicates that this pointer doesn't point to anything.

```c
int *p;
p = NULL;
```

Since it doesn't point to a value, dereferencing it is undefined behavior, and probably will result in a crash:

```c
int *p = NULL;
*p = 12; // CRASH or SOMETHING PROBABLY BAD. BEST AVOIDED.
```

### A Note on Declaring Pointers

The syntax for declaring a pointer can get a little weird. Let's look at this example:

```c
int a;
int b;

// We can condense that into a single line, right?

int a, b; // Same thing

// So a and b are both ints. No problem.
// But what about this?

int a;
int *p;

//The rule is that the * goes in front of any variable that is a pointer type. 
//That is. the * is not part of the int in this example 
//it is the part of variable p with that in mind we can write this:

int a, *p; //Same thing

//It's important to note that the following line does not declare two pointers:

int *p,q; //p is a pointer to an int, q is just an int.

//The following line is functionally identical to the one above.

int* p,q; //p is a pointer to an int; q is just an int.
```

### sizeof and Pointers

Just a little bit of syntax here that might be confusing and you might see from time to time.
Recall that sizeof operates on the *type* of the expression.

```c
int *p;
sizeof int; // Returns size of an `int`
sizeof p // p is type int*, so returns size of `int*`
sizeof *p // *p is type int, so returns size of `int`
```

You might see code with that last sizeof in there. Just remember that sizeof is all about the type of the exp

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
