/** @odoo-module */

import {useService} from "@web/core/utils/hooks";
import {useState} from "@odoo/owl";
import {patch} from "@web/core/utils/patch";
import {RefundButton} from "@point_of_sale/app/screens/product_screen/control_buttons/refund_button/refund_button";
import {usePos} from "@point_of_sale/app/store/pos_hook";

patch(RefundButton.prototype, {

    setup() {
        super.setup();
        this.pos = usePos();
        this.orm = useService("orm");
        this.state = useState({
            disabled: true, // Default to disabled
        });
        this.userRights = useState({rights: 'Loading...'});
        this.loadUserRights();

        this.checkUserRights();
        this.loadConfigSettings();
        //this.actionService = useService('action');
    },
    async loadUserRights() {
        // Assuming this.pos is correctly initialized via usePos() hook
        const currentUser = this.pos.user;
        let rightsDescription = 'Basic Rights';
        if (currentUser.role === 'manager') {
            rightsDescription = 'Advanced Rights';
        }
        this.userRights.rights = rightsDescription;
    },
    async click() {
        if (this.state.disabled) {
            console.log("User does not have rights to use the refund.");
            return; // Do nothing if button is disabled
        }
        // const data = this.env.services.pos.config;
        // console.log(data);
        // Call the original click method using super
        await super.click();
        // Log a message to the console after the original click action
        console.log("Refund button clicked!");
    },
    async checkUserRights() {
        // Ensure pos service is available
        if (!this.pos) {
            console.error('POS service is not available.');
            return;
        }

        const currentUser = this.pos.user;
        if (!currentUser) {
            console.error('Current user is undefined.');
            return;
        }

        const userHasRefundRights = currentUser.role === 'manager';
        this.state.disabled = !userHasRefundRights;
    },


    async loadConfigSettings() {
        // Fetch the configuration parameter
        const configParam = await this.orm.call('ir.config_parameter', 'get_param', ['pos_config.disable_remove_order_line_basic_right']);
        // Directly update the component's state based on the fetched value
        this.state.disabled = configParam === 'True';
        console.log(configParam)
    },

});