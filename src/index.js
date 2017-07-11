'use strict'

require('hammerjs/hammer.min')
window.TheGraph = require('the-graph')
const spacebroClient = require('spacebro-client')

require('./styles/style.css')
require('font-awesome/css/font-awesome.min.css')

Polymer.veiledElements = ["the-graph-editor"];

window.addEventListener('polymer-ready', function () {
  var fbpGraph = window.TheGraph.fbpGraph

  // Remove loading message
  document.body.removeChild(document.getElementById("loading"));

  // The graph editor
  var editor = document.getElementById('editor');

  // Component library
  var library = {
    basic: {
      name: 'basic',
      description: 'basic demo component',
      icon: 'eye',
      inports: [
        { 'name': 'in', 'type': 'all' },
      ],
      outports: [
        { 'name': 'out', 'type': 'all' }
      ]
    },
    smilecooker: {
      name: 'smilecooker',
      description: 'smilecooker receipe',
      icon: 'eye',
      inports: [
        { 'name': 'in', 'type': 'all' },
      ],
      outports: [
        { 'name': 'out0', 'type': 'all' },
        { 'name': 'out1', 'type': 'all' }
      ]
    },
    tall: {
      name: 'tall',
      description: 'tall demo component',
      icon: 'cog',
      inports: [
        { 'name': 'in0', 'type': 'all' },
        { 'name': 'in1', 'type': 'all' },
        { 'name': 'in2', 'type': 'all' },
        { 'name': 'in3', 'type': 'all' },
        { 'name': 'in4', 'type': 'all' },
        { 'name': 'in5', 'type': 'all' },
        { 'name': 'in6', 'type': 'all' },
        { 'name': 'in7', 'type': 'all' },
        { 'name': 'in8', 'type': 'all' },
        { 'name': 'in9', 'type': 'all' },
        { 'name': 'in10', 'type': 'all' },
        { 'name': 'in11', 'type': 'all' },
        { 'name': 'in12', 'type': 'all' }
      ],
      outports: [
        { 'name': 'out0', 'type': 'all' }
      ]
    }
  };
  editor.$.graph.library = library;

  // Load empty graph
  editor.graph = new fbpGraph.Graph('graph', { caseSensitive: true });
  console.log('case', editor.graph.caseSensitive)

  // Add node button
  var addnode = function (name) {
    var nodes = editor.graph.nodes;
    var existing = nodes.find(function (node) { return node.component === name })
    if (name !== 'spacebroUI' && !existing) {
      var id = Math.round(Math.random() * 100000).toString(36);
      var component = Math.random() > 0.5 ? 'basic' : 'tall';
      if (name) {
        component = name;
      }
      var metadata = {
        label: component,
        x: Math.round(Math.random() * 800),
        y: Math.round(Math.random() * 600)
      };
      var newNode = editor.graph.addNode(id, component, metadata);
      return newNode;
    }
  };
  document.getElementById("addnode").addEventListener("click", addnode);

  // Add edge button
  var addedge = function (outNodeID) {
    var nodes = editor.graph.nodes;
    var len = nodes.length;
    if (len < 1) { return; }
    var node1 = outNodeID || nodes[Math.floor(Math.random() * len)].id;
    var node2 = nodes[Math.floor(Math.random() * len)].id;
    var port1 = 'out' + Math.floor(Math.random() * 3);
    var port2 = 'in' + Math.floor(Math.random() * 12);
    var meta = { route: Math.floor(Math.random() * 10) };
    var newEdge = editor.graph.addEdge(node1, port1, node2, port2, meta);
    return newEdge;
  };
  document.getElementById("addedge").addEventListener("click", addedge);

  var addEdge = function (connection) {
    var nodes = editor.graph.nodes;
    var src = nodes.find(function (node) { return node.component === connection.src.clientName })
    var tgt = nodes.find(function (node) { return node.component === connection.tgt.clientName })
    var meta = { route: 2 };
    if (src && tgt) {
      var newEdge = editor.graph.addEdge(src.id, connection.src.eventName, tgt.id, connection.tgt.eventName, meta);
      spacebroClient.on(connection.src.eventName, function (data) {
        if (data._from === connection.src.clientName) {
          editor.animateEdge(newEdge);
          setTimeout(function () { editor.unanimateEdge(newEdge) }, 4000);
        }
      })
    }
    return newEdge;
  }

  // Autolayout button
  document.getElementById("autolayout").addEventListener("click", function () {
    editor.triggerAutolayout();
  });

  // Random graph button
  document.getElementById("random").addEventListener("click", function () {
    for (var i = 0; i < 20; i++) {
      var node = addnode();
      addedge(node.id);
      addedge(node.id);
    }
    setTimeout(function () {
      // b/c ports change
      editor.libraryRefresh();
      editor.triggerAutolayout();
    }, 500);
  });

  // Get graph button
  document.getElementById("get").addEventListener("click", function () {
    var graphJSON = JSON.stringify(editor.graph.toJSON(), null, 2);
    alert(graphJSON);
    console.log(graphJSON);
    //you can use the var graphJSON to save the graph definition in a file/database
  });

  // Load graph
  var loadJSON = function () {
    var graphData = `{
						"caseSensitive": false,
						"properties": {},
						"inports": {},
						"outports": {},
						"groups": [],
						"processes": {
							"etna-ysl": {
								"component": "basic",
								"metadata": {
									"label": "etna-ysl",
									"x": 144,
									"y": 0,
									"width": 72,
									"height": 72
								}
							},
							"ysl-digital-studio": {
								"component": "smilecooker",
								"metadata": {
									"label": "ysl-digital-studio",
									"x": 0,
									"y": 0,
									"width": 72,
									"height": 72
								}
							},
							"basic_rqa7f": {
								"component": "basic",
								"metadata": {
									"label": "media-manager",
									"x": 288,
									"y": 0,
									"width": 72,
									"height": 72
								}
							},
							"basic_lnefv": {
								"component": "basic",
								"metadata": {
									"label": "altruist",
									"x": 288,
									"y": 144,
									"width": 72,
									"height": 72
								}
							},
							"basic_c5cmg": {
								"component": "basic",
								"metadata": {
									"label": "ysl-library",
									"x": 432,
									"y": 0,
									"width": 72,
									"height": 72
								}
							}
						},
						"connections": [
							{
								"src": {
									"process": "ysl-digital-studio",
									"port": "out0"
								},
								"tgt": {
									"process": "etna-ysl",
									"port": "in"
								}
							},
							{
								"src": {
									"process": "etna-ysl",
									"port": "out"
								},
								"tgt": {
									"process": "ysl-digital-studio",
									"port": "in"
								}
							},
							{
								"src": {
									"process": "etna-ysl",
									"port": "out"
								},
								"tgt": {
									"process": "basic_rqa7f",
									"port": "in"
								},
								"metadata": {
									"route": 0
								}
							},
							{
								"src": {
									"process": "ysl-digital-studio",
									"port": "out1"
								},
								"tgt": {
									"process": "basic_lnefv",
									"port": "in"
								}
							},
							{
								"src": {
									"process": "basic_rqa7f",
									"port": "out"
								},
								"tgt": {
									"process": "basic_lnefv",
									"port": "in"
								},
								"metadata": {}
							},
							{
								"src": {
									"process": "basic_rqa7f",
									"port": "out"
								},
								"tgt": {
									"process": "basic_c5cmg",
									"port": "in"
								},
								"metadata": {
									"route": 0
								}
							}
						]
					}`;
    var fbpGraph = window.TheGraph.fbpGraph
    // fbpGraph.graph.loadJSON(JSON.stringify(graphData), function(err, graph){
    fbpGraph.graph.loadJSON(graphData, function (err, graph) {
      if (err) {
        loadingMessage.innerHTML = "error loading graph: " + err.toString();
        return;
      }
      editor.graph = graph;
    });
  }
  document.getElementById("load").addEventListener("click", function () {
    loadJSON();
  });
  // loadJSON();
  /*
  var edges = editor.graph.edges;
  console.log(edges)

  var animatingEdge1;
  var animatingEdge2;
  window.setInterval(function () {
    if (!editor.graph) { return; }
    if (animatingEdge2) {
      editor.unanimateEdge(animatingEdge2);
    }
    if (animatingEdge1) {
      animatingEdge2 = animatingEdge1;
    }
    var edges = editor.graph.edges;
    if (edges.length>0) {
      animatingEdge1 = edges[Math.floor(Math.random()*edges.length)];
      editor.animateEdge(animatingEdge1);
    }
  }, 2014);
  */
  // Clear button
  document.getElementById("clear").addEventListener("click", function () {
    editor.graph = new fbpGraph.Graph();
  });

  // Resize to fill window and also have explicit w/h attributes
  var resize = function () {
    editor.setAttribute("width", window.innerWidth);
    editor.setAttribute("height", window.innerHeight);
  };
  window.addEventListener("resize", resize);

  resize();

  // Connect to spacebro
  spacebroClient.connect('localhost', 6060, {
    clientName: "spacebroUI",
    channelName: "media-stream"
  })
  spacebroClient.on('connect', function (data) {
    spacebroClient.emit('getClients')
  })

  var getComponentFromClient = function (client) {
    client.inports = []
    client.outports = []
      if (client.in) {
        for (var keykey in client.in) {
          var inevent = client.in[keykey]
          client.inports.push({
            'name': inevent.eventName,
            'type':  inevent.type
          })
        }
      }
      if (client.out) {
        for (var keykey in client.out) {
          var outevent = client.out[keykey]
          client.outports.push({
            'name': outevent.eventName,
            'type':  outevent.type
          })
        }
      }
      return client
  }

  spacebroClient.on('clients', function (data) {
    for (var key in data) {
      var client = data[key]
      editor.$.graph.library[client.name] = getComponentFromClient(client);
      addnode(client.name);
    }
    spacebroClient.emit('getConnections')
  })
  spacebroClient.on('newClient', (client) => {
    editor.$.graph.library[client.name] = getComponentFromClient(client);
    addnode(client.name);
    spacebroClient.emit('getConnections')
  })

  spacebroClient.on('connections', function (connections) {
    for (var key in connections) {
      var connection = connections[key]
      if (connection.src && connection.src.eventName) {
        addEdge(connection);
      }
    }
    setTimeout(function () { editor.$.graph.triggerAutolayout() }, 100);
  })

  var getConnectionFromEdge = function (data) {
    var nodes = editor.graph.nodes;
    var connection = {
      src: {
        clientName: nodes.find(function (node) { return node.id === data.from.node }).component,
        eventName: data.from.port
      },
      tgt: {
        clientName: nodes.find(function (node) { return node.id === data.to.node }).component,
        eventName: data.to.port
      }
    }
    return connection
  }


  editor.graph.on('addEdge', function (data) {
    console.log(data)
    spacebroClient.emit('addConnections', getConnectionFromEdge(data))
  })
  editor.graph.on('removeEdge', function (data) {
    spacebroClient.emit('removeConnections', getConnectionFromEdge(data))
  })

});
