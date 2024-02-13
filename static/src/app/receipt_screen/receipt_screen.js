/** @odoo-module */

import { ReceiptScreen } from "@point_of_sale/app/screens/receipt_screen/receipt_screen";
import { patch } from "@web/core/utils/patch";

patch(ReceiptScreen.prototype, {
    async printReceipt() {
        var receiptData = this.pos.get_order().export_for_printing();
        receiptData.tenant = "odoo17";
        receiptData.client = this.pos.get_order().get_partner();
        console.log(JSON.stringify(receiptData));
        
        // console.log("RECEIPT => " + JSON.stringify(this.pos.get_order().export_for_printing()));
        // console.log("PARTNER => " + JSON.stringify(this.pos.get_order().get_partner()));
        alert("Hello Bini")
        // this.buttonPrintReceipt.el.className = "fa fa-fw fa-spin fa-circle-o-notch";
        // const isPrinted = await this.printer.print(
        //     OrderReceipt,
        //     {
        //         data: this.pos.get_order().export_for_printing(),
        //         formatCurrency: this.env.utils.formatCurrency,
        //     },
        //     { webPrintFallback: true }
        // );

        // if (isPrinted) {
        //     this.currentOrder._printed = true;
        // }

        // if (this.buttonPrintReceipt.el) {
        //     this.buttonPrintReceipt.el.className = "fa fa-print";
        // }
    }
});
