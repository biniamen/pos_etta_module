# -*- coding: utf-8 -*-
{
    "name": "POS Fiscal ETTA",
    "summary": "Module for handeling fiscal printing with SUNMI devices",
    "author": "Melkam Zeyede",
    "version": "0.1",
    "depends": ["point_of_sale"],
    'data': [
        'views/res_config_settings_views.xml',
        'views/assets.xml',
    ],
    "assets": {
        'point_of_sale._assets_pos': [
            'pos_etta/static/src/app/**/*',
        ],
        'point_of_sale.assets': [
            'pos_etta/static/src/app/control_button/*',
        ],

    },
    "installable": True,
    "application": True,
    'license': 'LGPL-3',
}