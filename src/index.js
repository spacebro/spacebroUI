'use strict'

require('hammerjs/hammer.min')
window.TheGraph = require('the-graph')

require('./styles/style.css')
require('font-awesome/css/font-awesome.min.css')

/* global Polymer */
Polymer.veiledElements = ['the-graph-editor']

const { setupSpacebro, connectSpacebro } = require('./connectSpacebro')
const { connectUi } = require('./connectUi')
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

  const spacebroClient = setupSpacebro()
  const graph = new CachedGraph()

  connectSpacebro(spacebroClient, graph)
  connectUi(editor, graph)

  // Autolayout button
  document.getElementById('autolayout').addEventListener('click', () => {
    editor.triggerAutolayout()
  })

  // Save button
  document.getElementById('save').addEventListener('click', () => {
    spacebroClient.emit('saveGraph', {})
  })

  // Clear button
  document.getElementById('clear').addEventListener('click', () => {
    graph.setConnections([], true, true)
  })
})

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
