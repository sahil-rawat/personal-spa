---
title: Java Internals - Virtual Threads & The End of Reactive Complexity
date: 2025-12-23 10:30:00 +0530
categories: [Devlopment,java]
tags: [java]
---
![](https://github.com/sahil-rawat/assets/blob/master/IMG/MAIN9.jpg?raw=true)


For the last decade, high-concurrency Java applications faced a difficult choice. If you wanted to handle thousands of concurrent requests, you had two options:

* **Thread-per-Request**: Simple to write, but expensive. Each thread consumes roughly 1MB of memory.
* **Reactive Programming (WebFlux/Netty)**: Efficient, but a nightmare to debug and maintain.

> With Java 21, Project Loom officially introduced Virtual Threads. 🎉🎉

But this isn't just a new API. It represents a fundamental shift in how the JVM maps Java code to operating system resources. In this post, we’re going ***"under the hood"*** to understand how Virtual Threads work, why they are different from standard threads, and the engineering tradeoffs you need to know.

## The Old Model: Platform Threads (1:1) 🧵

To understand the innovation, we must look at the limitation. Traditionally, every instance of `java.lang.Thread` was a thin wrapper around an Operating System (OS) Thread.

If you spawned a Java thread, the OS kernel spawned a thread.

The OS is efficient, but it isn't designed for massive concurrency of blocking tasks. 

First, there is the Memory Overhead. OS threads usually reserve a fixed stack size (often 1MB or 2MB). If you spawn 100,000 threads, you need roughly 100GB of RAM just for stack space. 

Second, there is the Context Switching cost. Switching between kernel threads involves the OS scheduler, which burns CPU cycles saving and restoring registers and cache lines.

This is why we moved to asynchronous frameworks (Reactive). We couldn't afford to block these expensive threads while waiting for a database response.

## The New Model: Virtual Threads (M:N) 🧵

Virtual Threads decouple the **"Java Thread"** from the **"OS Thread."**

The JVM now manages a pool of OS threads (called Carrier Threads). Millions of Virtual Threads can be multiplexed onto a very small number of Carrier Threads.

The beauty of Virtual Threads is that the API remains nearly identical. You don't need to learn a new framework.

```java

// The Old Way (Heavy Platform Thread)
// Risk: High memory usage, expensive startup
Thread platformThread = new Thread(() -> {
    System.out.println("I am mapped directly to an OS thread.");
});
platformThread.start();


// The New Way (Lightweight Virtual Thread)
// Benefit: Cheap, disposable, fast startup
Thread virtualThread = Thread.ofVirtual().start(() -> {
    System.out.println("I am managed by the JVM.");
});

```

## Under the hood: Mounting and Unmounting

The magic of Virtual Threads lies in how they handle blocking operations (like I/O).

When code running on a standard thread calls `socket.read()` or `Thread.sleep()`, the underlying OS thread is blocked. It sits idle, consuming memory but doing no work.

When a Virtual Thread performs a blocking operation, the JVM performs a maneuver called Unmounting.

This relies on a construct called a Continuation.

* **Running**: The Virtual Thread is "mounted" on a Carrier Thread. It executes bytecode normally.
* **Blocking**: The code hits a blocking call (e.g., a DB query).
* **Yielding**: The JVM detects this. Instead of blocking the Carrier Thread, it captures the Virtual Thread's stack frame (its current state, variables, and instruction pointer).
* **Unmounting**: This stack frame is moved from the stack memory into the JVM Heap.
* **Re-scheduling**: The Carrier Thread is now free to pick up another Virtual Thread and execute it.

When the database operation finishes, the OS signals the JVM. The JVM restores the stack frame from the Heap (resuming the Continuation) and schedules the Virtual Thread to run again potentially on a completely different Carrier Thread.

### The Memory Impact: Stack vs. Heap

This architecture changes the memory profile of Java applications significantly.

A Platform Thread requires ~1MB of fixed stack space (Native Memory). A Virtual Thread has a variable stack size stored in the Heap. It starts small (often just a few hundred bytes) and grows as needed.

Let's compare running 1000000 concurrent tasks:
* Platform Threads: 1000000 threads × 1MB stack = 100 GB RAM (Likely crashes the JVM).
* Virtual Threads: 1000000 threads × ~1KB (avg stack) = 100 MB RAM (Runs easily on a laptop).

## The Developer's Gotchas

As with any abstraction, there are leaks. Here are two critical things to watch out for as a developer.
* The "Pinning" Problem There are scenarios where a Virtual Thread cannot be unmounted from its carrier. This is called "Pinning." It happens if you are inside a synchronized block or if you are calling a native method (JNI).
If a thread is pinned and performs a blocking operation, it will block the underlying OS thread, negating the benefits of Loom.

```java

// BAD: This "Pins" the virtual thread to the OS thread
synchronized(lock) {
    // If this takes 5 seconds, the OS thread is blocked for 5 seconds
    Thread.sleep(5000); 
}

// GOOD: This allows the virtual thread to "Unmount"
lock.lock();
try {
    // The OS thread is freed immediately to do other work
    Thread.sleep(5000); 
} finally {
    lock.unlock();
}

```

* ThreadLocal Abuse In the old world, we used `ThreadLocal` to store expensive objects (like `SimpleDateFormat` or Database Connections) because we reused threads.

In the new world, threads are disposable. If you spawn 1,000,000 virtual threads and each initializes a heavy `ThreadLocal` object, you will trigger an `OutOfMemoryError` very quickly. The fix is to avoid `ThreadLocal` for object pooling in Virtual Threads and use explicit context passing or Scoped Values.


## The Proof: A Practical Benchmark

Theory is fine, but as engineers, we trust code. I wrote a simple benchmark to launch **100,0000 concurrent threads** that simulate a blocking operation (sleeping for 50ms).


Scenario A (Platform Threads): Will likely crash your computer or take a very long time because it tries to reserve 100GB+ of RAM.

Scenario B (Virtual Threads): Will finish in seconds because it stays in the Heap.

Here is the code if you want to reproduce this on your machine (Requires Java 21+):

```java
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.IntStream;

public class VirtualThreadsDemo {

    public static void main(String[] args) {
        int taskCount = 1000000;

        System.out.println("=== STARTING BENCHMARK ===");
        System.out.println("Tasks to run: " + taskCount);

        // --- TEST 1: VIRTUAL THREADS ---
        System.out.println("\n[Test 1] Launching " + taskCount + " Virtual Threads...");
        Instant startVirtual = Instant.now();
        
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            IntStream.range(0, taskCount).forEach(i -> {
                executor.submit(() -> {
                    try {
                        // Simulate a blocking I/O operation (e.g., DB call)
                        Thread.sleep(Duration.ofMillis(50)); 
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                });
            });
        } // Executor auto-closes here, waiting for all tasks to finish
        
        Instant endVirtual = Instant.now();
        System.out.println("✅ Virtual Threads Finished in: " + Duration.between(startVirtual, endVirtual).toMillis() + " ms");


        // --- TEST 2: PLATFORM THREADS (The Crash Test) ---
        System.out.println("\n[Test 2] Launching " + taskCount + " Platform Threads...");
        System.out.println("⚠️ WARNING: This might crash or freeze your JVM if taskCount is high!");
        
        Instant startPlatform = Instant.now();
        
        // We use a CachedThreadPool which spawns new threads as needed
        try (var executor = Executors.newCachedThreadPool()) {
            IntStream.range(0, taskCount).forEach(i -> {
                executor.submit(() -> {
                    try {
                        Thread.sleep(Duration.ofMillis(50));
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                });
            });
        }
        
        Instant endPlatform = Instant.now();
        System.out.println("✅ Platform Threads Finished in: " + Duration.between(startPlatform, endPlatform).toMillis() + " ms");
    }
}

```


### The Result

When running this on my local machine, the difference is night and day. Virtual threads finish almost instantly because they don't exhaust the OS memory. Platform threads, however, struggle to even initialize.

![https://github.com/sahil-rawat/assets/blob/master/VIRTUAL_THREADS.png?raw=true](https://github.com/sahil-rawat/assets/blob/master/VIRTUAL_THREADS.png?raw=true)

## Conclusion: The End of "Async" Anxiety

Virtual Threads allow us to write code that looks synchronous and blocks, but executes asynchronously. We get the readability of Thread-per-Request with the scalability of Reactive code.

For developers, this means we can finally stop writing "callback hell" or complex streams just to make an API call. But, understanding the underlying Carrier Thread model is essential to avoid performance pitfalls like Pinning.

For the last decade, we have forced ourselves to write complex, callback-heavy Reactive code just to squeeze more performance out of our hardware. We sacrificed readability for scalability. 

With Java 21, that trade-off is gone.

### Key Takeaways for Engineers:
1.  **Blocking is Cheap Again:** You can write simple, synchronous code (`db.query()`), and the JVM handles the non-blocking magic under the hood.
2.  **No More Thread Pools:** You don't need to pool Virtual Threads. Treat them like disposable objects—create them, use them, and let the Garbage Collector handle the rest.
3.  **Watch Your Locks:** The "Pinning" issue is real. If you are migrating legacy code, search for `synchronized` blocks and replace them with `ReentrantLock` to ensure your Virtual Threads can actually unmount.

We are entering a new era of Java where we can build massive-scale systems without needing a PhD in Reactive Streams. Go forth and spawn threads!

Happy hacking! 🧙‍♂️


---

Thanks for Reading, Stay tuned for more ❤︎

If you enjoyed reading the article do follow me on:

[Twitter](https://twitter.com/sahil_s_rawat)

[LinkedIn](https://www.linkedin.com/in/sahil-singh-rawat)

[Website](https://www.sahilsinghrawat.com)

[GitHub](https://github.com/sahil-rawat)

