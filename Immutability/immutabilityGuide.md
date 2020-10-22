# Immutability in React and Redux: The Complete Guide

Immutability can be a confusing topic, and it pops u p all over the place in React, Redux, and JavaScript in general.

## What is Immutability?
> immutable is the opposit of mutable - and mutable means changable, modifiable... able to be messed with.

So something that is immutable, then is something that  cannot be changed.

Taken to an extream, this means that instead of having traditional variables, you'd be constantly creating new values and replacing old ones. JavaScript is not this extremem, but some lanugage don't allow mutation at all (Elixir, Erlang, and ML come to mind).

While JavaScript isn't a purely functional language, it can sorta pretend to be sometimes. Certain Array operations in JS are immutable (meaning that they return a new array, instead of modifying the original). String operations are always immutable (they create a new string with the changes). And you can write your own functions that are immutable, too. You just need to be aware of a few rules.

## Rules of Immutability
In order to be pure a function must follow these rules:
1. A pure function must always return the same value when given the same inputs.
2. A pure function must not have any side effects.

## What's a "Side Effect"?
"Side effects" is a broad term, but basically, it means modifying things outside the scope of that immediate function. Some examples of side effects...
- Mutating/modifying input parameters, like `giveAwesomePowers` does
- Modifying any other state outside the function, like global variables, or `document.(anything)` or `window(anything)`
- Making API calls
- `console.log()`
- `Math.random()`

The API calls one might surprise you. After all, making a call to something like `fetch('users')` might not appear to change anything in your UI at all.

But ask yourself this: If you called `fetch('users')`, could it changes anthing anywhere? Even outsid your UI?

Yep. It'll create an entry in the browser's Network log. It'll create (and maybe later shutdown) a network connection to the server. And once that call hits the server, all bets are off. The server could do whatever it wants, including calling out to other services and making more mutations. At the very least, it'll probably put an entry in a log file somewhere (which is mutation).

## JS Array Methods That Mutate
Certain array methods will mutate the array ther're used on:
- push (add an item to the end)
- pop (remove an item to the end)
- shift (remove an item from the beginning)
- unshift (add an item to the beginning)
- sort 
- reverse
- splice

## Pure Functions Can Only Call Other Pure Functions
One potential source of trouble is calling a non-pure function from a pure one.

Purity is transitive, and it's all-or-nothing. You can write a perfect pure function, but if you end it with a call to some other function that eventually calls `setState` or `dispatch` or cause some other sort of side effect... then all bets are off.

Now, there are some sorts of side effects that are "acceptable". Logging messages with `console.log` is fine. Yeah, it's technically a side effect, but it's not going to affect anything.

## A Pure Version of `giveAwesomePowers`
```JavaScript
function giveAwesomePowers(person) {
	const newPerson = Object.assign({}, person, {
		specialPower: "invisibility",
	});
	return newPerson;
}
```

This is a bit different now. Instead of modifying the person, we're creating an *entirely* new person.

If you haven't seen `Object.assign`, what it does is assign properties from one object to another. You can pass it a series of objects, and it will merge them all together, left to right, while overwriting any duplicate properties. (And by "left" to "right", I mean that executing `Object.assign(result, a, b, c)` will copy `a` into `result`, then `b`, then `c`).

It doesn't do a deep merge though - only the immediate child properties of each argument will be moved over.

## React Prefers Immutability
In React's case, it's important to never mutate state or props. Whether a component is a function or a class doesn't matter for this rule.

As for props, they're a one-way thing. Props come IN to a component. They're not a two-way street, at least not via mutable operations like setting a prop to a new value.

If you need to send some data back to the parent, or trigger something in the parent component, you can do that by passing in a function as a prop, and then calling that function from inside the child whenever you need to communicate to the parent.

## Immutability Is Important for PureComponents
By default, React components (both the `function` type and the `class` type, if it extends `React.Component`) will re-rendder whenever their parent re-renders, or whenever you change their state with `setState`.

An easy way to optimize a React Component for performance is to make it a class, and make it extend `React.PureComponent` instead of `React.Component`. This way, the component will only re-render if its state is changed or if its props have changed. It will no longer mindlessly re-render every single time its parent re-renders; it will ONLY re-render if one of its props has changed since the last render.

Here's where immutability comes in: if you're passing props into a `PureComponent`, you have to make sure that those props are updated in an immutable way. That means, if they're objects or arrays, you've gotta replace the entire value with a new (modified). 

If you modify the internals of an object or array - by changing a property, or pushing a new item, or even modifying an item inside an array - then the object or array sis *referentially* equal to its old self, and a `PureComponent` will not notice that it has changed, and will not re-render. Weird rendering bugs will ensure.

## How Referential Equality Works in JavaScript
What does "referentially equal" mean? OK, this'll be a quick tangent, but it's important to understand.

JavaScript objects and arrays are stored in memory.

Let's say a place in memory like a box. The variable name "points to" the box, and the box holds the actual value.

In JavaScript, these boxes (memory addresses) are unnamed and unknowable. you can't figure out the memory address a variable points to.

If you reassign a variable, it will point to a new memory location.

If you mutate the internals of the variable, it still points to the same address.

Much like ripping out the insides of a house and putting in new walls, kitchen, living room, swimming pool, and so on - the *address* of that house remains the same.

**Here is the key**: when you compare two objects or arrays with the `===` operator, JavaScript is actually comparing the *address* they point to - a.k.a their *references*. JS does not even peek into the object. It only compares the references. That's what "referential equality" means.

## Redux: Update an Object in an object
When the object you want to update is one (or more) levels deep withing the Redux state, you need to make a copy of every level up to and including the object you want to update.

Here's an example one level deep

```JavaScript
function reducer(state, action) {
	// code
	return {
		...state, // copy the state (level 0)
		house: {
			...state.house, // copy nested object (level 1)
			points: state.house.points + 2
		}
	}

}
``` 

## Redux: Updating an Object by Key
```JavaScript
function reducer(state, action) {
	// code
	const key = "ravenclaw";
	return {
		...state,
		houses: {
			...state.houses,
			[key]: { // update one specific house (using computed property syntax)
				...state.houses[key],
				points: state.houses[key].points + 3
			}
		}
	}
}
```

## Redux: Prepend an item to an array
The *mutable* way to do this would be use Array's `.unshift` function to add an item to the front. Array.prototype.unshift mutates the array, though, and that's not what we want to do.

Here is how you can add an item to the beginning of an array in an immutable way, suitable for Redux:

```JavaScript
function reducer(state, action) {
	const newItem = 0;
	return [
		newItem, // add the new item first
		...state // then explode the old state at the end
	]
}
```

## Redux: Add an item to an array
The *mutable* way to do this would be to use Array's `.push` function to add an item to the end. That would mutate the array, though.

Here is how you can append an item to the end of an array, immutably:

```JavaScript
function reducer(state, action) {
	const newItem = 0;
	return [
		...state,
		newItem
	];
}
```

## Redux: Updata an item in an array with `map`
Array's `.map` function will return a new array by calling the function you provide, passing in each existing item, and using your return value as the new item's value.

In other words, if you have an array with N many items and want a new array that still has N items, use `.map`. You can update/replace one or more items with a single pass through the array.

(If you have an array with N items and you want to end up with fewer items, use `.filter`)

## Redux: Update an object in an array
This works the same way as above. The only difference is we'll need to construct a new object and return a copy of the one we want to change.

## Redux: Insert an item in the middle of an array
Array's `.splice` function function will insert an item, but it will also mutate the array.

Since we don't want to mutate the original, we can make a copy first (with `.slice`), then use `.splice` to insert an item into the copy.

## Redux: Update an item in an array by index
We can use Array's `.map` to return a new value for a specific index, and leave the other elements unchanged.

## Redux: Remove an item from an array with `filter`
Array's `.filter` function will call the function you provide, pass in each existing item, and return a new array with only the items where your function returned "true" (or truthy). If you return false, that item gets removed.

## Easy State Updates with Immer
Deeply-nested object updates are difficult to read, difficult to write, and difficult to get right. Unit tests are imperative, but even thoes don't make the code much easier to read and write.

Thankfully, there's a library that can help. Using **Immer** by Michael Westrate, you can write the mutable code you know and love, with all the `[].push` and `[].pop` and `=` you can squeeze in there - and Immer will take that code and produce a perfect immutable update, like magic.

> Install: `npm install immer`

```JavaScript
import produce from 'immer';
```

By the way, it's called "produce" because it produces a new value, and the name is sort of the opposite of "reduce". 

From there, you can use the `produce` function to build yourself a nice little mutable playground, where all your mutations will be handled by the magic of JS Proxies.

```JavaScript
function immerifiedReducer(state, action) {
	const key = "ravenclaw";

	return produce(state, draft => {
		draft.houses[key].points += 3;
	});
}
```

## Using Immer with React State
Immer works well with plain React State, too - the "functional" form of setState.

You may already know that React's `setState` has a "functional" form that accepts a function and passes it the current state. The function then returns the new state:

```JavaScript
onIncrementClick = () => {
	// The normal form
	this.setState({
		count: this.state.count + 1
	});

	// The functional form:
	this.setState(state => {
		return {
			count: state.count + 1
		}
	})
}
```

Immer's `produce` function can be slotted in as the state update function. You'll notice this way of calling `produce` only passes a single argument - the update function - instead of two arguments `(state, draft) => {}` as we did in the reducer example.

```JavaScript
onIncrementClick = () => {
	// The Immer way:
	this.setState(produce(draft => {
		draft.count += 1;
	}));
}
```

This works because Immer's `produce` function is set up to return a "curried" function when it's called with only 1 argument. The function it returns, in this case, is ready to accept a state and call your update function with the draft.

## Gradually Adopting Immer
A nice feature of Immer is that because it's so small and focused (just one function that produces new states), it's easy to add it to an existing codebase and try it out.

Immer is backwards compatible with existing Redux reducers, too. If you wrap your existing `switch/case` in Immer's `produce` function, all of your reducer tests should still pass.

Earlier I showed that the update function you pass to `produce` can implicity return `undefined` and that it'll automatically pick up the changes to the `draft` state. What I didn't mention is that the update function can alternatively return a brand new state, as long as it hasn'g mad any changes to the `draft`.

This means your existing Redux reducers, which already return brand new states, can be wrapped with Immer's `produce` function and they should keep working exactly the same. At that point, you're free to replace hard-to-read immutable code at your leisure, piece by piece.

---