var http = require('http');
var sockjs = require('sockjs');
var every = require('schedule').every;

var connections = [];

var chat = sockjs.createServer();
var id1percentComplete = 0;
var id2percentComplete = 0;
var id3percentComplete = 0;

chat.on('connection', function(conn) {
    //connections.push(conn);
    // var number = connections.length;
    // conn.write("Welcome, User " + number);
    every('3s').do(function() {
        id1percentComplete = Math.round(id1percentComplete + 2.5);
        id2percentComplete = Math.round(id2percentComplete + 1.3);
        id3percentComplete += 2;
        conn.write('{"NodeId": "1", "percentComplete": 0, "parent": "null", "status":"skyblue", "children": [{"NodeId": "2", "percentComplete": 0, "parent": "Top Level", "status": "skyblue", "children": [{ "NodeId": "4", "percentComplete": '+ id2percentComplete +', "parent": "Level 2: A", "status": "darkseagreen"}, { "NodeId": "5", "percentComplete": '+ id1percentComplete + ', "parent": "Level 2: A", "status": "darkseagreen"}]}, { "NodeId": "3", "percentComplete": ' + id1percentComplete + ', "parent": "Top Level", "value": 10, "status": "crimson"}]}');
        connections.push(conn);
    });

    //conn.write("{id: 1, percentComplete: " + id1percentComplete + ", children: [{id: 2, percentComplete:" + id2percentComplete + "}, {id:3, percentComplete:"+ id3percentComplete +"}]}")

    conn.on('data', function(message) {
        //for (var ii=0; ii < connections.length; ii++) {
        // connections[ii].write("User " + number + " says: " + message);
        //connection[ii].write("{id: 1, percentComplete: 0, children: [{id: 2, percentComplete:2}, {id:3, percentComplete:7}]}")
        //  }

    });
    conn.on('close', function() {
        for (var ii = 0; ii < connections.length; ii++) {
            //connections[ii].write("User " + number + " has disconnected");
            connections[ii].write("disconnected");
        }
    });
});

var server = http.createServer();
chat.installHandlers(server, {
    prefix: '/chat'
});
server.listen(process.env.PORT || 3000, '0.0.0.0');
