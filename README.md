# GrainfatherBluetoothCommands
Documents the Bluetooth communication to and from the Grainfather brewing system.

# Background
This project started because I was not satisfied with the official Grainfather Connect phone application. It often loses connection and if a person wants to use the bluetooth capabilities of the system, grainfather requires them to create an account for their cloud service. They also force them to upload the recipes to their cloud which sometimes alters the recipe. Because of this, it's a rather annoying proces to get your recipe from a recipe builder like Brewfather or Beersmith to your brewing system. By looking into the protocol I wanted to give the community more control over their grainfather systems by allowing anyone to create their own software to control the grainfather system.

# Tools used
[Wireshark](https://www.wireshark.org/) to analyze the bluetooth traffic between the GFConnect application and the box.  
[Frida](https://frida.re/) for dynamic testing. [Screenshot](https://imgur.com/lsc9tJV)   
[gatttool](http://manpages.ubuntu.com/manpages/cosmic/man1/gatttool.1.html) to find the bluetooth UUIDs.  
[apktool](https://ibotpeaches.github.io/Apktool/) to convert the APK to a JAR file.  
[jadx](https://github.com/skylot/jadx) to decompile the JAR file.  
[7-zip](https://www.7-zip.org/) to extract the APK assets.  

# Bluetooth Low Energy
The system uses Bluetooth Low Energy for it's communiation.  
Here's a list with the UUIDs for the grainfather system.  

Device UUID: `0000cdd0-0000-1000-8000-00805f9b34fb`  
Read Characteristic UUID: `0003cdd1-0000-1000-8000-00805f9b0131`  
Write Characteristic UUID `0003cdd2-0000-1000-8000-00805f9b0131`  

# Commands
The commands are sent to the grainfather system via Bluetooth. Commands are plain text.  
All commands should be exactly **19 characters** in length. Pad the end with spaces.  
Anything between curly braces is a parameter.  

Dismiss Boil Addition Alert: `A`  
Cancel Timer: `C`  
Decrement Target Temp: `D`  
Cancel Or Finish Session: `F`  
Pause Or Resume Timer: `G`  
Toggle Heat: `H`  
Interaction Complete: `I`  
Turn Off Heat: `K0`  
Turn On Heat: `K1`  
Turn Off Pump: `L0`  
Turn On Pump: `L1`  
Get Current Boil Temp: `M`  
Toggle Pump: `P`  
Disconnect Manual Mode No Action: `Q0`  
Disconnect And Cancel Session: `Q1`  
Disconnect Auto Mode No Action: `Q2`  
Press Set: `T`  
Increment Target Temp: `U`  
Disable Sparge Water Alert: `V`  
Get Firmware Version: `X`  
Reset Controller: `Z`  
Reset Recipe Interrupted: `!`  
Turn Off Sparge Counter Mode: `d0`  
Turn On Sparge Counter Mode: `d1`  
Turn Off Boil Control Mode: `e0`  
Turn On Boil Control Mode: `e1`  
Exit Manual Power Control Mode: `f0`  
Enter Manual Power Control Mode: `f1`  
Get Controller Voltage And Units: `g`  
Turn Off Sparge Alert Mode: `h0`  
Turn On Sparge Alert Mode: `h1`  
Set Delayed Heat Function: `B{Minutes},{Seconds},`  
Set Local Boil Temp To: `E{Temperature},`  
Set Boil Time To: `J{Minutes},`  
Skip To Step: `N{Step Num},{Can Edit Time},{Time Left Minutes},{Time Left Seconds},{Skip Ramp},{Disable Add Grain},`  
Set New Timer: `S{Minutes},`  
Set New Timer With Seconds: `W{Minutes},{Seconds},`  
Set Target Temp To: `${Temperature},`  
Edit Controller Stored Temp And Time: `a{Stage Num},{New Time},{New Temperature},`  
Set Sparge Progress To: `b${Progress},`  
Skip To Interaction: `c{Code},`  

# Sending a recipe
Sending a recipe is a bit more complex. Commands need to be sent in the correct order:  
`R{Boil Time},{Mash Step Count},{Mash Volume},{Sparge Volume},`  
`{Show Water Treatment Alert},{Show Sparge Counter},{Show Sparge Alert},{Delayed Session},{Skip Start},`  
`{Recipe Name}`  
`{Hop Stand Time},{Boil Addition Stop Count},{Boil Power Mode},{Strike Temp Mode},`  
Then for every 'boil stop' or 'unique boil addition time', send the time remaining in minutes.  
Then if you're using strike temp mode, send: `0`. (Not sure why, maybe it's not yet implemented)  
Then for every 'mash stop' or 'step' in your mash, send: `{Mash Step Temperature}:{Mash Step Duration}` (Temperature in degC and Duration in Min)  

Example:  
`R75,2,15.7,16.7,` 75 minute boil, 2 mash steps, 15.6L mash volume, 16.7L sparge volume  
`0,1,1,0,0,` No water treatment alert, show sparge counter, show sparge alert, no delayed session, do not skip the start  
`SAISON` Recipe name that will be displayed in the top left  
`0,4,0,0,` No hop stand, 4 boil addition stops, no boil power mode, no strike temp mode  
`75,` Boil addition stop 1, at 75 minutes boil time remaining  
`45,` Boil addition stop 2, at 45 minutes boil time remaining  
`30,` Boil addition stop 3, at 30 minutes boil time remaining  
`10,` Boil addition stop 4, at 10 Minutes boil time remaining  
`65:60,` Mash step 1, 65C for 60 minutes  
`75:10,` Mash step 2, 75C for 10 minutes  

# Notifications
The system sends it's current status every so often.  
All notifications start with one of these characters: A, B, C, E, I, T, W, X, Y.  
Notifications look like this:  

`X{Target Temperature},{Current temperature}`  
`Y{Heat Power},{Pump Status},{Auto Mode Status},{Stage Ramp Status},{Interaction Mode Status},{Interaction Code},{Stage Number},{Delayed Heat Mode}`  
`T{Timer Active},{Time Left Minutes},{Timer Total Start Time},{Time Left Seconds}`  
`I{Interaction Code}`  
`W{Heat Power Output Percentage},{Is Timer Paused},{Step Mash Mode},{Is Recipe Interrupted},{Manual Power Mode},{Sparge Water Alert Displayed}`  
`C{Boil Temperature}`  

Examples:  
`T0,0,0,0,ZZZZZZZZ`  
`X61.0,22.8,ZZZZZZ` 61.0C target temperature, 22.8C current temperature  
`W0,0,0,0,0,0,ZZZZ`  
