---
title: "Intro To C : Part IX (Structs)"
date: 2021-07-11 13:39:50 +0530
categories: [Languages,C]
tags: [Languages]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN7.jpg?raw=true)

This is the ninth post in the series [Intro To C](https://www.sahilsinghrawat.com/posts/INTRO-TO-C-I/) In the last post we learned Strings

In this article, we will learn about Structs

## Structs

In C, we have something called a struct, which is a user-definable type that holds multiple pieces of data, potentially of different types.

It’s a convenient way to bundle multiple variables into a single one. This can be beneficial for passing variables to functions (so you just have to pass one instead of many), and useful for organizing data and making code more readable.

If you’ve come from another language, you might be familiar with the idea of *classes* and *objects*. These don’t exist in C, natively. You can think of a struct as a class with only data members, and no methods.

### Declaring a Struct

You can declare a struct in your code like so:

```c
struct car {
    char *name;
    float price;
    int speed;
};
```

This is often done at the global scope outside any functions so that the struct is globally available. When you do this, you’re making a new *type*. The full type name is struct car. (Not just car that won’t work.)
There aren’t any variables of that type yet, but we can declare some:

```c
struct car saturn;
```

And now we have an uninitialised variable saturn of type struct car.

Like in many other languages that stole it from C, we’re going to use the dot operator (.) to access the individual fields.

```c
saturn.name = "Saturn SL/2";
saturn.price = 15999.99;
saturn.speed = 175;

printf("Name:           %s\n", saturn.name);
printf("Price (USD):    %f\n", saturn.price);
printf("Top Speed (km): %d\n", saturn.speed);
```

### Struct Initialisers

That example in the previous section was a little unwieldy. There must be a better way to initialize that struct variable!

You can do it with an initializer by putting values in for the fields *in the order they appear in the struct* when you define the variable. (This won’t work after the variable has been defined—it has to happen in the definition).

```c
struct car {
    char *name;
    float price;
    int speed;
};

// Now with an initializer! Same field order as in the struct declaration:

struct car saturn = {
    "Saturn SL/2",
    16000.99,
    175
};

printf("Name:      %s\n", saturn.name);
printf("Price:     %f\n", saturn.price);
printf("Top Speed: %d km\n", saturn.speed);
```

The fact that the fields in the initializer need to be in the same order is a little freaky. If someone changes the order in struct car, it could break all the other code!

We can be more specific with our initializers:

```c
struct car saturn = {.speed=172, .name="Saturn SL/2"};
```

Now it’s independent of the order in the struct declaration. Which is safer code, for sure.

Similar to array initializers, any missing field designators are initialized to zero.

### Passing Structs to Functions

You can do a couple things to pass a struct to a function.

1. Pass the struct.
2. Pass a pointer to the struct.

Recall that when you pass something to a function, a *copy* of that thing gets made for the function to operate on, whether it’s a copy of a pointer, an int, a struct, or anything.
There are basically two cases when you’d want to pass a pointer to the struct:

1. You need the function to be able to make changes to the struct that was passed  in, and have those changes show in the caller.
2. The struct is somewhat large and it’s more expensive to copy that onto the stack than it is to just copy a pointer

For those two reasons, it’s far more common to pass a pointer to a struct to a function.

Let’s try that, making a function that will allow you to set the .price field of the struct car:

```c
struct car {
    char *name;
    int speed;
};

int main(void)
{
    struct car saturn = {.speed=175, .name="Saturn SL/2"};
    // Pass a pointer to this struct car, along with a new,
    // more realistic, price:
    set_price(&saturn, 800.00);
    // ... code continues ...
}
```

You should be able to come up with the function signature for set_price() just by looking at the types of the arguments we have there.
saturn is a struct car, so &saturn must be the address of the struct car, AKA a pointer to a struct car, namely a struct car*.

And 800.0 is a float, So the function declaration must look like this:

```c
void set_price(struct car *c, float new_price)

//We just need to write the body. One attempt might be:

void set_price(struct car *c, float new_price) {
	c.price = new_price; // ERROR!!
}
```

That won’t work because the dot operator only works on structs... it doesn’t work on *pointers* to structs.

Ok, so we can dereference the struct to de-pointer it to get to the struct itself. Dereferencing a struct car* results in the struct car that the pointer points to, which we should be able to use the dot operator on:

```c
void set_price(struct car *c, float new_price) {
	(*c).price = new_price; // Works,
}
```

That works! But Theres a way to do the same without typing all those parens and the asterisk. It is called the *arrow operator*.

### The Arrow Operator

```c
void set_price(struct car *c, float new_price) {
    
    // (*c).price = new_price; // Works,
    // The line above is 100% equivalent to the one below:
    
    c->price = new_price; // That's the one!
}
```

The arrow operator helps refer to fields in pointers to structs.
So when accessing fields. when do we use dot and when do we use arrow?

- If you have a struct, use dot (.).
- If you have a pointer to a struct, use arrow (->).

### Copying and Returning structs

Just assign from one to the other!

```c
struct a, b;
b = a; // Copy the struct* 
```

And returning a struct (as opposed to a pointer to one) from a function also makes a similar copy to the receiving variable.
This is not a “deep copy”. All fields are copied as is, including pointers to things.

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
