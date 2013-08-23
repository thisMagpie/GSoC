/** -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
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
 * Contributor (2013):
     Magdalen Berns <m.berns@sms.ed.ac.uk>
 */

const Atspi = imports.gi.Atspi;
const Lang = imports.lang;

const CARETMOVED        = 'object:text-caret-moved';
const STATECHANGED      = 'object:state-changed';

const FocusCaretTracker = new Lang.Class({
    Name: 'FocusCaretTracker',

    _init: function() {
        Atspi.init();
        this.atspiListener = Atspi.EventListener.new(Lang.bind(this, this._onChanged));
        this.atspiListener._update = this;
    },

    _update: function(Atspi.EventListener) {
        return this.atspiListener._update;
    },

    // Note: that select events have been included in the logic for focus events
    // only because objects will lose focus the moment they are selected
    registerFocusListener: function() {
        return this.atspiListener.register(STATECHANGED + ':focused') || this.atspiListener.register(
                                           STATECHANGED + ':selected');
    },

    registerCaretListener: function() {
        return this.atspiListener.register(CARETMOVED);
    },

    // Note: that select events have been included in the logic for focus events
    // only because objects will lose focus the moment they are selected.
    deregisterFocusListener: function() {
        return this.atspiListener.deregister(
                                            STATECHANGED + ':focused') && this.atspiListener.deregister(
                                            STATECHANGED + ':selected');
    },

    deregisterCaretListener: function() {
        return this.atspiListener.deregister(CARETMOVED);
    },

    //// private method ////

    /**
    * @ _onChanged: This function makes use of the delegate property in order to obtain
                    objects from atspiListener.
    * @ Return: There is a 'void' return, but a caret moved or focus changed signal is emitted
    */
    _onChanged: function(event) {

        if (event.type.indexOf(STATECHANGED) == 0) _update = 'focus-changed';
        else if (event.type == CARETMOVED) _update = 'caret-moved';
        this.emit(_update, event);
    }
});
Signals.addSignalMethods(FocusCaretTracker.prototype);
