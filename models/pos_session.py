
from odoo import api, models


class PosSession(models.Model):
    """Model inherited to add additional functionality"""
    _inherit = 'pos.session'

    @api.model
    def login(self, login_number, user_id, pos_config_id):
        res = super(PosSession, self).login(login_number, user_id, pos_config_id)
        if res.get('code') == 200:
            pos_config = self.env['pos.config'].browse(pos_config_id)
            res['data']['res_config_settings'] = pos_config.get_res_config_settings()
        return res
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
