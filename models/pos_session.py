
from odoo import models


class PosSession(models.Model):
    """Model inherited to add additional functionality"""
    _inherit = 'pos.session'

    def _pos_ui_models_to_load(self):
        """Used to super the _pos_ui_models_to_load"""
        result = super()._pos_ui_models_to_load()
        result += [
            'res.config.settings',
        ]
        return result

    def _loader_params_res_config_settings(self):
        """Used to override the default settings for loading fields"""
        return {
            'search_params': {
                'fields': ['disable_remove_order_line_basic_right'],
            },
        }
    def _get_pos_ui_res_config_settings(self, params):
        """Used to get the parameters"""
        return self.env['res.config.settings'].search_read(
            **params['search_params'])
