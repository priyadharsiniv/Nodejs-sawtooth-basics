# Nodejs-sawtooth-basics
Hyperledger Sawtooth basics concept. Need to install docker based on your environment.

## sawtooth-TP
There will be validator file in sawtooth-TP folder. Need to run the validator
```bash
sudo docker-compose sawtooth-default.yaml up
```
Here Transaction Processor is created with handler.js and state.js. Data from client will be get and set and update in GLobal state.
After creating the TP, run the file
```bash
node index.js
```

Event will be trigged when any block is committed.
* block-commit
* state-delta
* user defined events
After creating the events, need to run the event to see the event trigger. Navigate to events folder and run the following command,
```bash
node ListenEvents.js
```

## client
Client code will send data through command line. That will connect with validator and send data to TP.
After creating the client, need to run the client with input. 

For set the data,

```bash
node sendRequest.js  '{"action": "set", "data": "Priya"}'
```
For get the data,

```bash
node sendRequest.js  '{"action": "get", "data": "Priya"}'
```

