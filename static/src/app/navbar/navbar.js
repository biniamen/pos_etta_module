/** @odoo-module */

import { Navbar } from "@point_of_sale/app/navbar/navbar";
import { patch } from "@web/core/utils/patch";
import { _t } from "@web/core/l10n/translation";
import { FiscalReadingPopup } from "./FiscalReadingPopup/FiscalReadingPopup"; // Import FiscalReadingPopup

import { useService } from "@web/core/utils/hooks";
//import { useService } from "@web/core/utils/hooks";

patch(Navbar.prototype, {
    setup() {
        super.setup();
        //this.actionService = useService('action');
    },

    async onClick() {
         await this.popup.add(FiscalReadingPopup, {
                title: _t("Add Products"),
                body: _t("Please add products before clicking Home delivery"),
            });

    },
    onZReportClick() {

         // Access the session service to get user information
    },
    onXReportClick() {
        console.log("Print X Report Clicked");
    },

    // opening popup



});
