from odoo import fields, models

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    disable_remove_order_line_basic_right = fields.Boolean(
        string="Disable Basic Right Users for Remove Order Line",
        help="Disable users with basic rights to remove order lines in POS.",
        config_parameter='pos_config.disable_remove_order_line_basic_right',
    )
