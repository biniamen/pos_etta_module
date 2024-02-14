from odoo import fields, models

class PosConfig(models.Model):
    _inherit = 'pos.config'

    # Add your custom field to the pos.config model
    disable_remove_order_line_basic_right = fields.Boolean(
        string="Disable Removal of Order Line for Basic Rights Users",
        help="If enabled, users with basic rights cannot remove order lines."
    )
