/** @odoo-module */
import { useService } from "@web/core/utils/hooks";
import { Component } from "@odoo/owl";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { usePos } from "@point_of_sale/app/store/pos_hook";

export class DiscountButton extends Component {
    static template = "pos_etta.DiscountButton";
    setup() {
        this.pos = usePos();
        this.orm = useService("orm");
    }

    click() {
        var current_order = this.pos.get_order();
        if (current_order) {
            const selectedLine = current_order.get_selected_orderline();
            if (selectedLine) {
                // set_discount method located in app/store/model file
                selectedLine.set_discount(5);
                console.log("5% discount applied to the selected line.");
            } else {
                console.log("No line selected.");
            }
        }
    }
}

ProductScreen.components['DiscountButton'] = DiscountButton;

ProductScreen.addControlButton({
    component: DiscountButton,
    condition: function () {
        return true;
    },
});
