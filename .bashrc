# .bashrc
. ~/.alias 
  
if [ -f /etc/bashrc ]; then 
	. /etc/bashrc 
fi

if [ -n "$CERTIFIED_GNOMIE" ]; then
    PS1="[JHBuild@\W] "   
fi

export PATH=$PATH:$HOME/bin:$HOME/.local/bin:$HOME/gnome/install/bin
