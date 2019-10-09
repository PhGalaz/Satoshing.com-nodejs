let BITBOX = require('bitbox-sdk').BITBOX;
const db = require('./dbconnection.js');
const config = require('./config.json');
const fun = require('./clases.js');
const emitAddress = require('./issue_address.js');
var events = require('events');
var emitter = new events.EventEmitter();
const tasks = require('./tasks');
const changeadr = config['settings']['collecter'];


let rest = 0;


emitAddress.emitter.on("NewAddressEmited", function(data) {
  console.log('new address emitized: ' + data);
  nueva(data);
});

let blocking = false;
let bitbox = new BITBOX();
let socket = new bitbox.Socket({callback: () => {console.log('socket connected')}, wsURL: 'wss://ws.bitcoin.com'});

async function scanAdrs(){
  let total = 0;
  let sql = 'SELECT * FROM adrs;';
  let adrs = await db.query(sql).catch((error)=>{console.log(error);});
  for (const adr of adrs){
    if (Object.getOwnPropertyNames(adrs).length != 0){
      await sleep(rest);
      let details = await tasks.addressdtls(adr.address).catch((error)=>{console.log(error);});
      balance = details.balance;
      console.log(adr.address);
      console.log(balance);
      total = total + balance;
      nueva(adr.address);
    };
  }
  await sleep(rest);
  let details = await tasks.addressdtls(changeadr).catch((error)=>{console.log(error);});
  balance = details.balance;
  console.log(changeadr);
  console.log(balance);
  total = total + balance;
  console.log('wallet sincronized');
  console.log('Balance: ' + total.toFixed(8));
}

async function  start(){
  await scanAdrs().catch((error)=>{console.log(error);});;
};
start();

let queue = [];
socket.listen('blocks', (data) => {
    data = JSON.parse(data);
    let hash = data['hash'];
    console.log('new block: ', hash);

    if (blocking == true){
      console.log('new block while blocking');
      queue.push(hash);
      console.log(queue);
    } else {
      console.log('bloking = true');
      blocking = true;
      processBlock(hash);
    };

});

function nueva(address){
  socket.listen(
    {
      "v": 3,
      "q": {
        "find": {
          "out.e.a": address
        }
      }
    },
    msg => {
      let tx = JSON.parse(msg);
      if (tx['type'] == 'mempool'){
        let id = tx['data'][0]['tx']['h'];
        let outs = tx['data'][0]['out'];
        for(const out of outs){
          if (out['e']['a'] == address){
            processTx(out, id, address);
          };
        }
      }
    }
  )
};

let processing = false;
let paytimes = 0;
function processBlock(hash){
  console.log('inicio proceso bloque: ', hash);
  (async () => {
    try {
      await sleep(rest);
      let details = await tasks.blockdtls(hash).catch((error)=>{console.log(error);});
      let winner = hash.toString().split('').pop();
      let height = details['height'];
      let confirmations = details['confirmations'];
      let time = details['time'];
      let previous = details['previousblockhash'];

      await sleep(rest);
      let detailsprevious = await tasks.blockdtls(previous).catch((error)=>{console.log(error);});

      let timeprevious = detailsprevious['time'];
      let final_time = time - timeprevious;

      emitter.emit("newblock", {
        'height_': height,
        'block_': hash,
        'winner_': winner,
        'confs_': 1,
        'time_': time,
        'previous_time': final_time
      });

      let sql = "INSERT into block_ VALUES ('" + height + "', '" + hash + "', '" + winner + "', '" + confirmations + "', '" + time + "')";
      await db.query(sql).then((resultado)=>{
        update_block_confs();
        console.log('bloque guardado');
      }).catch((error)=>{console.log(error);});

      let preheight = height - 1;
      sql = "UPDATE block_ SET time_='" + final_time + "' WHERE height_='" + preheight + "';";
      await db.query(sql).catch((error)=>{console.log(error);});

      sql = "DELETE FROM block_ WHERE confs_>=10";
      await db.query(sql).catch((error)=>{console.log(error);});

      paying();
    } catch(error) {
      console.error(error);
    }
  })();
};


async function paying(){
  if(processing == false){
    console.log('processing == ', processing);
    processing = true;
    paying2();
  } else {
    paytimes = paytimes + 1;
    console.log('paytime: ', paytimes);
  }
};

async function paying2(){
  sql = "SELECT * FROM txs_ WHERE confs_<=10;";
  await db.query(sql).then((resultado)=>{update_tx_confs(resultado);}).catch((error)=>{console.log(error);});

  sql = 'SELECT * FROM pays_;';
  db.query(sql).then((resultado)=>{update_pay_confs(resultado);}).catch((error)=>{console.log(error);});
}


async function update_block_confs(){
  sql = 'SELECT * FROM block_;';
  resultado = await db.query(sql).catch((error)=>{console.log(error);});
  for (const fila of resultado) {
    await sleep(rest);
    let details = await tasks.blockdtls(fila.block_).catch((error)=>{console.log(error);});;
    let confs = details['confirmations'];
    sql = "UPDATE block_ SET confs_='" + confs + "' WHERE height_='" + fila.height_ + "';";
    await db.query(sql).catch((error)=>{console.log(error);});
  };
  console.log('confirmacion bloques actualizadas');
  console.log('queue = ', queue.length);

  if (queue.length == 0){
    console.log(queue);
    blocking = false;
    console.log('blocking = false');
    if (queue.length != 0){
      processBlock(queue[0]);
      queue.shift();
    }
  } else {
    console.log(queue);
    processBlock(queue[0]);
    queue.shift();
  };
};

async function update_tx_confs(resultado){
  for (const fila of resultado) {
    console.log(fila.id);
    await sleep(rest);
    let details = await tasks.txdetails(fila.txid_).catch((error)=>{console.log(error);});
    let confs = details['confirmations'];
    sql = "UPDATE txs_ SET confs_='" + confs + "' WHERE txid_='" + fila.txid_ + "';";
    await db.query(sql).catch((error)=>{console.log(error);});
  };
  console.log('confirmacion de transaccion actualizadas');

  sql = "SELECT * FROM txs_ WHERE confs_>=3 AND result='pwrong' AND block_ IS NULL;";
  await db.query(sql).then((resultado)=>{verifywrongs(resultado);}).catch((error)=>{console.log(error);});
  sql = "SELECT * FROM txs_ WHERE confs_>=1 AND result='pending';";
  await db.query(sql).then((resultado)=>{verify(resultado);}).catch((error)=>{console.log(error);});
};

async function update_pay_confs(resultado){
  for (const fila of resultado) {
    await sleep(rest);
    let details = await tasks.txdetails(fila.txid_).catch((error)=>{console.log(error);});
    let confs = details['confirmations'];
    let block = details['blockhash'];
    sql = "UPDATE pays_ SET block_='" + block + "', confs_='" + confs + "' WHERE txid_='" + fila.txid_ + "';";
    await db.query(sql).catch((error)=>{console.log(error);});
    if (confs < 4){
      sql = "UPDATE pays_ SET block_='" + block + "' WHERE (txid_='" + fila.txid_ + "');";
      await db.query(sql).catch((error)=>{console.log(error);});
    }
  };
};

async function verifywrongs(resultado){
  for (const fila of resultado) {
    await sleep(rest);
    let details = await tasks.txdetails(fila.txid_).catch((error)=>{console.log(error);});
    let blockhash = details['blockhash'];
    sql = "UPDATE txs_ SET block_='" + blockhash + "' WHERE (txid_='" + fila.txid_ + "' and amount_='" + fila.amount_ + "');";
    await db.query(sql).catch((error)=>{console.log(error);});
  };
};

async function verify(resultado){
  for (const fila of resultado) {
    console.log('verificando: ', fila);
    await sleep(rest);
    let details = await tasks.txdetails(fila.txid_).catch((error)=>{console.log(error);});
    let blockhash = details['blockhash'];
    let winner = blockhash.toString().split('').pop();
    let tipo = fila.type_;
    let selection = tipo.split("");
    if (selection.includes(winner)){
      sql = "UPDATE txs_ SET block_='" + blockhash + "', result='pwin' WHERE (txid_='" + fila.txid_ + "' and amount_='" + fila.amount_ + "' and type_='" + tipo + "');";
      await db.query(sql).catch((error)=>{console.log(error);});
    } else {
      if ((tipo == '1357bdf' && winner == '0') || (tipo == '2469ace' && winner == '8')){
        sql = "UPDATE txs_ SET block_='" + blockhash + "', result='ptie' WHERE (txid_='" + fila.txid_ + "' and amount_='" + fila.amount_ + "' and type_='" + tipo + "');";
        await db.query(sql).catch((error)=>{console.log(error);});
      } else {
        sql = "UPDATE txs_ SET block_='" + blockhash + "', result='lost' WHERE (txid_='" + fila.txid_ + "' and amount_='" + fila.amount_ + "' and type_='" + tipo + "');";
        await db.query(sql).catch((error)=>{console.log(error);});
      }
    }
  };
  console.log('fin proceso de verificacion de transacciones con 1 o mas confs y resultado pending');
  sql = "SELECT * FROM txs_ WHERE (confs_ >= '" + config['settings']['min_confs'] + "') AND (result = 'pwin' OR result = 'ptie')";
  db.query(sql).then((resultado)=>{pay_winners(resultado)}).catch((error)=>{console.log(error);});
};


async function pay_winners(resultado){
  console.log('comenzando a pagar: ', resultado);
  var pack = [];
  var dict = {};
  var winners = [];
  var checked = [];
  sql = "SELECT * from txs_ WHERE confs_ >= 10 AND result = 'pwrong'";
  var wrongs = await db.query(sql).catch((error)=>{console.log(error);});
  for(const wrong of wrongs){
    if(wrong.amount_ > config['settings']['max_bet']){
      resultado.push(wrong);
    }
  };
  if(!isEmpty(resultado)) {
    dict['winners'] = [];
    for (const fila of resultado) {
      console.log(fila);
      winner = fila.block_.toString().split('').pop();
      await sleep(rest);
      let details = await tasks.txdetails(fila.txid_).catch((error)=>{console.log(error);});
      let preid = details.vin[0].txid;
      await sleep(rest);
      let pretx = await tasks.rawdetails(preid).catch((error)=>{console.log(error);});
      let prevout = details.vin[0].vout;
      await sleep(rest);
      let raw = await tasks.decoderaw(pretx).catch((error)=>{console.log(error);});
      let adr = raw['vout'][prevout]['scriptPubKey']['addresses'][0];
      adr = bitbox.Address.toCashAddress(adr, false);
      let verificado = fun.verify(winner, fila.amount_, fila.type_);
      console.log(verificado);
      if(adr in dict){
        dict[adr] = dict[adr] + verificado[1];
      } else {
        dict[adr] = verificado[1];
      };
      dict['winners'].push([verificado, fila.txid_]);
      if(Object.keys(dict).length == 21){
        pack.push(dict);
        dict = {};
        dict['winners'] = [];
      };
    };
    pack.push(dict);
  };
  firmar(pack);
};

async function firmar(pack){
  console.log('firmando');
  for(var dict of pack){
    if(!isEmpty(dict)) {
      await fun.topay(dict).catch((error)=>{console.log(error);});
    };
  };
  console.log('firmando2');
  if(paytimes > 0){
    paytimes = 0;
    console.log(paytimes);
    paying2();
  } else {
    processing = false;
    console.log('303 - processing == false');
  };
};

async function processTx(tx, id, address){
  let amount = tx['e']['v'];
  sql = 'SELECT COUNT(*) as cnt FROM txs_;';
  results = await db.query(sql).catch((error)=>{console.log(error);});
  let tipo = await emitAddress.consultAddress(address).catch((error)=>{console.log(error);});
  tipo = tipo[0]['tipo'];
  if(tipo != 'collecter'){
    if (amount >= config['settings']['min_bet'] && amount <= config['settings']['max_bet']){
      sql = "INSERT INTO txs_(txid_, amount_, confs_, type_, address, result) VALUES ('" + id + "', '" + amount + "', '0', '" + tipo + "', '" + address + "', 'pending')";
      await db.query(sql).catch((error)=>{console.log(error);});
      console.log('new valid bet');
      data = {
        'txid' : id,
        'result': 'pending'
      }
      emitter.emit("newbet", data);
    } else {
      sql = "INSERT INTO txs_(txid_, amount_, confs_, type_, address, result) VALUES ('" + id + "', '" + amount + "', '0', '" + tipo + "', '" + address + "', 'pwrong')";
      await db.query(sql).catch((error)=>{console.log(error);});
      console.log('new invalid bet');
      data = {
        'txid' : id,
        'result': 'pwrong'
      }
      emitter.emit("newbet", data);
    };
  };
};


//To client
async function last3(){
  sql = 'SELECT * FROM (SELECT * FROM block_ ORDER BY height_ DESC LIMIT 3) as r ORDER BY -height_';
  results = await db.query(sql).catch((error)=>{console.log(error);});
  return results;
};

async function marcador(){
  var marcador = {};
  sql = 'SELECT COUNT(*) as bets FROM txs_;';
  results = await db.query(sql).catch((error)=>{console.log(error);});
  marcador['bets'] = results[0].bets;
  sql = 'SELECT SUM(amount_) as sumatotal FROM txs_;';
  results = await db.query(sql).catch((error)=>{console.log(error);});
  marcador['suma'] = results[0].sumatotal;
  return marcador;
};


async function searchtx(data){
  sql = "SELECT * FROM txs_ WHERE txid_ LIKE '" + data + "%';";
  results = await db.query(sql).catch((error)=>{console.log(error);});
  if(isEmpty(results)){
    return 'no';
  } else {
    var dic = {
      'txid': results[0]['txid_'],
      'block': results[0]['block_'],
      'amount': results[0]['amount_'],
      'confs': results[0]['confs_'],
      'type': results[0]['type_'],
      'result': results[0]['result'],
      'pay_tx': results[0]['pay_tx'],
      'price': results[0]['price_']
    };
    return dic;
  }
};

module.exports = {
  emitter,
  last3,
  marcador,
  searchtx
}

//Utilities
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
};

function toHHMMSS(temp) {
  var sec_num = parseInt(temp, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds;
}

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}
