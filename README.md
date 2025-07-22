# mithril demo app

A simple example app to show how you could build an app with mithril

## Basics

install deps
```sh
npm i
```
run integration tests and show coverage
```sh
npm test
```
serve the app and build on changes
```sh
npm start
```
build a prod bundle
```sh
npm run build
```

## Whats this all about then

This example app displays a simplified usage of mithril, using it only for rendering DOM, and shows a super explicit (and therefore un-magic) lifecycle.

It attempts to show a few concepts like basic state control, including:

 - Setting state (App showLogin())
 - asynchronous state (AboutPage eventuallySetUserAge())
 - task-running stateful components (Countdown)
 - navigation, including SPA anchors, popstate, etc.
 - integration testing
 - code coverage
 - Build/Watch with sourcemaps

The key takeaways should be the extreme simplicity and therefore trivially comprehensibility of how everything works.

The entire specification of state management is 
 - Set the state
 - Redraw

Nothing gets bound, draw's aren't automatic (and therefore happen when you expect, or more commonly, *dont* happen unexpectedly).

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
```

This pattern has been employed in multiple non-trivial, production applications.

It does not grow in complexity.
