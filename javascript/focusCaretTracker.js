// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
/**
 * Copyright 2012-2013 Inclusive Design Research Centre, OCAD University.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * Author:\
 *   Joseph Scheuhammer <clown@alum.mit.edu>
 * Contributor:
 *   Magdalen Berns <thismagpie@live.com>
 */

const Atspi = imports.gi.Atspi;
const Lang = imports.lang;
const Signals = imports.signals;

let _atspiCallback = null;

const FocusCaretTracker = new Lang.Class({
    Name: 'FocusCaretTracker',

    _init: function() {
        Atspi.init();

        _atspiCallback = Lang.bind(this, this._changed);
        this._atspiListener = Atspi.EventListener.new(_atspiCallback);
        this._trackingFocus = false;
        this._trackingCaret = false;
    },

    /**
     * shutDown.
     */
    shutDown: function() {
        this.deregisterFocusEvents();
        this.deregisterCaretEvents();
        this.disconnectAll();
    },

    /**
     * registerFocusEvents:
     * @return: Boolean.
     */
    _registerFocusEvents: function() {

        if (this._trackingFocus) {
            return true;
        }

        let focusRegistered = false;
        let selectRegistered = false;

        try {
            focusRegistered = this._atspiListener.register(
                'object:state-changed:focused'
            );
            selectRegistered = this._atspiListener.register(
                'object:state-changed:selected'
            );
            log('registerFocusEvents: [' + focusRegistered + ',' + selectRegistered + ']');
        }
        catch (err) {
            log(err);
            focusRegistered = false;
            selectRegistered = false;

        }
        this._trackingFocus = focusRegistered;
        return this._trackingFocus;
    },

    /**
     * deregisterFocusEvents:
     * @return: Boolean.
     */
    _deregisterFocusEvents: function() {

        if (!this._trackingFocus) {
            return true;
        }
        let focusDeregistered = false;
        let selectDeregistered = false;

        try {
            focusDeregistered = this._atspiListener.deregister('object:state-changed:focused');
            selectDeregistered = this._atspiListener.deregister('object:state-changed:selected');
            log('deregisterFocusEvents: [' + focusDeregistered + ',' + selectDeregistered + ']');
        }
        catch (err) {
            log(err);
        }
        this._trackingFocus = !(focusDeregistered || selectDeregistered);
        return this._trackingFocus;
    },

    /**
     * registeredFocus
     * @return: Boolean.
     */
    registeredFocus: function() {
        return this._trackingFocus;
    },

    /**
     * registerCaretEvents
     * @return: Boolean.
     */
    _registerCaretEvents: function() {

        if (this._trackingCaret) {
            return true;
        }
        let registered = false;

        try {
            registered = this._atspiListener.register('object:text-caret-moved');
            log('registerCaretEvents: [' + registered + ']');
        }
         catch (err) {
            log(err);
        }
        this._trackingCaret = registered;
        return this._trackingCaret;
    },

    /**
     * deregisterCaretEvents
     * @return: Boolean.
     */
    _deregisterCaretEvents: function() {

        if (!this._trackingCaret){
            return true;
        }
        let deregistered = false;

        if (this._atspiListener) {
            try {
                deregistered = this._atspiListener.deregister(
                    'object:text-caret-moved'
                );
            }
            catch (err) {
                log(err);
            }
        }
        this._trackingCaret = !deregistered;
        return this._trackingCaret;
    },

    /**
     * RegisteredCaret
     * @return: Boolean.
     */
    registeredCaret: function() {
        return this._trackingCaret;
    },

    _changed: function(event) {

        if (event.type.indexOf('object:state-changed') == 0) {
            this.emit('focus-changed', event);
        }
        else if (event.type == 'object:text-caret-moved') {
            this.emit('caret-changed', event);
        }
    }
});

Signals.addSignalMethods(FocusCaretTracker.prototype);
/**
 * Override connect() from Signals to manage Atpsi registry internally.  If
 * the call to the Atspi registry fails, or the signal is unknown, no  connection
 * is made and this returns a negative value.
 * @name:     Name of the signal.
 * @callback: Function to call when signal is emitted.
 * @return:   Id of the connection.  If the call to Atspi registry fails,
 *            this returns a negative value (no connection made).
 */
FocusCaretTracker.prototype._connect = FocusCaretTracker.prototype.connect;
FocusCaretTracker.prototype.connect = function(name, callback) {
    let registered = false;

    if (name == 'focus-changed') {
        registered = this._registerFocusEvents();
    }
    else if (name == 'caret-changed') {
        registered = this._registerCaretEvents();
    }
    if (registered) {
      return this._connect(name, callback);
    }
    else {
      return -1;
   }
}
function onFocusCaret(caller, event) {
    let acc = event.source;

    if (acc) {
        let name = acc.get_name();
        let roleName = acc.get_role_name();

        if((name =='Terminal' || roleName=='terminal') || (event.type.indexOf('focus-changed') = 0 && event.type.indexOf('object:text-caret-moved') != 0)) {
            return;
        }
        log ('<accessible> : ' + name);
        log ('<caller> ' + caller);
        log ('<event> ' + event.type + ',' + event.detail1);
        log ('<contructor>' + acc.constructor);
        log ('<role name> ' + roleName);

        if(event.type.indexOf('object:text-caret-moved') == 0) {

            let text = acc.get_text_iface();

            if (text && text.get_caret_offset() >= 0) {

                try{
                    let offset = text.get_caret_offset();
                    text_extents = text.get_character_extents(offset, 0);

                    if (text_extents) {
                        log ('<text_extents> '+text_extents.x + ' ' + text_extents.y + ' ' + text_extents.width + ' ' + text_extents.height + '\nGjs-Message: JS LOG: END ');
                    }
                }
                catch(err) {
                    log(err);
                }
            }
        }
        else if (event.type.indexOf('object:state-changed') == 0 && event.detail1==1) {

            try{
                let comp = acc.get_component_iface();

                if (comp) {
                    let extents = comp.get_extents(Atspi.CoordType.SCREEN);

                    if (extents) {
                        log ('<extents> ['+ extents.x + ' ' + extents.y + ' ' + extents.width + ' ' + extents.height + ']\nGjs-Message: JS LOG: END ');
                    }
                }
            }
            catch(err){
                log(err);
            }
        }
        else {
            log ('focus lost \nGjs-Message: JS LOG: END ');
        }
    }
    else {
        log ('no accessible \nGjs-Message: JS LOG: END ');
    }
}
