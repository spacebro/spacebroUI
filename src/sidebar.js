'use strict'

function getHtml (client) {
  return `<p>${client.name}</p>\n`
}

function setSidebar (sidebar, clients) {
  let innerHtml = ''

  for (const clientName of Object.keys(clients)) {
    const client = clients[clientName]

    if (clientName === 'spacebroUI') {
      continue
    }

    innerHtml = innerHtml + getHtml(client)
  }
  sidebar.innerHTML = innerHtml
}

module.exports = {
  setSidebar
}
