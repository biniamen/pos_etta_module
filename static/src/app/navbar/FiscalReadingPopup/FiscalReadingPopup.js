/** @odoo-module */

import {useService} from "@web/core/utils/hooks";
import {useState} from "@odoo/owl";
import {usePos} from "@point_of_sale/app/store/pos_hook";
import {AbstractAwaitablePopup} from "@point_of_sale/app/popup/abstract_awaitable_popup";
import { _t } from "@web/core/l10n/translation";

export class FiscalReadingPopup extends AbstractAwaitablePopup {
    static template = "pos_etta.FiscalReadingPopup";

    setup() {
        super.setup();
        this.env.services.notification = useService('notification');
        // this.notification = useService("pos_notification");
        this.popup = useService("popup");
        this.orm = useService("orm");
        this.pos = usePos();
        this.hardwareProxy = useService("hardware_proxy");
        this.printer = useService("printer");
        this.state = useState({
            byDateRange: true,
            showNumberFields: false,
            showDateFields: true, // Show date fields by default
            fromDate: this.formatDate(new Date()), // Assuming formatDate is a method you've defined
            toDate: this.formatDate(new Date()),
            fromZno: null,
            toZno: null,
            detailed: false
        });
        // Access customers from the POS model
    this.state.customers = this.pos.db.get_partners_sorted();
    this.state.selectedCustomer = null;
    }

    // Helper function to format the date as a string
    formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        return `${year}-${month}-${day}`; // Format as YYYY-MM-DD for input[type="date"]
    }

    // Method to handle changes in the "By Date Range" checkbox
    onDateRangeChange() {
        this.state.byDateRange = !this.state.byDateRange;
        this.toggleFieldVisibility();
    }

    // Method to toggle the visibility of the date and number fields
    toggleFieldVisibility() {
        if (this.state.byDateRange) {
            this.state.showDateFields = true;
            this.state.showNumberFields = false;
        } else {
            this.state.showDateFields = false;
            this.state.showNumberFields = true;
        }
    }

    // Method to validate the input before printing
    validateInputBeforePrint() {
        if (!this.state.byDateRange && (this.state.fromZno >= this.state.toZno)) {
            this.state.errorMessage = "Invalid Input \"From Z No\" cannot be greater or equal to \"To Z No\"";
            return false;
        } else if (this.state.byDateRange && (new Date(this.state.fromDate) >= new Date(this.state.toDate))) {
            this.state.errorMessage = "Invalid Input \"From Date\" cannot be greater or equal to \"To Date\"";
            return false;
        }
        this.state.errorMessage = null;
        return true;
    }

    // This method is called when the Print button is clicked
    async onPrintButtonClick() {

        if (this.validateInputBeforePrint()) {
            // If there's no validation error, create a JSON object
            const output = {
                by_date_range: this.state.byDateRange,
                from_date: this.state.fromDate,
                to_date: this.state.toDate,
                from_zno: this.state.fromZno,
                to_zno: this.state.toZno,
                detailed: this.state.detailed
            };

            console.log(JSON.stringify(output));

            try {
                // Call the printFiscalReports method and wait for it to complete
                await this.printFiscalReports(output);
                // After printFiscalReports completes, show a success notification
                this.env.services.notification.add("Print job is successfully submitted.", {
                    type: 'success',
                    sticky: false,
                    timeout: 10000,

                });
                super.cancel()

            } catch (error) {
                console.error("Error during printing:", error);
                // Handle any errors that occur during the printFiscalReports call
                // Optionally, show an error message to the user
            }
        } else {
            // Show the error message because the input is not valid
            this.showErrorMessage();
        }
    }


    // Method to display the error message
    showErrorMessage() {
        if (this.state.errorMessage) {
            // Replace `notification` with the actual name of the notification service in your Odoo environment
            this.env.services.notification.add(this.state.errorMessage, {
                type: 'danger', // Error notification
                sticky: false, // The notification will disappear after the timeout
                timeout: 10000,
            });
        }
    }

async printFiscalReports(result) {
    // Define a fallback translation function in case this.env._t isn't available.
    const _t = this.env && this.env._t ? this.env._t : (key) => key;

    if (window.Android !== undefined && window.Android.isAndroidPOS()) {
        try {
            const posResult = await window.Android.printFiscalReports(JSON.stringify(result));
            const responseObject = JSON.parse(posResult);

            if (responseObject.success) {
                await this.env.services.popup.showPopup('ConfirmPopup', {
                    title: _t('Fiscal Report Printing Done'),
                    body: _t(responseObject.message)
                });
            } else {
                await this.env.services.popup.showPopup('ConfirmPopup', {
                    title: _t('Fiscal Report Printing Failed'),
                    body: _t(responseObject.message)
                });
            }
            return responseObject;
        } catch (error) {
            console.error('An error occurred while printing fiscal reports:', error);
            await this.env.services.popup.showPopup('ErrorPopup', {
                title: _t('Fiscal Report Printing Error'),
                body: _t('An unexpected error occurred.')
            });
            throw error;
        }
    } else {
        console.log('Android POS interface is not available.');
        await this.showPopup('ErrorPopup', {
            title: _t('Fiscal Report Printing Error'),
            body: _t('Android POS interface is not available.')
        });
        throw new Error('Android POS interface is not available.');
    }
}

    // async printFiscalReports(result) {
    //     // Check if we're running within an Android WebView with the required interface
    //     if (window.Android !== undefined && window.Android.isAndroidPOS()) {
    //         try {
    //             // Attempt to print the fiscal reports with the Android POS system
    //             const posResult = window.Android.printFiscalReports(JSON.stringify(result));
    //             const responseObject = JSON.parse(posResult);
    //
    //             // Check the response and show an appropriate popup
    //             if (responseObject.success) {
    //                 await this.showPopup('ConfirmPopup', {
    //                     title: this.env._t('Fiscal Report Printing Done'),
    //                     body: this.env._t(responseObject.message)
    //                 });
    //             } else {
    //                 await this.showPopup('ConfirmPopup', {
    //                     title: this.env._t('Fiscal Report Printing Failed'),
    //                     body: this.env._t(responseObject.message)
    //                 });
    //             }
    //         } catch (error) {
    //             console.error('An error occurred while printing fiscal reports:', error);
    //             // Handle any exceptions that occurred during the process
    //             await this.showPopup('ErrorPopup', {
    //                 title: this.env._t('Fiscal Report Printing Error'),
    //                 body: this.env._t('An unexpected error occurred.')
    //             });
    //         }
    //     }
    // }


}
