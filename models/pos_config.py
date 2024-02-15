from odoo import api, fields, models

class PosConfig(models.Model):
    _inherit = 'pos.config'

    # Add your custom field to the pos.config model
    disable_remove_order_line_basic_right = fields.Boolean(
        string="Disable Removal of Order Line for Basic Rights Users",
        help="If enabled, users with basic rights cannot remove order lines."
    )

    @api.model
    def get_res_config_settings(self):
        # Assuming 'module_example_setting' is a field in 'res.config.settings'
        settings = self.env['res.config.settings'].search([], limit=1)  # Get the latest settings
        return {
            'disable_remove_order_line_basic_right': settings.disable_remove_order_line_basic_right,
        }
