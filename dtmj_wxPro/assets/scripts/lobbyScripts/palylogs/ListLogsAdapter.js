import {AbsAdapter} from "ListView";

const ListItem = require('playlogitem');

cc.Class({
    extends: AbsAdapter,
    updateView(item, posIndex) {
        let comp = item.getComponent(ListItem);
        if (comp) {
            comp.initData(this.getItem(posIndex));
        }
    }
})