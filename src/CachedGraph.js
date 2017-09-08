'use strict'

const EventEmitter = require('events')
const deepEqual = require('deep-equal')

function _deepFind (array, obj) {
  return array.find(o => deepEqual(o, obj))
}

function _diff (oldArray, newArray) {
  return newArray.filter(obj => _deepFind(oldArray, obj) == null)
}

function _common (array1, array2) {
  return array2.filter(obj => _deepFind(array1, obj) != null)
}

class CachedGraph extends EventEmitter {
  constructor () {
    super()
    this._connections = []
    this._clients = {}
  }

  addClients (clients, updateUi, updateSb) {
    const addedNames = _diff(Object.keys(this._clients), Object.keys(clients))
    const addedClients = addedNames.map(name => clients[name])

    this._clients = Object.assign({}, clients, this._clients)

    if (addedClients.length) {
      updateUi && this.emit('ui-addClients', addedClients)
      updateSb && this.emit('sb-addClients', addedClients)
    }
  }

  removeClients (clientNames, updateUi, updateSb) {
    clientNames = _common(clientNames, Object.keys(this._clients))

    for (const name of clientNames) {
      delete this._clients[name]
    }

    if (clientNames.length) {
      updateUi && this.emit('ui-removeClients', clientNames)
      updateSb && this.emit('sb-removeClients', clientNames)
    }
  }

  setClients (clients, updateUi, updateSb) {
    const removedNames = _diff(Object.keys(clients), Object.keys(this._clients))
    const commonNames = _common(Object.keys(clients), Object.keys(this._clients))

    const updatedClients = commonNames
      .filter(name => !deepEqual(clients[name], this._clients[name]))
      .map(name => clients[name])

    this.addClients(clients, updateUi, updateSb)
    this.removeClients(removedNames, updateUi, updateSb)

    if (updatedClients.length) {
      updateUi && this.emit('ui-updateClients', updatedClients)
      updateSb && this.emit('sb-updateClients', updatedClients)
    }

    this._clients = Object.assign({}, clients)
  }

  addConnections (connections, updateUi, updateSb) {
    const added = _diff(this._connections, connections)

    if (added.length) {
      this._connections = connections.slice()
      updateUi && this.emit('ui-addConnections', added)
      updateSb && this.emit('sb-addConnections', added)
      this.emit('addConnections', added)
    }
  }

  removeConnections (connections, updateUi, updateSb) {
    const removed = _common(this._connections, connections)
    this._connections = _diff(connections, this._connections)

    if (removed.length) {
      updateUi && this.emit('ui-removeConnections', removed)
      updateSb && this.emit('sb-removeConnections', removed)
      this.emit('removeConnections', removed)
    }
  }

  setConnections (connections, updateUi, updateSb) {
    const removed = _diff(connections, this._connections)

    this.addConnections(connections, updateUi, updateSb)
    this.removeConnections(removed, updateUi, updateSb)
  }
}

module.exports = {
  CachedGraph
}
