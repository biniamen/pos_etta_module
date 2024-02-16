/** @odoo-module */

import {TicketScreen} from "@point_of_sale/app/screens/ticket_screen/ticket_screen";
import {patch} from "@web/core/utils/patch";
import {useService} from "@web/core/utils/hooks";
import {useState} from "@odoo/owl";

patch(TicketScreen.prototype, {
    setup() {
        super.setup();
        // Inject the ORM service to interact with the backend.
        this.orm = useService("orm");
        this.userRights = useState({rights: 'Loading...'});
        this.env.services.notification = useService('notification');

        this.loadConfig();
    },
    async loadConfig() {
        // Fetch the configuration parameter only once and store it.
        const configParam = await this.orm.call('ir.config_parameter', 'get_param', ['pos_config.disable_remove_order_line_basic_right']);
        this.pos.config.disable_remove_order_line_basic_right = (configParam === 'True');
    },
    async onDeleteOrder(order) {
        if (this.pos.config.disable_remove_order_line_basic_right) {
            const userHasAdvancedRights = this.pos.user.role === 'manager';
            if (!userHasAdvancedRights) {
                // If the user does not have advanced rights
                this.env.services.notification.add("Only Advanced Rights User Can delete orders.", {
                    type: 'danger',
                    sticky: false,
                    timeout: 10000,

                });
                console.log("Only users with Advanced Rights can delete orders.");
                return;
            }
        }

        await super.onDeleteOrder(order);
        console.log("this order is deleted")
    },


});
