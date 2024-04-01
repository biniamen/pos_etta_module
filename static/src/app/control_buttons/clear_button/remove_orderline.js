/** @odoo-module */

import {ProductScreen} from "@point_of_sale/app/screens/product_screen/product_screen";
import {patch} from "@web/core/utils/patch";
import {useService} from "@web/core/utils/hooks";

patch(ProductScreen.prototype, {
    setup() {
        super.setup();
// Ensure all original setup tasks are preserved
        this.orm = useService("orm");
        this.notification = useService("notification");
    },


    async onNumpadClick(buttonValue) {
        if (buttonValue === "Backspace") {
            const currentOrder = this.pos.get_order();
            if (currentOrder.get_orderlines().length === 0) {
                console.log("No order lines to remove.");
                return;
            }
<<<<<<< HEAD
            // Fetch the configuration parameter to determine if the current user can remove order lines
=======
// Fetch the configuration parameter to determine if the current user can remove order lines
>>>>>>> 006716b803746252bc12f154fbb8db081a6f1faa
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
    getNumpadButtons() {
        const buttons = super.getNumpadButtons(); // Call the original getNumpadButtons method
        const currentOrder = this.pos.get_order();

<<<<<<< HEAD
        // Check if there are no order lines
        const disableBackspace = currentOrder.get_orderlines().length === 0;

        // Find the Backspace button and Disable it
=======
// Check if there are no order lines
        const disableBackspace = currentOrder.get_orderlines().length === 0;

// Find the Backspace button and Disable it
>>>>>>> 006716b803746252bc12f154fbb8db081a6f1faa
        buttons.forEach(button => {
            if (button.value === "Backspace") {
                button.disabled = disableBackspace;
            }
        });

        return buttons;
    },

<<<<<<< HEAD
});
=======
});
>>>>>>> 006716b803746252bc12f154fbb8db081a6f1faa
