'use strict'

const { SpacebroClient, setDefaultSettings } = require('spacebro-client')

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

function connectSpacebro (spacebroClient, graph) {
  // From spacebro to CachedGraph
  spacebroClient.on('clients', (clients) => {
    console.log('Setting clients:', clients)
    graph.setClients(clients, true, false)
  })
  spacebroClient.on('connections', (connections) => {
    console.log('Setting connections:', connections)
    graph.setConnections(connections, true, false)
  })

  // From CachedGraph to spacebro
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
