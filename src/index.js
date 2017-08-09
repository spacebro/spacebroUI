'use strict'

require('hammerjs/hammer.min')
window.TheGraph = require('the-graph')

require('./styles/style.css')
require('font-awesome/css/font-awesome.min.css')

/* global Polymer */
Polymer.veiledElements = ['the-graph-editor']

const { setupSpacebro, connectSpacebro } = require('./connectSpacebro')
const { animateConnection, connectUi } = require('./connectUi')
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
  const sidebarDom = document.getElementById('sidebar')

  connectSpacebro(spacebroClient, graph)
  connectUi(editor, graph)
  connectSidebar(sidebarDom, sidebarItems, graph)

  spacebroClient.on('connectionUsed', (connection) => {
    animateConnection(editor, connection)
  })

  spacebroClient.on('uiEvent', (data) => {
    const { target, args } = data
    const item = sidebarItems[target.clientName]

    console.log(target, args)

    item && item.apply(target.eventName, args)
    updateHtml(sidebarDom, sidebarItems)
  })

  // Add text box button
  document.getElementById('addtextbox').addEventListener('click', () => {
    graph.addClients({
      'ui-textbox-0': {
        name: 'ui-textbox-0',
        type: 'ui-textbox',
        in: [ { eventName: "in", type: "all" } ]
      }
    }, true, true)
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
})
