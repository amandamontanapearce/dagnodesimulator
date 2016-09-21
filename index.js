var http = require('http');
var sockjs = require('sockjs');
var every = require('schedule').every;

var connections = [];

var chat = sockjs.createServer();


chat.on('connection', function(conn) {
  var id1percentComplete = 0;
  var id2percentComplete = 0;
  var id3percentComplete = 0;
  var error = '"darkseagreen"';
  var errorStatus = '"IN_PROGRESS"'
    //connections.push(conn);
    // var number = connections.length;
    // conn.write("Welcome, User " + number);
    conn.write('{"NodeId": "1", "percentComplete": 0, "parent": "null", "colorStatus":"skyblue", "children": [{"NodeId": "2", "percentComplete": 0, "parent": "Top Level", "colorStatus": "skyblue", "children": [{ "NodeId": "4", "percentComplete": '+ id2percentComplete +', "parent": "Level 2: A", "colorStatus": "darkseagreen"}, { "NodeId": "5", "percentComplete": '+ id1percentComplete + ', "parent": "Level 2: A", "colorStatus": "darkseagreen"}]}, { "NodeId": "3", "percentComplete": ' + id1percentComplete + ', "parent": "Top Level", "value": 10, "colorStatus": '+ error + '}]}');
    every('3s').do(function() {
        id1percentComplete = Math.round(id1percentComplete + 2.7);
        id2percentComplete = Math.round(id2percentComplete + 1.3);
        id3percentComplete += 2;
        if (id1percentComplete > 9) {
          error ='"crimson"';
          errorStatus = '"ERROR"'
          id1percentComplete = 9;
        };
        if (id2percentComplete > 100) {
          id2percentComplete = 100;
        };
        if (id3percentComplete > 100) {
          id3percentComplete = 100;
        };
        conn.write('{"NodeId": "1", "status": "QUEUED", "percentComplete": 0, "parent": "null", "colorStatus":"skyblue", "children": [{"NodeId": "2", "status": "QUEUED", "percentComplete": 0, "parent": "Top Level", "colorStatus": "skyblue", "children": [{ "NodeId": "4", "status": "IN_PROGRESS", "percentComplete": '+ id2percentComplete +', "parent": "Level 2: A", "colorStatus": "darkseagreen"}, { "NodeId": "5", "status": "IN_PROGRESS", "percentComplete": '+ id3percentComplete + ', "parent": "Level 2: A", "colorStatus": "darkseagreen"}]}, { "NodeId": "3", "status": ' + errorStatus + ',"percentComplete": ' + id1percentComplete + ', "parent": "Top Level", "value": 10, "colorStatus": '+ error + '}]}');
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
        // for (var ii = 0; ii < connections.length; ii++) {
        //     //connections[ii].write("User " + number + " has disconnected");
        //     connections[ii].write("disconnected");
        // }
        // var id1percentComplete = 0;
        // var id2percentComplete = 0;
        // var id3percentComplete = 0;
    });
});

var server = http.createServer();
chat.installHandlers(server, {
    prefix: '/chat'
});
server.listen(process.env.PORT || 3000, '0.0.0.0');
