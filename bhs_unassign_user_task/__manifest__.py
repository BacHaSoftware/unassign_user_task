{
    'name': "Unassigned user widget",
    'version': '15.0.1.0.0',
    'summary': """Unassigned user widget""",
    'description': """Unassigned user from task when click avatar user""",
    'category': 'Project',
    'author': 'Bac Ha Software',
    'company': 'Bac Ha Software',
    'maintainer': 'Bac Ha Software',
    'website': "https://bachasoftware.com",
    'depends': ['project'],
    'data': [
        'views/project_task_view.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'bhs_unassign_user_task/static/src/js/many2x_avatar_user_task.js',
        ],
        'web.assets_qweb': [
            'bhs_unassign_user_task/static/src/xml/many2x_avatar_user_task.xml',
        ],
    },
    'images': ['static/description/banner.png'],
    'license': "AGPL-3",
    'installable': True,
    'application': True,
}
