const db = require('./dbconnection');
let BITBOX = require('bitbox-sdk').BITBOX;
const config = require('./config.json');
const tasks = require('./tasks');

const changeadr = config['settings']['collecter'];

let bitbox = new BITBOX();

let mnemonic = config['settings']['mnemonic'];
let seedBuffer = bitbox.Mnemonic.toSeed(mnemonic);
let parent = bitbox.HDNode.fromSeed(seedBuffer);

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

async function pay(outputs){
  console.log('emtrando a builder: ', outputs);
  let total = 0;
  let funds = 0;
  for(out in outputs){
    let amount = outputs[out];
    total = total + amount;
  }
  let set = await get_set(20).catch((error)=>{console.log(error);});
  for(input of set){
    funds = funds + bitbox.BitcoinCash.toSatoshi(input.amount);
  };
  console.log(funds);
  console.log(total);
  if (total < funds - 10000 && total != 0){
    console.log(1);
    let dif = funds - total;
    console.log(dif);
    outputs[changeadr] = dif;
    return build(set,outputs,funds);
  }else if (total != 0){
    console.log(2);
    let boveda = [];
    let utxo = await tasks.txutxos(changeadr).catch((error)=>{console.log(error);});
    let utxos = utxo.utxos;
    utxos = utxos.sort((a, b) => (a.amount_ < b.amount_) ? 1 : -1);
    let puts = 0;
    funds = 0;
    count = 0;
    set = [];
    let change = 0;
    for(var input of utxos){
      input['address'] = changeadr;
      set.push(input);
      funds = funds + bitbox.BitcoinCash.toSatoshi(input.amount);
      count = count + 1;
    };
    if (count < 20){
      postset = await get_set(20 - utxos.length).catch((error)=>{console.log(error);});
      for(input of postset){
        set.push(input);
        funds = funds + bitbox.BitcoinCash.toSatoshi(input.amount);
      };
    }
    console.log(total);
    console.log(funds);
    outputs[changeadr] = funds - total;
    return build(set,outputs,funds);
  };

};

async function get_set(n){
  var total = 0;
  var counter = 0;
  var set = [];
  var adrs = [];
  sql = "SELECT address FROM txs_ WHERE address IS NOT NULL;";
  query = await db.query(sql).catch((error)=>{console.log(error);});
  query = query.sort((a, b) => (a.amount_ < b.amount_) ? 1 : -1);
  for (var adr of query){
    if(!adrs.includes(adr['address'])){
      let utxo = await tasks.txutxos(adr['address']).catch((error)=>{console.log(error);});
      if(isEmpty(utxo.utxos)) {
        sql = "UPDATE txs_ SET address=NULL WHERE address='" + adr['address'] + "';";
        query = await db.query(sql).catch((error)=>{console.log(error);});
      }else{
        for(var input of utxo.utxos){
          if(counter < n){
            total = total + bitbox.BitcoinCash.toSatoshi(input.amount);
            input['address'] = adr['address'];
            set.push(input);
            counter = counter + 1;
          }
        }
      };
      adrs.push(adr['address']);
    }
  };
  return set;
};

async function build(inputs, outputs, total){
  let transactionBuilder = new bitbox.TransactionBuilder('mainnet');
  transactionBuilder.setLockTime(0);
  let redeemScript;
  var i = 0;
  for(input of inputs){
    transactionBuilder.addInput(input['txid'], input['vout']);
  }
  for(output in outputs){
    let sendAmount;
    if(output == changeadr){
      let byteCount = bitbox.BitcoinCash.getByteCount({ P2PKH: Object.keys(inputs).length }, { P2PKH: Object.keys(outputs).length });
      sendAmount = outputs[output] - byteCount;
    }else{
      sendAmount = outputs[output];
    }
    transactionBuilder.addOutput(output, sendAmount);
  }

  for(input of inputs){
    var index;
    if(input.address == changeadr){
      index = 65535
    } else {
      sql = "SELECT * FROM adrs WHERE address='" + input['address'] + "'";
      index = await db.query(sql).catch((error)=>{console.log(error);});
      index = index[0]['index'];
    };
    let child = bitbox.HDNode.deriveHardened(parent, index);
    let account = bitbox.HDNode.createAccount([child]);
    let addressIndex = 0;
    let checkAddress = bitbox.Address.toCashAddress(account.getChainAddress(0), false);
    while (input['address'] != checkAddress){
      checkAddress = bitbox.Address.toCashAddress(account.nextChainAddress(0), false);
      addressIndex = addressIndex + 1;
    };

    child = bitbox.HDNode.derive(child, addressIndex);

    let keyPair = bitbox.HDNode.toKeyPair(child);
    let originalAmount = bitbox.BitcoinCash.toSatoshi(input['amount']);
    transactionBuilder.sign(i, keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, originalAmount, transactionBuilder.signatureAlgorithms.ECDSA);
    i = i + 1;
  }
  let tx = transactionBuilder.build();
  let p;
  let hex = tx.toHex();
  let paid = await bitbox.RawTransactions.sendRawTransaction(hex).then((result) => {
    p = result;
    console.log('id pago: ', p);
  }, (err) => { console.log(err); });
  if(p != undefined){
    sql = "INSERT INTO pays_(txid_, amount_, confs_, inputs, outputs) VALUES ('" + p + "', '" + total + "', 0, '" + Object.keys(inputs).length + "', '" + Object.keys(outputs).length + "')";
    await db.query(sql).catch((error)=>{console.log(error);});
  } else {
    console.log('ERROR TRANSACCION NO EFECTUADA!');
  };
  return p;
}

module.exports = {
  pay: pay
}
