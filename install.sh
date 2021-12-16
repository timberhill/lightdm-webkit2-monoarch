#!/bin/sh

check_status () {
    if [ "$1" -gt 0 ]; then echo $2 && rm -rf $3 && exit 1; fi
}


repo_folder=069ebef3-628c-4fc5-b81d-4ec9e28caf12


echo "...cloning the repo"
rm -f $repo_folder && git clone git@github.com:timberhill/lightdm-webkit2-monoarch.git $repo_folder && status=0 || status=1
check_status $status "...failed cloning the repo" $repo_folder

echo "...installing the theme"

sudo mkdir -p /usr/share/lightdm-webkit/themes/monoarch && sudo cp -r $repo_folder/* /usr/share/lightdm-webkit/themes/monoarch && rm -rf $repo_folder && status=0 || status=1
check_status $status "...failed moving files to /usr/share/lightdm-webkit/themes/" $repo_folder

sudo sed -i 's/^webkit_theme\s*=\s*\(.*\)/webkit_theme = monoarch #\1/g' /etc/lightdm/lightdm-webkit2-greeter.conf && status=0 || status=1
check_status $status "...failed updating /etc/lightdm/lightdm-webkit2-greeter.conf" $repo_folder

echo "...done!"
