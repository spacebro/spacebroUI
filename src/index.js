'use strict'

require('hammerjs/hammer.min')
window.TheGraph = require('the-graph')
const { SpacebroClient, setDefaultSettings } = require('spacebro-client')

require('./styles/style.css')
require('font-awesome/css/font-awesome.min.css')

/* global Polymer */
Polymer.veiledElements = ['the-graph-editor']

window.addEventListener('polymer-ready', function () {
  const fbpGraph = window.TheGraph.fbpGraph

  // Remove loading message
  document.body.removeChild(document.getElementById('loading'))

  // The graph editor
  const editor = document.getElementById('editor')

  // Component library
  const library = {
    basic: {
      name: 'basic',
      description: 'basic demo component',
      icon: 'eye',
      inports: [
        { 'name': 'in', 'type': 'all' }
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
        { 'name': 'in', 'type': 'all' }
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
  }
  editor.$.graph.library = library

  // Load empty graph
  editor.graph = new fbpGraph.Graph('graph', { caseSensitive: true })

  // Add node button
  function addnode (name) {
    const nodes = editor.graph.nodes
    const existing = nodes.find((node) => node.component === name)
    if (name !== 'spacebroUI' && !existing) {
      const id = Math.round(Math.random() * 100000).toString(36)
      const component = name || Math.random() > 0.5 ? 'basic' : 'tall'
      const metadata = {
        label: component,
        x: Math.round(Math.random() * 800),
        y: Math.round(Math.random() * 600)
      }
      const newNode = editor.graph.addNode(id, component, metadata)
      return newNode
    }
  }
  document.getElementById('addnode').addEventListener('click', addnode)

  // Add edge button
  function addedge (outNodeID) {
    const nodes = editor.graph.nodes
    const len = nodes.length
    if (len < 1) { return }
    const node1 = outNodeID || nodes[Math.floor(Math.random() * len)].id
    const node2 = nodes[Math.floor(Math.random() * len)].id
    const port1 = 'out' + Math.floor(Math.random() * 3)
    const port2 = 'in' + Math.floor(Math.random() * 12)
    const meta = { route: Math.floor(Math.random() * 10) }
    const newEdge = editor.graph.addEdge(node1, port1, node2, port2, meta)
    return newEdge
  }
  document.getElementById('addedge').addEventListener('click', addedge)

  function addEdge (connection) {
    const nodes = editor.graph.nodes
    const src = nodes.find((node) => node.component === connection.src.clientName)
    const tgt = nodes.find((node) => node.component === connection.tgt.clientName)
    const meta = { route: 2 }
    if (src && tgt) {
      const newEdge = editor.graph.addEdge(src.id, connection.src.eventName, tgt.id, connection.tgt.eventName, meta)
      if (newEdge) {
        spacebroClient.on(connection.src.eventName, (data) => {
          if (data._from === connection.src.clientName) {
            editor.animateEdge(newEdge)
            setTimeout(() => { editor.unanimateEdge(newEdge) }, 4000)
          }
        })
        return newEdge
      }
    }
  }

  // Autolayout button
  document.getElementById('autolayout').addEventListener('click', () => {
    editor.triggerAutolayout()
  })

  // Random graph button
  document.getElementById('random').addEventListener('click', () => {
    for (let i = 0; i < 20; i++) {
      const node = addnode()
      addedge(node.id)
      addedge(node.id)
    }
    setTimeout(() => {
      // b/c ports change
      editor.libraryRefresh()
      editor.triggerAutolayout()
    }, 500)
  })

  // Get graph button
  document.getElementById('get').addEventListener('click', () => {
    const graphJSON = JSON.stringify(editor.graph.toJSON(), null, 2)
    console.log(graphJSON)
    // you can use the var graphJSON to save the graph definition in a file/database
  })

  // Load graph
  function loadJSON () {
    const graphData = `{
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
    }`
    const fbpGraph = window.TheGraph.fbpGraph
    fbpGraph.graph.loadJSON(graphData, (err, graph) => {
      if (err) {
        console.error('error loading graph: ' + err.toString())
        return
      }
      editor.graph = graph
    })
  }
  document.getElementById('load').addEventListener('click', () => loadJSON())
  // loadJSON();

  // Clear button
  document.getElementById('clear').addEventListener('click', () => {
    editor.graph = new fbpGraph.Graph()
  })
  // Save button
  document.getElementById('save').addEventListener('click', () => {
    spacebroClient.emit('saveGraph', {})
  })

  // Resize to fill window and also have explicit w/h attributes
  function resize () {
    editor.setAttribute('width', window.innerWidth)
    editor.setAttribute('height', window.innerHeight)
  }
  window.addEventListener('resize', resize)

  resize()

  setDefaultSettings(SETTINGS.service.spacebro, true)
  // Connect to spacebro
  const spacebroClient = new SpacebroClient()

  spacebroClient.on('connect', (data) => {
    spacebroClient.emit('getClients')
  })

  function getComponentFromClient (client) {
    client.inports = []
    client.outports = []
    if (client.in) {
      for (const keykey in client.in) {
        const inevent = client.in[keykey]
        client.inports.push({
          'name': inevent.eventName,
          'type': inevent.type
        })
      }
    }
    if (client.out) {
      for (const keykeyout in client.out) {
        const outevent = client.out[keykeyout]
        client.outports.push({
          'name': outevent.eventName,
          'type': outevent.type
        })
      }
    }
    return client
  }

  spacebroClient.on('clients', function (data) {
    for (const key in data) {
      const client = data[key]
      editor.$.graph.library[client.name] = getComponentFromClient(client)
      addnode(client.name)
    }
    spacebroClient.emit('getConnections')
  })
  spacebroClient.on('newClient', (client) => {
    editor.$.graph.library[client.name] = getComponentFromClient(client)
    addnode(client.name)
    spacebroClient.emit('getConnections')
  })

  spacebroClient.on('connections', (connections) => {
    for (const key in connections) {
      const connection = connections[key]
      if (connection.src && connection.src.eventName) {
        addEdge(connection)
      }
    }
    setTimeout(() => { editor.$.graph.triggerAutolayout() }, 100)
  })

  function getConnectionFromEdge (data) {
    const nodes = editor.graph.nodes
    const connection = {
      src: {
        clientName: nodes.find((node) => node.id === data.from.node).component,
        eventName: data.from.port
      },
      tgt: {
        clientName: nodes.find((node) => node.id === data.to.node).component,
        eventName: data.to.port
      }
    }
    return connection
  }

  editor.graph.on('addEdge', (data) => {
    spacebroClient.emit('addConnections', getConnectionFromEdge(data))
  })
  editor.graph.on('removeEdge', (data) => {
    spacebroClient.emit('removeConnections', getConnectionFromEdge(data))
  })
})
