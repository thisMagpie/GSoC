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
 *   Magdalen Berns <m.berns@sms.ed.ac.uk>
 */

const Atspi = imports.gi.Atspi;
const Lang = imports.lang;
const Signals = imports.signals;

const CARETMOVED        = 'object:text-caret-moved';
const STATECHANGED      = 'object:state-changed';

const FocusCaretTracker = new Lang.Class({
    Name: 'FocusCaretTracker',

    _init: function() {
        Atspi.init();
        this.atspiListener = Atspi.EventListener.new(Lang.bind(this, this._onChanged));
        this.atspiListener._update = this;

        this._caretId = this.Atspi.connect('caret-changed', Lang.bind(this, this._startCaretTracking));
        this._caretId = this;
        this._focusId = this.Atspi.connect('focus-changed', Lang.bind(this, this._startFocusTracking));
        this._focusId = this;
        Mainloop.run('runMainloop');
    },

    _onChanged: function(event) {
        let _update = null;

        if (event.type.indexOf(STATECHANGED) == 0)
            _update = 'focus-changed';
        else if (event.type == CARETMOVED) _update = 'caret-moved';
            this.emit(_update, event);
    },

    _startTrackingFocus: function() {
        return this.Atspi.registerFocusListener();
    },

    _startTrackingCaret: function() {
        return this.Atspi.registerCaretListener();
    },

    _stopTrackingFocus: function() {
        return this.Atspi.deregisterFocusListener();
    },

    _stopTrackingCaret: function() {
        return this.Atspi.deregisterCaretListener();
    },

    // FIXME that select events have been included in the logic for focus events
    // only because objects will lose focus the moment they are selected.
    registerFocusListener: function() {
        return this.atspiListener.register(STATECHANGED + ':focused') || this.atspiListener.register(
                                           STATECHANGED + ':selected');
    },

    registerCaretListener: function() {
        return this.atspiListener.register(CARETMOVED);
    },

    // FIXME: that select events have been included in the logic for focus events
    // only because objects will lose focus the moment they are selected.
    deregisterFocusListener: function() {
        return this.atspiListener.deregister(STATECHANGED + ':focused') && this.atspiListener.deregister(
                                             STATECHANGED + ':selected');
    },

    deregisterCaretListener: function() {
        return this.atspiListener.deregister(CARETMOVED);
    }
});
// Use the protype methods from
Signals.addSignalMethods(FocusCaretTracker.prototype);

function addTrackingMethods(proto) {
    proto.startTrackingFocus = _startTrackingFocus;
    proto.stopTrackingFocus = _stopTrackingFocus;
    proto.startTrackingCaret = _startTrackingCaret;
    proto.stopTrackingCaret =  _stopTrackingCaret;
}
