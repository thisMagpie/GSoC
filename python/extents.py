#!/usr/bin/python
#
# space.py
#
# This library is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 2.1 of the License, or (at your option) any later version.
#
# This library is distribute d in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with this library; if not, write to the
# Free Software Foundation, Inc., Franklin Street, Fifth Floor,
# Boston MA  02110-1301 USA.
#
# A pyatspi2 example to demonstrate use of the Component interface
# In order to get the dimensions of a window

import pyatspi

def print_extents(obj, offset):
	try:
		caret = obj.queryComponent()
	except:
		return
	else:	
		print('Extents  0:       %s' % (caret.getExtents(0)))
		print('Position 0, Size: %s  %s '% (caret.getPosition(0),caret.getSize()))
		print('\nExtents  1:       %s' % (caret.getExtents(1)))
		print('Position 1, Size: %s %s \n'% (caret.getPosition(1),caret.getSize()))

def on_caret_move(event):
	if event.source and event.source.getRole() == pyatspi.ROLE_TERMINAL:
		return

	print_extents(event.source, event.detail1)

pyatspi.Registry.registerEventListener(on_caret_move, "object:text-caret-moved")
pyatspi.Registry.start()
