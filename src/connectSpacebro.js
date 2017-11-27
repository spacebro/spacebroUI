'use strict'

const { SpacebroClient, setDefaultSettings } = require('spacebro-client')

function getChannelName () {
  var channelName = window.location.hash
  if (channelName !== '') {
    channelName = channelName.replace('/', '').replace('#', '')
  }
  return channelName
}

function setupSpacebro () {
  const channelName = getChannelName()
  var spacebroSettings = JSON.parse(JSON.stringify(SETTINGS.service.spacebro))
  if (channelName !== '') {
    spacebroSettings.channelName = channelName
  }
  // dirty show channel
  const text = 'Channel: ' + spacebroSettings.channelName
  const sidebarDom = document.getElementById('sidebar')
  const h = document.createElement('h1')
  h.prepend(text)
  sidebarDom.prepend(h)

  setDefaultSettings(spacebroSettings, true)
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

function connectSpacebro (spacebroClient, graph) {
  // From spacebro to CachedGraph
  spacebroClient.on('clients', (clients) => {
    console.log('Setting clients:', clients)
    graph.setClients(clients, true, false)
    setTimeout(() => document.getElementById('editor').triggerAutolayout(), 300)
  })
  spacebroClient.on('connections', (connections) => {
    console.log('Setting connections:', connections)
    graph.setConnections(connections, true, false)
    setTimeout(() => document.getElementById('editor').triggerAutolayout(), 300)
  })

  // From CachedGraph to spacebro
  graph.on('sb-addClients', (clients) => {
    console.log('Emitting addClients:', clients)
    spacebroClient.emit('addClients', clients)
  })
  graph.on('sb-removeClients', (clientNames) => {
    console.log('Emitting removeClients:', clientNames)
    spacebroClient.emit('removeClients', clientNames)
  })
  graph.on('sb-addConnections', (connections) => {
    console.log('Emitting addConnections:', connections)
    spacebroClient.emit('addConnections', connections)
  })
  graph.on('sb-removeConnections', (connections) => {
    console.log('Emitting removeConnections:', connections)
    spacebroClient.emit('removeConnections', connections)
  })
}

module.exports = {
  setupSpacebro,
  connectSpacebro
}
