/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { useState } from "@odoo/owl";

// Patching the ProductScreen to include user rights information
patch(ProductScreen.prototype, {
    setup() {
        super.setup();
        this.userRights = useState({ rights: 'Loading...' });
        this.loadUserRights();
    },
    async loadUserRights() {
    // Assuming this.pos is correctly initialized via usePos() hook
    const currentUser = this.pos.user;
    let rightsDescription = 'Basic Rights';
    if (currentUser.role === 'manager') {
        rightsDescription = 'Advanced Rights';
    }
            console.log("User Rights:", rightsDescription);

    this.userRights.rights = rightsDescription;
},
});
