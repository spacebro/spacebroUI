'use strict'

function getSidebarItems () {
  return []
}

const ItemTypes = {}

class TextLine {
  constructor (client) {
    this.name = client.name
  }

  apply (/* port, data */) {}

  update (/* client */) {}

  getHtml () {
    return `<p>${this.name}</p>\n`
  }
}

function connectSidebar (sidebarDom, sidebarItems, graph) {
  function _addItem (client) {
    const Item = ItemTypes[client.name]

    if (Item) {
      sidebarItems.push(new Item(client))
    } else {
      sidebarItems.push(new TextLine(client))
    }
  }
  graph.on('ui-addClients', (clients) => clients.forEach(_addItem))
  graph.on('sb-addClients', (clients) => clients.forEach(_addItem))

  function _removeItem (clientName) {
    const clientId = sidebarItems.findIndex((item) => item.name === clientName)

    if (clientId !== -1) {
      sidebarItems.splice(clientId, 1)
    }
  }
  graph.on('ui-removeClients', (clientNames) => clientName.forEach(_removeItem))
  graph.on('sb-removeClients', (clientNames) => clientName.forEach(_removeItem))

  function _updateItem (client) {
    const item = sidebarItems.find((item) => item.name === client.name)

    item && item.update(client)
  }
  graph.on('ui-updateClients', (clients) => clients.forEach(_updateItem))
  graph.on('sb-updateClients', (clients) => clients.forEach(_updateItem))

  const eventNames = [
    'ui-addClients',
    'sb-addClients',
    'ui-removeClients',
    'sb-removeClients',
    'ui-updateClients',
    'sb-updateClients'
  ]
  for (const event of eventNames) {
    graph.on(event, () => updateHtml(sidebarDom, sidebarItems))
  }
}

function updateHtml (sidebarDom, sidebarItems) {
  const innerHtml = sidebarItems
    .map((item) => item.getHtml())
    .join('\n')
  sidebarDom.innerHTML = innerHtml
}

module.exports = {
  getSidebarItems,
  connectSidebar
}
