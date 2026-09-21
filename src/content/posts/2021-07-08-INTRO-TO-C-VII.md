---
title: "Intro To C : Part VII (Arrays)"
date: 2021-07-08 13:39:50 +0530
categories: [Languages,C]
tags: [Languages]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN5.jpg?raw=true)

This is the seventh post in the series [Intro To C](https://www.sahilsinghrawat.com/posts/INTRO-TO-C-I/) In the last post we learned Pointers

In this article, we will learn about Arrays

## Arrays

Luckily, C has arrays. It's considered a low-level language but it does at least have the concept of arrays built-in. And since a great many languages drew inspiration from C's syntax, you're probably already familiar with using “[” and “]” for declaring and using arrays in C.

But only barely! As we'll find out later, arrays are all pointers and stuff deep down. But for now, let's just use them as arrays.

### Easy Example

Let's just crank out an example:

```c
#include <stdio.h>

int main(void)
{
	int i;
	float f[4];

	f[0]=3.12301
	f[1]=9.12333
	f[2]=12.3423
	f[3]=1.23311

// Print them all out;

	for(i=0;i<4;i++){
		printf("%f \n",f[i]);
	}
}

```

When you declare an array, you have to give it a size. And the size has to be fixed.

In the above example, we made an array of 4 floats. The value in the square brackets in the declaration lets us know that.

Later on, in subsequent lines, we access the values in the array, setting them or getting them, again with square brackets.

Hopefully, this looks familiar from languages you already know!

### Getting the Length of an Array

C doesn't record this information. You have to manage it separately in another variable.

There are some circumstances when you *can get the length of an array*. There is a trick to get the number of elements in an array in the scope in which an array is declared. But, generally speaking, this won't work the way you want if you pass the array into a function.

Let's take a look at this trick. The basic idea is that you take the sizeof  array, and then divide that by the size of each element to get the length. For example, if an int is 4 bytes, and the array is 32 bytes long, there must be room for 32/4 or 8 ints in there.

```c
int x[12]; // 12 ints
printf("%zu\n", sizeof x); // 48 total bytes
printf("%zu\n", sizeof (int)); // 4 bytes per int

printf("%zu\n", sizeof x / sizeof (int)); // 48/4 = 12 ints!
```

If it's an array of chars, then sizeof the array is the number of elements, since sizeof(char) is defined to be 1. For anything else, you have to divide by the size of each element.

But this trick only works in the scope in which the array was defined. If you pass the array to a function, it doesn't work.

```c
void foo(int x[12])
{
		printf("%zu\n", sizeof x); // 8?! What happened to 48?*
		printf("%zu\n", sizeof(int)); // 4 bytes per int

		printf("%zu\n", sizeof x / sizeof(int)); // 8/4 = 2 ints?? WRONG.
}

```

This is because when you “pass” arrays to functions, you're only passing a pointer to the first element, and that's what sizeof measures. 

### Array Initializers

You can initialize an array with constants ahead of time:

```c
#include <stdio.h>

int main(void)
{
	int i;
	int a[5] = {22, 37, 3490, 18, 95}; // Initialize with these values
	
	for (i=0;i<5;i++){
		printf("%d\n", a[i]);
	}	
}
```

`Catch: initializer values must be constant terms. Can't throw variables in there.`

`You should never have more items in your initializer than there is room for in the array, or the compiler will error out`

```
foo.c: In function ‘main':
foo.c:6:39: warning: excess elements in array initializer
6 |     int a[5] = {22, 37, 3490, 18, 95, 999};
  |                                       ^~~

```

But you can have fewer items in your initializer than there is room for in the array. The remaining elements in the array will be automatically initialized with zero.

```c
int a[5] = {22, 37, 3490};

// is the same as:

int a[5] = {22, 37, 3490, 0, 0};

//It's a common shortcut to see this in an initializer when you want to set an entire array to zero:

int a[100] = {0};

//Which means, "Make the first element zero, and then automatically make the
//rest zero, as well." Lastly, you can also have C compute the size of the
// array from the initializer, just by leaving the size off:

int a[3] = {22, 37, 3490}; // is the same as:
int a[] = {22, 37, 3490};  // Left the size off!
```

### Out of Bounds!

C doesn't stop you from accessing arrays out of bounds. It might not even warn you.

Let's check with an example. The array in the example only has 5 elements, but let's try to print 10 and see what happens:

```c
#include <stdio.h>

int main(void)
{
    int i;
    int a[]={1,2,3,4,5};

    for(i=0;i<10;i++){
        printf("The num is %d\n",a[i]);
  }
}
```

Running it on my computer prints:

```
The num is 1
The num is 2
The num is 3
The num is 4
The num is 5
The num is 32766
The num is -324534166
The num is 722891991
The num is -403008544
The num is 32766
```

### Multidimensional Arrays

You can add as many dimensions as you want to your arrays.

```c
int a[10];
int b[2][7];
int c[4][5][6];

```

These are stored in memory in row-major order.

You an also use initializers on multidimensional arrays by nesting them:

```c
#include <stdio.h>
int main(void)
{
	int row,col;

	int a[2][5]={     //initialize a 2d array
			{0,1,2,3,4},
			{5,6,7,8,9}
	};
	
	for(row=0;row<2;row++){
		for(col=0;col<5;col++){
				printf("(%d,%d) = %d \n",row,col,a[row][col])
		}
	}
}
```

For output of:

```
(0,0) = 0
(0,1) = 1
(0,2) = 2
(0,3) = 3
(0,4) = 4
(1,0) = 5
(1,1) = 6
(1,2) = 7
(1,3) = 8
(1,4) = 9

```

### Getting a Pointer to an Array

Generally speaking, when someone talks about a pointer to an array, they're talking about a pointer *to the first element* of the array.

So let's get a pointer to the first element of an array.



```c
#include <stdio.h>

int main(void)
{
    int a[5] = {11, 22, 33, 44, 55};
    int *p;
    p = &a[0]; // p points to the array
	
    // Well, to the first element, actually
	
    printf("%d\n", *p); // Prints "11"
}

// This is so common to do in C that the language allows us a shorthand:

p = &a[0]; // p points to the array

// is the same as:*4

p = a; // p points to the array, but much nicer-looking!

```

Just referring to the array name in isolation is the same as getting a pointer to the first element of the array! We're going to use this extensively in the upcoming examples.

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
