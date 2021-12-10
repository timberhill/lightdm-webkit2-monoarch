#!/bin/sh

echo "...cloning the repo"
git clone git@github.com:timberhill/lightdm-webkit2-monoarch.git && status=0 || status=1
if [ "$status" -gt 0 ]; then echo "...failed cloning the repo" && exit 1; fi

echo "...installing the theme"

mv lightdm-webkit2-monoarch /usr/share/lightdm-webkit/themes/monoarch && status=0 || status=1
if [ "$status" -gt 0 ]; then echo "...failed moving files to /usr/share/lightdm-webkit/themes/" && exit 1; fi

sed -i 's/^webkit_theme\s*=\s*\(.*\)/webkit_theme = monoarch #\1/g' /etc/lightdm/lightdm-webkit2-greeter.conf && status=0 || status=1
if [ "$status" -gt 0 ]; then echo "...failed updating /etc/lightdm/lightdm-webkit2-greeter.conf" && exit 1; fi

echo "...done!"

