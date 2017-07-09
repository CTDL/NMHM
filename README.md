# NMHM

New Mexico History Museum exhibit interactives
<br>
<br>
Raspberry Pi videolooper
<br>
https://learn.adafruit.com/raspberry-pi-video-looper
<br><br>
Touchscreens
Segesser Hides, Shifting Boundaries
<br>
Segesser Hides and Shifting Boundaries both require a local host server (Mamp) to run on the pc. Chrome is used as the kiosk to display the website.
<br>
Chrome Kiosk for Windows
Disable pinch zoom in chrome
1. Open Start Menu on PC (win 7)
2. Select Control Panel
3. Select Hardware and Sound
4. Select “Change touch input settings”
5. Unclick “Enable multi-touch gestures and linking”
6. Apply and save changes
Disable right click in chrome
1. Embedded in JS (already included in the kiosk version of the site):
function mouseDown(e) {
if (e.which==3) {//rightClick
//disabled }
}
Disable ability to swipe backward/forward in chrome
1. Open Chrome, set URL to: chrome://flags/
2. Find "Overscroll history navigation" experiment (use command F to search for it)
3. Set it to "Disabled"
Setup Chrome to Open in Kiosk Fullscreen Mode
1. right click chrome app icon, create a shortcut
2. rename shortcut to kiosk
3. right click shortcut app icon, select properties
4. In the Target field, add " --kiosk " at the end (space between and no quotes)
5. apply changes
Set homepage for chrome OR follow Mamp Instructions for local host URL
1. Open Chrome, set URL to: chrome://settings/
2. Find “On Startup” section
3. Select “open a specific page..”
4. Paste url or path to files
Localhost Mamp Instructions
If using localhost, follow this Mamp setup:
1. Place files in HTdocs folder in mamp
2. Open preferences of mamp app
3. Choose option to run servers at startup
4. Choose to open webstart page at startup
5. Change default webstart url to local host url
6. Place mamp in startup folder
Open kiosk at Startup (win 7)
1. Open startmenu
2. Look for folder called startup
3. Right click, select option to show folder
4. create another shortcut to our chrome kiosk
5. Drag chrome kiosk shortcut to the startup folder
