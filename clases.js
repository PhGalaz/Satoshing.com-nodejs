let BITBOX = require('bitbox-sdk').BITBOX;
const db = require('./dbconnection');
const cashier = require('./txbuilder.js');
const config = require('./config.json');
var omit = require('object.omit');

let bitbox = new BITBOX();


module.exports = {
  verify: function(winner, amount, tipo){
    console.log('amount: ', amount);
    if(amount > config['settings']['max_bet']){
      var result = parseInt(amount / 10 * 9);
      console.log(result);
      return ['wrong', result, tipo, amount];
    };
    if(amount < config['settings']['min_bet']){
      return ['wrong', 0, tipo, amount];
    };
    let modo = tipo.length
  	let selection = tipo.split("");
    if (modo == 1){ return check(winner, amount, tipo) }
  	if (modo == 2){ return check(winner, amount, tipo, "tonto", selection) }
  	if (modo == 3){ return check(winner, amount, tipo, "fila", selection) }
  	if (modo == 4){ return check(winner, amount, tipo, "cuadra", selection) }
  	if (modo == 5){ return check(winner, amount, tipo, "columna", selection) }
  	if (modo == 6){ return check(winner, amount, tipo, "sexta", selection) }
  	if (modo == 7){ return check(winner, amount, tipo, "septima", selection) }
  	if (modo == 8){ return check(winner, amount, tipo, "octava", selection) }
  },
  topay: async function(dict){
    var winners = dict['winners'];
    dict = omit(dict,'winners');
    var pagoid = await test(dict).catch((error)=>{console.log(error);});
    for (var x of winners){
      var lista = x[0];
      let result = lista[0];
    	let premio = lista[1];
    	let tipo = lista[2]
    	let amount = lista[3]
      sql = "UPDATE txs_ SET price_='" + premio + "', result='" + result + "', pay_tx='" + pagoid + "' WHERE (txid_='" + x[1] + "' and amount_='" + amount + "' and type_='" + tipo + "');";
      await db.query(sql).catch((error)=>{console.log(error);});
    }
  },
};

async function test(dict){
  let receipt = await cashier.pay(dict).catch((error)=>{console.log(error);});
  console.log('boleta final: ', receipt);
  return receipt;
};

function check(winner, amount, tipo, clase, selection){
  if (arguments.length == 3) {
    if (winner == tipo){
      a = amount * 15;
      return ['win', a, tipo, amount];
    }else{
      return ('lost', 0, tipo);
    };
  } else if (arguments.length == 5) {
    if (selection.includes(winner)){
      if (clase == 'tonto'){
        a = parseInt(amount * 7.5);
        return ['win', a, tipo, amount];
      };
      if (clase == 'fila'){
        a = amount * 5;
        return ['win', a, tipo, amount];
      };
      if (clase == 'cuadra'){
        a = parseInt(amount * 3.75);
        return ['win', a, tipo, amount];
      };
      if (clase == 'columna'){
        a = amount * 3;
        return ['win', a, tipo, amount];
      };
      if (clase == 'sexta'){
        a = parseInt(amount * 2.5);
        return ['win', a, tipo, amount];
      };
      if (clase == 'septima'){
        a = amount * 2;
        return ['win', a, tipo, amount];
      };
      if (clase == 'octava'){
        a = parseInt(amount * 1.87);
        return ['win', a, tipo, amount];
      };
    } else if (clase == 'septima' && tipo == '1357bdf' && winner == 0){
      a = amount;
      return ['tie', a, tipo, amount];
    } else if (clase == 'septima' && tipo == '2469ace' && winner == 8){
      a = amount;
      return ['tie', a, tipo, amount];
    } else {
      return ['lost', 0, tipo, amount];
    };
  };
};
