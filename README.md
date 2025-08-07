# mithril demo app

A simple example app to show how you could build an app with mithril

## Why

The status quo is complexity.

I want simple and sane.

I don't want to waste time fighting my tools. I want to build products.

This pattern has been employed in multiple non-trivial, production applications.

It does not grow in complexity. It does not slow down.

## Basics

install deps and dev-deps (~29MB, ~5 seconds)
```sh
npm i
```
run integration tests and show coverage (15 integration tests, 100% line 100% function 99% branch coverage, ~5 seconds)
```sh
npm test
```
serve the app and build on changes
```sh
npm start (~200 milliseconds)
```
build a prod bundle
```sh
npm run build (~50 milliseconds, 37.4kb JS bundle uncompressed)
```

## Whats this all about then

This example app displays a simplified usage of mithril, using it only for rendering DOM, and shows a super explicit (and therefore un-magic) lifecycle.

It attempts to show a few concepts including:

 - Setting state
 - Asynchronous state
 - Task-running stateful components (Countdown)
 - Routing
 - Navigation, including SPA anchors, pushState, popstate, replaceState, etc.
 - Forms/inputs
 - Integration testing
 - Code coverage
 - Build/Watch with sourcemaps

The key takeaways should be the extreme simplicity and therefore trivially comprehensibility of how everything works.

The entire specification of state management is 
 - Set the state
 - Redraw

Nothing gets bound, draw's aren't automatic (and therefore happen when you expect, or more importantly, *dont* happen unexpectedly).

There are only two 'closures' per component:

```js
const m = require('mithril/hyperscript');
const emittable = require('mithril-emittable');

const MyComponent = emittable((vnode, emit)) {
	// Closure 1.
	// This runs once on component creation
	// You can store component-level state here
	let count = 0;

	const interval = setInterval(() => {
		count++;
		emit('redraw');
	}, 1000);

	return {
		onremove: () => clearInterval(interval),
		view: () => {
			// Closure 2.
			// This runs on every redraw
			// You can store ephemeral per-redraw state here
			const doubleTheCount = count * 2;

			return m('h1', 'Two times the count it', doubleTheCount);
		}
	}
}

module.exports = { MyComponent };
```
