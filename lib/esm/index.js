import React from 'react';
var SlotFillContext = React.createContext(undefined);
var SlotManager = /** @class */ (function () {
    function SlotManager() {
        this.currentKey = 0;
        this.elements = new Map();
        this.callbacks = new Set();
    }
    SlotManager.prototype.nextKey = function () {
        return (this.currentKey =
            this.currentKey >= Number.MAX_SAFE_INTEGER ? 0 : this.currentKey + 1);
    };
    SlotManager.prototype.getContent = function () {
        return Array.from(this.elements.entries()).map(function (_a) {
            var key = _a[0], element = _a[1];
            return (React.isValidElement(element)
                ? React.cloneElement(element, { key: key })
                : element);
        });
    };
    SlotManager.prototype.subscribe = function (callback) {
        var _this = this;
        callback(this.getContent());
        this.callbacks.add(callback);
        return function () {
            _this.callbacks.delete(callback);
        };
    };
    SlotManager.prototype.broadcast = function () {
        var children = this.getContent();
        this.callbacks.forEach(function (callback) { return callback(children); });
    };
    SlotManager.prototype.fill = function () {
        var _this = this;
        var key = this.nextKey();
        return {
            update: function (element) {
                _this.elements.set(key, element);
                _this.broadcast();
            },
            remove: function () {
                _this.elements.delete(key);
                _this.broadcast();
            },
        };
    };
    return SlotManager;
}());
export var SlotFillProvider = function (_a) {
    var children = _a.children;
    var value = React.useMemo(function () {
        var managers = new Map();
        return function (slot) {
            if (!managers.get(slot)) {
                managers.set(slot, new SlotManager());
            }
            return managers.get(slot);
        };
    }, []);
    return (React.createElement(SlotFillContext.Provider, { value: value }, children));
};
export function createSlot() {
    var Slot = function (_a) {
        var children = _a.children;
        var context = React.useContext(SlotFillContext);
        if (!context) {
            throw new Error('Invariant failed: You should not use <Slot> outside a <SlotProvider>');
        }
        var manager = React.useMemo(function () { return context(Slot); }, []);
        var _b = React.useState(function () { return manager.getContent(); }), content = _b[0], setContent = _b[1];
        React.useEffect(function () { return manager.subscribe(setContent); }, [manager]);
        return children ? children(content) : React.createElement(React.Fragment, null, content);
    };
    var Fill = function (_a) {
        var children = _a.children;
        var context = React.useContext(SlotFillContext);
        if (!context) {
            throw new Error('Invariant failed: You should not use <Fill> outside a <SlotProvider>');
        }
        var _b = React.useMemo(function () { return context(Slot).fill(); }, []), update = _b.update, remove = _b.remove;
        React.useEffect(function () { return remove; }, [remove]);
        React.useEffect(function () { return update(children); }, [update, children]);
        return null;
    };
    Slot.Fill = Fill;
    return Slot;
}
