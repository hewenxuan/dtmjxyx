import {AbsAdapter} from "ListView";

const ListItem = require('club_memberlist_other_item');

cc.Class({
    extends: AbsAdapter,
    updateView(item, posIndex) {
        let comp = item.getComponent(ListItem);
        if (comp) {
            comp.initData(this.getItem(posIndex));
        }
    }
})