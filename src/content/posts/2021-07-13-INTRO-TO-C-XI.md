---
title: "Intro To C : Part XI (typedef)"
date: 2021-07-13 13:39:50 +0530
categories: [Languages,C]
tags: [Languages]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN3.jpg?raw=true)

This is the eleventh post in the series [Intro To C](https://www.sahilsinghrawat.com/posts/INTRO-TO-C-I/) In the last post we learned Files in C

In this article, we will learn about typedef

## typedef 

### typedef in Theory

You take an existing type and you make an alias for it with typedef, Like this:

```c
typedef int newalias; // Make "newalias" an alias for "int"
newalias x = 10; // Type "newalias" is the same as type "int"
```

You can take any existing type and do it. You can even make several types with a comma list:

```c
typedef int newalias, newalias2, newalias3; // These are all "int"
```

### Scoping

typedef follows regular scoping rules. For this reason, it’s quite common to find typedef at file scope (“global”) so that all functions can use the new types at will.

### typedef in Practice

So renaming int to something else isn’t that useful. Let’s see where typedef commonly makes an appearance.

### typedef and structs

Sometimes a struct will be typedef’d to a new name so you don’t have to type the word struct over and over.

```c
struct animal {
	char *name;        
	int leg_count, speed;
};
```

```c
//      original name | new name
//               |         |
//               v         v
//      |-----------| |----|
typedef struct animal animal;

struct animal y; // This works
animal z; // This also works because "animal" is an alias
```

Now I want to run the same example in a way that you might commonly see. We’re going to put the struct animal *in* the typedef. You can mash it all together like this:

```c
//       original name
//             |
//             v
//      |-----------|
typedef struct animal {
    char *name
    int leg_count, speed;
} animal; // <-- new name

struct animal y; // This works
animal z; // This also works because "animal" is an alias
```

That’s the same as the previous example, just more concise.

But that’s not all! There’s another common shortcut that you might see in code using what are called *anonymous structures*. It turns out you don’t need to name the structure in a variety of places, and typedef is one of them.

Let’s do the same example with an anonymous structure:

```c
// anonymous struct!
//        |
//        v
//    |---------|
typedef struct {
    char *name;
    int leg_count, speed;
} animal; // <--- new name

struct animal y; //ERROR: this no longer works
animal z; //This works because "animal" is an alias
```

As another example, we might find something like this:

```c
typedef struct {
    int x, y;
} point;

point p = {.x=20, .y=40};
printf("%d, %d\n", p.x, p.y); // 20, 40
```

### typedef and Other Types

It’s not that using typedef with a simple type like int is completely useless... it helps you abstract the types to make it easier to change them later.
For example, if you have float all over your code in 1000's places, it’s going to be painful to change them all to double if you find you have to do that later for some reason.
But if you prepared a little with:

```c
typedef float app_float;
// and
app_float f1, f2, f3;

// Then if later you want to change to another type, like long double,
// you just need to change the typedef:

//         voila!
//      |---------|
typedef long double app_float;
// and
app_float f1,f2,f3 // all these are now long doubles
```

### typedef and Pointers

You can make a type that is a pointer.

```c
typedef int *intptr;

int a = 10;
intptr x = &a; // "intptr" is type "int*"
```

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
