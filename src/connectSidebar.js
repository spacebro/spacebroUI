'use strict'

function getSidebarItems () {
  return {}
}

class TextBox {
  constructor (client) {
    this.name = client.name
    this.text = 'No text'
  }

  apply (port, data) {
    this.text = JSON.stringify(data, null, 2)
  }

  update (client) {
    this.name = client.name
  }

  getHtml () {
    return '<h2>' + this.name + '</h2>\n<p>' + this.text + '</p>\n'
  }
}

class ImageBox {
  constructor (client) {
    this.name = client.name
    this.url = ''
  }

  apply (port, data) {
    this.url = data.url
  }

  update (client) {
    this.name = client.name
  }

  getHtml () {
    return '<h2>' + this.name + '</h2><img src=\'' + this.url + '\'/><video controls autoplay autoloop src=\'' + this.url + '\'></video>'
  }
}

const ItemTypes = {
  'ui-textbox': TextBox,
  'ui-imagebox': ImageBox
}

class TextLine {
  constructor (client) {
    this.name = client.name
  }

  apply (/* port, data */) {}

  update (client) {
    this.name = client.name
  }

  getHtml () {
    return `<h2>${this.name}</h2>\n`
  }
}

function connectSidebar (sidebarDom, sidebarItems, graph) {
  function _addItem (client) {
    const Item = ItemTypes[client.type]

    if (Item) {
      sidebarItems[client.name] = new Item(client)
    } else {
      sidebarItems[client.name] = new TextLine(client)
    }
  }
  graph.on('ui-addClients', (clients) => clients.forEach(_addItem))
  graph.on('sb-addClients', (clients) => clients.forEach(_addItem))

  function _removeItem (clientName) {
    delete sidebarItems[clientName]
  }
  graph.on('ui-removeClients', (names) => names.forEach(_removeItem))
  graph.on('sb-removeClients', (names) => names.forEach(_removeItem))

  function _updateItem (client) {
    const item = sidebarItems[client.name]

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
  const innerHtml = Object.values(sidebarItems)
    .map((item) => item.getHtml())
    .join('\n')
  sidebarDom.innerHTML = innerHtml
}

module.exports = {
  getSidebarItems,
  connectSidebar,
  updateHtml
}
