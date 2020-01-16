
const { Stream } = require('sawtooth-sdk/messaging/stream');

const {
  Message,
  EventList,
  EventSubscription,
  EventFilter,
  StateChangeList,
  ClientEventsSubscribeRequest,
  ClientEventsSubscribeResponse
} = require('sawtooth-sdk/protobuf')

const NULL_BLOCK_ID = '0000000000000000';
const VALIDATOR_URL = "tcp://127.0.0.1:4004";
const stream = new Stream(VALIDATOR_URL);

// Parse Block Commit Event
const getBlock = events => {
  const block = _.chain(events)
    .find(e => e.eventType === 'sawtooth/block-commit')
    .get('attributes')
    .map(a => [a.key, a.value])
    .fromPairs()
    .value()

  return {
    blockNum: parseInt(block.block_num),
    blockId: block.block_id,
    stateRootHash: block.state_root_hash
  }
}

// Parse State Delta Event
const getChanges = events => {
  const event = events.find(e => {
    return e.eventType === 'sawtooth/state-delta'
  })

  if (!event) return []

  const changeList = StateChangeList.decode(event.data)
  return changeList.stateChanges
    .filter((change) => {
      return change.address.slice(0, 6) === PREFIX
    })
}

// Handle event message received by stream
const handleEvent = msg => {
  if (msg.messageType === Message.MessageType.CLIENT_EVENTS) {
    const events = EventList.decode(msg.content).events
    console.log(events);
    
    // deltas.handle(getBlock(events), getChanges(events))
  } else {
    console.warn('Received message of unknown type:', msg.messageType)
  }
}

// Send delta event subscription request to validator
const subscribe = () => {
  const blockSub = EventSubscription.create({
    eventType: 'sawtooth/block-commit'
  })
  const deltaSub = EventSubscription.create({
    eventType: 'sawtooth/state-delta',
    filters: [EventFilter.create({
      key: 'address',
      // matchString: `^${PREFIX}.*`,
      filterType: EventFilter.FilterType.REGEX_ANY
    })]
  })

  return stream.send(
    Message.MessageType.CLIENT_EVENTS_SUBSCRIBE_REQUEST,
    ClientEventsSubscribeRequest.encode({
      lastKnownBlockIds: [NULL_BLOCK_ID],
      subscriptions: [blockSub, deltaSub]
    }).finish()
  )
    .then(response => ClientEventsSubscribeResponse.decode(response))
    .then(decoded => {
      const status = _.findKey(ClientEventsSubscribeResponse.Status,
                               val => val === decoded.status)
      if (status !== 'OK') {
        throw new Error(`Validator responded with status "${status}"`)
      }
    })
}

function connect(){
  // return new Promise(resolve => stream.connect(resolve))
  // .then(() => {
  //   let resp = send();    
  // }).catch(exception => console.log(exception));

  return new Promise(resolve => {
    stream.connect(() => {
      stream.onReceive(handleEvent)
      subscribe().then(resolve)
    })
  });
}
connect();

// let eventSubscription = EventSubscription.create({
//   eventType : "sawtooth/state-delta"
// });

let eventSubscription = EventSubscription.create({
  eventType : "sawtooth/block-commit"
});

let CONTENT = {
  subscriptions : eventSubscription,
  correlationId: "123"
};

function send(){

  stream.send(
    Message.MessageType.CLIENT_EVENTS_SUBSCRIBE_REQUEST,
    ClientEventsSubscribeRequest.encode(CONTENT).finish()
  )
  .then(function(response) {
    console.log("Response :"+JSON.stringify(response));
    console.log(ClientEventsSubscribeResponse.decode(response));
    
    ClientEventsSubscribeResponse.decode(response)
  })
  .catch(exception => console.log(exception))
  stream.onReceive(msg => {
    console.log('Received message of unknown type:', msg.messageType)
  })
}

connect();

// const {protobuf} = require('sawtooth-sdk')

// // console.log(protobuf.Message);
// console.log(protobuf.Message.MessageType.CLIENT_EVENTS_SUBSCRIBE_REQUEST);

// let msg = protobuf.Message;
// msg.fields.correlationId = "123";
// msg.fields.messageType = protobuf.Message.MessageType.CLIENT_EVENTS_SUBSCRIBE_REQUEST;
// // console.log(msg.fields);


// // const clientEventRequest = protobuf.ClientEventsSubscribeRequest;
// // clientEventRequest.correlation_id = 123
// // console.log(s);

// // let { ClientEventsSubscribeRequest } = require('sawtooth-sdk/protobuf');

// // console.log(ClientEventsSubscribeRequest)

// // let request = ClientEventsSubscribeRequest(
// //     subscriptions=["subscription"]).toString();
// // console.log(request);



// var zmq = require("zeromq");
// let p_sock = zmq.socket("pub");

// p_sock.bindSync("tcp://127.0.0.1:4004");
// console.log("Publisher bound to port 4004");
// p_sock.send(msg.fields.toString());


// let s_sock = zmq.socket("sub");
  
// s_sock.connect("tcp://127.0.0.1:4004");
// s_sock.subscribe("sawtooth/state-delta");
// console.log("Subscriber connected to port 4004");

// s_sock.on("message", function(topic, message) {
//   console.log(
//     "received a message related to:",
//     topic,
//     "containing message:",
//     message
//   );
// });