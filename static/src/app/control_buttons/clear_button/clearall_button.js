/** @odoo-module */
import {useService} from "@web/core/utils/hooks";
import { Component, useState } from "@odoo/owl"; // Corrected import here
import {ProductScreen} from "@point_of_sale/app/screens/product_screen/product_screen";
import {usePos} from "@point_of_sale/app/store/pos_hook";

export class ClearAllButton extends Component {
    static template = "pos_etta.ClearAllButton";
    setup() {
        this.pos = usePos();
        this.orm = useService("orm");
        this.state = useState({
            disabled: true, // Default to disabled
        });
        this.userRights = useState({ rights: 'Loading...' });

        this.checkUserRights();
        this.loadUserRights();

    }

     async loadUserRights() {
    // Assuming this.pos is correctly initialized via usePos() hook
    const currentUser = this.pos.user;
    let rightsDescription = 'Basic Rights';
    if (currentUser.role === 'manager') {
        rightsDescription = 'Advanced Rights';
    }
            console.log("User Rights:", rightsDescription);

    this.userRights.rights = rightsDescription;
}
    async checkUserRights() {
        // Example logic to determine if the user has Advanced rights
        // You'll need to replace this with actual logic based on your application's user rights management
        const userHasAdvancedRights = this.pos.user.role === 'manager';
        this.state.disabled = !userHasAdvancedRights;
    }


    async click() {
        if (this.state.disabled) {
            return; // Do nothing if button is disabled
        }

        var current_order = this.pos.get_order();
        if (current_order) {
            current_order.orderlines.filter(line => line.get_product()).forEach(single_line => current_order.removeOrderline(single_line));
        } else {
            console.log("No current order found.");
        }
    }
}
ProductScreen.addControlButton({
    component: ClearAllButton,
    condition: function () {
        return true; // Here you might also check for conditions to show the button
    },
});
