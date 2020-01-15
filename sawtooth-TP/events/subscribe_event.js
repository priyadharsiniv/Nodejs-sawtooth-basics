const protobuf = require('protobufjs'),
exportableMessages = require('sawtooth-sdk/protobuf')
const { zmq } = require('zeromq')

console.log(protobuf);


class SubscribeToEvents {

    constructor() {
        console.log("coming");

        //eventSubscription = protobuf().
        //eventSubscription = exportableMessages.EventSubscription.newBuilder.setEventType.build();
        // protobuf.Root.prototype.deferred.
        let clientEventsSubscribeRequest = new protobuf.ClientEventsSubscribeRequest();
        clientEventsSubscribeRequest = clientEventsSubscribeRequest.newBuilder().addSubscriptions(eventSubscription).build();

        let ctx = zmq.zContext();
        let socket = zContext.socket('dealer');
        socket.connect("tcp://192.168.99.100:4004");
        //correlation id
        let correlation_id = "123";
        //Message
        let msg = new protobuf.Message();
        msg = Message.newBuilder().setCorrelationId(correlation_id)
                .setMessageType(Message.MessageType.CLIENT_EVENTS_SUBSCRIBE_REQUEST)
                .setContent(clientEventsSubscribeRequest.toByteString()).build();
        //sending subscribe request to the validator
        socket.send(msg.toByteArray());

        //Continuously listening for the messages
        while(true){
            //Constructing the response
//            ClientEventsSubscribeResponse clientEventsSubscribeResponse =
            mg = socket.recv();
            console.log("msg received: "+mg);
            
            let mg1 = new protobuf.Message();
            mg1 = mg1.parseFrom(mg);
//            Events events = Event.
            console.log("parsed msg received: "+mg1);
            //System.out.println(mg1.getContent().toString());

        }
    }
}


const subscribe_event = new SubscribeToEvents();