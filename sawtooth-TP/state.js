var { _hash } = require("./lib");
var { TP_NAMESPACE } = require("./constants");

class SimpelStoreState {
 constructor(context) {
   this.context = context;
   this.timeout = 500;
   this.stateEntries = {};
 }

 setValue(value) {
   var address = makeAddress(value);
   var stateEntriesSend = {}
   stateEntriesSend[address] = Buffer.from("Hello! " + value);
   this.context.addEvent(
    'xo/create',
    [['name', 'siva'], ['creator', 'signer_public_key']],
    null)
   return  this.context.setState(stateEntriesSend, this.timeout).then(function(result) {
     console.log("Success", result)
   }).catch(function(error) {
     console.error("Error", error)
   })
 }

 getValue(value) {
  console.log(value);
   var address = makeAddress(value);
   console.log(address);
   return  this.context.getState([address], this.timeout).then(function(stateEntries) {
     Object.assign(this.stateEntries, stateEntries);
     console.log(this.stateEntries[address].toString())
     return  this.stateEntries;
   }.bind(this))
 }
}

const makeAddress = (x, label) => TP_NAMESPACE + _hash(x)

module.exports = SimpelStoreState;