---
title: "Intro To C : Part I (Introduction)"
date: 2021-07-03 13:39:50 +0530
categories: [Languages,C]
tags: [Languages]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN3.jpg?raw=true)

To get started in the field of CyberSecurity or specifically Reverse Engineering. The knowledge of C language will help a lot, It's not that Learning C is compulsory but it helps in understanding the source code which is written in C language, however, Learning C Language helps because most of the executables were written in C.

C Programming language is considered as one of the low-level languages and helps us understand the underlying concepts of Programming

In this series we will learn about the Basics of C language

Let's start with a Basic ***HelloWorld*** Program and understand how it works.

## Hello World

```c
/* Hello world program, This line is a comment and will be ignored by compiler */
// This is also a comment

#include <stdio.h>

int main(void)
{
    printf("Hello, World!\n"); // Actually do the work here 8
}
```

Let's start by the first line and get the easy thing out of the way, so anything between the digraphs **“/\*”** and **“\*/”** is a comment and will be completely ignored by the compiler. The same goes for anything on a line after a **“//”**. Now if it is going to be ignored then why do we use it, so these comments allow us to leave messages to ourselves and others so that when you come back and read your code at a later time, you'll know what the code is trying to do.

Coming to the next line, what is this **#include**? Well, it tells the C Preprocessor to pull the contents of another file and insert it into the code right there.

There are two stages (well, technically there are more than two, but let's pretend there are two) to compilation: the preprocessor and the compiler. Anything that starts with the pound sign **“#”** is something the preprocessor operates on before the compiler even gets started. Common *preprocessor directives* are *#include* and *#define*.

After the C preprocessor has finished preprocessing everything, the results are ready for the compiler to take them and produce assembly code, machine code; your source runs through the preprocessor, then the output of that runs through the compiler, then that produces an executable for you to run.

What's **\<stdio.h\>**? That is what is known as a *header file*. here the **dot-h** at the end hints to us that it is a header file. It's the **Standard I/O** header file. It contains preprocessor directives and function prototypes for common input and output needs. For our demo, we're printing the string *“Hello, World!”*, so we, in particular, need the function printf() from this header file. If we tried to use printf() without **#include \<stdio.h\>**, the compiler would have errored out.

```text
Q: How to find that i need to #include <stdio.h> for printf()?

A: It's in the documentation. If you're on a Unix system, run man 3 printf
   on the terminal and it'll tell you right at the top of the man page 
   what header files are required.
```

The next line is **int main(void)**. This is the definition of the function **main()**; everything between the curly braces **“{”** and **“}”** is part of the function definition, Here *int* at the beginning signifies that this function will be going to return an int value, and the void between the **“(”** and **“)”** signifies that this function does not take any parameters as input.

The main function is the one that will be called automatically when your program starts executing. Nothing of yours gets called before **main()**.

So now we know that that program has brought in a header file, **stdio.h**, and declared a **main()** function that will execute when the program is started. There is a call to the function **printf()**, you end the function call with a semicolon so the compiler knows it's the end of the expression.

Here we are passing one parameter to the function **printf()**: a string to be printed when you call it. But What's that **“\n”** at the end of the string? Well there are certain characters that you can't print on screen well that are embedded as two-character backslash codes. One of the most popular is **“\n”** (read “backslash-N”) which corresponds to the *newline* character. This is the character that causing further printing to continue on the next line instead of the current. It's like hitting return at the end of the line.

So copy that code into a file called hello.c and build it. On a Unix-like platform (e.g. Linux, BSD, Mac, or WSL), you'll build with a command like so:

```bash
gcc -o hello hello.c
```

(This means “compile hello.c, and output an executable called hello”.) 

After that's done, you should have a file called hello that you can run with this command:

```bash
./hello
```

(The leading ./ tells the shell to “run from the current directory”.) 

And see what happens:

```bash
Hello World!
```

## Compilation

Let's talk a bit more about how to build C programs, and what happens behind the scenes there. Like other languages, C has *source code*. Now, Compilation is the process of taking your C source code and turning it into a program that your operating system can execute.

JavaScript and Python devs aren't used to a separate compilation step at all–though behind the scenes it's happening! Python compiles your source code into something called *bytecode* that the Python virtual machine can execute.

When compiling C, *machine code* is generated. These are the 1s and 0s that can be executed directly by the CPU.

Languages that typically aren't compiled are called *interpreted* languages. But as we mentioned with Java and Python, they also have a compilation step. And there's no rule saying that C can't be interpreted. (There are C interpreters out there!).

Compilation in general is just taking source code and turning it into another, more easily executed form. The C compiler is the program that does the compilation.

As we've already said, gcc is a compiler that's installed on a lot of Unix-like operating systems. And it's commonly run from the command line in a terminal, but not always. You can run it from your IDE, as well.

So how do we do command-line builds?

## Building with gcc 🏗

If you have a source file called hello.c in the current directory, you can build that into a program called hello with this command typed in a terminal:

```bash
gcc -o hello hello.c
```

The -o means “output to this file”11. And there's hello.c at the end, the name of the file we want to compile.

If your source is broken up into multiple files, you can compile them all together (almost as if they were one file, but the rules are actually more complex than that) by putting all the .c files on the command line:

```bash
    gcc -o awesomegame ui.c characters.c npc.c items.c
```

and they'll all get built together into a big executable.

---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)
