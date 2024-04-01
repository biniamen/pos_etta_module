/** @odoo-module */
import { patch } from "@web/core/utils/patch";
import { ActionpadWidget } from "@point_of_sale/app/screens/product_screen/action_pad/action_pad";
import {useService} from "@web/core/utils/hooks";

patch(ActionpadWidget.prototype,  {
    setup() {
         super.setup();
        // Assuming there's a method or property to check if the current user is a cashier
        // This is just a placeholder; you need to implement the actual check based on your system's roles or permissions
        this.isCashier = this.pos.get_cashier().role === 'manager';
        this.notification = useService("notification");

    },

    async submitOrder() {
        // Prevent order submission if the user is not a cashier
        if (!this.isCashier) {

             this.notification.add("Only cashiers are allowed to process payments.", {
                        type: 'Restricted Action',
                        sticky: false,
                    });
            return;
        }
        await super.submitOrder();
    },
});
