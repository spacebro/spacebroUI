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

  // From spacebro to CachedGraph
  client.on('clients', (clients) => {
    console.log('Setting clients:', clients)
    graph.setClients(clients, true, false)
  })

  // From CachedGraph to spacebro
  graph.on('sb-removeClients', (clientNames) => {
    console.log('Emitting removeClients:', clientNames)
    client.emit('removeClients', clientNames)
  })

  // From CachedGraph to UI
  function _addNode (clientName) {
    const id = Math.round(Math.random() * 100000).toString(36)

    // return editor.graph.addNode(id, clientName, metadata = {
    return editor.graph.addNode(id, 'tall', {
      label: clientName,
      x: Math.round(Math.random() * 800),
      y: Math.round(Math.random() * 600)
    })
  }

  function _findNode (name) {
    return editor.graph.nodes.find(nodeData => nodeData.metadata.label == name)
  }

  graph.on('ui-addClients', (clients) => {
    console.log('ui-addClients', clients)
    for (const client of clients) {
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

  /*
  editor.graph.on('addEdge', (data) => {
    client.emit('addConnections', getConnectionFromEdge(data))
  })
  editor.graph.on('removeEdge', (data) => {
    client.emit('removeConnections', getConnectionFromEdge(data))
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
  return spacebroClient
}

/*
{
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

  spacebroClient.on('clients', function (clients) {
    console.log('Clients2: ', clients)
    for (const key in clients) {
      const client = clients[key]
      editor.$.graph.library[client.name] = getComponentFromClient(client)
      addnode(client.name)
    }
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

}
*/

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
