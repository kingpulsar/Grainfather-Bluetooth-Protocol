var Bluetooth = require('./Bluetooth');
var GrainfatherCommands = require('./GrainfatherCommands');

const bluetooth = new Bluetooth();
const grainfatherCommands = new GrainfatherCommands();

bluetooth.once('ready', async () => {
    let commands = grainfatherCommands.getRecipeCommands(
        75, // Boil time
        [[65, 60], [75, 10]], // Mash steps
        15.6, // Mash volume
        16.7, // Sparge volume
        0, // Water treament alert
        1, // Sparge counter
        1, // Sparge alert
        0, // Delayed session
        0, // Skip start
        "SAISON", // Name
        0, // Hop stand
        [75, 45, 30, 10], // Boil addition times
        0, // Boil power mode
        0 // Strike temp mode
    );

    // Send the commands one by one
    for(const command of commands) {
        await bluetooth.send(command).catch(console.log);
    }

    console.log("Sent recipe :)");
});


// Example for receiving data from the grainfather
/*
    bluetooth.on('data', (data) => {
        const notification = grainfatherCommands.parseNotification(data.toString());
        console.log(notification);
    });
*/
