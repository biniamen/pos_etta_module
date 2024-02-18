/** @odoo-module */

import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";

patch(ProductScreen.prototype, {
    setup() {
        super.setup();
        // Ensure all original setup tasks are preserved
        this.orm = useService("orm");
        this.notification = useService("notification");
    },

    async onNumpadClick(buttonValue) {
        // Check if the backspace button was clicked
        if (buttonValue === "Backspace") {
            // Fetch the configuration parameter to determine if the current user can remove order lines
            const configParam = await this.orm.call('ir.config_parameter', 'get_param', ['pos_config.disable_remove_order_line_basic_right']);
            if (configParam === 'True') {
                if (this.pos.get_cashier().role !== 'manager') {
                    // If the user does not have advanced rights, display a notification and prevent further actions
                    this.notification.add("Only users with Advanced Rights can remove order lines.", {
                        type: 'danger',
                        sticky: false,
                    });
                    console.log("User lacks rights to remove order lines.");
                    return; // Stop the method execution here
                }
            }
        }
        await super.onNumpadClick(buttonValue);
    },
});
