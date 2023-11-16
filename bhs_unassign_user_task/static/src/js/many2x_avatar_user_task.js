/** @odoo-module **/

import fieldRegistry from 'web.field_registry';

import { Many2OneAvatarUser, KanbanMany2OneAvatarUser, KanbanMany2ManyAvatarUser, ListMany2ManyAvatarUser } from '@mail/js/m2x_avatar_user';
import { Many2ManyAvatarUser } from '@mail/js/m2x_avatar_user';
import { KanbanMany2ManyTagsAvatar, ListMany2ManyTagsAvatar } from 'web.relational_fields';

import { qweb as QWeb, _t, core } from 'web.core';
import Dialog from 'web.Dialog';

const { Component } = owl;


// This module defines variants of the Many2OneAvatarUser and Many2ManyAvatarUser
// field widgets, to support fields pointing to 'res.users'. It also defines the
// kanban version of the Many2OneAvatarUserTask widget.
//
// Usage:
//   <field name="user_id" widget="many2one_avatar_user_task"/>
//   <field name="user_ids" widget="many2many_avatar_user_task"/>

const M2XAvatarUserTaskMixin = {
    supportedModels: ['res.users'],

    init() {
        this._super(...arguments);
//        console.log(this.field.relation)
//        if (!this.supportedModels.includes(this.field.relation)) {
//            throw new Error(`This widget is only supported on many2one and many2many fields pointing to ${JSON.stringify(this.supportedModels)}`);
//        }
//        this.className = `${this.className || ''} o_clickable_m2x_avatar`.trim();
//        this.noOpenChat = this.nodeOptions.no_open_chat || false;
//        BHS
        this.ShowOptions = this.nodeOptions.show_options || false;
    },

    //--------------------------------------------------------------------------
    // BHS - Handlers
    //--------------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Private
    //----------------------------------------------------------------------
    /**
     * Opens a option template window with the given user id.
     *
     * @private
     * @param {Object} params
     * @returns {Promise}
     */
    async _openOptions(params) {
        if (this.ShowOptions) {
//            console.log(params);
//            console.log(this);
            self = this;
            params['task_name'] = self.recordData.name;
            return new Promise((resolve, reject) => {
                new Dialog(this, {
                    title: _t('Notification'),
                    size: 'small',
                    $content: $(QWeb.render('UserOptionsPopUp', params)),
                    buttons: [{
                        text: _t('Remove from card'),
                        classes: 'btn-primary',
                        close: true,
                        click: function () {
                            var userId = params.userId
                            this._rpc({
                                model: 'project.task',
                                method: 'unassign_user',
                                kwargs: {userId: userId},
                                args: [[self.recordData.id]]
                            });

                            this.trigger_up('reload');
                        },
                    }],
                }).open();
            });
        }
        else{
            if (!this.noOpenChat) {
                const messaging = await Component.env.services.messaging.get();
                return messaging.openChat(params);
            }
        }
        return Promise.resolve();
    },

    /**
     * @override
     */
//    _onAvatarClicked(ev) {
//        ev.stopPropagation(); // in list view, prevent from opening the record
////        const employeeId = this._getEmployeeID(ev);
//        const userId = parseInt(ev.target.getAttribute('data-id'), 10);
//        this._openChat({ userId: userId });
//    }
};

export const Many2OneAvatarUserTask = Many2OneAvatarUser.extend(M2XAvatarUserTaskMixin);
export const KanbanMany2OneAvatarUserTask = KanbanMany2OneAvatarUser.extend(M2XAvatarUserTaskMixin);

fieldRegistry.add('many2one_avatar_user_task', Many2OneAvatarUserTask);
fieldRegistry.add('kanban.many2one_avatar_user_task', KanbanMany2OneAvatarUserTask);

const M2MAvatarUserTaskMixin = Object.assign(M2XAvatarUserTaskMixin, {
    /**
     * @private
     * @param {MouseEvent} ev
     */
    _onAvatarClicked(ev) {
        ev.stopPropagation(); // in list view, prevent from opening the record
        const userId = parseInt(ev.target.getAttribute('data-id'), 10);
        const user_name = ev.target.getAttribute('title');
        const user_ava = ev.target.getAttribute('src');
        this._openOptions({ userId: userId,user_name: user_name,user_ava: user_ava });
    },
});

export const Many2ManyAvatarUserTask = Many2ManyAvatarUser.extend(M2MAvatarUserTaskMixin, {});

export const KanbanMany2ManyAvatarUserTask = KanbanMany2ManyAvatarUser.extend(M2MAvatarUserTaskMixin, {});

export const ListMany2ManyAvatarUserTask = ListMany2ManyAvatarUser.extend(M2MAvatarUserTaskMixin, {});

fieldRegistry.add('many2many_avatar_user_task', Many2ManyAvatarUserTask);
fieldRegistry.add('kanban.many2many_avatar_user_task', KanbanMany2ManyAvatarUserTask);
fieldRegistry.add('list.many2many_avatar_user_task', ListMany2ManyAvatarUserTask);

export default {
    Many2OneAvatarUserTask,
};
