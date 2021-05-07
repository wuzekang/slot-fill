"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSlot = exports.SlotFillProvider = void 0;
var react_1 = __importDefault(require("react"));
var SlotFillContext = react_1.default.createContext(undefined);
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
            return (react_1.default.isValidElement(element)
                ? react_1.default.cloneElement(element, { key: key })
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
var SlotFillProvider = function (_a) {
    var children = _a.children;
    var value = react_1.default.useMemo(function () {
        var managers = new Map();
        return function (slot) {
            if (!managers.get(slot)) {
                managers.set(slot, new SlotManager());
            }
            return managers.get(slot);
        };
    }, []);
    return (react_1.default.createElement(SlotFillContext.Provider, { value: value }, children));
};
exports.SlotFillProvider = SlotFillProvider;
function createSlot() {
    var Slot = function (_a) {
        var children = _a.children;
        var context = react_1.default.useContext(SlotFillContext);
        if (!context) {
            throw new Error('Invariant failed: You should not use <Slot> outside a <SlotProvider>');
        }
        var manager = react_1.default.useMemo(function () { return context(Slot); }, []);
        var _b = react_1.default.useState(function () { return manager.getContent(); }), content = _b[0], setContent = _b[1];
        react_1.default.useEffect(function () { return manager.subscribe(setContent); }, [manager]);
        return children ? children(content) : react_1.default.createElement(react_1.default.Fragment, null, content);
    };
    var Fill = function (_a) {
        var children = _a.children;
        var context = react_1.default.useContext(SlotFillContext);
        if (!context) {
            throw new Error('Invariant failed: You should not use <Fill> outside a <SlotProvider>');
        }
        var _b = react_1.default.useMemo(function () { return context(Slot).fill(); }, []), update = _b.update, remove = _b.remove;
        react_1.default.useEffect(function () { return remove; }, [remove]);
        react_1.default.useEffect(function () { return update(children); }, [update, children]);
        return null;
    };
    Slot.Fill = Fill;
    return Slot;
}
exports.createSlot = createSlot;
