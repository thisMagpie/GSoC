/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
/*
 * Copyright 2012 Inclusive Design Research Centre, OCAD University.
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
 * Author:
 *   Joseph Scheuhammer <clown@alum.mit.edu>
 */

const Atspi = imports.gi.Atspi;
const Lang = imports.lang;
const Signals = imports.signals;

const FocusCaretTracker = new Lang.Class({
    Name: 'FocusCaretTracker',

    _init : function() {
        Atspi.init(); // TODO put somewhere better later
        this._atspiListener = Atspi.EventListener.new(Lang.bind(this, this._notifyUpdate));
        this._stateChanged = 'object:state-changed:';
        this._caretMoved = 'object:text-caret-moved';
    },

    // Note that select events have been included in the logic for focus events
    // only because objects will lose focus the moment they are selected.
    registerFocusListener : function() {
        return this._atspiListener.register(this._stateChanged + 'focused') || this._atspiListener.register(
                                                                               this._stateChanged + 'selected');
    },

    registerCaretListener : function() {
        return this._atspiListener.register(this._caretMoved);
    },

    // Note that select events have been included in the logic for focus events
    // only because objects will lose focus the moment they are selected.
    deregisterFocusListener : function() {
        return this._atspiListener.register(
                        this._stateChanged + 'focused') &&
                this._atspiListener.register(
                        this._stateChanged + 'selected');
    },

    deregisterCaretListener : function() {
        return this._atspiListener.deregister(this._caretMoved);
    },

    _notifyUpdate : function(event) {
        let update = null;

        if (event.type.indexOf(this._stateChanged) == 0)
            update = 'focus-changed';      
        else if (event.type == this._caretMoved) 
            update = 'caret-moved';
        this.emit(update, event);
    }
});
Signals.addSignalMethods(FocusCaretTracker.prototype);

// Should do check for accessible when making call (if necessary)
function extentsAtROI(caller, event) {
    let extents = [-1 , -1, -1 , -1];

    if (event.type.indexOf('object:state-changed') == 0 && event.detail1 == 1) {
        let component = acc.get_component_iface();
        extents = comp.get_extents(Atspi.CoordType.SCREEN);
    }
    else if (event.type.indexOf('object:text-caret-moved') == 0) {
        let text = acc.get_text_iface();
        if (text.get_caret_offset() >= 0)
            extents = text.get_character_extents(text.get_caret_offset(), 0);
    }
    return extents;
}
