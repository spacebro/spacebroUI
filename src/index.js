'use strict'

require('hammerjs/hammer.min')
window.TheGraph = require('the-graph')

require('./styles/style.css')
require('font-awesome/css/font-awesome.min.css')

/* global Polymer */
Polymer.veiledElements = ['the-graph-editor']

const { setupSpacebro, connectSpacebro } = require('./connectSpacebro')
const { animateConnectionFromSource, connectUi } = require('./connectUi')
const { getSidebarItems, connectSidebar, updateHtml } = require('./connectSidebar')
const { CachedGraph } = require('./CachedGraph')

window.addEventListener('polymer-ready', function () {
  const fbpGraph = window.TheGraph.fbpGraph

  // Remove loading message
  document.body.removeChild(document.getElementById('loading'))

  // The graph editor
  const editor = document.getElementById('editor')

  // Load empty graph
  editor.graph = new fbpGraph.Graph('graph', { caseSensitive: true })

  // Resize to fill window and also have explicit w/h attributes
  function resize () {
    editor.setAttribute('width', window.innerWidth * 75 / 100)
    editor.setAttribute('height', window.innerHeight)
  }
  window.addEventListener('resize', resize)
  resize()

  const spacebroClient = setupSpacebro()
  const graph = new CachedGraph()
  const sidebarItems = getSidebarItems()
  const sidebarDom = document.getElementById('sidebarItems')

  connectSpacebro(spacebroClient, graph)
  connectUi(editor, graph)
  connectSidebar(sidebarDom, sidebarItems, graph)

  graph.on('addConnections', (connections) => {
    // listen on these events to animate edges
    for (let connection of connections) {
      spacebroClient.on(connection.src.eventName, (data) => {
        animateConnectionFromSource(editor, connection.src)
        if (connection.tgt.clientName.startsWith('ui-')) {
          const item = sidebarItems[connection.tgt.clientName]
          item && item.apply(connection.tgt.eventName, data)
          updateHtml(sidebarDom, sidebarItems)
        }
      })
    }
  })
  graph.on('removeConnections', (connections) => {
    // remove listening when no more connection on this event
    for (let connection of connections) {
      const srcNode = editor.graph.nodes.find(nodeData => nodeData.clientName === connection.src.clientName)
      const edge = editor.graph.edges.find(e => (
        e.from.node === srcNode.id &&
        e.from.port === connection.src.eventName
      ))
      if (!edge) {
        spacebroClient.off(connection.src.eventName)
      }
    }
  })

  // Add text box button
  document.getElementById('addtextbox').addEventListener('click', () => {
    let name = 'ui-textbox-0' + Math.floor(Math.random() * 10000)
    let clients = {}
    clients[name] = {
      name: name,
      type: 'ui-textbox',
      in: { in: { eventName: 'in', type: 'all' } }
    }
    graph.addClients(clients, true, true)
    setTimeout(() => editor.triggerAutolayout(), 300)
  })

  // Add image box button
  document.getElementById('addimagebox').addEventListener('click', () => {
    let name = 'ui-imagebox-0' + Math.floor(Math.random() * 10000)
    let clients = {}
    clients[name] = {
      name: name,
      type: 'ui-imagebox',
      in: { in: { eventName: 'in', type: 'all' } }
    }
    graph.addClients(clients, true, true)
    setTimeout(() => editor.triggerAutolayout(), 300)
  })

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

  setTimeout(() => editor.triggerAutolayout(), 300)
})
