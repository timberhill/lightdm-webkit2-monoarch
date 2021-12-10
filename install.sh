#!/bin/sh

echo "cloning the repo"
git clone git@github.com:timberhill/lightdm-webkit2-monoarch.git

echo "...installing the theme"
mv lightdm-webkit2-monoarch /usr/share/lightdm-webkit/themes/monoarch
sed -i 's/^webkit_theme\s*=\s*\(.*\)/webkit_theme = monoarch #\1/g' /etc/lightdm/lightdm-webkit2-greeter.conf

echo "...done!"

