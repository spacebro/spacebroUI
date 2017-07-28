'use strict'

require('hammerjs/hammer.min')
window.TheGraph = require('the-graph')

require('./styles/style.css')
require('font-awesome/css/font-awesome.min.css')

/* global Polymer */
Polymer.veiledElements = ['the-graph-editor']

const { SpacebroClient, setDefaultSettings } = require('spacebro-client')
const { CachedGraph } = require('./CachedGraph')

window.addEventListener('polymer-ready', function () {
  const fbpGraph = window.TheGraph.fbpGraph

  // Remove loading message
  document.body.removeChild(document.getElementById('loading'))

  // The graph editor
  const editor = document.getElementById('editor')
  editor.$.graph.library = loadLibrary()

  // Load empty graph
  editor.graph = new fbpGraph.Graph('graph', { caseSensitive: true })

  // Resize to fill window and also have explicit w/h attributes
  function resize () {
    editor.setAttribute('width', window.innerWidth)
    editor.setAttribute('height', window.innerHeight)
  }
  window.addEventListener('resize', resize)

  resize()

  const client = setupSpacebro()
  const graph = new CachedGraph()

  // From UI to CachedGraph
  editor.graph.on('addNode', (nodeData) => {
    console.log('Removing node:', nodeData)
    graph.removeClients([ nodeData.name ], false, true)
  })
  editor.graph.on('removeNode', (nodeData) => {
    console.log('Removing node:', nodeData.metadata.label)
    graph.removeClients([ nodeData.metadata.label ], false, true)
  })

  function _getNodeName (id) {
    return editor.graph.nodes.find(node => node.id === id).metadata.label
  }

  function _getConnection (edge) {
    const { from, to } = edge
    return {
      src: { clientName: _getNodeName(from.node), eventName: from.port },
      tgt: { clientName: _getNodeName(to.node), eventName: to.port }
    }
  }

  editor.graph.on('addEdge', (edge) => {
    console.log('addEdge:', edge)
    graph.addConnections([ _getConnection(edge) ], false, true)
  })
  editor.graph.on('removeEdge', (edge) => {
    console.log('removeEdge:', edge)
    graph.removeConnections([ _getConnection(edge) ], false, true)
  })

  // From spacebro to CachedGraph
  client.on('clients', (clients) => {
    console.log('Setting clients:', clients)
    graph.setClients(clients, true, false)
  })
  client.on('connections', (connections) => {
    console.log('Setting connections:', connections)
    graph.setConnections(connections, true, false)
  })

  // From CachedGraph to spacebro
  graph.on('sb-removeClients', (clientNames) => {
    console.log('Emitting removeClients:', clientNames)
    client.emit('removeClients', clientNames)
  })
  graph.on('sb-addConnections', (connections) => {
    console.log('Emitting addConnections:', connections)
    client.emit('addConnections', connections)
  })
  graph.on('sb-removeConnections', (connections) => {
    console.log('Emitting removeConnections:', connections)
    client.emit('removeConnections', connections)
  })

  // From CachedGraph to UI

  function _addNode (clientName) {
    const id = Math.round(Math.random() * 100000).toString(36)

    // TODO
    // return editor.graph.addNode(id, clientName, metadata = {
    return editor.graph.addNode(id, 'tall', {
      label: clientName,
      x: Math.round(Math.random() * 800),
      y: Math.round(Math.random() * 600)
    })
  }

  function _findNode (name) {
    return editor.graph.nodes.find(nodeData => nodeData.metadata.label === name)
  }

  graph.on('ui-addClients', (clients) => {
    console.log('ui-addClients', clients)
    for (const client of clients) {
      // editor.$.graph.library[client.name] = getComponentFromClient(client)
      if (client.name !== 'spacebroUI') {
        _addNode(client.name)
      }
    }
  })
  graph.on('ui-removeClients', (clientNames) => {
    console.log('ui-removeClients', clientNames)
    for (const name of clientNames) {
      const node = _findNode(name)
      node && editor.graph.removeNode(node.id)
    }
  })

  function _getEdge (connection, getId) {
    let srcNode = _findNode(connection.src.clientName)
    let tgtNode = _findNode(connection.tgt.clientName)

    if (!srcNode || !tgtNode) {
      return null
    }
    return [
      srcNode.id,
      connection.src.eventName,
      tgtNode.id,
      connection.tgt.eventName,
    ]
  }

  graph.on('ui-addConnections', (connections) => {
    console.log('ui-addConnections', connections)
    for (const connection of connections) {
      const edge = _getEdge(connection, true)

      console.log('edge:', edge)
      edge && editor.graph.addEdge(...edge, { route: 2 })
    }
  })
  graph.on('ui-removeConnections', (connections) => {
    console.log('ui-removeConnections', connections)
    for (const connection of connections) {
      const edge = _getEdge(connection, false)

      edge && editor.graph.removeEdge(...edge)
    }
  })

  // TODO
  // ANIMATE CONNECTIONS
  /*
  spacebroClient.on(connection.src.eventName, (data) => {
    if (data._from === connection.src.clientName) {
      editor.animateEdge(newEdge)
      setTimeout(() => { editor.unanimateEdge(newEdge) }, 4000)
    }
  })
  */
})

function setupSpacebro () {
  setDefaultSettings(SETTINGS.service.spacebro, true)
  // Connect to spacebro
  const spacebroClient = new SpacebroClient()

  spacebroClient.on('connect', (data) => {
    spacebroClient.emit('getClients')
  })
  spacebroClient.on('clients', (data) => {
    spacebroClient.emit('getConnections')
  })
  return spacebroClient
}

// TODO
/*
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
*/

function loadLibrary () {
  return {
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
}
