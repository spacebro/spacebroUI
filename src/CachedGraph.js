const EventEmitter = require('events')
const deepEqual = require('deep-equal')

function _diff (oldArray, newArray) {
  return newArray.filter(obj => !(oldArray.indexOf(obj) != -1))
}

class CachedGraph extends EventEmitter {
  constructor () {
    super()
    this._connections = []
    this._clients = {}
  }

  /*
  updateConnections (connections, compareCache) {
    if (compareCache) {
      for (const connection of _removed(this._connections, connections)) {
        this.emit('removeConnection', connection)
      }
      for (const connection of _added(this._connections, connections)) {
        this.emit('addConnection', connection)
      }
    }
    // Deep copy
    this._connections = connections.slice()
  }
  */

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
    clientNames = clientNames.filter(name => name in this._clients)

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
    const commonNames = Object.keys(clients).filter(n => n in this._clients)

    const updatedClients = commonNames.filter(name =>
      !deepEqual(clients[name], this._clients[name])
    )

    this.addClients(clients, updateUi, updateSb)
    this.removeClients(removedNames, updateUi, updateSb)

    if (updatedClients.length) {
      updateUi && this.emit('ui-updateClients', updatedClients)
      updateSb && this.emit('sb-updateClients', updatedClients)
    }

    this._clients = Object.assign({}, clients)
  }
}

module.exports = {
  CachedGraph
}
