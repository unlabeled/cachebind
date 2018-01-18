## BindCache ##

It **caches/memoizes** result of binding function with its context and args. For the same set it returns identical result every time.

> This version doesn't use any shims or polyfills. If you don't have their substitutes in your projects you may need to use use version with the shims [bindcache](https://www.npmjs.com/package/bindcache) instead of this.

## Motivation ##
It solves the problem of unnecessary renders for React in cases of usage arrow function or `Function.prototype.bind` in render method. It also keep up with `jsx-no-bind` rule which is used to detact such issues.

```javascript
class MyComponent extends Component {
    onChange() {
        // ...    
    }

    render () {
        const { param } = this.props
        return (
            <div>
                <SomeComponent someParam={"value"}>
                <OtherComponent callback={this.onChange.bind(this, param, "MyComponent")}/>
            </div>    
        )
    }
}
```
This code will make `OtherComponent` to render every time this render function will be fired.

## Api ##

If you need to bind context:
```typescript
bind(context: any, fn: () => void, args?: any | Array<any>)
```

If you don't need context:
```typescript
bindArgs(fn: () => void, args?: any | Array<any>)
```

- **context** — context,
- **fn** — function to bind,
- **args** — any number of arguments of any type devided by commas.


## Usage ##

```shell
npm install bindcache
```

```javascript
import { bind } from "bindcache"

class MyComponent extends Component {
    onChange(param, component) {
        // ...
    }

    render () {
        const { param } = this.props
        return (
            <div>
                <SomeComponent someParam={"value"}>
                <OtherComponent callback={bind(this, this.onChange, param, "MyComponent")}/>
            </div>    
        )
    }
}
```
If you don't need the context of the function or it is already present/binded you can use `bindArgs` util instead. The previous code can be written like this.

```javascript
import { bindArgs } from "bindcache"

class MyComponent extends Component {
    onChange = (param, component) => { /* ... */ }

    render () {
        const { param } = this.props
        return (
            <div>
                <SomeComponent someParam={"value"}>
                <OtherComponent callback={bindArgs(this.onChange, param, "MyComponent")}/>
            </div>    
        )
    }
}
```

`bindArgs(fn, ...args)` is equal to `bind(undefined, fn, ...args)`

## How it works ##

The util caches results of binding in native WeakMap so the items with no references can be garbage collected.

## Tips ##

`bind` util lets you feed it with context for the function. But it is better not to use that option since it will take more memory and be slower. Use `bindArg` or `bind` with undefined context. You can use arrow function (as it was shown above), or bind context once with decorator:
```javascript
class MyComponent extends Component {
    @autoBind
    onChange(param, component) {
        // ...
    }
    // ...
}
```
 or cache the result of binding in constructor:
 ```javascript
class MyComponent extends Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
    }

    onChange(param, component) {
        // ...
    }
    // ...
}
```

It is not suggested to use this utils instead of `Function.prototype.bind` in every case. The original bind function is still faster. For example if you need to bind context with no args or your params are static for the component you can bind it one time in constructor function. But it will help you great deal in case of unnecessary renders of react components.