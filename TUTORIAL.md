Spacebro UI Tutorial
====================

`spacebroUI` is a web app intended to show and manipulate graphs of connections between [spacebro](https://github.com/spacebro/spacebro) applications.

The driving principle behind the app is getting the user to visualize how one app's outputs are connected to another app's inputs, and how messages are passed from one app to the next.

Installation
---------------

Clone this repository, then install it with npm or yarn:

``` sh
$ git clone https://github.com/spacebro/spacebroUI.git

$ npm install
```

Use `npm start` to start the webpack server; then connect your browser to the given port. For instance, if you read `Server listening at http://127.0.0.1:9050` in your terminal, connect to `127.0.0.1:9050` in your browser.

By default, `spacebroUI` will try to connect to the `spacebro` server at `localhost:6060` and join the channel `media-stream`; you can change this by editing the file `settings/settings.json`.

Spacebro UI is still at an experimental stage, and some features may be added or refined at a later date.

Getting started
---------------

When you start `spacebro` and `spacebroUI` for the first time, spacebroUI should display an empty space: there are no applications to be linked together.

_insert screenshot here_

To add an application to the graph, you must run an instance of the application and connect it to the same spacebro server and channel `spacebroUI` is connected to.

For instance, let's say you want to form a graph with two applications:

- [chokibro](https://github.com/soixantecircuits/chokibro), which will detect media added to a certain folder

- [media-manager](https://github.com/soixantecircuits/media-manager), which will store these media

You must start each of these applications through a terminal. Both of them must be connected to your spacebro server and channel, in this case `localhost:6060` and `media-stream`.

Once you've done that, you should see squares representing each app appear on the screen.

_insert screenshot here_

Each app has several white knobs on its left, representing its input ports, and on its right, representing its output knobs.

Connect the `outmedia` port of `chokibro` to the `inMedia` port of `media-manager`. To connect two ports, click on the knob corresponding to the first port, hold your click, and drag your mouse to the knob representing the second port, then release your click.

Try to add image files to `chokibro`'s target folder. If everything goes well, you should see the connection be highlighted on the UI for a short time, and `media-manager` should report that it received a new media.

### UI Widgets

You probably noticed several buttons at the top left of the Window. Among these buttons, two of them add a new object to the graph: `Add text box` and `Add image box`.

These objects are both UI Widgets. They don't "exist" outside of `spacebroUI`, and their main function is to help the user visualize what the graph does.

Each of these widgets has one input port; when an event is sent to this port, the widgets display the contents of this event on the sidebar on the right.

_insert screenshot here_

Add an 'image box' widget, and connect its input to the `outMedia` event of `media-manager`. Then try to add [this image](http://imgur.com/gallery/F5iJY) to the folder watched by `chokibro`.

_insert screenshot here_
