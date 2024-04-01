/** @odoo-module **/

import { patch } from '@web/core/utils/patch';
import { useService } from '@web/core/utils/hooks';
import models from 'point_of_sale.models';
import { PosModel } from 'point_of_sale.models';

patch(PosModel.prototype, 'pos_invoice_attachment_print.PosModelExtension', {
    async willStart() {
        console.log("working")
        const superWillStart = this._super.apply(this, arguments);
        // Load configuration or perform initial setup here
        // Example: Load a setting to determine if invoice attachments should be printed
        const orm = useService("orm");
        const configParam = await orm.call('res.config.settings', 'get_values', []);
        this.printInvoiceAttachment = configParam.print_invoice_attachment;
        return superWillStart;
    },

    print_invoice_attachment: function() {
        // This function is called to print the invoice attachment
        if (this.printInvoiceAttachment) {
            console.log('Implement the logic to print the invoice attachment here.');
            // Here you would add the logic to actually print the invoice attachment.
            // This might involve calling a backend method to get the attachment URL or data,
            // and then using JavaScript to send it to the printer.
        } else {
            console.log('Printing invoice attachments is disabled.');
        }
    },
});
