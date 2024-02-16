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
        this.loadResConfigSettings2();

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
        if (this.pos.get_cashier().role !== 'manager') {
            this.showErrorMessage("Restricted Access. Please Contact Supervisor.");
            return; // Do nothing if button is disabled
        }
//Create a Beep Sound from Device
        await super.click();
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
    // this one must replace the exiting
    async loadResConfigSettings2() {
        const posConfig = this.pos.config;
        if (!posConfig.is_loaded_res_config_settings) {
            // Fetch the additional fields from 'pos.config' and store them
            const fields = await this.orm.call('pos.config', 'read', [posConfig.id, ['disable_remove_order_line_basic_right']]);
            posConfig.disable_remove_order_line_basic_right = fields[0].disable_remove_order_line_basic_right;
            posConfig.is_loaded_res_config_settings = true;
        }

        // Update the state based on the disable_remove_order_line_basic_right value
        this.state.disabled = posConfig.disable_remove_order_line_basic_right;

        console.log('Refund Button Disabled:', this.state.disabled);
    },

});