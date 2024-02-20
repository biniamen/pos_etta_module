/** @odoo-module */

import { SplitBillScreen } from "@pos_restaurant/app/split_bill_screen/split_bill_screen";
import {patch} from "@web/core/utils/patch";
import {useService} from "@web/core/utils/hooks";
import {useState} from "@odoo/owl";

patch(SplitBillScreen.prototype, {
    setup() {
        super.setup();
        // Inject the ORM service to interact with the backend.
        this.orm = useService("orm");

    },

    async onClickLine() {




        console.log("SplitBillScreen Working")
    },


});
