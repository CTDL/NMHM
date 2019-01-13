# NMHM

<h1>New Mexico History Museum exhibit interactives</h1>
<b>Raspberry Pi videolooper</b>
<br>
https://learn.adafruit.com/raspberry-pi-video-looper

<br>
<b>Touchscreens</b><br>
Segesser Hides, Shifting Boundaries
<br><br>
Segesser Hides and Shifting Boundaries kiosk versions require a local host server (Mamp) to run on the pc. Chrome is used as the kiosk to display the website.
<br><br>
Chrome Kiosk for Windows
<br><br>
Disable pinch zoom in chrome<br>
1. Open Start Menu on PC (win 7)<br>
2. Select Control Panel<br>
3. Select Hardware and Sound<br>
4. Select “Change touch input settings”<br>
5. Unclick “Enable multi-touch gestures and linking”<br>
6. Apply and save changes
<br><br>
Disable right click in chrome<br>
1. Embedded in JS (already included in the kiosk version of the site):
<code>
function mouseDown(e) {
if (e.which==3) {//rightClick
//disabled }
}
</code>
<br><br>
Disable ability to swipe backward/forward in chrome<br>
1. Open Chrome, set URL to: chrome://flags/<br>
2. Find "Overscroll history navigation" experiment (use command F to search for it)<br>
3. Set it to "Disabled"
<br><br>
Setup Chrome to Open in Kiosk Fullscreen Mode<br>
1. right click chrome app icon, create a shortcut<br>
2. rename shortcut to kiosk<br>
3. right click shortcut app icon, select properties<br>
4. In the Target field, add " --kiosk " at the end (space between and no quotes)<br>
5. apply changes
<br><br>
Set homepage for chrome OR follow Mamp Instructions for local host URL<br>
1. Open Chrome, set URL to: chrome://settings/<br>
2. Find “On Startup” section<br>
3. Select “open a specific page..”<br>
4. Paste url or path to files
<br><br>
Localhost Mamp Instructions<br>
If using localhost, follow this Mamp setup:<br>
1. Place files in HTdocs folder in mamp<br>
2. Open preferences of mamp app<br>
3. Choose option to run servers at startup<br>
4. Choose to open webstart page at startup<br>
5. Change default webstart url to local host url<br>
6. Place mamp in startup folder
<br><br>
Open kiosk at Startup (win 7)<br>
1. Open startmenu<br>
2. Look for folder called startup<br>
3. Right click, select option to show folder<br>
4. create another shortcut to our chrome kiosk<br>
5. Drag chrome kiosk shortcut to the startup folder<br>
