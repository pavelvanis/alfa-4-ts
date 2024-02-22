# Peer-to-Peer Chat

This project implements a chat system between different peers using UDP, TCP. Each node can connect to the network, discover other nodes, and communicate with them. The application allows receiving and sending messages through a web interface and API.

## Installation and Running

1. **Install Dependencies:**

- Install Node.js and npm from the [Node.js website](https://nodejs.org/).
- Clone this repository to your computer.

2. **Install npm Packages**

- Navigate to the project directory and run `npm i` to install all necessary packages.

3. **Configuration:**

- Set up the configuration file `config.json` according to your needs.

4. **Running:**

- Open a terminal and navigate to the project directory.
- Start the application with the command `npm start`.

5. **Running as a Service**

- If you want to run the application as a service on Debian, create a `chat.service` file in `/etc/systemd/system` and modify it to look like the code below, replacing `user` with the user under which you want to run the service and `WorkingDirectory` with the path to your project.
- Run the command `sudo systemctl daemon-reload` to reload the systemd daemon configuration.
- Then you can use `sudo systemctl start chat` to start the service and `sudo journalctl -fu chat` to view the logs.

###### Configuration file _chat.service_:

```ini
[Unit]
Description=P2P chatting app (2)
After=network.target
[Service]
Type=simple
User=<user>
WorkingDirectory=<path_to_project_folder>
ExecStart=npm start
Restart=always
Environment=NODE_ENV=production
[Install]
WantedBy=multi-user.target
```

## Usage

### 1. UDP Discovery

- Upon starting the application, a node automatically connects to the network and regularly sends UDP Discovery messages to discover other nodes.
- Responses to these queries will contain a list of available nodes in the network.

### 2. TCP Protocol

- After discovering other nodes via UDP, a node establishes a persistent TCP connection with each of them and saves it.
- Upon establishing a connection, it performs a handshake and receives message history from the peer.
- It can then send and receive messages using TCP connections.
- Additionally, a TCP server is created to listen, and upon incoming handshake, it returns all its messages.

### 3. Web API

- The application provides a simple HTTP API and interface for reading and sending messages.
- `GET /messages` - returns all messages in json format.
- `GET /send?message=<text>` - sends a message, where
- `GET /` - a simple interface for sending and displaying messages.

## Additional Information

- The project is implemented in Typescript and runs on Node.js.
- Express.js is used for the web API.
- Each peer has a unique ID, which can be set in `config.json` as `my_peer_id`.
- Messages are identified using timestamps.
- An array in RAM is used for storing message history.
- The application logs events and errors using system logging.
- All non-original content can be found in `/src/vendor`.

## License

This project is licensed under the MIT License. Details can be found in the [LICENSE](LICENSE) file.