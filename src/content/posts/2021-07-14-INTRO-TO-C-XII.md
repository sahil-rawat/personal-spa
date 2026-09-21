---
title: "Intro To C : Part XII (Pointers Arithmetic)"
date: 2021-07-14 13:39:50 +0530
categories: [Languages,C]
tags: [Languages]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN.jpg?raw=true)

This is the tweltfh post in the series [Intro To C](https://www.sahilsinghrawat.com/posts/INTRO-TO-C-I/) In the last post we learned typedef

In this article, we will learn about Pointers Arithmetic

## Pointers Arithmetic

Turns out you can do math on pointers, notably addition and subtraction.

In short, if you have a pointer to a type, adding one to the pointer moves to the next item of that type directly after it in memory.

It’s **important** to remember that as we move pointers around and look at different places in memory, we need to make sure that we’re always pointing to a valid place in memory before we dereference. If we’re off in the weeds and we try to see what’s there, the behavior is undefined and a crash is a common result.


### Adding to Pointers

First, let’s take an array of numbers.

```c
int a[5] = {11, 22, 33, 44, 55};
// Then let’s get a pointer to the first element in that array:
int *p=a
//Lets print the value by dereferencing the pointer

printf("%d\n",*p) //prints 11
//Now lets use pointer arithmetic to print the next element in the array, the index at one
printf("%d\n",*(p+1)) // prints 22
 
```

C knows that p is a pointer to an int. So it knows the sizeof an int and it knows to skip that many bytes to get to the next int after the first one! The prior example could be written these two equivalent ways:

```c
printf("%d\n", *p); // Prints 11
printf("%d\n", *(p + 0)); // Prints 11
```

because adding 0 to a pointer results in the same pointer.

We can iterate over elements of an array this way instead of using an array:

```c
int a[5] = {11, 22, 33, 44, 55};
int *p=a
for(int i=0;i<5;i++){
	printf("%d\n",*(p+i))
}
```

And that works the same as if we used array notation! Getting closer to that array/pointer equivalence thing! 

But what’s happening, here? How does it work?
Remember from early on that memory is like a big array, where a byte is stored at each array index.

So a point is an index into memory, somewhere.

For a random example, say that a number 3490 was stored at address (“index”) `23,237,489,202`. If we have an int pointer to that 3490, that value of that pointer is `23,237,489,202`... because the pointer is the memory address. Different words for the same thing.

And now let’s say we have another number, 4096, stored right after the 3490 at address `23,237,489,210` (8 higher than the 3490 because each int in this example is 8 bytes long).

If we add 1 to that pointer, it jumps ahead sizeof(int) bytes to the next int. It knows to jump that far ahead because it’s an int pointer. If it were a float pointer, it’d jump sizeof(float) bytes ahead to get to the next float!

So you can look at the next int, by adding 1 to the pointer, the one after that by adding 2 to the pointer, and so on.

### Changing Pointers

We saw how we could add an integer to a pointer in the previous section. This time, let’s *modify the pointer, itself*.

You can just add (or subtract) integer values directly to (or from) any pointer!

Let’s do that example again, except with a couple of changes.

```c
int a[] = {11, 22, 33, 44, 55, 999}; 
int *p = &a[0]; // p points to the 11

//And we also have p pointing to the element at index 0 of a, 
//namely 11, just like before.

//Now let’s start incrementing p so that it points at subsequent 
//elements of the array.

// We’ll do this until p points to the 999; 
//that is, we’ll do it until *p == 999:

while (*p != 999) {
	printf("%d\n", *p);
	p++;
}
```

When we give it a run, first p points to 11. Then we increment p, and it points to 22, and then again, it points to 33. And so on, until it points to 999 and we quit.

### Subtracting Pointers

You can subtract a value from a pointer to get to an earlier address, as well, just like we were adding to them before.

But we can also subtract two pointers to find the difference between them, For example we can calculate how many ints there are between two int*s. The catch is that this only works within a single array if the pointers point to anything else, you get undefined behavior.

Remember how strings are char*s in C? Let’s see if we can use this to write another variant of strlen() to compute the length of a string that utilizes pointer subtraction.

The idea is that if we have a pointer to the beginning of the string, we can find a pointer to the end of the string by scanning ahead for the NUL character.

And if we have a pointer to the beginning of the string, and we computed the pointer to the end of the string, we can just subtract the two pointers to come up with the length!

```c
#include <stdio.h>

int my_strlen(char *s)
{
	char *p=s;
	while(*p !='\0')
		p++;

	return p-s
}

int main(void)
{
	printf("%d\n",my_strlen("Hello World")); // prints 13
}

```

### Array/Pointer Equivalence

We’re finally ready to talk about this! We’ve seen plenty of examples of places where we’ve intermixed array notation, but let’s give out the *fundamental formula of array/pointer equivalence*:
`a[b] == *(a + b)`


The spec is specific, as always, declaring (in C11 §6.5.2.1¶2):
E1[E2] is identical to (*((E1)+(E2)))


This means we can *decide* if we’re going to use array or pointer notation for an array or pointer (assuming it points to an element of an array).

Let’s use an array and pointer with both array and pointer notation:

```c
#include <stdio.h>
int main(void)
{
	int a[] = {11, 22, 33, 44, 55}; // Add 999 here as a sentinel
	int *p = a; // p points to the first element of a, 11

	// Print all elements of the array a variety of ways:
	for(int i=0;i<5;i++)
		printf("%d\n",a[i])   //Array notation with a

	for(int i=0;i<5;i++)
		printf("%d\n",p[i])    //Array notation with p

	for(int i=0;i<5;i++)
		printf("%d\n",*(a+i))   //Pointer notation with a

	for(int i=0;i<5;i++)
		printf("%d\n",*(p+i))   //Ponter notation with p

	for(int i=0;i<5;i++)
		printf("%d\n",*(p++)) // Moving pointer p
		printf("%d\n",*(a++)) // Moving array variable a -- ERROR

}
```

So you can see that in general, if you have an array variable, you can use pointer or array notion to access elements. Same with a pointer variable.

The one big difference is that you can *modify* a pointer to point to a different address, but you can’t do that with an array variable.

### Array/Pointer Equivalence in Function Calls

This is where you’ll encounter this concept the most, for sure.
If you have a function that takes a pointer argument, e.g.:

```c
int my_strlen(char *s)

// This means you can pass either an array or a pointer to this function and have it work!

char s[] = "Antelopes";
char *t = "Wombats";

printf("%d\n", my_strlen(s)); // Works!
printf("%d\n", my_strlen(t)); // Works, too!

//*And it’s also why these two function signatures are equivalent:

int my_strlen(char *s) // Works!
int my_strlen(char s[]) // Works, too!
```

### voidPointers

You’ve already seen the void keyword used with functions, but this is entirely separate, unrelated.

Sometimes it’s useful to have a pointer to a thing *that you don’t know the type of*. There are two use cases for this.

1. A function is going to operate on something byte-by-byte. For example, memcpy() copies bytes of memory from one pointer to another, but those pointers can point to any type. memcpy() takes advantage of the fact that if you iterate through char*s, you’re iterating through the bytes of an object no matter what type the object is. More on this in the Multibyte Values subsection.
2. Another function is calling a function you passed to it (a callback), and it’s passing you data. You know the type of the data, but the function calling you don’t. So it passes you void*s ’cause it doesn’t know the type—and you convert those to the type you need. The built-in qsort() and bsearch() use this technique.

Let’s look at an example, the built-in memcpy() function:
`void *memcpy(void *s1, void *s2, size_t n);`

This function copies n bytes of memory starting from address s1 into the memory starting at address s2.

For instance, we could copy a string with memcpy() (though strcpy() is more appropriate for strings):

```c
#include <stdio.h>
#include <string.h>
int main(void)
{
	char s[] = "Goats!"
	char t[100];

	memcpy(t,s,7);    //Copy 7 Bytes including the NULL terminator

	printf("%s\n",t)  // "Goats!"
}
```

Or we can copy some ints:

```c
#include <stdio.h>
#include <strings.h>
int main(void)
{
int a[]={1,3,5};
int b[3];

memcpy(b,a,3*sizeof(int));

printf("%d\n",b[1]);
}
```

We copied the data from a to b, but we had to specify how many *bytes* to copy, and an int is more than one byte.


And if we have 3 ints in our array, like we did in that example, the entire space used for the 3 ints must be 3 * sizeof(int).
(In the string example, earlier, it would have been more technically accurate to copy 7 * sizeof(char) bytes. But chars are always one byte large, by definition, so that just devolves into 7 * 1.)
We could even copy a float or a struct with memcpy()



If you have a pointer to a source and a pointer to a destination, and you have the number of bytes you want to copy, you can copy *any type of data*.

Imagine if we didn’t have void*. We’d have to write specialized memcpy() functions for each type:

```c
memcpy_int(int *a, int *b, int count);
memcpy_float(float *a, float *b, int count);
memcpy_double(double *a, double *b, int count);
memcpy_char(char *a, char *b, int count);
memcpy_unsigned_char(unsigned char *a, unsigned char *b, int count);

// etc...

```

Much better to just use void* and have one function that can do it all.
That’s the power of void*. You can write functions that don’t care about the type and are still able to do things with it.

However, there are some limitations:

1. You cannot do pointer arithmetic on a void*.
2. You cannot dereference a void*.
3. You cannot use the arrow operator on a void*, since it’s also a dereference.
4. You cannot use array notation on a void*, since it’s also a dereference, as well.

And if you think about it, these rules make sense. All those operations rely on knowing the sizeof the type of data pointed to, and with void*, we don’t know the size of the data being pointed to it could be anything!

But the secret is that, deep down, *you convert the void* to another type before you use it*!

And conversion is easy: you can just assign a variable of the desired type.

```c
char  a = 'X'; // A single char
void *p = &a; // p points to the 'X'
char *q = p; // q also points to the 'X'
printf("%c\n", *p); // ERROR--cannot dereference void\*!
printf("%c\n", *q); // Prints "X"
```

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
