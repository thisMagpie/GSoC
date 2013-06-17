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
// Move these to GS-Mag/GSettings
// Note: TRACKING_MODES are the same values as for mouse tracking modes,
const TRACKING_MODES = ['none', 'centered', 'proportional', 'push'];
const FOCUS_TRACKING_DEFAULT = 'centered';
const CARET_TRACKING_DEFAULT = 'centered';

let _atspiCallback = null;

const AtspiRegistry = new Lang.Class({
    Name: 'AtspiRegistry',

    _init: function() {
        Atspi.init();
           
        _atspiCallback = Lang.bind(this, this._changed);
        this._atspiListener = Atspi.EventListener.new(_atspiCallback);
        this._trackingFocus = false;
        this._trackingCaret = false;  
    },

    /**  
     * shutDown
     * Stop tracking and remove all attached signal handlers.
     * @Return void
     */
    shutDown: function() {
        this.deregisterFocusEvents();
        this.deregisterCaretEvents();
        this.disconnectAll();
    },
    /**
     * registerFocusEvents:
     * Enable focus tracking.
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
     * Disable focus tracking
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
            log('deregisterAtspiFocusEvents: [' + focusDeregistered + ',' + selectDeregistered + ']');
        }
        catch (err) {
            log(err);
        }
        this._trackingFocus = !(focusDeregistered || selectDeregistered);
        return this._trackingFocus;
    },

    /**
     * isRegisteringFocusEvents
     * Report whether focus tracking is enabled.
     * @return: Boolean.
     */
    isRegisteringFocusEvents: function() {
        return this._trackingFocus;
    },

    /**
     * registerCaretEvents
     * Enable caret tracking
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
     * deregisterCaretEvents:
     * Disable caret tracking
     * @return: Boolean.
     */
    deregisterCaretEvents: function() {
    	
        if (!this._trackingCaret){
            return true;
		}
        let deregistered = false;
        
        if (this._atspiListener) {
            try {
                deregistered = this._atspiListener.deregister('object:text-caret-moved');
            }
            catch (err) {
                log(err);
            }
        }
        this._trackingCaret = !deregistered;
        return this._trackingCaret;
    },

    /**
     * isRegisteringCaretEvents
     * Report whether caret tracking is enabled.
     * @return: Boolean.
     */
    isRegisteringCaretEvents: function() {
        return this._trackingCaret;
    },

    _changed: function(event) {
            
        if ((event.type == 'object:state-changed:focused' || event.type == 'object:state-changed:selected') && event.detail1==1){//TODO put selected in later
            this.emit('focused', event);
            log('atspiRegister._changed(' + event.type + ',' + event.detail1 + ')');
		}
		if (event.type == 'object:text-caret-moved') {
            this.emit('caret-changed', event);
		}
    }
});

Signals.addSignalMethods(AtspiRegister.prototype);

// For debugging. 
function onFocus(caller, event) {
	
	if (event.type.startsWith("object:state-changed") && event.detail1!=1) {
		log ('Focus lost ');
		log ('END ');
		return;
	}
	let acc = event.source;

	try{
	    log ('<role name> ' + acc.get_role_name());
	}	
	catch(err){
		log ('<exception cause> get_role_name() ');
		log ('<exception name> '+ ' ' + err.name + '\nGjs-Message: JS LOG: <exception message> ' + err.message +'\nGjs-Message: JS LOG: <exception>' + err);
	}	 	
	log ('<caller> ' + caller);
	log ('<event> ' + event.type + ',' + event.detail1);

	if (acc) {
		log ('<contructor>' + acc.constructor);
		let name = acc.get_name();

		if (name!='') {
			log ('<accessible> : ' + name);
		}
		else if(name=='') {
			log('<accessible> ' + 'is empty string ' + name);	
		}
		let comp = acc.get_component_iface();					
		if (comp) {
			let extents = comp.get_extents(Atspi.CoordType.SCREEN);
			log ('<extents> (x='+extents.x+',y='+extents.y+') [' + extents.width + ',' + extents.height + ']\nGjs-Message: JS LOG: END ');
		}
		else{
			log ('no component \nGjs-Message: JS LOG: END');
		}
	}			
	else {
		log ('no accessible \nGjs-Message: JS LOG:  END: no accessible\n');
	}		
}
function onCaret(caller, event) {
	
	if (!event.type.startsWith("object:text-caret-moved")) {
		log ('no caret ');
		log ('END ');
		return;
	}
	let acc = event.source;

	try{
	    log ('<role name> ' + acc.get_role_name());
	}	
	catch(err){
		log ('<exception cause> get_role_name() ');
		log ('<exception name> '+ ' ' + err.name + '\nGjs-Message: JS LOG: <exception message> ' + err.message +'\nGjs-Message: JS LOG: <exception>' + err);
	}	 	
	log ('<caller> ' + caller);
	log ('<event> ' + event.type + ',' + event.detail1);

	if (acc) {
		log ('<contructor>' + acc.constructor);
		let name = acc.get_name();

		if (name!='') {
			log ('<accessible> : ' + name);
		}
		else if(name=='') {
			log('<accessible> ' + 'is empty string ' + name);	
		}
		let comp = acc.get_component_iface();					
		if (comp) {
			let extents = comp.get_extents(Atspi.CoordType.SCREEN);
			log ('<extents> (x='+extents.x+',y='+extents.y+') [' + extents.width + ',' + extents.height + ']\nGjs-Message: JS LOG: END ');
		}
		else{
			log ('no component \nGjs-Message: JS LOG: END');
		}
	}			
	else {
		log ('no accessible \nGjs-Message: JS LOG:  END: no accessible\n');
	}		
}
