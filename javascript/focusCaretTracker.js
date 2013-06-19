/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
/*
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
	registerFocusEvents: function() {

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
	deregisterFocusEvents: function() {

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
	registerCaretEvents: function() {

		if (this._trackingCaret) {
			return true;
		}
		let registered = false;

		try {
			registered = this._atspiListener.register('object:text-caret-moved');
			log('registerCaretEvents: ' + registered);
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
	deregisterCaretEvents: function() {

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

		if ((event.type == 'object:state-changed:focused' || event.type == 'object:state-changed:selected') && event.detail1==1){
			this.emit('focus-changed', event);
			log('atspiTracker._changed(' + event.type + ',' + event.detail1 + ')');
		}
		if (event.type == 'object:text-caret-moved') {
			this.emit('caret-changed', event);
		}
	}
});

Signals.addSignalMethods(FocusCaretTracker.prototype);

// For debugging. Call in looking glass
// with Main.focusCaretTracker.connect('caret-changed', Main.FocusCaretTracker.onFocusCaret); Main.focusCaretTracker.registerCaretEvents();
// with Main.focusCaretTracker.connect('focus-changed', Main.FocusCaretTracker.onFocusCaret); Main.focusCaretTracker.registerCaretEvents();
function onFocusCaret(caller, event) {

	if (event.type.startsWith("object:state-changed") && event.detail1!=1) {
		log ('Focus lost ');
		log ('END ');
		return;
	}
	let acc = event.source;

	if (acc) {
		let name = acc.get_name();
		let comp = acc.get_component;
		let text = acc.get_text(event.detail1,Atspi.CoordType.SCREEN);
		log ('<accessible> : ' + name);
		log ('<contructor>' + acc.constructor);
		log ('<role name> ' + acc.get_role_name());
		log ('<caller> ' + caller);
		log ('<event> ' + event.type + ',' + event.detail1);

		if(event.type.startsWith('object:text-caret-moved')) {
			log ('<caret property>');
			
			try {
				log ('Yay! I did not get caught!');
			//	let extents = text.get_character_extents();?? TODO 
		//		log ('<extents> (x='+extents.x+',y='+extents.y+')\n [' + extents.width + ',' + extents.height + ']\nGjs-Message: JS LOG: END ');
			}
			catch(err) {
				log ('exception ' + err.name + err.message + '\n '+ err);
			}
		}
	}
}
