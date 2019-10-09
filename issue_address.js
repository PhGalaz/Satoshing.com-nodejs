const db = require('./dbconnection');
let BITBOX = require('bitbox-sdk').BITBOX;
var events = require('events');
var emitter = new events.EventEmitter();
var async = require('async');
const config = require('./config.json');


let bitbox = new BITBOX();

let mnemonic = config['settings']['mnemonic'];
let seedBuffer = bitbox.Mnemonic.toSeed(mnemonic);
let parent = bitbox.HDNode.fromSeed(seedBuffer);


async function emitAddress(tipo){
  sql = "SELECT * FROM tipos WHERE tipo = '" + tipo + "';";
  query = await db.query(sql).catch((error)=>{console.log(error);});
  let index = query[0]['idTipo'];
  let child = bitbox.HDNode.deriveHardened(parent, index);
  let account = bitbox.HDNode.createAccount([child]);
  let betaddress = bitbox.Address.toCashAddress(account.getChainAddress(0), false);
  sql = "SELECT * FROM adrs WHERE address LIKE '" + betaddress + "%';";
  results = await db.query(sql).catch((error)=>{console.log(error);});
  while (!isEmpty(results)){
    betaddress = bitbox.Address.toCashAddress(account.nextChainAddress(0), false);
    sql = "SELECT 1 FROM adrs WHERE address LIKE '" + betaddress + "%';";
    results = await db.query(sql).catch((error)=>{console.log(error);});
  };
  sql = "INSERT INTO adrs VALUES ('" + betaddress + "', '" + tipo + "', '" + index + "');";
  await db.query(sql).catch((error)=>{console.log(error);});
  emitter.emit("NewAddressEmited", betaddress);
  return betaddress;
};

async function consultAddress(address){
  sql = "SELECT tipo FROM adrs WHERE address = '" + address + "';";
  query = await db.query(sql).catch((error)=>{console.log(error);});
  return query;
}

module.exports = {
  emitter: emitter,
  emitAddress: emitAddress,
  consultAddress: consultAddress
}

//Utilities
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};
