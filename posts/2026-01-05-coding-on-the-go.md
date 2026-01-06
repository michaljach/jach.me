---
title: Coding on the toilet with iPhone and OpenCode
date: 2026-01-05
---

![Mobile coding setup](../mobile-setup.png)

I've been experimenting with a mobile development setup that lets me code and ship from anywhere, using just my iPhone. Here's the stack that makes it possible.

## The Setup

My workflow consists of three key components:

1. **Google Cloud VM** - A virtual machine running in the cloud that serves as my development environment
2. **Terminus (iOS)** - A powerful terminal app for iPhone that connects to remote servers via SSH
3. **OpenCode** - An AI-powered coding assistant that runs in the terminal

## Why This Works

The beauty of this setup is that all the heavy lifting happens on the cloud VM. My phone is just a thin client that sends commands and displays output. This means:

- No need for a powerful local machine
- My development environment is always available from any device
- I can pick up exactly where I left off, whether I'm on my phone, tablet, or laptop

## Terminus on iOS

Terminus is surprisingly capable for a mobile terminal. It supports:

- SSH key authentication
- Multiple sessions
- Customizable keyboard with extra keys for coding
- Smooth scrolling and responsive input

The extra keyboard row with common programming characters (brackets, pipes, etc.) makes typing code much more bearable on a phone screen.

## OpenCode: The Game Changer

The real magic happens with OpenCode. Instead of typing out every line of code manually on a phone keyboard, I can describe what I want to build and let OpenCode do the heavy lifting. It can:

- Read and understand existing codebases
- Write and edit files
- Run commands and fix errors
- Handle complex refactoring tasks

This transforms mobile coding from a painful exercise in thumb-typing to a conversational experience where I guide the AI through the changes I want to make.

## Typical Workflow

1. SSH into my Google Cloud VM using Terminus
2. Navigate to my project directory
3. Launch OpenCode
4. Describe the feature I want to build or the bug I need to fix
5. Review the changes and iterate as needed
6. Commit and push

## Is It Practical?

For quick fixes, code reviews, and small features - absolutely. I've shipped real code from coffee shops, airports, and even while waiting in line. It's not going to replace a proper desk setup for intensive work, but for staying productive on the go, it's a game changer.

The combination of cloud computing, a solid mobile terminal, and AI assistance has made truly mobile development a reality.

---

*This post was written and deployed entirely from an iPhone.*
