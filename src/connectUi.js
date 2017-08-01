'use strict'

function connectUi (editor, graph) {
  // From UI to CachedGraph
  editor.graph.on('addNode', (nodeData) => {
    console.log('Removing node:', nodeData)
    graph.removeClients([ nodeData.name ], false, true)
  })
  editor.graph.on('removeNode', (nodeData) => {
    console.log('Removing node:', nodeData.clientName)
    graph.removeClients([ nodeData.clientName ], false, true)
  })

  function _getNodeName (id) {
    return editor.graph.nodes.find(node => node.id === id).clientName
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

  // From CachedGraph to UI

  function _addNode (clientName) {
    const id = Math.round(Math.random() * 100000).toString(36)

    // TODO
    // return editor.graph.addNode(id, clientName, metadata = {
    const node = editor.graph.addNode(id, 'tall', {
      label: clientName,
      x: Math.round(Math.random() * 800),
      y: Math.round(Math.random() * 600)
    })
    node.clientName = clientName
    return node
  }

  function _findNode (name) {
    return editor.graph.nodes.find(nodeData => nodeData.clientName === name)
  }

  graph.on('ui-addClients', (clients) => {
    console.log('ui-addClients', clients)
    for (const client of clients) {
      // editor.$.graph.library[client.name] = getComponentFromClient(client)
      if (client.name !== 'spacebroUI') {
        const node = _addNode(client.name)

        if (!client._isConnected) {
          node.metadata.label = node.clientName + ' (offline)'
        }
      }
    }
  })
  graph.on('ui-updateClients', (clients) => {
    console.log('ui-updateClients', clients)
    for (const client of clients) {
      // editor.$.graph.library[client.name] = getComponentFromClient(client)
      if (client.name !== 'spacebroUI') {
        const node = _findNode(client.name)

        const suffix = client._isConnected ? '' : ' (offline)'
        node.metadata.label = node.clientName + suffix
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
}

module.exports = {
  connectUi
}
