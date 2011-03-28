lolmc
=====

For use with [anyconsole](https://github.com/Mortal/anyconsole).

Usage
-----

Start the Minecraft server with anyconsole:

    node anyconsole.js /tmp/minecraft java -jar minecraft_server.jar

Import the lolmc library and create a single Minecraft instance:

    var lolmc = require('lolmc');
    var minecraft = new lolmc.Minecraft();
    minecraft.say("Hey guys! Having a good time?");
    minecraft.once("say", function (sender, message) {
        minecraft.say("Sounds good!");
    });

### Event: 'message'

`function (sender, message) { }`

Emitted when a player sends a chat message.

### Event: 'consolemessage'

`function (message) { }`

Emitted when a console user sends a chat message, excluding messages sent using
`minecraft.say()`.

### Event: 'latency'

`function (latency) { }`

Emitted when latency is measured. Currently this occurs with each call to
`minecraft.say()`.

### Event: 'login'

`function (username) { }`

Emitted when a user logs in.

### Event: 'logout'

`function (username, reason) { }`

Emitted when a user logs out or disconnects for some reason.

### minecraft.say

`minecraft.say(msg)`

Send a message to the server.

### minecraft.command

`minecraft.command(cmd)`

Run a command on the server.
