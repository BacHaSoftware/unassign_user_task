# -*- coding: utf-8 -*-

from odoo import models

class ProjectTask(models.Model):
    _inherit = 'project.task'

    def unassign_user(self, userId=None):
        self.ensure_one()
        self.user_ids = [(3, userId)]

