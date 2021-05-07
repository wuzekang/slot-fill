Slot & Fill component for merging React subtrees together.

## Installation

```
npm install slot-fill --save
```

### Check out the examples locally

```
git clone https://github.com/wuzekang/slot-fill
cd slot-fill/example
npm install
npm start
```

## Usage


### Toolbar.js

```jsx
import { createSlot, SlotFillProvider } from 'slot-fill';

const Slot = createSlot();

const Toolbar = () => (
  <div>
    <Slot />
  </div>
)

Toolbar.Item = (props) => (
  <Slot.Fill name="Toolbar.Item">
    <button>{ props.label }</button>
  </Slot.Fill>
)

export default Toolbar;
```

### Feature.js

```jsx
const Feature = () => [
  <Toolbar.Item label="My Feature!" />
];
```

### App.js

```jsx
import { SlotFillProvider } from 'slot-fill';
import Toolbar from './Toolbar';
import Feature from './Feature';

const App = () => (
  <SlotFillProvider>
    <Toolbar />
    <Feature />
  </SlotFillProvider>
)

ReactDOMFiber.render(
  <App />,
  document.getElementById('root')
);
```


## Components

### SlotFillProvider

Creates a Slot/Fill context. All Slot/Fill components must be descendants of Provider. You may only pass a single descendant to `SlotFillProvider`.


### createSlot

Creates a slot instance

```jsx
import { createSlot } from 'slot-fill';

const Slot = createSlot();

<Slot />

<Slot.Fill>
  Fill Content
</Slot.Fill>

<Slot>
  {
    children => <div>{children}</div>
  }
</Slot>
```

## Reference

```typescript
export declare const SlotFillProvider: React.FC;

export interface SlotProps {
    children?: (children: React.ReactNode[]) => ReturnType<React.FC>;
}
export interface Slot {
    (props: SlotProps): ReturnType<React.FC>;
    Fill: React.ComponentType;
}
export declare function createSlot(): Slot;
```
