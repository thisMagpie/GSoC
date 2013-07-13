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

const FocusCaretTracker = new Lang.Class({
    Name: 'FocusCaretTracker',

    _init: function() {
        Atspi.init();
        this._atspiListener = Atspi.EventListener.new(Lang.bind(this, this._changed));
        this._trackingFocus = false;
        this._trackingCaret = false;
    },

    /**
     * registerFocusEvents:
     * @return: Boolean.
     */
    _registerFocusEvents: function() {

        if (this._trackingFocus) 
            return true;

        let registeredFocus = false;
        let registeredSelect = false;

        try{
            registeredFocus = this._atspiListener.register('object:state-changed:focused');
            registeredSelect = this._atspiListener.register('object:state-changed:selected');
        }
        catch(err){
            log(err.message);
        }

        return this._trackingFocus = registeredFocus || registeredSelect;
    },

    /**
     * deregisterFocusEvents:
     * @return: Boolean.
     */
    _deregisterFocusEvents: function() {

        if (!this._trackingFocus)
            return true;

        let deregisteredFocus = false;
        let deregisteredSelect = false;

        try{
            deregisteredFocus = this._atspiListener.register('object:state-changed:focused');
            deregisteredSelect = this._atspiListener.register('object:state-changed:selected');
        }
        catch(err){
            log(err.message);
        }

        return this._trackingFocus = !(deregisteredFocus && deregisteredSelect);
    },

    /**
     * registeredFocus
     * @return: Boolean.
     */
    registeredFocusEvents: function() {
        return this._trackingFocus;
    },

    /**
     * registerCaretEvents
     * @return: Boolean.
     */
    _registerCaretEvents: function() {

        if (this._trackingCaret)
            return true;

        try{
            this._trackingCaret = this._atspiListener.register('object:text-caret-moved');
        }
        catch(log){
            log(err.message);
        }

        return this._trackingCaret;
    },

    /**
     * deregisterCaretEvents
     * @return: Boolean.
     */
    _deregisterCaretEvents: function() {

        if (!this._trackingCaret)
            return true;

        try{
            this._trackingCaret = !this._atspiListener.deregister('object:text-caret-moved');
        }
        catch(err){
            log(err.message);
        }
        
        return this._trackingCaret;
    },

    /**
     * RegisteredCaret
     * @return: Boolean.
     */
    registeredCaretEvents: function() {
        return this._trackingCaret;
    },

    shutDown: function() {
        this.deregisterFocusEvents();
        this.deregisterCaretEvents();
        this.disconnectAll();
    },

    _changed: function(event) {

        if (event.indexOf('object:state-changed') == 0) {
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
