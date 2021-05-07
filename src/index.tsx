import React from 'react';

export type UpdateCallback = (children: React.ReactNode[]) => void;

interface SlotFillContextValue {
  (slot: Slot): SlotManager;
}

const SlotFillContext = React.createContext<SlotFillContextValue | undefined>(
  undefined
);

export interface SlotProps {
  children?: (children: React.ReactNode[]) => ReturnType<React.FC>;
}

export interface Slot {
  (props: SlotProps): ReturnType<React.FC>;
  Fill: React.ComponentType;
}

class SlotManager {
  currentKey = 0;
  elements = new Map<number, React.ReactNode>();
  callbacks = new Set<UpdateCallback>();

  nextKey() {
    return (this.currentKey =
      this.currentKey >= Number.MAX_SAFE_INTEGER ? 0 : this.currentKey + 1);
  }

  getContent() {
    return Array.from(this.elements.entries()).map(
      ([key, element]) =>
        (React.isValidElement(element)
          ? React.cloneElement(element, { key })
          : element) as React.ReactNode
    );
  }

  subscribe(callback: UpdateCallback) {
    callback(this.getContent());
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  broadcast() {
    const children = this.getContent();
    this.callbacks.forEach((callback) => callback(children));
  }

  fill() {
    const key = this.nextKey();
    return {
      update: (element: React.ReactNode) => {
        this.elements.set(key, element);
        this.broadcast();
      },
      remove: () => {
        this.elements.delete(key);
        this.broadcast();
      },
    };
  }
}

export const SlotFillProvider: React.FC = ({ children }) => {
  const value = React.useMemo<SlotFillContextValue>(() => {
    const managers = new Map<Slot, SlotManager>();
    return (slot) => {
      if (!managers.get(slot)) {
        managers.set(slot, new SlotManager());
      }
      return managers.get(slot) as SlotManager;
    };
  }, []);
  return (
    <SlotFillContext.Provider value={value}>
      {children}
    </SlotFillContext.Provider>
  );
};

export function createSlot(): Slot {
  const Slot = ({ children }: SlotProps) => {
    const context = React.useContext(SlotFillContext);
    if (!context) {
      throw new Error(
        'Invariant failed: You should not use <Slot> outside a <SlotProvider>'
      );
    }
    const manager: SlotManager = React.useMemo(() => context(Slot), []);
    const [content, setContent] = React.useState(() => manager.getContent());
    React.useEffect(() => manager.subscribe(setContent), [manager]);
    return children ? children(content) : <>{content}</>;
  };

  const Fill: React.FC = ({ children }) => {
    const context = React.useContext(SlotFillContext);
    if (!context) {
      throw new Error(
        'Invariant failed: You should not use <Fill> outside a <SlotProvider>'
      );
    }
    const { update, remove } = React.useMemo(() => context(Slot).fill(), []);
    React.useEffect(() => remove, [remove]);
    React.useEffect(() => update(children), [update, children]);
    return null;
  };

  Slot.Fill = Fill;
  return Slot;
}
