const EventEmitter = require('events');
const deepEqual = require('deep-equal')

// TODO - Write this in a better, more optimized fashion
function _added (oldArray, newArray) {
  const diff = []

  for (const obj of newArray) {
    if (oldArray.find(o => deepEqual(o, obj)) == null) {
      diff.push(obj)
    }
  }
  return diff
}

function _removed (oldArray, newArray) {
  return _added(newArray, oldArray)
}

class CachedGraph extends EventEmitter {
  constructor () {
    this._connections = []
    this._clients = {}
  }

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

  updateClients (clients, compareCache) {
    if (compareCache) {
      const clientNames = Object.keys(this._clients)
      for (const clientName of _removed(clientNames, Object.keys(clients))) {
        this.emit('removeClient', clientName)
      }
      for (const clientName of _added(clientNames, Object.keys(clients))) {
        this.emit('addClient', clientName)
      }
      for (const name of clientNames) {
        if (
          Object.keys(clients).indexOf(name) != -1 &&
          !deepEqual(clients[name], this._clients[name])
        ) {
          this.emit('updateClient', name, this._clients[name], clients[name])
        }
      }
    }
    // Deep copy
    this._clients = Object.assign({}, clients)
  }

}
