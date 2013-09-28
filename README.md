= Implement Caret and Focus Tracking for GNOME Shell =

<<TableOfContents>>

== Blog Posts ==
 * [[ http://thismagpie.blogspot.co.uk/2013/06/pyatspi2-script-to-demonstrate-keypress.html?view=sidebar | pyatspi2 script to demonstrate keypress listeners ]] 
 * [[ http://thismagpie.blogspot.co.uk/2013/06/pyatspi2-script-to-demonstrate-text.html?view=sidebar | pyatspi2 script to demonstrate the text interface.]]
 * [[ http://thismagpie.blogspot.co.uk/2013/08/developing-gnome-shell-under-jhbuild.html | developing GNOME Shell under jhbuild ]]
 * [[ http://thismagpie.blogspot.co.uk/2013/06/gsoc-updates-for-planet-gnome.html?view=sidebar | GSoC Updates for Planet GNOME: Investigating and Solving the 'Freeze Problem' ]]
 * [[ http://thismagpie.blogspot.co.uk/2013/07/gsoc-updates-for-planet-gnome.html?view=sidebar | GSoC Updates for Planet GNOME: Integrating the focus and caret tracker into the magnifier for GNOME Shell]]
 * [[ http://thismagpie.blogspot.co.uk/2013/07/gsoc-updates-for-planet-gnome-going-to.html?view=sidebar | GSoC Updates for Planet GNOME: Going to GUADEC]]
 * [[ http://thismagpie.blogspot.co.uk/2013/08/gsoc-updates-for-planet-gnome-good.html?view=sidebar | GSoC Updates for Planet GNOME: Good Times at GUADEC]]
 * [[ http://thismagpie.blogspot.co.uk/2013/09/gsoc-updates-accepted-commitnow.html?view=sidebar | GSoC Updates: accepted-commit_now... ]]
 * [[ http://thismagpie.blogspot.co.uk/2013/09/gsoc-updates-focus-and-caret-tracking.html?view=sidebar | GSoC Updates: Focus and Caret Tracking Has Landed.]]

== A11y Meetings ==

 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A5_September | 5/09/2013 ]] 
 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A29_August | 29/08/2013 ]] 
 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A22_August | 22/08/2013 ]] 
 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A15_August | 15/08/2013 ]] 
 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A25 July | 25/07/2013 ]] 
 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A29_July | 18/07/2013 ]] 
 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A22_July | 11/07/2013 ]] 
 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A4 July | 4/07/2013 ]] 
 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A27_June | 27/06/2013 ]] 
 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A20_June | 20/06/2013 ]] 
 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A13_June | 13/06/2013 ]] 
 * [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC#A6_June | 06/06/2013 ]] 

== Abstract ==

To implement a caret and focus tracking device within GNOME Shell and allow the magnifier to use this device to display current keyboard focus. This work would contribute a focus and caret tracking "device" within GNOME Shell to the benefit of the GNOME community. The work also allows the magnifier to use this device in order to display current keyboard focus which enable users with low vision to use GNOME more easily.


== Introduction ==

The magnifier was originally authored by Joseph Scheuhammer who developed magnification that was able to track the mouse. The magnifier has a set of auxillary tools, such as 'crosshairs' which make it easier for users with low vision to find the mouse position so that they can navigate the desktop and 'contrast' which make the images on desktop widgets sharper. An details of GNOME Shell magnification can be found on the dedicated [[https://wiki.gnome.org/GnomeShell/Magnification | magnification wiki page ]].

The magnifier has needed focus tracking to make navigating the desktop easier for users and caret tracking to aid users in reading and writing documents and web pages.

== Setting up the Development Environment ==

JHBuild can be a learning curve, so mentors advised an early start.   Switching from Ubuntu to Fedora made it possible to install the development libraries needed for running GNOME Shell  (and its dependencies) under JHBuild.


A script was used to install jhbuild and during the installation process a couple of python files were generated in the [[/home/magpie.]] directory, these files are called .jbuildrc and .jhbuildrc-custom.


The .jhbuildrc-custom file has allowed modifications to be made to the default configuration of JHBuild. There is useful [[http://docs.python.org/2/library/index.html| python documentation ]] available, which helps to understand these configuration files. See the [[ http://thismagpie.blogspot.co.uk/2013/08/developing-gnome-shell-under-jhbuild.html | developing GNOME Shell under jhbuild ]] blog post  for further information.

 * Mentor, Juanjo Marin was supportive throughout this work.

== Making Pyatspi Examples and familiarisation with ATSPI  ==

One example demonstrates use of the text interface (and caret tracking), another uses a listener client which listens for particular keypress events. The events trigger a print out the hierarchy in an active (accessible) window and an extra script to print the names of accessible applications running and count how many there are altogether.

Although they are written in python and not javascript. The examples can still demonstrate the principles needed for the focus and caret tracking implementation in GNOME Shell because they depend on interfaces from the atspi API that is required for the javascript tracking code. [[https://people.gnome.org/~parente/pyatspi/doc/|pytspi]] python library. Link to [[https://bugzilla.gnome.org/show_bug.cgi?id=701063 | relevant bug]].

 * Mentor, Joanmarie Diggs was supportive throughout this work.

== Solving the Freeze Problem: The Creation an Accessible FocusCaretTracker ==

It was necessary to solve the freeze problem because it would have been next to impossible to do much with GNOME Shell freezing up. So once a file called focusCaretTracker.js, a debugging method was used to find out where the issues lay.

The details of this can be found on the [[ http://thismagpie.blogspot.co.uk/2013/06/gsoc-updates-for-planet-gnome.html  | blog post ]] about it.

 * Mentors, Joseph Scheuhammer and Mike Gorse were supportive throughout this work.


== Integrating the focus caret tracker to work with the GNOME Shell Magnifier ==

The tracking has been integrated into the magnifier and tested using the strategies advised by mentors Joseph Scheuhammer and Alejandro Piñeiro Iglesias. It has been revised serveral times and the latest version is currently under review. Here is an outline of the work

=== Code ===

The files involved a magnifier.js and focusCaretTracker.js. Makefile.am needs to be updated to include focusCaretTracker.js since it is new to GNOME Shell.

{{{
Diffstat
-rw-r--r--	js/Makefile.am	                 1

-rw-r--r--	js/ui/focusCaretTracker.js	 68

-rw-r--r--	js/ui/magnifier.js	         155 }}}


==== focusCaretTracker.js ====

The first thing to notice is that Atspi is imported. This this is a GNOME Shell javascript first (or at least, it will be when it does get pushed to master). Because nothing else in GNOME Shell uses the Atspi API yet there have been various associated teething problem with it's use, which will be outlined during the discussion on this work.

{{{
const Atspi = imports.gi.Atspi;
const Lang = imports.lang;
const Signals = imports.signals; }}}

For convenience two constants are created to hold the values of an Atspi signal 'object:state-changed', and to hold part of the value of two other signals, 'object:state-changed:focused' and 'object:state-changed:selected':
{{{
const CARETMOVED        = 'object:text-caret-moved';
const STATECHANGED      = 'object:state-changed'; }}}

The following code instansiates the FocusCaretTracker namespace and initialises an Atspi listener instance which will listen for atspi emitted events from a private function called _onChanged.

At the moment the Atspi itself is also initialised inside _init because it is not yet certain whether the best approach is to have the tracker be a singleton or not. The decision depends on a few factors. Mainly:

 1. Whether multiple registration of Atspi event listeners is problematic.
 2. Whether Atspi is too expensive to initialise in GNOME Shell's main.c
 3. Which is better in the long run.

The plan is to test Atspi in GNOME Shell to see how expensive it is but if it is very expensive, sooner or later that would need to be solved anyway, in any case.

{{{
const FocusCaretTracker = new Lang.Class({
    Name: 'FocusCaretTracker',

    _init: function() {
        Atspi.init();
        this._atspiListener = Atspi.EventListener.new(Lang.bind(this, this._onChanged));
    }, }}}
{{{
    _onChanged: function(event) {
        let update = null;

        if (event.type.indexOf(STATECHANGED) == 0)
            update = 'focus-changed';
        else if (event.type == CARETMOVED)
            update = 'caret-moved';
        this.emit(update, event);
    }, }}}

Next methods to register the Atspi listener with connected clients (like the magnifier for example). Select events have been included in the logic for focus events only because otherwise objects will lose focus the moment they are selected.

{{{
    registerFocusListener: function() {
        return this._atspiListener.register(STATECHANGED + ':focused') &&
               this._atspiListener.register(STATECHANGED + ':selected');
    },

    registerCaretListener: function() {
        return this._atspiListener.register(CARETMOVED);
    }, }}}

Methods are also needed to deregister the Atspi listener with connected clients (like the magnifier for example). Select events have been included in the logic for focus events only because otherwise objects will lose focus the moment they are selected. 

{{{
    deregisterFocusListener: function() {
        return this._atspiListener.deregister(STATECHANGED + ':focused') &&
               this._atspiListener.deregister(STATECHANGED + ':selected');
    },

    deregisterCaretListener: function() {
        return this._atspiListener.deregister(CARETMOVED);
    }
}); }}}

In order to access the private methods from gjs' signals.js a call to the following method is made in focusCaretTracker.js

{{{
+Signals.addSignalMethods(FocusCaretTracker.prototype); }}}

==== magnifier.js ====

Firstly it is necessary to import the gobject introspected Atspi library and also the focusCaretTracker too. This was done in the following way:

{{{
 const Atspi = imports.gi.Atspi;
const FocusCaretTracker = imports.ui.focusCaretTracker; }}}

Keys for the GSettings focus-tracking and caret-tracking modes were added to enable preferences to be set for the kind of tracking a user wants for their magnification experience.

{{{
const FOCUS_TRACKING_KEY = 'focus-tracking';
const CARET_TRACKING_KEY = 'caret-tracking'; }}}

Most of the work was done in the zoomRegions class, which belongs to the magnifier namespace but preferences for the focus and caret tracking keys were set in the magnifier by calling two members of the magnifier's zoomRegions called setFocusTrackingMode and setCaretTrackingMode:

{{{
    zoomRegion.setMouseTrackingMode(aPref);
    aPref = this._settings.get_enum(FOCUS_TRACKING_KEY);
    if (aPref)
        zoomRegion.setFocusTrackingMode(aPref);
 }}}

Because 'this' is not captured in closures the style guide reccommends wrapping closures in Lang.bind so this was done when using the connect methods from signals.js in gjs to connect to the settings and update the tracking modes: 

{{{
    this._settings.connect('changed::' + FOCUS_TRACKING_KEY, Lang.bind(this, this._updateFocusTrackingMode));
    this._settings.connect('changed::' + CARET_TRACKING_KEY, Lang.bind(this, this._updateCaretTrackingMode)); }}}

The update focus and caret tracking mode update functions were private members of the magnifier namespace. Note that there is only 1 zoomRegion for the magnifier at the moment so this is why _zoomRegions[0] is hard coded in the way that it is:
  
{{{
    _updateFocusTrackingMode: function() {
    // Applies only to the first zoom region.
        if (this._zoomRegions.length) {
             this._zoomRegions[0].setFocusTrackingMode(
             this._settings.get_enum(FOCUS_TRACKING_KEY)
             );
        }
    }, }}}

As was done in focusCaretTracker.js the addSignalMethods function from signals.js in gjs needed to be called in order to access the private methods from that namespace (like 'connect'):
 
{{{
Signals.addSignalMethods(Magnifier.prototype); }}}

Inside the magnifier 'helper class', zoomRegions focusCaretTracker was instantiated and initialised as a private functions in the zoomRegions _init constructor as were the following private methods:
{{{
    this._focusCaretTracker = new FocusCaretTracker.FocusCaretTracker();
    this._focusTrackingMode = GDesktopEnums.MagnifierFocusTrackingMode.NONE;
    this._caretTrackingMode = GDesktopEnums.MagnifierCaretTrackingMode.NONE;
    this._xFocus = 0;
    this._yFocus = 0;
    this._xCaret = 0;
    this._yCaret = 0; }}}

A connection to the FocusCaretTracker namespace is also made in init and the update functions for caret and focus are wrapped in Lang.bind as the style guide recommends for such closures:

{{{
    this._focusCaretTracker.connect('caret-moved', Lang.bind(this, this._updateCaret));
    this._focusCaretTracker.connect('focus-changed', Lang.bind(this, this._updateFocus)); }}}

Here, _updateFocus and _updateCaret are private members of the zoomRegions 'helper class' they update the x and y position of the caret or focus and the instances of these coordinates are available to other methods in zoomRegions so when this._centerFromFocusPosition() is called it can access the values obtained here by using the 'this' keyword.

The _updateFocus function uses the component interface to get the x and y coordinates of the focused widget:

{{{
    _updateFocus: function(caller, event) {
        let component = event.source.get_component_iface();
        if (!component || event.detail1 != 1)
            return;
        let extents = component.get_extents(Atspi.CoordType.SCREEN);
        [this._xFocus, this._yFocus] = [extents.x, extents.y]
        this._centerFromFocusPosition();
    }, }}}

The _updateCaret function uses the text interface to get the x and y coordinates of the caret:

{{{

    _updateCaret: function(caller, event) {
        let text = event.source.get_text_iface();
        if (!text)
            return;
        let extents = text.get_character_extents(text.get_caret_offset(), 0);
        [this._xCaret, this._yCaret] = [extents.x, extents.y];
        this._centerFromCaretPosition();
}, }}}

The focus and caret tracking modes (from gsettings-desktop-schemas) are handled in 'setter' functions for them. If the user uses GSettings to set focus or caret tracking to 'none' this will deregister the listener for that key. This essentially means that setting the focus-tracking or caret-tracking key to the mode, 'none' will disable that tracking and switching the mode back to 'centered', 'proportional' or 'push' will register the appropriate listener, thus enabling tracking once more. 

{{{
    setFocusTrackingMode: function(mode) {
        this._focusTrackingMode = mode;
        if (this._focusTrackingMode == GDesktopEnums.MagnifierFocusTrackingMode.NONE)
            this._focusCaretTracker.deregisterFocusListener();
        else
            this._focusCaretTracker.registerFocusListener();
        }, }}}

In order for the tracking modes to be meaningful they need to have influence on how the magnifier zoom regions move with respect to the coordinates the zoom region is 'given'. This is done with a set of functions starting with '_centerFromPoint' which the functions _centerFromFocus/CaretPosition will use to readjust the xFocus/Caret yFocus/Caret coordinates before passing to a scrollContentsTo function:

{{{
    _centerFromFocusPosition: function() {
        let xFocus = this._xFocus;
        let yFocus = this._yFocus;

        if (this._focusTrackingMode == GDesktopEnums.MagnifierFocusTrackingMode.PROPORTIONAL)
            [xFocus, yFocus] = this._centerFromPointProportional(xFocus, yFocus);
        else if (this._focusTrackingMode == GDesktopEnums.MagnifierFocusTrackingMode.PUSH)
            [xFocus, yFocus] = this._centerFromPointPush(xFocus, yFocus);
        else if (this._focusTrackingMode == GDesktopEnums.MagnifierFocusTrackingMode.CENTERED)
            [xFocus, yFocus] = this._centerFromPointCentered(xFocus, yFocus);

        this.scrollContentsTo(xFocus, yFocus);
    }, }}}

==  GSettings for Focus and Caret Tracking ==

During GUADEC a patch was written for the {{{ gsettings-desktop-schemas }}} module so that focus and caret tracking could be set independently from the mouse or caret tracking. The method for changing focus or/and caret gsettings from a terminal is outlined below:

{{{$ gsettings list-keys org.gnome.desktop.a11y.magnifier }}}

Specifically check that you have the following GSettings available to you.

{{{ caret-tracking }}}
{{{ focus-tracking }}}

To find out the possible options for focus tracking, type:

{{{ $ gsettings range org.gnome.desktop.a11y.magnifier focus-tracking }}}

Or To find out the possible options for caret tracking, type:

{{{ $ gsettings range org.gnome.desktop.a11y.magnifier caret-tracking }}}

To change the GSetting for caret tracking to centered, type:

{{{ $ gsettings set org.gnome.desktop.a11y.magnifier caret-tracking centered }}}

{{{ $ gsettings set org.gnome.desktop.a11y.magnifier focus-tracking push }}}

To turn off tracking for the focus or caret set the GSetting to {{{ 'none' }}}. It is possible to turn it back on again by setting the key to a different value afterwards.

The code for these was written in two separate files:

{{{

 headers/gdesktop-enums.h                           | 15 +++++++++
 ....gnome.desktop.a11y.magnifier.gschema.xml.in.in | 38 ++++++++++++++++++++++
 2 files changed, 53 insertions(+) }}}

The edit to /headers/gdesktop-enums.h was fairly simple and straightforward because the enum tracking modes for focus and caret tracking were the same as those already in place for the mouse tracking:

{{{
typedef enum
{
  G_DESKTOP_MAGNIFIER_FOCUS_TRACKING_MODE_NONE,
  G_DESKTOP_MAGNIFIER_FOCUS_TRACKING_MODE_CENTERED,
  G_DESKTOP_MAGNIFIER_FOCUS_TRACKING_MODE_PROPORTIONAL,
  G_DESKTOP_MAGNIFIER_FOCUS_TRACKING_MODE_PUSH
} GDesktopMagnifierFocusTrackingMode;

typedef enum
{
  G_DESKTOP_MAGNIFIER_CARET_TRACKING_MODE_NONE,
  G_DESKTOP_MAGNIFIER_CARET_TRACKING_MODE_CENTERED,
  G_DESKTOP_MAGNIFIER_CARET_TRACKING_MODE_PROPORTIONAL,
  G_DESKTOP_MAGNIFIER_CARET_TRACKING_MODE_PUSH
} GDesktopMagnifierCaretTrackingMode; }}}

The edit to /schemas/org.gnome.desktop.a11y.magnifier.gschema.xml.in.in was fairly simple and straightforward too, because the tracking modes for focus and caret tracking were the same as those already in place for the mouse tracking. All that was done differently to the mousetracking was a little formatting to help documentation look a bit smarter.

{{{
    <key name="focus-tracking" enum="org.gnome.desktop.GDesktopMagnifierFocusTrackingMode">
      <default>'push'</default>
      <_summary>Focus Tracking Mode</_summary>
      <_description>
        Determines the position of the focused widget within magnified view.

        The values are:

        - none: no focus tracking

        - centered: the focused image is displayed at the center of the zoom region (which also represents the
          point under the system focus) and the magnified contents are scrolled as the system focus moves

        - proportional: the position of the magnified focus in the zoom region is proportionally the same as the
          position of the system focus on screen

        - push: when the magnified focus intersects a boundary of the zoom region, the contents are scrolled
          into view
    </_description>
    </key>
    <key name="caret-tracking" enum="org.gnome.desktop.GDesktopMagnifierCaretTrackingMode">
      <_default>'centered'</_default>
      <_summary>Caret Tracking Mode</_summary>
      <_description>
        Determines the position of the caret within magnified view. The values are:

      - none: no caret tracking

      - centered: the image of the caret is displayed at the center of the zoom region (which also represents
        the point under the system caret) and the magnified contents are scrolled as the system caret moves

      - proportional: the position of the magnified caret in the zoom region is proportionally the same as the
        position of the system caret on screen

      - push: when the magnified caret intersects a boundary of the zoom region, the contents are scrolled into
        view
      </_description>
    </key>
     <key name="screen-position" enum="org.gnome.desktop.GDesktopMagnifierScreenPosition">
       <default>'full-screen'</default>
       <_summary>Screen position</_summary> }}}

== Proposed UI ==

 [[attachment:mouse.png]]
 [[attachment:caret.png]]
 [[attachment:focus.png]]

=== Tools Used ===

 1. For improving inconsistencies in javascript style a tool called [[https://developers.google.com/closure/utilities/docs/linter_howto ]]

 2. For debugging [[ http://git.gnome.org/browse/gjs | gjs ]] can be very useful. Run the command

{{{ $ gjs /path/to/file.js }}} to see problems. Note that the private libraries in GNOME Shell will not be recognised by gjs

 3. For installing [[http://www.rpm.org/max-rpm/ch-rpm-install.html | rpm ]]

=== Modules ===

The development environment jhbuild is used to build the GNOME 3.10 modules. Specifically:

 * gnome-shell (magnifier)

 * gnome-control-center ('zoom')

 * gsettings-desktop-schemas

== Keep Updated ==

 * Take an [[http://feeds.feedburner.com/thismagpie/GNOME | rss feed]] from the GNOME label at [[http://thismagpie.blogspot.co.uk | my blog]]

 * Each week there is a meeting and you can read the minutes of [[ https://wiki.gnome.org/Accessibility/Minutes/2013GSoC | GSoC Updates ]]

 * You can watch my [[ https://github.com/thisMagpie/GSoC | github scratchpad repo ]] or take an rss feed to stay abreast of changes.

== Bugs ==

   * (./) [[GnomeBug:681276]] Reentrancy problems on gnome-shell
   * (./) [[GnomeBug:705652]] Add GSettings for focus and caret tracking in GNOME Shell
   * (./) [[GnomeBug:647074]] GNOME Shell Magnifier should track focus and the caret
   * (./) [[GnomeBug:707010]] Atspi_event_listener_register_no_data makes using eventlistener on javascript not possible

=== For general information ===

 * [[https://projects.gnome.org/accessibility | Accessibility at GNOME]]

 * [[https://live.gnome.org/ThreePointNine/Features/FocusCaretTracking| ThreePointNine/Features/FocusCaretTracking ]]

 * GnomeShell

 * [[https://wiki.gnome.org/Accessibility/MagnificationFramework  | Accessibility/MagnificationFramework ]] 

 * [[https://wiki.gnome.org/GnomeShell/Gjs_StyleGuide | GnomeShell/Gjs_StyleGuide ]]

 * [[ https://wiki.gnome.org/ThreePointThree/Features/ZoomOptionsDialog | ThreePointThree/Features/ZoomOptionsDialog]]

 * [[https://wiki.gnome.org/Orca/SmokeTest | Orca SmokeTest]]

 * [[ https://developer.gnome.org/platform-overview/stable/d-bus.html.en | dbus ]]

 * [[http://www.townx.org/index.php?q=blog/elliot/introduction-sorts-javascript-desktop-application-development-gjs-and-clutter | useful gjs blog post]]

 * [[https://wiki.gnome.org/GnomeShell/FAQ#Is_GNOME_Shell_accessible.3F | GNOME Shell FAQ ]]

== Acknowledgements ==

Thanks to the A11y and GNOME Shell teams for the time they have given to support the work as well as the omnipotent Google who kept me out of trouble this summer, by giving me stuff (including access to one of the funniest mailing lists known to humanity).

I would like to say a special thank my mentor Joseph Scheuhammer and also the following people: Alejandro Piñeiro,  Jasper St. Pierre, Joanmarie Diggs, Javier Jardón, Matthias Clasen, Ryan Lortie, Juanjo Marin, Florian Müllner, Richard Schwarting, Mike Gorse, Kalev Lember, Lafargue Sébastien, Marina Zhurakhinskaya, and I am sure I have missed somebody because a host of others have helped so far (but you know who you are -come and shout at me if I forgot to list you)...
