import { Utility, Type } from "@geomtoy/util";
import { validAndWithSameOwner } from "../decorator";
import EventObject from "../event/EventObject";
import EventTarget from "../base/EventTarget";

import type Geomtoy from "../geomtoy";
import type Shape from "../base/Shape";

class Group extends EventTarget {
    private _items: Shape[] = [];

    constructor(owner: Geomtoy, items: Shape[]);
    constructor(owner: Geomtoy);
    constructor(o: Geomtoy, a1?: any) {
        super(o);
        if (Type.isArray(a1)) {
            Object.assign(this, { items: a1 });
        }
        return Object.seal(this);
    }
    static readonly events = Object.freeze({
        itemsReset: "reset" as const
    });

    private _setItems(value: Shape[]) {
        if (!Utility.isEqualTo(this._items, value)) this.trigger_(EventObject.simple(this, Group.events.itemsReset));
        this._items = value;
    }

    get items() {
        return this._items;
    }
    set items(value) {
        this._setItems(value);
    }

    toString() {
        // prettier-ignore
        return [
            `${this.name}(${this.uuid}){`,
            `\tlength: ${this.items.length}`,
            `} owned by Geomtoy(${this.owner.uuid})`
        ].join("\n")
    }
    toArray() {
        return [];
    }
    toObject() {
        return {};
    }
}

validAndWithSameOwner(Group);

export default Group;
