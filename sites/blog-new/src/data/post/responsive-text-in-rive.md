---
publishDate: 2025-12-4T00:00:00Z
author: David de Jesus
title: Responsive Text in Rive Without Losing Your Mind
excerpt: A designer friendly way to handle breakpoints, layouts, and scaling.
image: https://images.unsplash.com/photo-1516996087931-5ae405802f9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80
category: Tutorials
tags:
  - astro
  - tailwind css
metadata:
  canonical: https://astrowind.vercel.app/get-started-website-with-astro-tailwind-css
---

If you have ever resized a screen and watched your beautiful typography slowly collapse into unreadable dust, you already know the problem. Scaling text linearly works in theory, but real layouts are not linear. Designers do not think in percentages. We think in breakpoints.

On the web, CSS solved this years ago. When the screen gets smaller, layouts change. Font sizes change. Line lengths change. Things adapt instead of shrinking.

This article is about recreating that same mental model inside Rive.

Not by fighting the tool. Not by over engineering. Just by wiring the right signals together.

## The Problem With Scaling Everything

Before landing on this approach, I tried two common solutions that Rive users often reach for.

The first one is the easy method. You set your text to use the Fit overflow mode and let the artboard size handle the rest. This works fine for simple cases, but it scales everything evenly. When the artboard gets too small, the text gets too small. No decisions are being made.

The second one is the super custom method. You connect a joystick to the artboard width and drive text size and spacing manually. This gives you a lot of control, and for some projects it is the right call. But it is still linear. The text keeps shrinking as the canvas shrinks.

Neither approach behaves like CSS.

What I wanted was this. At certain widths, the layout should switch. Font sizes should jump. Line breaks should change. Just like breakpoints on the web.

## Thinking in Breakpoints Instead of Scale

The breakthrough was realizing that Rive does not need to know how big the canvas is. It needs to know how wide the screen is.

That distinction matters.

Canvas size can change because of containers, padding, or layout quirks. Window width is stable. It is what designers already use when defining breakpoints.

So instead of binding the artboard size into Rive, we bind the browser window width into a View Model number.

From there, Rive does what it does best. It reacts to state.

## Sending the Window Width Into Rive

On the JavaScript side, the setup is straightforward. We read the current window width and pass it into a View Model number called num.

Here is the core idea simplified.

```shell
const windowWidth = window.innerWidth;
numProp.value = windowWidth;
```

That value updates whenever the window resizes. Rive receives it instantly.

At this point, Rive knows exactly how wide the screen is.

## Letting Rive Decide the Layout

Inside Rive, the real work happens.

Instead of one timeline that scales forever, we create four timelines:

- **xLarge** for screens above 1200px
- **Large** for screens between 741px and 1199px
- **Medium** for screens between 531px and 740px
- **Small** for screens below 530px

Each timeline has its own layout. Font sizes, line breaks, spacing, alignment. Everything is intentional.

In the State Machine, we use an Any State with conditional transitions based on the View Model number.

If num is greater than or less than certain values, the State Machine switches timelines.

This is the key mental shift.

You are no longer animating size. You are choosing layouts.

## Why This Feels Like CSS

This approach feels familiar because it behaves like CSS media queries.

- The browser tells you how wide the screen is
- The design system defines what should happen at each width
- Layouts switch instead of shrinking

Designers can reason about this without touching code. Developers only wire the signal once.

After that, everything lives in the Rive file.