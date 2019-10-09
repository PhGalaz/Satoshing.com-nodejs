const db = require('./dbconnection');
let BITBOX = require('bitbox-sdk').BITBOX;
const config = require('./config.json');
const changeadr = 'qzkedlqxcnrel0hltnx04khwlr72aat06qs42l30nn';

let bitbox = new BITBOX();

async function txdetails(id){
  try{
    return await bitbox.Transaction.details(id);
  } catch(e){
    console.log(e);
    return await txdetails(id);
  }
}

async function blockdtls(id){
  try{
    return await bitbox.Block.detailsByHash(id);
  } catch(e){
    console.log(e);
    return await blockdtls(id);
  }
}

async function addressdtls(id){
  try{
    return await bitbox.Address.details(id);
  } catch(e){
    console.log(e);
    return await addressdtls(id);
  }
}

async function rawdetails(id){
  try{
    return await bitbox.RawTransactions.getRawTransaction(id);
  } catch(e){
    console.log(e);
    return await rawdetails(id);
  }
}

async function decoderaw(id){
  try{
    return await bitbox.RawTransactions.decodeRawTransaction(id);
  } catch(e){
    console.log(e);
    return await decoderaw(id);
  }
}


async function txutxos(id){
  try{
    return await bitbox.Address.utxo(id);
  } catch(e){
    console.log(e);
    return await txutxos(id);
  }
}


function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

module.exports = {
  txdetails : txdetails,
  blockdtls : blockdtls,
  addressdtls : addressdtls,
  rawdetails : rawdetails,
  decoderaw : decoderaw,
  txutxos : txutxos
}
