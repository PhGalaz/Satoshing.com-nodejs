/********************************/
/*                              */
/*       Global Variables       */
/*                              */
/********************************/
let shiftDown = false;
let ctrlDown = false;
let lastSelectedIndex = null;
var numItems;
var push = null;

var numbers = [];
var oferta = null;
var todos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
var acolor = [1, 3, 5, 7, 'b', 'd', 'f'];
var acolor1 = [2, 4, 6, 9, 'a', 'c', 'e'];
var cashaddress = null;
var legacyaddress = null;
var blocknumber = 0;
var last = null;
var previous = null;
var confirmed = null;
var winner = null;
var total_bets = null;
var total_wag = null;

var mode = false;
var cash = true;
var blockinfo = false;
var blockstatus = 0;

var touch = false;
var deplo = true;



var color1 = getComputedStyle(document.body).getPropertyValue('--color1');
var color2 = getComputedStyle(document.body).getPropertyValue('--color2');
var color3 = getComputedStyle(document.body).getPropertyValue('--color3');
var color4 = getComputedStyle(document.body).getPropertyValue('--color4');
var color5 = getComputedStyle(document.body).getPropertyValue('--color5');
var color6 = getComputedStyle(document.body).getPropertyValue('--color6');
var color7 = getComputedStyle(document.body).getPropertyValue('--color7');
var color8 = getComputedStyle(document.body).getPropertyValue('--color8');
var color9 = getComputedStyle(document.body).getPropertyValue('--color9');
var color19 = getComputedStyle(document.body).getPropertyValue('--color19');
var colorlogo = getComputedStyle(document.body).getPropertyValue('--colorlogo');
var gris0 = getComputedStyle(document.body).getPropertyValue('--gris0');
var gris1 = getComputedStyle(document.body).getPropertyValue('--gris1');
var gris2 = getComputedStyle(document.body).getPropertyValue('--gris2');
var gris3 = getComputedStyle(document.body).getPropertyValue('--gris3');
var gris4 = getComputedStyle(document.body).getPropertyValue('--gris4');
var blanco = getComputedStyle(document.body).getPropertyValue('--blanco');
var negro = getComputedStyle(document.body).getPropertyValue('--negro');



/********************************/
/*                              */
/*       Real Time Engine       */
/*                              */
/********************************/

const socket = io();
socket.emit("newview");
socket.on("last3", function(msg) {
    last = msg[0];
    previous = msg[1];
    confirmed = msg[2];
    actualice();
    timer();
    if_number();
});
socket.on("marcador", function(marcador) {
    document.getElementById("totalbets").innerHTML = marcador['bets'];
    document.getElementById("wagered").innerHTML = (marcador['suma'] / 100000000).toFixed(8) + ' BCH';
    total_bets = marcador['bets'];
});

socket.on("newblock", function(data) {
    if (data != null) {
        confirmed = previous;
        previous = last;
        last = data;
        previous['time_'] = last['previous_time'];
        actualice();
        fletch_txs();
        if_number();
    };
});
socket.on("newbet", function(data) {
    txbox(data);
});


/*
$('.ocho').click(function(){
  let element = document.getElementById('tiones');
  element.innerHTML = '<div class="tion lastion"><div class= "flash"></div><div class= "kun pending"></div><p>prueba</p></div>' + element.innerHTML;
  $('.flash').hide();
  $('.lastion').css({
      'height' : '20px'
    })
})
*/


function txbox(data) {
    var kuncolor;
    var status = data['result'];
    if (status == 'pending') {
        kuncolor = 'pending';
    } else if (status == 'ppwrong') {
        kuncolor = 'wrong';
    } else if (status == 'ptie') {
        kuncolor = 'ptie';
    }
    let element = document.getElementById('tiones');
    element.innerHTML = '<div class="tion lastion"><div class= "flash"></div><div class= "kun ' + kuncolor + '"></div><p>' + data['txid'] + '</p></div>' + element.innerHTML;
    $('.flash').hide();
    (function() {
        setInterval(function() {
            $('.lastion').css({
                'height': '20px'
            });
        }, 1);
    })();
}

socket.on("actualiced_txs", function(data) {
  kun = data[1];
  flash = data[2]
  status = data['result'];
  if (status != flash) {
      $('.flash')
          .show() //show the hidden div
          .animate({
              opacity: 0.5
          }, 300)
          .fadeOut(300)
          .css({
              'opacity': 1
          });
  }
  resultado(kun, status);
});

function fletch_txs() {
    $('.tion').each(function() {
        var TX = this.getElementsByTagName('p')[0].innerHTML;
        var kun = this.getElementsByTagName('div')[1];

        flash = kun.className;

        socket.emit("actualice_txs", [TX, kun, flash]);
    });
}


function resultado(kun, status) {
    kun.className = status;
}


function timer() {
    var start = Date.now() / 1000;
    var ultima = last['time_'];
    var lapsed = start - ultima;
    document.getElementById("time0").innerHTML = toHHMMSS(lapsed);
    setTimeout(function() {
        timer();
    }, 1000);
}



/**************CLICK ON TRANSACTION******************/

$('.tiones').on('click', '.tion', function() {
    var TX = this.getElementsByTagName('p')[0].innerHTML;
    $('.barra input[type="text"]').val('');
    cargar_tx(TX);
});

socket.on("searchtx", function(data) {
    if (data == 'no') {
        notx();
    } else {
        var TX = data.txid;
        $('.transa').css({
            'display': 'block'
        })
        $('.hashdata').find('p')[0].innerHTML = TX;
        var chars = [data['type'].split('').join("   ")];
        $('.numbers').find('p')[0].innerHTML = chars;
        $('.amountdata').find('p')[0].innerHTML = data['amount'] / 100000000;

        var status = data['result'];

        if (status == 'pending') {
            $('.hashtitle').find('p')[0].innerHTML = 'BET';
            $('.hashdata').find('p')[0].innerHTML = TX;
            $('.hashblocktittle').find('p')[0].innerHTML = 'WAITING FOR FIRST';
            $('.hashblocktittle').css({
                'background-color': ''
            })
            $('.blockhashdata').find('p')[0].innerHTML = 'CONFIRMATION';
            $('.blockhashdata').css({
                'background-color': ''
            })
            $('.ticketa').find('p')[0].innerHTML = 'TICKET';
            $('.ticketa').css({
                'display': ''
            })
            $('.numbers').find('p')[0].innerHTML = chars;
            $('.numbers').css({
                'display': ''
            })
            $('.amount').find('p')[0].innerHTML = 'AMOUNT';
            $('.amount').css({
                'display': ''
            })
            $('.amountdata').find('p')[0].innerHTML = data['amount'] / 100000000;
            $('.amountdata').css({
                'display': ''
            })
            $('.prize').find('p')[0].innerHTML = 'PRIZE';
            $('.prize').css({
                'display': ''
            })
            $('.prizenumbers').find('p')[0].innerHTML = '&nbsp;';
            $('.prizenumbers').css({
                'display': ''
            })
            $('.status').find('p')[0].innerHTML = 'PENDING';
            $('.status').css({
                'background-color': 'rgba(250,250,250,0.5)',
                'filter': '',
                'color': 'var(--gris2)'
            })
            $('.pago').find('p')[0].innerHTML = 'WAITING FOR 3 CONFIRMATIONS';
            $('.pago').css({
                'display': 'none',
                'filter': '',
                'color': ''
            })
            $('.transa').css({
                'background-color': '',
                'height': ''
            })
            $('.istatus').hide();
            $('.iblock').hide();
        }

        if (status == 'ppwrong') {
            $('.hashtitle').find('p')[0].innerHTML = 'BET';
            $('.hashdata').find('p')[0].innerHTML = TX;
            $('.hashblocktittle').find('p')[0].innerHTML = 'WAITING FOR FIRST';
            $('.hashblocktittle').css({
                'background-color': ''
            })
            $('.blockhashdata').find('p')[0].innerHTML = 'CONFIRMATION';
            $('.blockhashdata').css({
                'background-color': ''
            })
            $('.ticketa').find('p')[0].innerHTML = 'TICKET';
            $('.ticketa').css({
                'display': ''
            })
            $('.numbers').find('p')[0].innerHTML = chars;
            $('.numbers').css({
                'display': ''
            })
            $('.amount').find('p')[0].innerHTML = 'AMOUNT';
            $('.amount').css({
                'display': ''
            })
            $('.amountdata').find('p')[0].innerHTML = data['amount'] / 100000000;
            $('.amountdata').css({
                'display': ''
            })
            $('.prize').find('p')[0].innerHTML = 'PRIZE';
            $('.prize').css({
                'display': ''
            })
            $('.prizenumbers').find('p')[0].innerHTML = '&nbsp;';
            $('.prizenumbers').css({
                'display': ''
            })
            $('.status').find('p')[0].innerHTML = 'INVALID AMOUNT';
            $('.status').css({
                'background-color': 'var(--color4)',
                'filter': 'hue-rotate(0deg)',
                'color': 'rgba(250,250,250,0.9)',
            })
            $('.pago').find('p')[0].innerHTML = 'WAITING FOR 3 CONFIRMATIONS';
            $('.pago').css({
                'color': '',
                'filter': 'hue-rotate(0deg)',
                'display': 'none'
            })
            $('.pago').css({
                'filter': 'hue-rotate(0deg)'
            });
            $('.transa').css({
                'background-color': '',
                'height': ''
            })
            $('.istatus').hide();
            $('.iblock').hide();
        }
        if (status == 'pwrong') {
            $('.hashtitle').find('p')[0].innerHTML = 'BET';
            $('.hashdata').find('p')[0].innerHTML = TX;
            $('.hashblocktittle').find('p')[0].innerHTML = 'BLOCK';
            $('.hashblocktittle').css({
                'background-color': ''
            })
            $('.blockhashdata').find('p')[0].innerHTML = data['block'];
            $('.blockhashdata').css({
                'background-color': ''
            })
            $('.ticketa').find('p')[0].innerHTML = 'TICKET';
            $('.ticketa').css({
                'display': ''
            })
            $('.numbers').find('p')[0].innerHTML = chars;
            $('.numbers').css({
                'display': ''
            })
            $('.amount').find('p')[0].innerHTML = 'AMOUNT';
            $('.amount').css({
                'display': ''
            })
            $('.amountdata').find('p')[0].innerHTML = data['amount'] / 100000000;
            $('.amountdata').css({
                'display': ''
            })
            $('.prize').find('p')[0].innerHTML = 'PRIZE';
            $('.prize').css({
                'display': ''
            })
            $('.prizenumbers').find('p')[0].innerHTML = '&nbsp;';
            $('.prizenumbers').css({
                'display': ''
            })
            $('.status').find('p')[0].innerHTML = 'INVALID AMOUNT';
            $('.status').css({
                'background-color': 'var(--color4)',
                'filter': 'hue-rotate(0deg)',
                'color': 'rgba(250,250,250,0.9)',
            })
            $('.pago').find('p')[0].innerHTML = 'WAITING FOR 3 CONFIRMATIONS';
            $('.pago').css({
                'color': '',
                'filter': 'hue-rotate(0deg)',
                'display': 'none'
            })
            $('.transa').css({
                'background-color': '',
                'height': ''
            })
            $('.istatus').hide();
            $('.iblock').show();
        }
        if (status == 'wrong') {
            $('.hashtitle').find('p')[0].innerHTML = 'BET';
            $('.hashdata').find('p')[0].innerHTML = TX;
            $('.hashblocktittle').find('p')[0].innerHTML = 'BLOCK';
            $('.hashblocktittle').css({
                'background-color': ''
            })
            $('.blockhashdata').find('p')[0].innerHTML = data['block'];
            $('.blockhashdata').css({
                'background-color': ''
            })
            $('.ticketa').find('p')[0].innerHTML = 'TICKET';
            $('.ticketa').css({
                'display': ''
            })
            $('.numbers').find('p')[0].innerHTML = chars;
            $('.numbers').css({
                'display': ''
            })
            $('.amount').find('p')[0].innerHTML = 'AMOUNT';
            $('.amount').css({
                'display': ''
            })
            $('.amountdata').find('p')[0].innerHTML = data['amount'] / 100000000;
            $('.amountdata').css({
                'display': ''
            })
            $('.prize').find('p')[0].innerHTML = 'PRIZE';
            $('.prize').css({
                'display': ''
            })
            $('.prizenumbers').find('p')[0].innerHTML = data['prize'] / 100000000;
            $('.prizenumbers').css({
                'display': ''
            })
            $('.status').find('p')[0].innerHTML = 'INVALID - PAID';
            $('.status').css({
                'background-color': 'var(--color4)',
                'filter': 'hue-rotate(0deg)',
                'color': 'rgba(250,250,250,0.9)'
            })

            $('.pago').find('p')[0].innerHTML = data['pay_tx'];
            $('.pago').css({
                'filter': 'hue-rotate(0deg)',
                'background-color': 'var(--color4)',
                'display': 'block',
                'color': 'rgba(250,250,250,0.9)'
            })
            $('.transa').css({
                'background-color': '',
                'height': ''
            })
            $('.istatus').show();
            $('.iblock').show();
        }
        if (status == 'pwin') {
            $('.hashtitle').find('p')[0].innerHTML = 'BET';
            $('.hashdata').find('p')[0].innerHTML = TX;
            $('.hashblocktittle').find('p')[0].innerHTML = 'BLOCK';
            $('.hashblocktittle').css({
                'background-color': ''
            })
            $('.blockhashdata').find('p')[0].innerHTML = data['block'];
            $('.blockhashdata').css({
                'background-color': ''
            })
            $('.ticketa').find('p')[0].innerHTML = 'TICKET';
            $('.ticketa').css({
                'display': ''
            })
            $('.numbers').find('p')[0].innerHTML = chars;
            $('.numbers').css({
                'display': ''
            })
            $('.amount').find('p')[0].innerHTML = 'AMOUNT';
            $('.amount').css({
                'display': ''
            })
            $('.amountdata').find('p')[0].innerHTML = data['amount'] / 100000000;
            $('.amountdata').css({
                'display': ''
            })
            $('.prize').find('p')[0].innerHTML = 'PRIZE';
            $('.prize').css({
                'display': ''
            })
            $('.prizenumbers').find('p')[0].innerHTML = '&nbsp;';
            $('.prizenumbers').css({
                'display': ''
            })
            $('.status').find('p')[0].innerHTML = 'WIN';
            $('.status').css({
                'color': '',
                'filter': '',
                'background-color': 'var(--color3)'
            })
            $('.pago').find('p')[0].innerHTML = 'WAITING FOR 3 CONFIRMATIONS';
            $('.pago').css({
                'background-color': 'var(--color3)',
                'color': '',
                'filter': '',
                'display': 'block'
            })
            $('.transa').css({
                'background-color': '',
                'height': ''
            })
            $('.istatus').hide();
            $('.iblock').show();
        }
        if (status == 'lost') {
            $('.hashtitle').find('p')[0].innerHTML = 'BET';
            $('.hashdata').find('p')[0].innerHTML = TX;
            $('.hashblocktittle').find('p')[0].innerHTML = 'BLOCK';
            $('.hashblocktittle').css({
                'background-color': ''
            })
            $('.blockhashdata').find('p')[0].innerHTML = data['block'];
            $('.blockhashdata').css({
                'background-color': ''
            })
            $('.ticketa').find('p')[0].innerHTML = 'TICKET';
            $('.ticketa').css({
                'display': ''
            })
            $('.numbers').find('p')[0].innerHTML = chars;
            $('.numbers').css({
                'display': ''
            })
            $('.amount').find('p')[0].innerHTML = 'AMOUNT';
            $('.amount').css({
                'display': ''
            })
            $('.amountdata').find('p')[0].innerHTML = data['amount'] / 100000000;
            $('.amountdata').css({
                'display': ''
            })
            $('.prize').find('p')[0].innerHTML = 'PRIZE';
            $('.prize').css({
                'display': ''
            })
            $('.prizenumbers').find('p')[0].innerHTML = '0';
            $('.prizenumbers').css({
                'display': ''
            })
            $('.status').find('p')[0].innerHTML = 'LOST';
            $('.status').css({
                'color': 'white',
                'filter': '',
                'background-color': 'var(--gris4)'
            })
            $('.pago').css({
                'display': 'none',
                'filter': '',
                'color': ''
            })
            $('.transa').css({
                'background-color': '',
                'height': ''
            })
            $('.istatus').hide();
            $('.iblock').show();
        }
        if (status == 'win') {
            $('.hashtitle').find('p')[0].innerHTML = 'BET';
            $('.hashdata').find('p')[0].innerHTML = TX;
            $('.hashblocktittle').find('p')[0].innerHTML = 'BLOCK';
            $('.hashblocktittle').css({
                'background-color': ''
            })
            $('.blockhashdata').find('p')[0].innerHTML = data['block'];
            $('.blockhashdata').css({
                'background-color': ''
            })
            $('.ticketa').find('p')[0].innerHTML = 'TICKET';
            $('.ticketa').css({
                'display': ''
            })
            $('.numbers').find('p')[0].innerHTML = chars;
            $('.numbers').css({
                'display': ''
            })
            $('.amount').find('p')[0].innerHTML = 'AMOUNT';
            $('.amount').css({
                'display': ''
            })
            $('.amountdata').find('p')[0].innerHTML = data['amount'] / 100000000;
            $('.amountdata').css({
                'display': ''
            })
            $('.prize').find('p')[0].innerHTML = 'PRIZE';
            $('.prize').css({
                'display': ''
            })
            $('.prizenumbers').find('p')[0].innerHTML = data['price'] / 100000000;
            $('.prizenumbers').css({
                'display': ''
            })
            $('.status').find('p')[0].innerHTML = 'WIN - PAID';
            $('.status').css({
                'color': '',
                'filter': '',
                'background-color': 'var(--color3)'
            })
            $('.pago').find('p')[0].innerHTML = data['pay_tx'];
            $('.pago').css({
                'background-color': 'var(--color3)',
                'filter': '',
                'display': 'block',
                'color': ''
            })
            $('.transa').css({
                'background-color': '',
                'height': ''
            })
            $('.istatus').show();
            $('.iblock').show();
        }
        if (status == 'ptie') {
            $('.hashtitle').find('p')[0].innerHTML = 'BET';
            $('.hashdata').find('p')[0].innerHTML = TX;
            $('.hashblocktittle').find('p')[0].innerHTML = 'BLOCK';
            $('.hashblocktittle').css({
                'background-color': ''
            })
            $('.blockhashdata').find('p')[0].innerHTML = data['block'];
            $('.blockhashdata').css({
                'background-color': ''
            })
            $('.ticketa').find('p')[0].innerHTML = 'TICKET';
            $('.ticketa').css({
                'display': ''
            })
            $('.numbers').find('p')[0].innerHTML = chars;
            $('.numbers').css({
                'display': ''
            })
            $('.amount').find('p')[0].innerHTML = 'AMOUNT';
            $('.amount').css({
                'display': ''
            })
            $('.amountdata').find('p')[0].innerHTML = data['amount'] / 100000000;
            $('.amountdata').css({
                'display': ''
            })
            $('.prize').find('p')[0].innerHTML = 'PRIZE';
            $('.prize').css({
                'display': ''
            })
            $('.prizenumbers').find('p')[0].innerHTML = '&nbsp;';
            $('.prizenumbers').css({
                'display': ''
            })
            $('.status').find('p')[0].innerHTML = 'TIE';
            $('.status').css({
                'background-color': 'var(--color3)',
                'filter': '',
                'color': 'var(--gris2)'
            })
            $('.pago').find('p')[0].innerHTML = 'WAITING FOR 3 CONFIRMATIONS';
            $('.pago').css({
                'display': 'block',
                'filter': '',
                'background-color': 'var(--color3)',
                'color': ''
            })
            $('.transa').css({
                'background-color': '',
                'height': ''
            })
            $('.istatus').hide();
            $('.iblock').show();
        }
        if (status == 'tie') {
            $('.hashtitle').find('p')[0].innerHTML = 'BET';
            $('.hashdata').find('p')[0].innerHTML = TX;
            $('.hashblocktittle').find('p')[0].innerHTML = 'BLOCK';
            $('.hashblocktittle').css({
                'background-color': ''
            })
            $('.blockhashdata').find('p')[0].innerHTML = data['block'];
            $('.blockhashdata').css({
                'background-color': ''
            })
            $('.ticketa').find('p')[0].innerHTML = 'TICKET';
            $('.ticketa').css({
                'display': ''
            })
            $('.numbers').find('p')[0].innerHTML = chars;
            $('.numbers').css({
                'display': ''
            })
            $('.amount').find('p')[0].innerHTML = 'AMOUNT';
            $('.amount').css({
                'display': ''
            })
            $('.amountdata').find('p')[0].innerHTML = data['amount'] / 100000000;
            $('.amountdata').css({
                'display': ''
            })
            $('.prize').find('p')[0].innerHTML = 'PRIZE';
            $('.prize').css({
                'display': ''
            })
            $('.prizenumbers').find('p')[0].innerHTML = data['prize'] / 100000000;
            $('.prizenumbers').css({
                'display': ''
            })
            $('.status').find('p')[0].innerHTML = 'PAID';
            $('.status').css({
                'color': '',
                'filter': '',
                'background-color': 'var(--color3)'
            })
            $('.pago').find('p')[0].innerHTML = data['pay_tx'];
            $('.pago').css({
                'background-color': 'var(--color3)',
                'display': 'block',
                'filter': '',
                'color': ''
            })
            $('.transa').css({
                'background-color': '',
                'height': ''
            })
            $('.istatus').show();
            $('.iblock').show();
        }
    };
});


function cargar_tx(TX) {
    socket.emit('searchtx', TX);
}

function actualice() {
    if (blockstatus == 0) {
        document.getElementById("winner").innerHTML = last['winner_'];
        document.getElementById("winner1").innerHTML = previous['winner_'];
        document.getElementById("winner2").innerHTML = confirmed['winner_'];
        document.getElementById("height").innerHTML = last['height_'];
        document.getElementById("hash").innerHTML = last['block_'];
        document.getElementById("confs").innerHTML = 1;
    } else if (blockstatus == 1) {
        document.getElementById("winner").innerHTML = last['winner_'];
        document.getElementById("winner1").innerHTML = previous['winner_'];
        document.getElementById("winner2").innerHTML = confirmed['winner_'];
        document.getElementById("height").innerHTML = previous['height_'];
        document.getElementById("hash").innerHTML = previous['block_'];
        document.getElementById("confs").innerHTML = 2;
        document.getElementById("confs1").innerHTML = toHHMMSS(previous['time_']);
    } else if (blockstatus == 2) {
        document.getElementById("winner").innerHTML = last['winner_'];
        document.getElementById("winner1").innerHTML = previous['winner_'];
        document.getElementById("winner2").innerHTML = confirmed['winner_'];
        document.getElementById("height").innerHTML = confirmed['height_'];
        document.getElementById("hash").innerHTML = confirmed['block_'];
        document.getElementById("confs").innerHTML = 3;
        document.getElementById("confs1").innerHTML = toHHMMSS(confirmed['time_']);
    };
}


$(document).ready(function() {

    $('.details').css({
        'opacity': '0'
    });
    $('.barra input[type="text"]').focus();
    $('.barra input[type="text"]').on("input", function() {
        /* Get input value on change */
        var inputVal = $(this).val();
        var resultDropdown = $(this).siblings(".result");
        if (inputVal.length) {
            socket.emit("searchtx", inputVal);
        } else {
            resultDropdown.empty();
            $('.transa').css({
                'display': 'none'
            })
        }
    });

    // Set search input value on click of result item
    $(document).on("click", ".result p", function() {
        $(this).parents(".search-box").find('input[type="text"]').val($(this).text());
        $(this).parent(".result").empty();
    });
});

function if_number() {
    if (last['winner_'] == 0) {
        document.body.style.setProperty('--color1', '#929292');
        document.body.style.setProperty('--color2', '#C9C9C9');
        document.body.style.setProperty('--color3', 'rgb(228, 240, 0)');
        document.body.style.setProperty('--color4', '#FF7D46');
        document.body.style.setProperty('--color5', '#C5E148');
        document.body.style.setProperty('--color6', '#DDE900');
        document.body.style.setProperty('--color7', '#D1D2D2');
        document.body.style.setProperty('--color8', 'rgb(200, 201, 201)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.3)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.5)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'rgba(250,250,250,0.7)');
        document.body.style.setProperty('--color16', '#999999');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(0deg)'
        });

        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '22px',
            'top': '8px'
        });
        $("#favicon").attr("href", "/favicon/favicon-01.png");
    }
    if (document.getElementById("winner1").innerHTML == 0) {
        $('#winner1').css({
            'left': '22px',
            'top': '8px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 0) {
        $('#winner2').css({
            'left': '22px',
            'top': '8px'
        });
    }


    if (last['winner_'] == 1) {

        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', 'rgb(228, 240, 0)');
        document.body.style.setProperty('--color4', '#FF7D46');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#DCE801');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');

        $('#container-12').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(0deg)'
        });


        $('.bch').css({
            'color': ''
        });

        $('#winner').css({
            'left': '24px',
            'top': '7px'
        });
        $("#favicon").attr("href", "/favicon/favicon-02.png");
    }
    if (document.getElementById("winner1").innerHTML == 1) {
        $('#winner1').css({
            'left': '24px',
            'top': '7px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 1) {
        $('#winner2').css({
            'left': '24px',
            'top': '7px'
        });
    }




    if (last['winner_'] == 2) {

        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', 'rgb(228, 240, 0)');
        document.body.style.setProperty('--color4', '#FF7D46');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#DAE500');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(28deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(28deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(28deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(28deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(28deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(28deg)'
        });
        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '23px',
            'top': '7px'
        });
        $("#favicon").attr("href", "/favicon/favicon-03.png");
    }
    if (document.getElementById("winner1").innerHTML == 2) {
        $('#winner1').css({
            'left': '23px',
            'top': '7px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 2) {
        $('#winner2').css({
            'left': '23px',
            'top': '7px'
        });
    }



    if (last['winner_'] == 3) {

        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', 'rgb(228, 240, 0)');
        document.body.style.setProperty('--color4', '#FF7D46');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#CED900');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(85deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(85deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(85deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(85deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(85deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(85deg)'
        });
        $("#favicon").attr("href", "/favicon/favicon-04.png");

        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '23px',
            'top': '8px'
        });
    }
    if (document.getElementById("winner1").innerHTML == 3) {
        $('#winner1').css({
            'left': '23px',
            'top': '8px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 3) {
        $('#winner2').css({
            'left': '23px',
            'top': '8px'
        });
    }



    if (last['winner_'] == 4) {

        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', 'rgb(228, 240, 0)');
        document.body.style.setProperty('--color4', '#FF7D46');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#D5E004');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(104deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(104deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(104deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(104deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(104deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(104deg)'
        });


        $('.bch').css({
            'color': ''
        });


        $('#winner').css({
            'left': '21px',
            'top': '7px'
        });
        $("#favicon").attr("href", "/favicon/favicon-05.png");
    }
    if (document.getElementById("winner1").innerHTML == 4) {
        $('#winner1').css({
            'left': '20px',
            'top': '7px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 4) {
        $('#winner2').css({
            'left': '20px',
            'top': '7px'
        });
    }


    if (last['winner_'] == 5) {


        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', 'rgb(228, 240, 0)');
        document.body.style.setProperty('--color4', '#FF7D46');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#DCE708');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(124deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(124deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(124deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(124deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(124deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(124deg)'
        });

        $('#winner').css({
            'left': '23px',
            'top': '8px'
        });
        $("#favicon").attr("href", "/favicon/favicon-06.png");
    }
    if (document.getElementById("winner1").innerHTML == 5) {
        $('#winner1').css({
            'left': '23px',
            'top': '8px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 5) {
        $('#winner2').css({
            'left': '23px',
            'top': '8px'
        });
    }


    if (last['winner_'] == 6) {
        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', 'rgb(228, 240, 0)');
        document.body.style.setProperty('--color4', '#FF7D46');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#DCE708');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(150deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(150deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(150deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(150deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(150deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(150deg)'
        });


        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '21px',
            'top': '8px'
        });
        $("#favicon").attr("href", "/favicon/favicon-07.png");
    }
    if (document.getElementById("winner1").innerHTML == 6) {
        $('#winner1').css({
            'left': '21px',
            'top': '8px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 6) {
        $('#winner2').css({
            'left': '21px',
            'top': '8px'
        });
    }



    if (last['winner_'] == 7) {
        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', 'rgb(228, 240, 0)');
        document.body.style.setProperty('--color4', '#FF7D46');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#DCE708');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(170deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(170deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(170deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(170deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(170deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(170deg)'
        });


        $('.bch').css({
            'color': ''
        });
        $("#favicon").attr("href", "/favicon/favicon-08.png");
    }
    if (document.getElementById("winner1").innerHTML == 7) {
        $('#winner1').css({
            'left': '23px',
            'top': '8px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 7) {
        $('#winner2').css({
            'left': '23px',
            'top': '8px'
        });
    }



    if (last['winner_'] == 8) {
        document.body.style.setProperty('--color1', '#929292');
        document.body.style.setProperty('--color2', '#C9C9C9');
        document.body.style.setProperty('--color3', '#59FECC');
        document.body.style.setProperty('--color4', '#FF7D46');
        document.body.style.setProperty('--color5', '#C5E148');
        document.body.style.setProperty('--color6', '#55F6C5');
        document.body.style.setProperty('--color7', '#D1D2D2');
        document.body.style.setProperty('--color8', 'rgb(200, 201, 201)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.3)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.5)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'rgba(250,250,250,0.7)');
        document.body.style.setProperty('--color16', '#999999');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.2)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(0deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(0deg)'
        });

        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '22px',
            'top': '8px'
        });
        $("#favicon").attr("href", "/favicon/favicon-09.png");
    }
    if (document.getElementById("winner1").innerHTML == 8) {
        $('#winner1').css({
            'left': '22px',
            'top': '8px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 8) {
        $('#winner2').css({
            'left': '22px',
            'top': '8px'
        });
    }


    if (last['winner_'] == 9) {

        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', 'rgb(228, 240, 0)');
        document.body.style.setProperty('--color4', '#FF7D46');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#DCE708');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(190deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(190deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(190deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(190deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(190deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(190deg)'
        });

        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '22px',
            'top': '8px'
        });
        $("#favicon").attr("href", "/favicon/favicon-10.png");
    }
    if (document.getElementById("winner1").innerHTML == 9) {
        $('#winner1').css({
            'left': '22px',
            'top': '8px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 9) {
        $('#winner2').css({
            'left': '22px',
            'top': '8px'
        });
    }


    if (last['winner_'] == 'a') {
        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', 'rgb(228, 240, 0)');
        document.body.style.setProperty('--color4', '#FF7D46');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#DCE708');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(210deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(210deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(210deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(210deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(210deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(210deg)'
        });



        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '23px',
            'top': '4px'
        });
        $("#favicon").attr("href", "/favicon/favicon-11.png");
    }
    if (document.getElementById("winner1").innerHTML == 'a') {
        $('#winner1').css({
            'left': '23px',
            'top': '4px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 'a') {
        $('#winner2').css({
            'left': '23px',
            'top': '4px'
        });
    }


    if (last['winner_'] == 'b') {

        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', '#F6FF44');
        document.body.style.setProperty('--color4', '#18DDD6');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#F3FF11');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(270deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(270deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(270deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(270deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(270deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(270deg)'
        });

        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '24px',
            'top': '8px'
        });
        $("#favicon").attr("href", "/favicon/favicon-12.png");
    }
    if (document.getElementById("winner1").innerHTML == 'b') {
        $('#winner1').css({
            'left': '24px',
            'top': '8px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 'b') {
        $('#winner2').css({
            'left': '24px',
            'top': '8px'
        });
    }



    if (last['winner_'] == 'c') {

        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', '#F6FF44');
        document.body.style.setProperty('--color4', '#18DDD6');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#F3FF11');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(290deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(290deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(290deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(290deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(290deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(290deg)'
        });

        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '23px',
            'top': '5px'
        });
        $("#favicon").attr("href", "/favicon/favicon-13.png");
    }
    if (document.getElementById("winner1").innerHTML == 'c') {
        $('#winner1').css({
            'left': '23px',
            'top': '5px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 'c') {
        $('#winner2').css({
            'left': '23px',
            'top': '5px'
        });
    }


    if (last['winner_'] == 'd') {
        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', '#F6FF44');
        document.body.style.setProperty('--color4', '#18DDD6');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#F3FF11');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(310deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(310deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(310deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(310deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(310deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(310deg)'
        });

        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '21px',
            'top': '8px'
        });
        $("#favicon").attr("href", "/favicon/favicon-14.png");
    }
    if (document.getElementById("winner1").innerHTML == 'd') {
        $('#winner1').css({
            'left': '21px',
            'top': '8px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 'd') {
        $('#winner2').css({
            'left': '21px',
            'top': '8px'
        });
    }


    if (last['winner_'] == 'e') {

        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', '#F6FF44');
        document.body.style.setProperty('--color4', '#18DDD6');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#F3FF11');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(330deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(330deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(330deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(330deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(330deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(330deg)'
        });

        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '23px',
            'top': '4px'
        });
        $("#favicon").attr("href", "/favicon/favicon-15.png");
    }
    if (document.getElementById("winner1").innerHTML == 'e') {
        $('#winner1').css({
            'left': '23px',
            'top': '4px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 'e') {
        $('#winner2').css({
            'left': '23px',
            'top': '4px'
        });
    }


    if (last['winner_'] == 'f') {
        document.body.style.setProperty('--color1', '#B3B000');
        document.body.style.setProperty('--color2', '#CAC600');
        document.body.style.setProperty('--color3', '#F6FF44');
        document.body.style.setProperty('--color4', '#18DDD6');
        document.body.style.setProperty('--color5', 'rgb(208, 219, 0)');
        document.body.style.setProperty('--color6', '#ECF800');
        document.body.style.setProperty('--color7', '#E0DCA0');
        document.body.style.setProperty('--color8', 'rgb(201, 198, 76)');
        document.body.style.setProperty('--color9', '#515240');

        document.body.style.setProperty('--color10', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color11', 'rgba(250,250,250,0.1)');
        document.body.style.setProperty('--color12', 'rgba(250,250,250,0.2)');
        document.body.style.setProperty('--color13', 'rgba(250,250,250,0.4)');
        document.body.style.setProperty('--color14', 'rgba(250,250,250,0.25)');
        document.body.style.setProperty('--color15', 'white');
        document.body.style.setProperty('--color16', '#666');
        document.body.style.setProperty('--color17', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--color18', 'rgba(250,250,250,0.15)');

        document.body.style.setProperty('--color19', 'rgba(250,250,250,0.3)');

        document.body.style.setProperty('--gris0', 'rgba(50,53,26,1)');
        document.body.style.setProperty('--gris1', 'rgba(50,53,26,0.8)');
        document.body.style.setProperty('--gris2', 'rgba(50,53,26,0.5)');
        document.body.style.setProperty('--gris3', 'rgba(50,53,26,0.4)');
        document.body.style.setProperty('--gris4', 'rgba(50,53,26,0.1)');

        document.body.style.setProperty('--td-color', 'var(--gris3)');
        document.body.style.setProperty('--neutro-color', '');
        document.body.style.setProperty('--spinner-inner', 'var(--color3)');
        document.body.style.setProperty('--x-color', 'var(--color3)');
        document.body.style.setProperty('--address', 'var(--color3)');
        document.body.style.setProperty('--qr-back', 'var(--color3)');
        document.body.style.setProperty('--td-op', '');
        $('#container-12').css({
            'filter': 'hue-rotate(345deg)'
        });
        $('#faqs').css({
            'filter': 'hue-rotate(345deg)'
        });
        $('.row.mesa').css({
            'filter': 'hue-rotate(345deg)'
        });
        $('#twitter').css({
            'filter': 'hue-rotate(345deg)'
        });
        $('#cortina').css({
            'filter': 'hue-rotate(345deg)'
        });
        $('.left').css({
            'filter': 'hue-rotate(345deg)'
        });

        $('.bch').css({
            'color': ''
        });
        $('#winner').css({
            'left': '27px',
            'top': '8px'
        });
        $("#favicon").attr("href", "/favicon/favicon-16.png");
    }
    if (document.getElementById("winner1").innerHTML == 'f') {
        $('#winner1').css({
            'left': '27px',
            'top': '8px'
        });
    }
    if (document.getElementById("winner2").innerHTML == 'f') {
        $('#winner2').css({
            'left': '27px',
            'top': '8px'
        });
    }
    gris0 = getComputedStyle(document.body).getPropertyValue('--gris0');
    color3 = getComputedStyle(document.body).getPropertyValue('--color3');
    color9 = getComputedStyle(document.body).getPropertyValue('--color9');
}


/********************************/
/*                              */
/*       Global Listeners       */
/*                              */
/********************************/

// on touch devices, forces individual cell select/deselect
window.addEventListener('touchstart', function() {
    touch = true;
});

// modifier key listeners
window.addEventListener('keydown', function(e) {
    if (e.keyCode == 17) {
        ctrlDown = true;
    }
    if (e.keyCode == 16) {
        shiftDown = true;
    }
});
window.addEventListener('keyup', function(e) {
    if (e.keyCode == 17) {
        ctrlDown = false;
    }
    if (e.keyCode == 16) {
        shiftDown = false;
    }
});

// deselect all elements when the user clicks off of the grid


var touchmoved;
$(document).on('click touchend', function(e) {
    if (touchmoved != true) {
        if (mode == false) {
            if (event.target.tagName.toUpperCase() != 'INPUT') {
                if ((!$(e.target).is('table.mesa td')) && (!$(e.target).is('table.mesa th')) && (!$(e.target).is('span')) && (!$(e.target).is('p')) && (!$(e.target).is('.bur')) && (!$(e.target).is('.bur2')) && (!$(e.target).is('.bur3')) && (!$(e.target).is('.blocks')) && (!$(e.target).is('.lasthash')) && (!$(e.target).is('.istatus')) && (!$(e.target).is('.iblock')) && (!$(e.target).is('.ihash')) && (!$(e.target).is('.barra')) && (!$(e.target).is('.hashblockbox')) && (!$(e.target).is('.lastheight')) && (!$(e.target).is('.height')) && (!$(e.target).is('.tconfs')) && (!$(e.target).is('.confs')) && (!$(e.target).is('.arrowright')) && (!$(e.target).is('.arrowleft')) && (!$(e.target).is('.blockback')) && (!$(e.target).is('.spinner')) && (!$(e.target).is('.spinner1')) && (!$(e.target).is('.faqs')) && (!$(e.target).is('#answer')) && (!$(e.target).is('.tion')) && (!$(e.target).is('.spinner2'))) {
                    $('td.selected').removeClass('selected');
                    $('td.deselected').removeClass('deselected');
                    numbers = [];
                    fillticket();
                    $.fn.myFunction();
                };
            }
            sel();
        };
    }
}).on('touchmove', function(e) {
    touchmoved = true;
}).on('touchstart', function() {
    touchmoved = false;
});

/*********************************/
/*                               */
/*       Element Listeners       */
/*                               */
/*********************************/

$(function() {
    $('th.red').hover(function() {
        if (touch == false) {
            $('.red span').css({
                'color': 'var(--blanco)'
            });
            $('td.color1').css({
                'background-color': 'var(--color3)',
                'transform': 'translateZ(0px)',
            });
            $('td.color1').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if (!$(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })
            var numItems = $('.selected').length;
            var activos = $('.color1.selected').length;
            var color = $('.color1.selected').length;
            if ((numItems >= 8) || ((numItems >= 7) && (activos <= 5)) || ((numItems >= 6) && (activos <= 4)) || ((numItems >= 5) && (activos <= 3)) || ((numItems >= 4) && (activos == 2)) || ((numItems >= 3) && (activos <= 1)) || ((numItems >= 2) && (activos == 0))) {
                $('td.color1').each(function(index) {
                    if (!$(this).hasClass('selected')) {
                        $(this).css({
                            'transform': 'translateZ(0)',
                            'color': 'var(--gris3)',
                            'background': 'var(--color7)'
                        })
                        $(this).find('.bur').css({
                            'background-color': 'var(--color11)'
                        })
                    }
                })
            };
        }
    }, function() {
        if (touch == false) {
            // on mouseout, reset the background colour
            $('td.color1').css({
                'color': '',
                'background-color': '',
                'box-shadow': '',
                'transform': '',
                'opacity': ''
            });
            $('.red span').css({
                'color': '',
                'opacity': '',
            });
            $('td.color1').each(function(index) {
                $(this).find('.bur').css({
                    'background-color': ''
                })
            })

        }
    });

    $('.bet.red').click(function() {
        if (touch == false) {
            $('td.color1').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 12px 2px var(--color3)',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if ((!$(this).hasClass('selected')) && ($(this).css('background-color') == color3)) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })
        }
    })

    $('th.black').hover(function() {
        if (touch == false) {
            $('td.color2').css({
                'background-color': 'var(--color3)',
                'transform': 'translateZ(0px)',

            });
            $('.black span').css({
                'color': 'var(--blanco)'
            });
            $('td.color2').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if (!$(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })
            var numItems = $('.selected').length;
            var activos = $('.color2.selected').length;
            var color = $('.color2.selected').length;
            if ((numItems >= 8) || ((numItems >= 7) && (activos <= 5)) || ((numItems >= 6) && (activos <= 4)) || ((numItems >= 5) && (activos <= 3)) || ((numItems >= 4) && (activos == 2)) || ((numItems >= 3) && (activos <= 1)) || ((numItems >= 2) && (activos == 0))) {
                $('td.color2').each(function(index) {
                    if (!$(this).hasClass('selected')) {
                        $(this).css({
                            'transform': 'translateZ(0)',
                            'color': 'var(--gris3)',
                            'background': 'var(--color7)'
                        })
                        $(this).find('.bur').css({
                            'background-color': 'var(--color11)'
                        })
                    }
                })
            };
        }
    }, function() {
        if (touch == false) {
            // on mouseout, reset the background colour
            $('td.color2').css({
                'color': '',
                'background-color': '',
                'box-shadow': '',
                'transform': '',
                'opacity': ''
            });
            $('.black span').css({
                'color': '',
                'opacity': '',
            });
            $('td.color2').each(function(index) {
                $(this).find('.bur').css({
                    'background-color': ''
                })
            })

        }
    });

    $('.bet.black').click(function() {
        if (touch == false) {
            $('td.color2').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 12px 2px var(--color3)',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if ((!$(this).hasClass('selected')) && ($(this).css('background-color') == color3)) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })
        }
    })

    $('th.lin1').hover(function() {
        if (touch == false) {

            $('.lin1 span').css({
                'color': 'var(--blanco)'
            });


            $('td.lin1').css({
                'background-color': 'var(--color3)',
                'transform': 'translateZ(0px)',
            });
            $('td.lin1').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if (!$(this).hasClass('selected')) {
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })


            var numItems = $('.selected').length;
            var activos = $('.lin1.selected').length;
            var linea = $('.lin1.selected').length;
            if ((numItems >= 8) || ((numItems >= 7) && (activos <= 1)) || ((numItems >= 6) && (activos == 0))) {
                $('td.lin1').each(function(index) {
                    if (!$(this).hasClass('selected')) {
                        $(this).css({
                            'box-shadow': '0px 0px 6px 2px #fff',
                        })
                        $(this).css({
                            'transform': 'translateZ(0)',
                            'color': 'var(--gris3)',
                            'background': 'var(--color7)'
                        })
                        $(this).find('.bur').css({
                            'background-color': 'var(--color11)'
                        })

                    }
                })
            };
        }
    }, function() {
        if (touch == false) {
            // on mouseout, reset the background colour
            $('td.lin1').css({
                'color': '',
                'background-color': '',
                'box-shadow': '',
                'transform': '',
                'opacity': ''
            });
            $('.lin1 span').css({
                'color': '',
                'opacity': '',
            });
            $('td.lin1').each(function(index) {
                $(this).find('.bur').css({
                    'background-color': ''
                })
            })

        }
    });

    $('.bet.lin1').click(function() {
        if (touch == false) {
            $('td.lin1').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 12px 2px var(--color3)',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if ((!$(this).hasClass('selected')) && ($(this).css('background-color') == color3)) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })
        }
    })


    $('th.lin2').hover(function() {
        if (touch == false) {
            $('td.lin2').css({
                'background-color': 'var(--color3)',
                'transform': 'translateZ(0px)',
            });
            $('.lin2 span').css({
                'color': 'var(--blanco)'
            });

            $('td.lin2').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if (!$(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })


            var numItems = $('.selected').length;
            var activos = $('.lin2.selected').length;
            var linea = $('.lin2.selected').length;
            if ((numItems >= 8) || ((numItems >= 7) && (activos <= 1)) || ((numItems >= 6) && (activos == 0))) {
                $('td.lin2').each(function(index) {
                    if (!$(this).hasClass('selected')) {
                        $(this).css({
                            'transform': 'translateZ(0)',
                            'color': 'var(--gris3)',
                            'background': 'var(--color7)'
                        })
                        $(this).find('.bur').css({
                            'background-color': 'var(--color11)'
                        })
                    }
                })
            };
        }
    }, function() {
        if (touch == false) {
            // on mouseout, reset the background colour
            $('td.lin2').css({
                'color': '',
                'background-color': '',
                'box-shadow': '',
                'transform': '',
                'opacity': ''
            });
            $('.lin2 span').css({
                'color': '',
                'opacity': '',
            });

            $('td.lin2').each(function(index) {
                $(this).find('.bur').css({
                    'background-color': ''
                })
            })
        }
    });

    $('.bet.lin2').click(function() {
        if (touch == false) {
            $('td.lin2').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 12px 2px var(--color3)',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if ((!$(this).hasClass('selected')) && ($(this).css('background-color') == color3)) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })
        }
    })

    $('th.lin3').hover(function() {
        if (touch == false) {
            $('.lin3 span').css({
                'color': 'var(--blanco)'
            });

            $('td.lin3').css({
                'background-color': 'var(--color3)',
                'transform': 'translateZ(0px)',
            });
            if ($('td.lin3').hasClass('neutro')) {
                $('td.neutro.lin3').css({
                    'background': 'var(--color6)',
                    'transform': 'translateZ(0px)'
                })
            };
            $('td.lin3').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                    $(this).find('.bur3').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if (!$(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                    $(this).find('.bur3').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })

            var numItems = $('.selected').length;
            var activos = $('.lin3.selected').length;
            var linea = $('.lin3.selected').length;
            if ((numItems >= 8) || ((numItems >= 7) && (activos <= 1)) || ((numItems >= 6) && (activos == 0))) {
                $('td.lin3').each(function(index) {
                    if (!$(this).hasClass('selected')) {
                        if ($(this).hasClass('ocho')) {
                            $(this).css({
                                'transform': 'translateZ(0)',
                                'background-color': 'var(--color8)',
                                'color': 'white'
                            })
                            $('.bur3').css({
                                'background-color': 'var(--color12)'
                            })
                        }
                        if (!$(this).hasClass('neutro')) {
                            $(this).css({
                                'transform': 'translateZ(0)',
                                'color': 'var(--gris3)',
                                'background': 'var(--color7)'
                            })
                            $(this).find('.bur').css({
                                'background-color': 'var(--color11)'
                            })
                        }
                    }
                })
            };
        }
    }, function() {
        if (touch == false) {
            // on mouseout, reset the background colour
            $('td.lin3').css({
                'color': '',
                'background-color': '',
                'box-shadow': '',
                'transform': '',
                'opacity': '',
                'background': ''
            });
            $('.lin3 span').css({
                'color': '',
                'opacity': '',
            });

            $('td.lin3').each(function(index) {
                $(this).find('.bur').css({
                    'background-color': ''
                })
                $(this).find('.bur3').css({
                    'background-color': ''
                })
            })
        }
    });

    $('.bet.lin3').click(function() {
        if (touch == false) {
            $('td.lin3').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 12px 2px var(--color3)',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                    $(this).find('.bur3').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if ((!$(this).hasClass('selected')) && (($(this).css('background-color') == color3) || ($(this).css('background-color') == color6))) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                    $(this).find('.bur3').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })
        }
    })


    $('th.lin4').hover(function() {
        if (touch == false) {
            $('td.lin4').css({
                'background-color': 'var(--color3)',
                'transform': 'translateZ(0px)',

            });
            $('.lin4 span').css({
                'color': 'var(--blanco)'
            });

            $('td.lin4').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if (!$(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })


            var numItems = $('.selected').length;
            var activos = $('.lin4.selected').length;
            var linea = $('.lin4.selected').length;
            if ((numItems >= 8) || ((numItems >= 7) && (activos <= 1)) || ((numItems >= 6) && (activos == 0))) {
                $('td.lin4').each(function(index) {
                    if (!$(this).hasClass('selected')) {
                        $(this).css({
                            'transform': 'translateZ(0)',
                            'color': 'var(--gris3)',
                            'background': 'var(--color7)'
                        })
                        $(this).find('.bur').css({
                            'background-color': 'var(--color11)'
                        })
                    }
                })
            };
        }
    }, function() {
        if (touch == false) {
            // on mouseout, reset the background colour
            $('td.lin4').css({
                'color': '',
                'background-color': '',
                'box-shadow': '',
                'transform': '',
                'opacity': ''
            });
            $('.lin4 span').css({
                'color': '',
                'opacity': '',
            });

            $('td.lin4').each(function(index) {
                $(this).find('.bur').css({
                    'background-color': ''
                })
            })
        }
    });

    $('.bet.lin4').click(function() {
        if (touch == false) {
            $('td.lin4').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 12px 2px var(--color3)',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if ((!$(this).hasClass('selected')) && ($(this).css('background-color') == color3)) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })
        }
    })


    $('th.lin5').hover(function() {
        if (touch == false) {
            $('td.lin5').css({
                'background-color': 'var(--color3)',
                'transform': 'translateZ(0px)'
            });
            $('.lin5 span').css({
                'color': 'var(--blanco)'
            });

            $('td.lin5').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if (!$(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })


            var numItems = $('.selected').length;
            var activos = $('.lin5.selected').length;
            var linea = $('.lin5.selected').length;
            if ((numItems >= 8) || ((numItems >= 7) && (activos <= 1)) || ((numItems >= 6) && (activos == 0))) {
                $('td.lin5').each(function(index) {
                    if (!$(this).hasClass('selected')) {
                        $(this).css({
                            'transform': 'translateZ(0)',
                            'color': 'var(--gris3)',
                            'background': 'var(--color7)'
                        })
                        $(this).find('.bur').css({
                            'background-color': 'var(--color11)'
                        })
                    }
                })
            };
        }
    }, function() {
        if (touch == false) {
            // on mouseout, reset the background colour
            $('td.lin5').css({
                'color': '',
                'background-color': '',
                'box-shadow': '',
                'transform': '',
                'opacity': ''
            });
            $('.lin5 span').css({
                'color': '',
                'opacity': '',
            });

            $('td.lin5').each(function(index) {
                $(this).find('.bur').css({
                    'background-color': ''
                })
            })
        }
    });

    $('.bet.lin5').click(function() {
        if (touch == false) {
            $('td.lin5').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 12px 2px var(--color3)',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if ((!$(this).hasClass('selected')) && ($(this).css('background-color') == color3)) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })
        }
    })

    $('th.col1').hover(function() {
        if (touch == false) {

            $('td.col1').css({
                'background-color': 'var(--color3)',
                'transform': 'translateZ(0px)',
            });
            $('.col1 span').css({
                'color': 'var(--blanco)'
            });

            $('td.col1').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if (!$(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })

                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })

            var numItems = $('.selected').length;
            var activos = $('.col1.selected').length;
            var col = $('.col1.selected').length;
            if ((numItems >= 8) || ((numItems >= 7) && (activos <= 3)) || ((numItems >= 6) && (activos <= 2)) || ((numItems >= 5) && (activos <= 1)) || ((numItems >= 4) && (activos == 0))) {
                $('td.col1').each(function(index) {
                    if (!$(this).hasClass('selected')) {
                        $(this).css({
                            'transform': 'translateZ(0)',
                            'color': 'var(--gris3)',
                            'background': 'var(--color7)'
                        })
                        $(this).find('.bur').css({
                            'background-color': 'var(--color11)'
                        })
                    }
                })
            };
        }
    }, function() {
        if (touch == false) {
            // on mouseout, reset the background colour
            $('td.col1').css({
                'color': '',
                'background-color': '',
                'box-shadow': '',
                'transform': '',
                'opacity': ''
            });
            $('.col1 span').css({
                'color': '',
                'opacity': ''
            });
            $('td.col1').each(function(index) {
                $(this).find('.bur').css({
                    'background-color': ''
                })
            })
        }
    });

    $('.bet.col1').click(function() {
        if (touch == false) {
            $('td.col1').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 12px 2px var(--color3)',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if ((!$(this).hasClass('selected')) && ($(this).css('background-color') == color3)) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })
        }
    })

    $('th.col2').hover(function() {
        if (touch == false) {
            $('.col2 span').css({
                'color': 'var(--blanco)'
            });

            $('td.col2').css({
                'background-color': 'var(--color3)',
                'transform': 'translateZ(0px)',
                'color': 'var(--gris2)'

            });
            if ($('td.col2').hasClass('neutro')) {
                $('td.neutro.col2').css({
                    'background': 'var(--color6)',
                    'transform': 'translateZ(0px)',
                    'color': 'white'
                })
            };

            $('td.col2').each(function(index) {
                if ($(this).hasClass('selected')) {

                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                    $(this).find('.bur3').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if (!$(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })

                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                    $(this).find('.bur3').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })

            var numItems = $('.selected').length;
            var activos = $('.col2.selected').length;
            var linea = $('.col2.selected').length;
            if ((numItems >= 8) || ((numItems >= 7) && (activos <= 3)) || ((numItems >= 6) && (activos <= 2)) || ((numItems >= 5) && (activos <= 1)) || ((numItems >= 4) && (activos == 0))) {
                $('td.col2').each(function(index) {
                    if (!$(this).hasClass('selected')) {
                        if ($(this).hasClass('ocho')) {
                            $(this).css({
                                'transform': 'translateZ(0)',
                                'background-color': 'var(--color8)',
                                'color': 'white'
                            })
                            $('.bur3').css({
                                'background-color': 'var(--color12)'
                            })
                        }
                        if (!$(this).hasClass('neutro')) {
                            $(this).css({
                                'transform': 'translateZ(0)',
                                'color': 'var(--gris3)',
                                'background': 'var(--color7)'
                            })
                            $(this).find('.bur').css({
                                'background-color': 'var(--color11)'
                            })
                        }
                    }
                })
            };
        }
    }, function() {
        if (touch == false) {
            // on mouseout, reset the background colour
            $('td.col2').css({
                'color': '',
                'background-color': '',
                'box-shadow': '',
                'background': '',
                'transform': '',
                'opacity': ''
            });
            $('.col2 span').css({
                'color': '',
                'opacity': '',
            });
            $('td.col2').each(function(index) {
                $(this).find('.bur').css({
                    'background-color': ''
                })
                $(this).find('.bur3').css({
                    'background-color': ''
                })
            })
        }
    });

    $('.bet.col2').click(function() {
        if (touch == false) {
            $('td.col2').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 12px 2px var(--color3)',
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                    $(this).find('.bur3').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if ((!$(this).hasClass('selected')) && (($(this).css('background-color') == color3) || ($(this).css('background-color') == color6))) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })

                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                    $(this).find('.bur3').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })
        }
    })

    $('th.col3').hover(function() {

        if (touch == false) {

            $('td.col3').css({
                'background-color': 'var(--color3)',
                'transform': 'translateZ(0px)',

            });
            $('.col3 span').css({
                'color': 'var(--blanco)'
            });

            $('td.col3').each(function(index) {

                if (!$(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                    })

                    $(this).css({
                        'color': 'var(--gris2)'
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                }
            })



            var numItems = $('.selected').length;
            var activos = $('.col3.selected').length;
            var col = $('.col3.selected').length;
            if ((numItems >= 8) || ((numItems >= 7) && (activos <= 3)) || ((numItems >= 6) && (activos <= 2)) || ((numItems >= 5) && (activos <= 1)) || ((numItems >= 4) && (activos == 0))) {
                $('td.col3').each(function(index) {
                    if (!$(this).hasClass('selected')) {
                        $(this).css({
                            'transform': 'translateZ(0)',
                            'color': 'var(--gris3)',
                            'background': 'var(--color7)'
                        })
                        $(this).find('.bur').css({
                            'background-color': 'var(--color11)'
                        })
                    }
                })
            };
        }
    }, function() {
        if (touch == false) {
            // on mouseout, reset the background colour
            $('td.col3').css({
                'color': '',
                'box-shadow': '',
                'background-color': '',
                'transform': '',
                'opacity': ''
            });
            $('.col3 span').css({
                'color': '',
                'opacity': ''
            });
            $('td.col3').each(function(index) {
                $(this).find('.bur').css({
                    'background-color': ''
                })
            })
        }
    });

    $('.bet.col3').click(function() {
        if (touch == false) {
            $('td.col3').each(function(index) {
                if ($(this).hasClass('selected')) {
                    $(this).css({
                        'box-shadow': '0px 0px 12px 2px var(--color3)',
                        'color': 'var(--gris2)'
                    })
                    $(this).find('.bur').css({
                        'background-color': 'var(--color3)'
                    })
                }
                if ((!$(this).hasClass('selected')) && ($(this).css('background-color') == color3)) {
                    $(this).find('.bur').css({
                        'background-color': 'var(--color19)'
                    })
                    $(this).css({
                        'box-shadow': '0px 0px 6px 2px #fff',
                        'color': ''
                    })
                }
            })
        }
    })

    $('td.nocolor').hover(function() {
        if ((($('.selected').length) >= 8) && (touch == false) && (!$(this).hasClass('selected'))) {
            $(this).css({
                'transform': 'translateZ(0)',
                'color': 'var(--gris3)',
                'background': 'var(--color7)'
            })
            $(this).find('.bur').css({
                'background-color': 'var(--color11)'
            })
        };
    }, function() {
        // on mouseout, reset the background colour
        $(this).css({
            'color': '',
            'background': '',
            'box-shadow': '',
            'transform': ''
        });
        $(this).find('.bur').css({
            'background-color': ''
        });
    });

    $('td.cero').hover(function() {

        if ((($('.selected').length) >= 8) && (touch == false) && (!$(this).hasClass('selected'))) {

            $(this).css({
                'transform': 'translateZ(0)',
                'color': 'white',
                'background': 'var(--color8)'
            })
            $('.bur2').css({
                'background-color': 'var(--color12)'
            })

        };
    }, function() {
        // on mouseout, reset the background colour
        $(this).css({
            'transform': ''
        });
        $('.bur2').css({
            'background-color': ''
        })
        $(this).css({
            'transform': '',
            'color': '',
            'background': ''
        })
        $('.bur2').css({
            'background-color': ''
        })
    });

    $('td.ocho').hover(function() {

        if ((($('.selected').length) >= 8) && (touch == false) && (!$(this).hasClass('selected'))) {

            $(this).css({
                'transform': 'translateZ(0)',
                'color': 'white',
                'background': 'var(--color8)'
            })
            $('.bur3').css({
                'background-color': 'var(--color12)'
            })

        };
    }, function() {
        // on mouseout, reset the background colour
        $(this).css({
            'transform': '',
            'color': '',
            'background': ''
        });
        $('.bur3').css({
            'background-color': ''
        })
    });



    $('.bety').hover(function() {
        if (mode == false) {
            if ($('.selected').length != 0) {
                $(this).css({
                    'cursor': 'pointer'
                })
            }
        };
    }, function() {
        // on mouseout, reset the background colour
        $(this).css({
            'cursor': ''
        });
    });



    $('td').hover(function() {
        if ((($('.selected').length) <= 7) && (!$(this).hasClass('selected'))) {
            if (touch == false) {
                if ($(this).hasClass('cero')) {
                    numbers.push(0);
                }
                if ($(this).hasClass('uno')) {
                    numbers.push(1);
                }
                if ($(this).hasClass('dos')) {
                    numbers.push(2);
                }
                if ($(this).hasClass('tres')) {
                    numbers.push(3);
                }
                if ($(this).hasClass('cuatro')) {
                    numbers.push(4);
                }
                if ($(this).hasClass('cinco')) {
                    numbers.push(5);
                }
                if ($(this).hasClass('seis')) {
                    numbers.push(6);
                }
                if ($(this).hasClass('siete')) {
                    numbers.push(7);
                }
                if ($(this).hasClass('ocho')) {
                    numbers.push(8);
                }
                if ($(this).hasClass('nueve')) {
                    numbers.push(9);
                }
                if ($(this).hasClass('a')) {
                    numbers.push('a');
                }
                if ($(this).hasClass('b')) {
                    numbers.push('b');
                }
                if ($(this).hasClass('c')) {
                    numbers.push('c');
                }
                if ($(this).hasClass('d')) {
                    numbers.push('d');
                }
                if ($(this).hasClass('e')) {
                    numbers.push('e');
                }
                if ($(this).hasClass('f')) {
                    numbers.push('f');
                }
                fillticket();
                $.fn.myFunction();
            }
        };
    }, function() {

        if ((($('.selected').length) <= 7) && (!$(this).hasClass('selected'))) {
            if (touch == false) {
                if ($(this).hasClass('cero')) {
                    numbers.splice(numbers.indexOf(0), 1);
                }
                if ($(this).hasClass('uno')) {
                    numbers.splice(numbers.indexOf(1), 1);
                }
                if ($(this).hasClass('dos')) {
                    numbers.splice(numbers.indexOf(2), 1);
                }
                if ($(this).hasClass('tres')) {
                    numbers.splice(numbers.indexOf(3), 1);
                }
                if ($(this).hasClass('cuatro')) {
                    numbers.splice(numbers.indexOf(4), 1);
                }
                if ($(this).hasClass('cinco')) {
                    numbers.splice(numbers.indexOf(5), 1);
                }
                if ($(this).hasClass('seis')) {
                    numbers.splice(numbers.indexOf(6), 1);
                }
                if ($(this).hasClass('siete')) {
                    numbers.splice(numbers.indexOf(7), 1);
                }
                if ($(this).hasClass('ocho')) {
                    numbers.splice(numbers.indexOf(8), 1);
                }
                if ($(this).hasClass('nueve')) {
                    numbers.splice(numbers.indexOf(9), 1);
                }
                if ($(this).hasClass('a')) {
                    numbers.splice(numbers.indexOf('a'), 1);
                }
                if ($(this).hasClass('b')) {
                    numbers.splice(numbers.indexOf('b'), 1);
                }
                if ($(this).hasClass('c')) {
                    numbers.splice(numbers.indexOf('c'), 1);
                }
                if ($(this).hasClass('d')) {
                    numbers.splice(numbers.indexOf('d'), 1);
                }
                if ($(this).hasClass('e')) {
                    numbers.splice(numbers.indexOf('e'), 1);
                }
                if ($(this).hasClass('f')) {
                    numbers.splice(numbers.indexOf('f'), 1);
                }
                fillticket();
                $.fn.myFunction();
            }
        }
    });



    $('th.lin1').hover(function() {
        if (touch == false) {
            var numItems = $('.selected').length;
            var linea = $('.lin1.selected').length;
            if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
                if (!$('td.uno').hasClass('selected')) {
                    numbers.push(1)
                }
                if (!$('td.dos').hasClass('selected')) {
                    numbers.push(2)
                }
                if (!$('td.tres').hasClass('selected')) {
                    numbers.push(3)
                }
                fillticket();
                $.fn.myFunction();
            }
        }
    }, function() {
        if (touch == false) {
            if (!$('td.uno').hasClass('selected')) {
                if ($.inArray(1, numbers) != -1) {
                    numbers.splice(numbers.indexOf(1), 1);
                }
            }
            if (!$('td.dos').hasClass('selected')) {
                if ($.inArray(2, numbers) != -1) {
                    numbers.splice(numbers.indexOf(2), 1);
                }
            }
            if (!$('td.tres').hasClass('selected')) {
                if ($.inArray(3, numbers) != -1) {
                    numbers.splice(numbers.indexOf(3), 1);
                }
            }
            fillticket();
            $.fn.myFunction();
        }
    });
    $('th.lin2').hover(function() {
        if (touch == false) {
            var numItems = $('.selected').length;
            var linea = $('.lin2.selected').length;
            if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
                if (!$('td.cuatro').hasClass('selected')) {
                    numbers.push(4)
                }
                if (!$('td.cinco').hasClass('selected')) {
                    numbers.push(5)
                }
                if (!$('td.seis').hasClass('selected')) {
                    numbers.push(6)
                }
                fillticket();
                $.fn.myFunction();
            }
        }
    }, function() {
        if (touch == false) {
            if (!$('td.cuatro').hasClass('selected')) {
                if ($.inArray(4, numbers) != -1) {
                    numbers.splice(numbers.indexOf(4), 1);
                }
            }
            if (!$('td.cinco').hasClass('selected')) {
                if ($.inArray(5, numbers) != -1) {
                    numbers.splice(numbers.indexOf(5), 1);
                }
            }
            if (!$('td.seis').hasClass('selected')) {
                if ($.inArray(6, numbers) != -1) {
                    numbers.splice(numbers.indexOf(6), 1);
                }
            }
            fillticket();
            $.fn.myFunction();
        }
    });
    $('th.lin3').hover(function() {
        if (touch == false) {
            var numItems = $('.selected').length;
            var linea = $('.lin3.selected').length;
            if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
                if (!$('td.siete').hasClass('selected')) {
                    numbers.push(7)
                }
                if (!$('td.ocho').hasClass('selected')) {
                    numbers.push(8)
                }
                if (!$('td.nueve').hasClass('selected')) {
                    numbers.push(9)
                }
                fillticket();
                $.fn.myFunction();
            }
        }
    }, function() {
        if (touch == false) {
            if (!$('td.siete').hasClass('selected')) {
                if ($.inArray(7, numbers) != -1) {
                    numbers.splice(numbers.indexOf(7), 1);
                }
            }
            if (!$('td.ocho').hasClass('selected')) {
                if ($.inArray(8, numbers) != -1) {
                    numbers.splice(numbers.indexOf(8), 1);
                }
            }
            if (!$('td.nueve').hasClass('selected')) {
                if ($.inArray(9, numbers) != -1) {
                    numbers.splice(numbers.indexOf(9), 1);
                }
            }
            fillticket();
            $.fn.myFunction();
        }
    });
    $('th.lin4').hover(function() {
        if (touch == false) {
            var numItems = $('.selected').length;
            var linea = $('.lin4.selected').length;
            if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
                if (!$('td.a').hasClass('selected')) {
                    numbers.push('a')
                }
                if (!$('td.b').hasClass('selected')) {
                    numbers.push('b')
                }
                if (!$('td.c').hasClass('selected')) {
                    numbers.push('c')
                }
                fillticket();
                $.fn.myFunction();
            }
        }
    }, function() {
        if (touch == false) {
            if (!$('td.a').hasClass('selected')) {
                if ($.inArray('a', numbers) != -1) {
                    numbers.splice(numbers.indexOf('a'), 1);
                }
            }
            if (!$('td.b').hasClass('selected')) {
                if ($.inArray('b', numbers) != -1) {
                    numbers.splice(numbers.indexOf('b'), 1);
                }
            }
            if (!$('td.c').hasClass('selected')) {
                if ($.inArray('c', numbers) != -1) {
                    numbers.splice(numbers.indexOf('c'), 1);
                }
            }
            fillticket();
            $.fn.myFunction();
        }
    });
    $('th.lin5').hover(function() {
        if (touch == false) {
            var numItems = $('.selected').length;
            var linea = $('.lin5.selected').length;
            if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
                if (!$('td.d').hasClass('selected')) {
                    numbers.push('d')
                }
                if (!$('td.e').hasClass('selected')) {
                    numbers.push('e')
                }
                if (!$('td.f').hasClass('selected')) {
                    numbers.push('f')
                }
                fillticket();
                $.fn.myFunction();
            }
        }
    }, function() {
        if (touch == false) {
            if (!$('td.d').hasClass('selected')) {
                if ($.inArray('d', numbers) != -1) {
                    numbers.splice(numbers.indexOf('d'), 1);
                }
            }
            if (!$('td.e').hasClass('selected')) {
                if ($.inArray('e', numbers) != -1) {
                    numbers.splice(numbers.indexOf('e'), 1);
                }
            }
            if (!$('td.f').hasClass('selected')) {
                if ($.inArray('f', numbers) != -1) {
                    numbers.splice(numbers.indexOf('f'), 1);
                }
            }
            fillticket();
            $.fn.myFunction();
        }
    });
    $('th.col1').hover(function() {
        if (touch == false) {
            var numItems = $('.selected').length;
            var col = $('.col1.selected').length;
            if (((col == 4) && (numItems <= 7)) || ((col == 3) && (numItems <= 6)) || ((col == 2) && (numItems <= 5)) || ((col == 1) && (numItems <= 4)) || ((col == 0) && (numItems <= 3))) {
                if (!$('td.uno').hasClass('selected')) {
                    numbers.push(1)
                }
                if (!$('td.cuatro').hasClass('selected')) {
                    numbers.push(4)
                }
                if (!$('td.siete').hasClass('selected')) {
                    numbers.push(7)
                }
                if (!$('td.a').hasClass('selected')) {
                    numbers.push('a')
                }
                if (!$('td.d').hasClass('selected')) {
                    numbers.push('d')
                }
                fillticket();
                $.fn.myFunction();
            }
        }
    }, function() {
        if (touch == false) {
            if (!$('td.uno').hasClass('selected')) {
                if ($.inArray(1, numbers) != -1) {
                    numbers.splice(numbers.indexOf(1), 1);
                }
            }
            if (!$('td.cuatro').hasClass('selected')) {
                if ($.inArray(4, numbers) != -1) {
                    numbers.splice(numbers.indexOf(4), 1);
                }
            }
            if (!$('td.siete').hasClass('selected')) {
                if ($.inArray(7, numbers) != -1) {
                    numbers.splice(numbers.indexOf(7), 1);
                }
            }
            if (!$('td.a').hasClass('selected')) {
                if ($.inArray('a', numbers) != -1) {
                    numbers.splice(numbers.indexOf('a'), 1);
                }
            }
            if (!$('td.d').hasClass('selected')) {
                if ($.inArray('d', numbers) != -1) {
                    numbers.splice(numbers.indexOf('d'), 1);
                }
            }
            fillticket();
            $.fn.myFunction();
        }
    });
    $('th.col2').hover(function() {
        if (touch == false) {
            var numItems = $('.selected').length;
            var col = $('.col2.selected').length;
            if (((col == 4) && (numItems <= 7)) || ((col == 3) && (numItems <= 6)) || ((col == 2) && (numItems <= 5)) || ((col == 1) && (numItems <= 4)) || ((col == 0) && (numItems <= 3))) {
                if (!$('td.dos').hasClass('selected')) {
                    numbers.push(2)
                }
                if (!$('td.cinco').hasClass('selected')) {
                    numbers.push(5)
                }
                if (!$('td.ocho').hasClass('selected')) {
                    numbers.push(8)
                }
                if (!$('td.b').hasClass('selected')) {
                    numbers.push('b')
                }
                if (!$('td.e').hasClass('selected')) {
                    numbers.push('e')
                }
                fillticket();
                $.fn.myFunction();
            }
        }
    }, function() {
        if (touch == false) {
            if (!$('td.dos').hasClass('selected')) {
                if ($.inArray(2, numbers) != -1) {
                    numbers.splice(numbers.indexOf(2), 1);
                }
            }
            if (!$('td.cinco').hasClass('selected')) {
                if ($.inArray(5, numbers) != -1) {
                    numbers.splice(numbers.indexOf(5), 1);
                }
            }
            if (!$('td.ocho').hasClass('selected')) {
                if ($.inArray(8, numbers) != -1) {
                    numbers.splice(numbers.indexOf(8), 1);
                }
            }
            if (!$('td.b').hasClass('selected')) {
                if ($.inArray('b', numbers) != -1) {
                    numbers.splice(numbers.indexOf('b'), 1);
                }
            }
            if (!$('td.e').hasClass('selected')) {
                if ($.inArray('e', numbers) != -1) {
                    numbers.splice(numbers.indexOf('e'), 1);
                }
            }
            fillticket();
            $.fn.myFunction();
        }
    });
    $('th.col3').hover(function() {
        if (touch == false) {
            var numItems = $('.selected').length;
            var col = $('.col3.selected').length;
            if (((col == 4) && (numItems <= 7)) || ((col == 3) && (numItems <= 6)) || ((col == 2) && (numItems <= 5)) || ((col == 1) && (numItems <= 4)) || ((col == 0) && (numItems <= 3))) {
                if (!$('td.tres').hasClass('selected')) {
                    numbers.push(3)
                }
                if (!$('td.seis').hasClass('selected')) {
                    numbers.push(6)
                }
                if (!$('td.nueve').hasClass('selected')) {
                    numbers.push(9)
                }
                if (!$('td.c').hasClass('selected')) {
                    numbers.push('c')
                }
                if (!$('td.f').hasClass('selected')) {
                    numbers.push('f')
                }
                fillticket();
                $.fn.myFunction();
            }
        }
    }, function() {
        if (touch == false) {
            if (!$('td.tres').hasClass('selected')) {
                if ($.inArray(3, numbers) != -1) {
                    numbers.splice(numbers.indexOf(3), 1);
                }
            }
            if (!$('td.seis').hasClass('selected')) {
                if ($.inArray(6, numbers) != -1) {
                    numbers.splice(numbers.indexOf(6), 1);
                }
            }
            if (!$('td.nueve').hasClass('selected')) {
                if ($.inArray(9, numbers) != -1) {
                    numbers.splice(numbers.indexOf(9), 1);
                }
            }
            if (!$('td.c').hasClass('selected')) {
                if ($.inArray('c', numbers) != -1) {
                    numbers.splice(numbers.indexOf('c'), 1);
                }
            }
            if (!$('td.f').hasClass('selected')) {
                if ($.inArray('f', numbers) != -1) {
                    numbers.splice(numbers.indexOf('f'), 1);
                }
            }
            fillticket();
            $.fn.myFunction();
        }
    });
    $('th.red').hover(function() {
        if (touch == false) {
            var numItems = $('.selected').length;
            var color = $('.color1.selected').length;
            if (((color == 6) && (numItems <= 7)) || ((color == 5) && (numItems <= 6)) || ((color == 4) && (numItems <= 5)) || ((color == 3) && (numItems <= 4)) || ((color == 2) && (numItems <= 3)) || ((color == 1) && (numItems <= 2)) || ((color == 0) && (numItems <= 1))) {
                if (!$('td.uno').hasClass('selected')) {
                    numbers.push(1)
                }
                if (!$('td.tres').hasClass('selected')) {
                    numbers.push(3)
                }
                if (!$('td.cinco').hasClass('selected')) {
                    numbers.push(5)
                }
                if (!$('td.siete').hasClass('selected')) {
                    numbers.push(7)
                }
                if (!$('td.b').hasClass('selected')) {
                    numbers.push('b')
                }
                if (!$('td.d').hasClass('selected')) {
                    numbers.push('d')
                }
                if (!$('td.f').hasClass('selected')) {
                    numbers.push('f')
                }
                fillticket();
                $.fn.myFunction();
            }
        }
    }, function() {
        if (touch == false) {
            if (!$('td.uno').hasClass('selected')) {
                if ($.inArray(1, numbers) != -1) {
                    numbers.splice(numbers.indexOf(1), 1);
                }
            }
            if (!$('td.tres').hasClass('selected')) {
                if ($.inArray(3, numbers) != -1) {
                    numbers.splice(numbers.indexOf(3), 1);
                }
            }
            if (!$('td.cinco').hasClass('selected')) {
                if ($.inArray(5, numbers) != -1) {
                    numbers.splice(numbers.indexOf(5), 1);
                }
            }
            if (!$('td.siete').hasClass('selected')) {
                if ($.inArray(7, numbers) != -1) {
                    numbers.splice(numbers.indexOf(7), 1);
                }
            }
            if (!$('td.b').hasClass('selected')) {
                if ($.inArray('b', numbers) != -1) {
                    numbers.splice(numbers.indexOf('b'), 1);
                }
            }
            if (!$('td.d').hasClass('selected')) {
                if ($.inArray('d', numbers) != -1) {
                    numbers.splice(numbers.indexOf('d'), 1);
                }
            }
            if (!$('td.f').hasClass('selected')) {
                if ($.inArray('f', numbers) != -1) {
                    numbers.splice(numbers.indexOf('f'), 1);
                }
            }
            fillticket();
            $.fn.myFunction();
        }
    });
    $('th.black').hover(function() {
        if (touch == false) {
            var numItems = $('.selected').length;
            var color = $('.color2.selected').length;
            if (((color == 6) && (numItems <= 7)) || ((color == 5) && (numItems <= 6)) || ((color == 4) && (numItems <= 5)) || ((color == 3) && (numItems <= 4)) || ((color == 2) && (numItems <= 3)) || ((color == 1) && (numItems <= 2)) || ((color == 0) && (numItems <= 1))) {
                if (!$('td.dos').hasClass('selected')) {
                    numbers.push(2)
                }
                if (!$('td.cuatro').hasClass('selected')) {
                    numbers.push(4)
                }
                if (!$('td.seis').hasClass('selected')) {
                    numbers.push(6)
                }
                if (!$('td.nueve').hasClass('selected')) {
                    numbers.push(9)
                }
                if (!$('td.a').hasClass('selected')) {
                    numbers.push('a')
                }
                if (!$('td.c').hasClass('selected')) {
                    numbers.push('c')
                }
                if (!$('td.e').hasClass('selected')) {
                    numbers.push('e')
                }
                fillticket();
                $.fn.myFunction();
            }
        }
    }, function() {
        if (touch == false) {
            if (!$('td.dos').hasClass('selected')) {
                if ($.inArray(2, numbers) != -1) {
                    numbers.splice(numbers.indexOf(2), 1);
                }
            }
            if (!$('td.cuatro').hasClass('selected')) {
                if ($.inArray(4, numbers) != -1) {
                    numbers.splice(numbers.indexOf(4), 1);
                }
            }
            if (!$('td.seis').hasClass('selected')) {
                if ($.inArray(6, numbers) != -1) {
                    numbers.splice(numbers.indexOf(6), 1);
                }
            }
            if (!$('td.nueve').hasClass('selected')) {
                if ($.inArray(9, numbers) != -1) {
                    numbers.splice(numbers.indexOf(9), 1);
                }
            }
            if (!$('td.a').hasClass('selected')) {
                if ($.inArray('a', numbers) != -1) {
                    numbers.splice(numbers.indexOf('a'), 1);
                }
            }
            if (!$('td.c').hasClass('selected')) {
                if ($.inArray('c', numbers) != -1) {
                    numbers.splice(numbers.indexOf('c'), 1);
                }
            }
            if (!$('td.e').hasClass('selected')) {
                if ($.inArray('e', numbers) != -1) {
                    numbers.splice(numbers.indexOf('e'), 1);
                }
            }
            fillticket();
            $.fn.myFunction();
        }
    });
});

$.fn.myFunction = function() {
    if (numbers.length == 0) {
        document.getElementById("spanoferta").innerHTML = null;
    };
    if (numbers.length == 1) {
        document.getElementById("spanoferta").innerHTML = "<span>\u00D7</span>15";
    };
    if (numbers.length == 2) {
        document.getElementById("spanoferta").innerHTML = "<span>\u00D7</span>7.5";
    };
    if (numbers.length == 3) {
        document.getElementById("spanoferta").innerHTML = "<span>\u00D7</span>5";
    };
    if (numbers.length == 4) {
        document.getElementById("spanoferta").innerHTML = "<span>\u00D7</span>3.75";
    };
    if (numbers.length == 5) {
        document.getElementById("spanoferta").innerHTML = "<span>\u00D7</span>3";
    };
    if (numbers.length == 6) {
        document.getElementById("spanoferta").innerHTML = "<span>\u00D7</span>2.5";
    };
    if (numbers.length == 7) {
        document.getElementById("spanoferta").innerHTML = "<span>\u00D7</span>2.14";
        if ((JSON.stringify(numbers) === JSON.stringify(acolor)) || (JSON.stringify(numbers) === JSON.stringify(acolor1))) {
            document.getElementById("spanoferta").innerHTML = "<span>\u00D7</span>2";
        }
    };
    if (numbers.length == 8) {
        document.getElementById("spanoferta").innerHTML = "<span>\u00D7</span>1.87";
    };
    if (numbers.join('') == '1357bdf') {
        $('.alerta0').css({
            'display': 'block'
        });

        $('.ticket.eight').css({
            'background-color': 'var(--color15)'
        });
        document.getElementById('numeros8').innerHTML = '0';

    } else if (numbers.join('') == '2469ace') {
        $('.alerta8').css({
            'display': 'block'
        });

        $('.ticket.eight').css({
            'background-color': 'var(--color15)'
        });

        document.getElementById('numeros8').innerHTML = '8';


    } else {
        $('.alerta8').css({
            'display': ''
        });
        if (deplo == false) {
            $('#cortina').removeClass('deployed');
            $('#cortina').addClass('undeployed');
        }
        $('.alerta0').css({
            'display': ''
        });
    }
}

// listen for clicks on any td (main logic: clickFunction)
$('td').click(clickFunction);
$('td').on('touchend', clickFunctionM);


$('th.lin1').click(clickFunctionLin1);
$('th.lin1').on('touchend', clickFunctionLin1M);
$('th.lin2').click(clickFunctionLin2);
$('th.lin2').on('touchend', clickFunctionLin2M);
$('th.lin3').click(clickFunctionLin3);
$('th.lin3').on('touchend', clickFunctionLin3M);
$('th.lin4').click(clickFunctionLin4);
$('th.lin4').on('touchend', clickFunctionLin4M);
$('th.lin5').click(clickFunctionLin5);
$('th.lin5').on('touchend', clickFunctionLin5M);


$('th.col1').click(clickFunctionCol1);
$('th.col1').on('touchend', clickFunctionCol1M);
$('th.col2').click(clickFunctionCol2);
$('th.col2').on('touchend', clickFunctionCol2M);
$('th.col3').click(clickFunctionCol3);
$('th.col3').on('touchend', clickFunctionCol3M);

$('th.red').click(clickFunctionColor);
$('th.red').on('touchend', clickFunctionColorM);
$('th.black').click(clickFunctionColor1);
$('th.black').on('touchend', clickFunctionColor1M);

$('th.ran').click(clickFunctionRan);

$('.bety').click(clickFunctionBet);

$('.arrowleft').click(clickFunctionArrowleft);
$('.arrowright').click(clickFunctionArrowright);

$('#volver').click(clickFunctionVolver);
$('#legacy').click(clickFunctionLegacy);
$('#copy').click(clickFunctionCopy);

$('.flecha').click(clickFunctionWelcome);
$('.flecha1').click(clickFunctionWelcome1);
$('.flecha2').click(clickFunctionWelcome2);
$('.flecha3').click(clickFunctionWelcome3);
$('.flecha4').click(clickFunctionWelcome4);

$('#faqs').click(clickFunctionFaqs);
$('.q.one').click(clickFunctionQone);
$('.q.two').click(clickFunctionQtwo);
$('.q.three').click(clickFunctionQthree);
$('.q.four').click(clickFunctionQfour);
$('.q.five').click(clickFunctionQfive);
$('.q.six').click(clickFunctionQsix);
$('.q.seven').click(clickFunctionQseven);
$('.q.eight').click(clickFunctionQeight);

$('p.close').click(clickFunctionAclose);

$('#twitter').click(clickFunctionTwitter);

function clickFunctionTwitter(e) {
    url = 'https://twitter.com/Satoshingcom'
    var win = window.open(url, '_blank');
    win.focus();
}

function clickFunctionAclose(e) {
    $('#answer').css({
        'display': 'none'
    });
    $('.apa').css({
        'display': 'none'
    });
}

function clickFunctionQone(e) {
    $('#answer').css({
        'display': 'block'
    });
    $('.a.one').css({
        'display': 'block'
    });
}

function clickFunctionQtwo(e) {
    $('#answer').css({
        'display': 'block'
    });
    $('.a.two').css({
        'display': 'block'
    });
}

function clickFunctionQthree(e) {
    $('#answer').css({
        'display': 'block'
    });
    $('.a.three').css({
        'display': 'block'
    });
}

function clickFunctionQfour(e) {
    $('#answer').css({
        'display': 'block'
    });
    $('.a.four').css({
        'display': 'block'
    });
}

function clickFunctionQfive(e) {
    $('#answer').css({
        'display': 'block'
    });
    $('.a.five').css({
        'display': 'block'
    });
}

function clickFunctionQsix(e) {
    $('#answer').css({
        'display': 'block'
    });
    $('.a.six').css({
        'display': 'block'
    });
}

function clickFunctionQseven(e) {
    $('#answer').css({
        'display': 'block'
    });
    $('.a.seven').css({
        'display': 'block'
    });
}

function clickFunctionQeight(e) {
    $('#answer').css({
        'display': 'block'
    });
    $('.a.eight').css({
        'display': 'block'
    });
}


var faqs = false;

function clickFunctionFaqs(e) {
    if (faqs == false) {
        $('#questions').removeClass();
        $('#questions').addClass('on');
        $('#container-12').removeClass();
        $('#container-12').addClass('long');
        $('#faqs').removeClass();
        $('#faqs').addClass('long');
        if (window.innerWidth < 385) {
            $('#twitter').removeClass();
            $('#twitter').addClass('long');
            $('html,body').scrollTop(1300);
        }
        faqs = true;
    } else {
        $('#questions').removeClass();
        $('#questions').addClass('off');
        $('#container-12').removeClass();
        $('#container-12').addClass('short');
        $('#faqs').removeClass();
        $('#faqs').addClass('short');
        if (window.innerWidth < 385) {
            $('#twitter').removeClass();
            $('#twitter').addClass('short');
        }
        $('#answer').css({
            'display': 'none'
        });
        $('.apa').css({
            'display': 'none'
        });
        faqs = false;
    }
}



function clickFunctionColorM(e) {
    var numItems = $('.selected').length;
    var color = $('.color1.selected').length;
    if (color == 7) {
        $('td.color1').removeClass('selected');
        $('td.color1').addClass('deselected');
        numbers.splice(numbers.indexOf(1), 1);
        numbers.splice(numbers.indexOf(3), 1);
        numbers.splice(numbers.indexOf(5), 1);
        numbers.splice(numbers.indexOf(7), 1);
        numbers.splice(numbers.indexOf('b'), 1);
        numbers.splice(numbers.indexOf('d'), 1);
        numbers.splice(numbers.indexOf('f'), 1);

        fillticket();
        $.fn.myFunction();
    } else if (((color == 6) && (numItems <= 7)) || ((color == 5) && (numItems <= 6)) || ((color == 4) && (numItems <= 5)) || ((color == 3) && (numItems <= 4)) || ((color == 2) && (numItems <= 3)) || ((color == 1) && (numItems <= 2)) || ((color == 0) && (numItems <= 1))) {
        if (!$('td.uno').hasClass('selected')) {
            $('td.uno').addClass('selected');
            $('td.uno').addClass('selected');
            numbers.push(1);
        }
        if (!$('td.tres').hasClass('selected')) {
            $('td.tres').addClass('selected');
            $('td.tres').addClass('selected');
            numbers.push(3);
        }
        if (!$('td.cinco').hasClass('selected')) {
            $('td.cinco').addClass('selected');
            $('td.cinco').addClass('selected');
            numbers.push(5);
        }
        if (!$('td.siete').hasClass('selected')) {
            $('td.siete').addClass('selected');
            $('td.siete').addClass('selected');
            numbers.push(7);
        }
        if (!$('td.b').hasClass('selected')) {
            $('td.b').addClass('selected');
            $('td.b').addClass('selected');
            numbers.push('b');
        }
        if (!$('td.d').hasClass('selected')) {
            $('td.d').addClass('selected');
            $('td.d').addClass('selected');
            numbers.push('d');
        }
        if (!$('td.f').hasClass('selected')) {
            $('td.f').addClass('selected');
            $('td.f').addClass('selected');
            numbers.push('f');
        }

        fillticket();
        $.fn.myFunction();
    }
}

function clickFunctionColor1M(e) {
    var numItems = $('.selected').length;
    var color = $('.color2.selected').length;
    if (color == 7) {
        $('td.color2').removeClass('selected');
        $('td.color2').addClass('deselected');
        numbers.splice(numbers.indexOf(2), 1);
        numbers.splice(numbers.indexOf(4), 1);
        numbers.splice(numbers.indexOf(6), 1);
        numbers.splice(numbers.indexOf(9), 1);
        numbers.splice(numbers.indexOf('a'), 1);
        numbers.splice(numbers.indexOf('c'), 1);
        numbers.splice(numbers.indexOf('e'), 1);

        fillticket();
        $.fn.myFunction();
    } else if (((color == 6) && (numItems <= 7)) || ((color == 5) && (numItems <= 6)) || ((color == 4) && (numItems <= 5)) || ((color == 3) && (numItems <= 4)) || ((color == 2) && (numItems <= 3)) || ((color == 1) && (numItems <= 2)) || ((color == 0) && (numItems <= 1))) {
        if (!$('td.dos').hasClass('selected')) {
            $('td.dos').addClass('selected');
            $('td.dos').removeClass('deselected');
            numbers.push(2);
        }
        if (!$('td.cuatro').hasClass('selected')) {
            $('td.cuatro').addClass('selected');
            $('td.cuatro').removeClass('deselected');
            numbers.push(4);
        }
        if (!$('td.seis').hasClass('selected')) {
            $('td.seis').addClass('selected');
            $('td.seis').removeClass('deselected');
            numbers.push(6);
        }
        if (!$('td.nueve').hasClass('selected')) {
            $('td.nueve').addClass('selected');
            $('td.nueve').removeClass('deselected');
            numbers.push(9);
        }
        if (!$('td.a').hasClass('selected')) {
            $('td.a').addClass('selected');
            $('td.a').removeClass('deselected');
            numbers.push('a');
        }
        if (!$('td.c').hasClass('selected')) {
            $('td.c').addClass('selected');
            $('td.c').removeClass('deselected');
            numbers.push('c');
        }
        if (!$('td.e').hasClass('selected')) {
            $('td.e').addClass('selected');
            $('td.e').removeClass('deselected');
            numbers.push('e');
        }

        fillticket();
        $.fn.myFunction();
    }
}

function clickFunctionCol1M(e) {
    var numItems = $('.selected').length;
    var col = $('.col1.selected').length;
    if (col == 5) {
        $('td.col1').removeClass('selected');
        $('td.col1').addClass('deselected');
        numbers.splice(numbers.indexOf(1), 1);
        numbers.splice(numbers.indexOf(4), 1);
        numbers.splice(numbers.indexOf(7), 1);
        numbers.splice(numbers.indexOf('a'), 1);
        numbers.splice(numbers.indexOf('d'), 1);

        fillticket();
        $.fn.myFunction();
    } else if (((col == 4) && (numItems <= 7)) || ((col == 3) && (numItems <= 6)) || ((col == 2) && (numItems <= 5)) || ((col == 1) && (numItems <= 4)) || ((col == 0) && (numItems <= 3))) {
        if (!$('td.uno').hasClass('selected')) {
            $('td.uno').addClass('selected');
            $('td.uno').removeClass('deselected');
            numbers.push(1);
        }
        if (!$('td.cuatro').hasClass('selected')) {
            $('td.cuatro').addClass('selected');
            $('td.cuatro').removeClass('deselected');
            numbers.push(4);
        }
        if (!$('td.siete').hasClass('selected')) {
            $('td.siete').addClass('selected');
            $('td.siete').removeClass('deselected');
            numbers.push(7);
        }
        if (!$('td.a').hasClass('selected')) {
            $('td.a').addClass('selected');
            $('td.a').removeClass('deselected');
            numbers.push('a');
        }

        if (!$('td.d').hasClass('selected')) {
            $('td.d').addClass('selected');
            $('td.d').removeClass('deselected');
            numbers.push('d');
        }

        fillticket();
        $.fn.myFunction();
    }
}

function clickFunctionCol2M(e) {
    var numItems = $('.selected').length;
    var col = $('.col2.selected').length;
    if (col == 5) {
        $('td.col2').removeClass('selected');
        $('td.col2').addClass('deselected');
        numbers.splice(numbers.indexOf(2), 1);
        numbers.splice(numbers.indexOf(5), 1);
        numbers.splice(numbers.indexOf(8), 1);
        numbers.splice(numbers.indexOf('b'), 1);
        numbers.splice(numbers.indexOf('e'), 1);

        fillticket();
        $.fn.myFunction();
    } else if (((col == 4) && (numItems <= 7)) || ((col == 3) && (numItems <= 6)) || ((col == 2) && (numItems <= 5)) || ((col == 1) && (numItems <= 4)) || ((col == 0) && (numItems <= 3))) {
        if (!$('td.dos').hasClass('selected')) {
            $('td.dos').addClass('selected');
            $('td.dos').removeClass('deselected');
            numbers.push(2);
        }
        if (!$('td.cinco').hasClass('selected')) {
            $('td.cinco').addClass('selected');
            $('td.cinco').removeClass('deselected');
            numbers.push(5);
        }
        if (!$('td.ocho').hasClass('selected')) {
            $('td.ocho').addClass('selected');
            $('td.ocho').removeClass('deselected');
            numbers.push(8);
        }
        if (!$('td.b').hasClass('selected')) {
            $('td.b').addClass('selected');
            $('td.b').removeClass('deselected');
            numbers.push('b');
        }

        if (!$('td.e').hasClass('selected')) {
            $('td.e').addClass('selected');
            $('td.e').removeClass('deselected');
            numbers.push('e');
        }

        fillticket();
        $.fn.myFunction();
    }
}

function clickFunctionCol3M(e) {
    var numItems = $('.selected').length;
    var col = $('.col3.selected').length;
    if (col == 5) {
        $('td.col3').removeClass('selected');
        $('td.col3').addClass('deselected');
        numbers.splice(numbers.indexOf(3), 1);
        numbers.splice(numbers.indexOf(6), 1);
        numbers.splice(numbers.indexOf(9), 1);
        numbers.splice(numbers.indexOf('c'), 1);
        numbers.splice(numbers.indexOf('f'), 1);

        fillticket();
        $.fn.myFunction();
    } else if (((col == 4) && (numItems <= 7)) || ((col == 3) && (numItems <= 6)) || ((col == 2) && (numItems <= 5)) || ((col == 1) && (numItems <= 4)) || ((col == 0) && (numItems <= 3))) {
        if (!$('td.tres').hasClass('selected')) {
            $('td.tres').addClass('selected');
            $('td.tres').removeClass('deselected');
            numbers.push(3);
        }
        if (!$('td.seis').hasClass('selected')) {
            $('td.seis').addClass('selected');
            $('td.seis').removeClass('deselected');
            numbers.push(6);
        }
        if (!$('td.nueve').hasClass('selected')) {
            $('td.nueve').addClass('selected');
            $('td.nueve').removeClass('deselected');
            numbers.push(9);
        }
        if (!$('td.c').hasClass('selected')) {
            $('td.c').addClass('selected');
            $('td.c').removeClass('deselected');
            numbers.push('c');
        }

        if (!$('td.f').hasClass('selected')) {
            $('td.f').addClass('selected');
            $('td.f').removeClass('deselected');
            numbers.push('f');
        }

        fillticket();
        $.fn.myFunction();
    }
}

function clickFunctionLin1M(e) {
    var numItems = $('.selected').length;
    var linea = $('.lin1.selected').length;
    if (linea == 3) {
        $('td.lin1').removeClass('selected');
        $('td.lin1').addClass('deselected');
        numbers.splice(numbers.indexOf(1), 1);
        numbers.splice(numbers.indexOf(2), 1);
        numbers.splice(numbers.indexOf(3), 1);

        fillticket();
        $.fn.myFunction();
    } else if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
        if (!$('td.uno').hasClass('selected')) {
            $('td.uno').addClass('selected');
            $('td.uno').removeClass('deselected');
            numbers.push(1);
        }
        if (!$('td.dos').hasClass('selected')) {
            $('td.dos').addClass('selected');
            $('td.dos').removeClass('deselected');
            numbers.push(2);
        }
        if (!$('td.tres').hasClass('selected')) {
            $('td.tres').addClass('selected');
            $('td.tres').removeClass('deselected');
            numbers.push(3);
        }
        fillticket();
        $.fn.myFunction();
    }
}

function clickFunctionLin2M(e) {
    var numItems = $('.selected').length;
    var linea = $('.lin2.selected').length;
    if (linea == 3) {
        $('td.lin2').removeClass('selected');
        $('td.lin2').addClass('deselected');
        numbers.splice(numbers.indexOf(4), 1);
        numbers.splice(numbers.indexOf(5), 1);
        numbers.splice(numbers.indexOf(6), 1);

        fillticket();
        $.fn.myFunction();
    } else if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
        if (!$('td.cuatro').hasClass('selected')) {
            $('td.cuatro').addClass('selected');
            $('td.cuatro').removeClass('deselected');
            numbers.push(4);
        }
        if (!$('td.cinco').hasClass('selected')) {
            $('td.cinco').addClass('selected');
            $('td.cinco').removeClass('deselected');
            numbers.push(5);
        }
        if (!$('td.seis').hasClass('selected')) {
            $('td.seis').addClass('selected');
            $('td.seis').removeClass('deselected');
            numbers.push(6);
        }
        fillticket();
        $.fn.myFunction();
    }
}

function clickFunctionLin3M(e) {
    var numItems = $('.selected').length;
    var linea = $('.lin3.selected').length;
    if (linea == 3) {
        $('td.lin3').removeClass('selected');
        $('td.lin3').addClass('deselected');
        numbers.splice(numbers.indexOf(7), 1);
        numbers.splice(numbers.indexOf(8), 1);
        numbers.splice(numbers.indexOf(9), 1);

        fillticket();
        $.fn.myFunction();
    } else if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
        if (!$('td.siete').hasClass('selected')) {
            $('td.siete').addClass('selected');
            $('td.siete').removeClass('deselected');
            numbers.push(7);
        }
        if (!$('td.ocho').hasClass('selected')) {
            $('td.ocho').addClass('selected');
            $('td.ocho').removeClass('deselected');
            numbers.push(8);
        }
        if (!$('td.nueve').hasClass('selected')) {
            $('td.nueve').addClass('selected');
            $('td.nueve').removeClass('deselected');
            numbers.push(9);
        }
        fillticket();
        $.fn.myFunction();
    }
}

function clickFunctionLin4M(e) {
    var numItems = $('.selected').length;
    var linea = $('.lin4.selected').length;
    if (linea == 3) {
        $('td.lin4').removeClass('selected');
        $('td.lin4').addClass('deselected');
        numbers.splice(numbers.indexOf('a'), 1);
        numbers.splice(numbers.indexOf('b'), 1);
        numbers.splice(numbers.indexOf('c'), 1);

        fillticket();
        $.fn.myFunction();
    } else if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
        if (!$('td.a').hasClass('selected')) {
            $('td.a').addClass('selected');
            $('td.a').removeClass('deselected');
            numbers.push('a');
        }
        if (!$('td.b').hasClass('selected')) {
            $('td.b').addClass('selected');
            $('td.b').removeClass('deselected');
            numbers.push('b');
        }
        if (!$('td.c').hasClass('selected')) {
            $('td.c').addClass('selected');
            $('td.c').removeClass('deselected');
            numbers.push('c');
        }
        fillticket();
        $.fn.myFunction();
    }
}

function clickFunctionLin5M(e) {
    var numItems = $('.selected').length;
    var linea = $('.lin5.selected').length;
    if (linea == 3) {
        $('td.lin5').removeClass('selected');
        $('td.lin5').addClass('deselected');
        numbers.splice(numbers.indexOf('d'), 1);
        numbers.splice(numbers.indexOf('e'), 1);
        numbers.splice(numbers.indexOf('f'), 1);

        fillticket();
        $.fn.myFunction();
    } else if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
        if (!$('td.d').hasClass('selected')) {
            $('td.d').removeClass('deselected');
            $('td.d').addClass('selected');
            numbers.push('d');
        }
        if (!$('td.e').hasClass('selected')) {
            $('td.e').removeClass('deselected');
            $('td.e').addClass('selected');
            numbers.push('e');
        }
        if (!$('td.f').hasClass('selected')) {
            $('td.f').removeClass('deselected');
            $('td.f').addClass('selected');
            numbers.push('f');
        }
        fillticket();
        $.fn.myFunction();
    }
}


function clickFunctionM(e) {
    if ($(this).hasClass('mesa')) {
        if ($(e.target).hasClass('selected')) {
            $(this).removeClass('selected');
            $(this).addClass('deselected');
            if ($(this).hasClass('cero')) {
                numbers.splice(numbers.indexOf(0), 1);
            }
            if ($(this).hasClass('uno')) {
                numbers.splice(numbers.indexOf(1), 1);
            }
            if ($(this).hasClass('dos')) {
                numbers.splice(numbers.indexOf(2), 1);
            }
            if ($(this).hasClass('tres')) {
                numbers.splice(numbers.indexOf(3), 1);
            }
            if ($(this).hasClass('cuatro')) {
                numbers.splice(numbers.indexOf(4), 1);
            }
            if ($(this).hasClass('cinco')) {
                numbers.splice(numbers.indexOf(5), 1);
            }
            if ($(this).hasClass('seis')) {
                numbers.splice(numbers.indexOf(6), 1);
            }
            if ($(this).hasClass('siete')) {
                numbers.splice(numbers.indexOf(7), 1);
            }
            if ($(this).hasClass('ocho')) {
                numbers.splice(numbers.indexOf(8), 1);
            }
            if ($(this).hasClass('nueve')) {
                numbers.splice(numbers.indexOf(9), 1);
            }
            if ($(this).hasClass('a')) {
                numbers.splice(numbers.indexOf('a'), 1);
            }
            if ($(this).hasClass('b')) {
                numbers.splice(numbers.indexOf('b'), 1);
            }
            if ($(this).hasClass('c')) {
                numbers.splice(numbers.indexOf('c'), 1);
            }
            if ($(this).hasClass('d')) {
                numbers.splice(numbers.indexOf('d'), 1);
            }
            if ($(this).hasClass('e')) {
                numbers.splice(numbers.indexOf('e'), 1);
            }
            if ($(this).hasClass('f')) {
                numbers.splice(numbers.indexOf('f'), 1);
            }
            fillticket();
            $.fn.myFunction();
        } else {
            if ($('.selected').length <= 7) {
                if ($(this).hasClass('cero')) {
                    numbers.push(0);
                }
                if ($(this).hasClass('uno')) {
                    numbers.push(1);
                }
                if ($(this).hasClass('dos')) {
                    numbers.push(2);
                }
                if ($(this).hasClass('tres')) {
                    numbers.push(3);
                }
                if ($(this).hasClass('cuatro')) {
                    numbers.push(4);
                }
                if ($(this).hasClass('cinco')) {
                    numbers.push(5);
                }
                if ($(this).hasClass('seis')) {
                    numbers.push(6);
                }
                if ($(this).hasClass('siete')) {
                    numbers.push(7);
                }
                if ($(this).hasClass('ocho')) {
                    numbers.push(8);
                }
                if ($(this).hasClass('nueve')) {
                    numbers.push(9);
                }
                if ($(this).hasClass('a')) {
                    numbers.push('a');
                }
                if ($(this).hasClass('b')) {
                    numbers.push('b');
                }
                if ($(this).hasClass('c')) {
                    numbers.push('c');
                }
                if ($(this).hasClass('d')) {
                    numbers.push('d');
                }
                if ($(this).hasClass('e')) {
                    numbers.push('e');
                }
                if ($(this).hasClass('f')) {
                    numbers.push('f');
                }
                $(this).addClass('selected');
                $(this).removeClass('deselected');
                fillticket();
                $.fn.myFunction();
            }
        }
    }
}

function clickFunction(e) {
    if ($(this).hasClass('mesa') && (touch == false)) {
        var numItems = $('.selected').length;

        // store the current selected cell's index
        let thisIndex = $('td').index(this);

        // always remove the deselected class and unbind listeners
        $('.deselected').removeClass('deselected').off('mouseout');
        // if clicking on a selected element, deselect it
        if ($(e.target).hasClass('selected')) {
            // the deselected class preserves the expected cell styling,
            // but also clearly shows when a cell has been deselected
            $(this).removeClass('selected').addClass('deselected');

            // add a listener to the deselected element
            $(this).mouseout(function() {
                $(this).removeClass('deselected').off('mouseout');
            })

            lastSelectedIndex = thisIndex;
            return;
        }

        // if no modifiers are held down, deselect all other cells, and null out the last selected
        /*
        if (!ctrlDown && !shiftDown) {
          $('td.selected').removeClass('selected');
        }
        */

        // the shift modifier selects all cells from the last selected to this selection
        /*
        if (shiftDown && lastSelectedIndex !== null) {
          $('td').filter((ind)=>{
            return (ind >= Math.min(lastSelectedIndex, thisIndex) && ind <= Math.max(lastSelectedIndex, thisIndex));
          }).addClass('selected');
        }
        */
        if (numItems <= 7) {
            $(this).addClass('selected');
            lastSelectedIndex = thisIndex;
        }
        $.fn.myFunction();
        fillticket();
    }
}

/*************************/
/*                       */
/*       Functions       */
/*                       */
/*************************/

function fillticket() {
    var sort = numbers.sort();
    var i;
    for (i = 0; i < 8; i++) {
        var cubes = ["one", "two", "three", "four", "five", "six", "seven", "eight"];
        var inc = 1 + i;
        var id = "numeros" + inc;
        var addr = ".ticket." + cubes[i];
        $(addr).css({
            'background-color': 'var(--gris4)'
        });
        document.getElementById(id).innerHTML = '';
    };
    for (i = 0; i < sort.length; i++) {
        var cubes = ["one", "two", "three", "four", "five", "six", "seven", "eight"];
        var inc = 1 + i;
        var id = "numeros" + inc;
        var addr = ".ticket." + cubes[i];
        $(addr).css({
            'background-color': 'var(--gris4)'
        });
        $('.details').css({
            'opacity': ''
        });
        document.getElementById(id).innerHTML = sort[i];
    };
    if (sort.length == 0) {
        $('.details').css({
            'opacity': '0'
        });
    };
    sel();
}

function clickFunctionArrowright() {
    if (blockstatus == 2) {
        document.getElementById("bajada").innerHTML = "PREVIOUS BLOCK";
        $('.arrowleft').css({
            'display': 'inline-block'
        });
        $('.spinner1').css({
            'display': 'block'
        });
        $('.spinner2').css({
            'display': 'none'
        });
        blockstatus = 1;
        actualice();
    } else if (blockstatus == 1) {
        document.getElementById("bajada").innerHTML = "LAST BLOCK";
        $('.arrowright').css({
            'display': 'none'
        });
        $('spinner-1').css({
            'display': 'none'
        });
        $('.spinner').css({
            'display': 'block'
        });
        $('.spinner1').css({
            'display': 'none'
        });
        $('.time0').css({
            'display': 'block'
        });
        $('.confs1').css({
            'display': 'none'
        });
        blockstatus = 0;
        actualice();
    }
}

function clickFunctionArrowleft() {
    if (blockstatus == 0) {
        document.getElementById("bajada").innerHTML = "PREVIOUS BLOCK";
        $('.arrowright').css({
            'display': 'inline-block'
        });
        $('.spinner').css({
            'display': 'none'
        });
        $('.spinner1').css({
            'display': 'block'
        });
        $('.time0').css({
            'display': 'none'
        });
        $('.confs1').css({
            'display': 'block'
        });
        blockstatus = 1;
        actualice();
    } else if (blockstatus == 1) {
        document.getElementById("bajada").innerHTML = "LAST CONFIRMED BLOCK";
        $('.arrowleft').css({
            'display': 'none'
        });
        $('.spinner1').css({
            'display': 'none'
        });
        $('.spinner2').css({
            'display': 'block'
        });
        blockstatus = 2;
        actualice();
    }
}

function clickFunctionSpin(e) {
    if (!blockinfo) {
        $('.block').css({
            'display': 'inline'
        });
        $('.spinner').css({
            'left': '225px'
        });
        $('.spinner1').css({
            'left': '225px'
        });
        $('.spinner2').css({
            'left': '225px'
        });
        $('.flechas').css({
            'left': '245px',
            'top': '330px'
        });
        blockinfo = true;
    } else {
        $('.block').css({
            'display': ''
        });
        $('.spinner').css({
            'left': ''
        });
        $('.spinner1').css({
            'left': ''
        });
        $('.spinner2').css({
            'left': ''
        });
        $('.flechas').css({
            'left': '',
            'top': ''
        });
        blockinfo = false;

    }
}

function clickFunctionCopy() {

    window.Clipboard = (function(window, document, navigator) {
        var textArea,
            copy;

        function isOS() {
            return navigator.userAgent.match(/ipad|iphone/i);
        }

        function createTextArea(text) {
            textArea = document.createElement('textArea');
            textArea.value = text;
            document.body.appendChild(textArea);
        }

        function selectText() {
            var range,
                selection;

            if (isOS()) {
                range = document.createRange();
                range.selectNodeContents(textArea);
                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                textArea.setSelectionRange(0, 999999);
            } else {
                textArea.select();
            }
        }

        function copyToClipboard() {
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }

        copy = function(text) {
            createTextArea(text);
            selectText();
            copyToClipboard();
        };

        return {
            copy: copy
        };
    })(window, document, navigator);

    Clipboard.copy(document.getElementById("address").innerText);
    $('html,body').scrollTop(0);

    $('#button p').css({
        'transition': 'none',
    });
    $('#copy').css({
        'transition': 'none',
    });
    $('#copy').css({
        'background-color': 'white',
    });
    $('#button p').css({
        'background-color': 'white',
    });
    $('#qr').css({
        'background-color': 'white',
    });
    setTimeout(function() {

        $('#copy').css({
            'background-color': '',
            'transition': '',
        });
        $('#button p').css({
            'background-color': '',
            'transition': '',
        });
    }, 100);
    setTimeout(function() {

        $('#qr').css({
            'background-color': '',
        });
    }, 300);
}

function clickFunctionLegacy(e) {
    if (cash == true) {
        document.getElementById("qr").innerHTML = '';
        var qrcode = new QRCode("qr", {
            text: legacyaddress,
            width: 617,
            height: 460,
            colorDark: color9,
            colorLight: "rgba(0,0,0,0)",
            correctLevel: QRCode.CorrectLevel.H
        });
        document.getElementById("address").innerHTML = "<span>" + legacyaddress + "</span>";
        document.getElementById("format").innerHTML = "<span>" + "CASH FORMAT" + "</span>";
        cash = false;
    } else {
        document.getElementById("qr").innerHTML = '';
        var qrcode = new QRCode("qr", {
            text: cashaddress,
            width: 617,
            height: 460,
            colorDark: color9,
            colorLight: "rgba(0,0,0,0)",
            correctLevel: QRCode.CorrectLevel.H
        });
        document.getElementById("address").innerHTML = "<span>" + cashaddress + "</span>";
        document.getElementById("format").innerHTML = "<span>" + "LEGACY FORMAT" + "</span>";
        cash = true;
    }
}

function clickFunctionVolver(e) {
    document.getElementById("qr").innerHTML = null;

    $('#spanoferta').css({
        'color': ''
    });
    $('#qr').css({
        'display': ''
    });
    $('#exit').css({
        'display': ''
    });
    $('table.mesa').css({
        'display': ''
    });
    $('.alert1').css({
        'display': ''
    });

    $('#cortina').removeClass('deployed');
    $('#cortina').addClass('undeployed');

    $('#button').removeClass();
    $('#button').addClass('off');
    mode = false;
    document.getElementById("address").innerHTML = "<span>" + "BET!" + "</span>";
    $('td.selected').removeClass('selected');
    numbers = [];
    $.fn.myFunction();
    fillticket();
}

function clickFunctionBet(e) {
    if (mode == false) {
        if (numbers.length > 0) {
            var request = numbers.join('');
            socket.emit("getaddress", request);
            clickFunctionWelcome4();
        }
    }
}

socket.on("new", function(data) {
    cashaddress = data;
    var toLegacyAddress = bchaddr.toLegacyAddress;
    legacyaddress = toLegacyAddress(cashaddress);

    var qrcode = new QRCode("qr", {
        text: cashaddress,
        width: 617,
        height: 460,
        colorDark: color9,
        colorLight: "rgba(0,0,0,0)",
        correctLevel: QRCode.CorrectLevel.H
    });

    $('#button').removeClass();
    $('#button').addClass('on');

    $('#qr').css({
        'display': 'block'
    });
    $('#exit').css({
        'display': 'block'
    });
    $('#legacy').css({
        'display': 'block'
    });
    $('#copy').css({
        'display': 'block'
    });
    $('table.mesa').css({
        'display': 'none'
    });
    $('.alert1').css({
        'display': 'block'
    });
    $('.alerta0').css({
        'display': ''
    });
    $('.alerta8').css({
        'display': ''
    });


    if (deplo == false) {
        $('#cortina').removeClass('undeployed');
        $('#cortina').addClass('deployed');
    }

    document.getElementById("address").innerHTML = "<span>" + cashaddress + "</span>";
    document.getElementById("format").innerHTML = "<span>" + "LEGACY FORMAT" + "</span>";
    cash = true;
    mode = true;
});

function clickFunctionLin1(e) {
    if (touch == false) {
        var numItems = $('.selected').length;
        var linea = $('.lin1.selected').length;

        if (linea == 3) {
            if ($('td.lin1').hasClass('selected')) {
                // the deselected class preserves the expected cell styling,
                // but also clearly shows when a cell has been deselected
                $('td.lin1').removeClass('selected');

                // add a listener to the deselected element
                $('th.lin1').mouseout(function() {
                    $('th.lin1').removeClass('deselected').off('mouseout');
                })
                return;
            }
            lastSelectedIndex = thisIndex;
            $.fn.myFunction();
        }
        if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
            $('td.lin1').addClass('selected').off('mouseout');
        }
    }
}

function clickFunctionLin2(e) {
    if (touch == false) {
        var numItems = $('.selected').length;
        var linea = $('.lin2.selected').length;

        if (linea == 3) {
            if ($('td.lin2').hasClass('selected')) {
                // the deselected class preserves the expected cell styling,
                // but also clearly shows when a cell has been deselected
                $('td.lin2').removeClass('selected');

                // add a listener to the deselected element
                $('th.lin2').mouseout(function() {
                    $('th.lin2').removeClass('deselected').off('mouseout');
                })
                return;
            }
            lastSelectedIndex = thisIndex;
            $.fn.myFunction();
        }
        if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
            $('td.lin2').addClass('selected').off('mouseout');
        }
    }
}

function clickFunctionLin3(e) {
    if (touch == false) {
        var numItems = $('.selected').length;
        var linea = $('.lin3.selected').length;

        if (linea == 3) {
            if ($('td.lin3').hasClass('selected')) {
                // the deselected class preserves the expected cell styling,
                // but also clearly shows when a cell has been deselected
                $('td.lin3').removeClass('selected');

                // add a listener to the deselected element
                $('th.lin3').mouseout(function() {
                    $('th.lin3').removeClass('deselected').off('mouseout');
                })
                return;
            }
            lastSelectedIndex = thisIndex;
            $.fn.myFunction();
        }
        if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
            $('td.lin3').addClass('selected').off('mouseout');
        }
    }
}

function clickFunctionLin4(e) {
    if (touch == false) {
        var numItems = $('.selected').length;
        var linea = $('.lin4.selected').length;

        if (linea == 3) {
            if ($('td.lin4').hasClass('selected')) {
                // the deselected class preserves the expected cell styling,
                // but also clearly shows when a cell has been deselected
                $('td.lin4').removeClass('selected');

                // add a listener to the deselected element
                $('th.lin4').mouseout(function() {
                    $('th.lin4').removeClass('deselected').off('mouseout');
                })
                return;
            }
            lastSelectedIndex = thisIndex;
            $.fn.myFunction();
        }
        if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
            $('td.lin4').addClass('selected').off('mouseout');
        }
    }
}

function clickFunctionLin5(e) {
    if (touch == false) {
        var numItems = $('.selected').length;
        var linea = $('.lin5.selected').length;

        if (linea == 3) {
            if ($('td.lin5').hasClass('selected')) {
                // the deselected class preserves the expected cell styling,
                // but also clearly shows when a cell has been deselected
                $('td.lin5').removeClass('selected');

                // add a listener to the deselected element
                $('th.lin5').mouseout(function() {
                    $('th.lin5').removeClass('deselected').off('mouseout');
                })
                return;
            }
            lastSelectedIndex = thisIndex;
            $.fn.myFunction();
        }
        if (((linea == 2) && (numItems <= 7)) || ((linea == 1) && (numItems <= 6)) || (linea == 0) && (numItems <= 5)) {
            $('td.lin5').addClass('selected').off('mouseout');
        }
    }
}

function clickFunctionCol1(e) {
    if (touch == false) {
        var numItems = $('.selected').length;
        var col = $('.col1.selected').length;

        if (col == 5) {
            if ($('td.col1').hasClass('selected')) {
                // the deselected class preserves the expected cell styling,
                // but also clearly shows when a cell has been deselected
                $('td.col1').removeClass('selected');

                // add a listener to the deselected element
                $('th.col1').mouseout(function() {
                    $('th.col1').removeClass('deselected').off('mouseout');
                })
                return;
            }
            lastSelectedIndex = thisIndex;
            $.fn.myFunction();
        }
        if (((col == 4) && (numItems <= 7)) || ((col == 3) && (numItems <= 6)) || ((col == 2) && (numItems <= 5)) || ((col == 1) && (numItems <= 4)) || ((col == 0) && (numItems <= 3))) {
            $('td.col1').addClass('selected').off('mouseout');
        }
    }
}

function clickFunctionCol2(e) {
    if (touch == false) {
        var numItems = $('.selected').length;
        var col = $('.col2.selected').length;

        if (col == 5) {
            if ($('td.col2').hasClass('selected')) {
                // the deselected class preserves the expected cell styling,
                // but also clearly shows when a cell has been deselected
                $('td.col2').removeClass('selected');

                // add a listener to the deselected element
                $('th.col2').mouseout(function() {
                    $('th.col2').removeClass('deselected').off('mouseout');
                })
                return;
            }
            lastSelectedIndex = thisIndex;
            $.fn.myFunction();
        }
        if (((col == 4) && (numItems <= 7)) || ((col == 3) && (numItems <= 6)) || ((col == 2) && (numItems <= 5)) || ((col == 1) && (numItems <= 4)) || ((col == 0) && (numItems <= 3))) {
            $('td.col2').addClass('selected').off('mouseout');
        }
    }
}

function clickFunctionCol3(e) {
    if (touch == false) {
        var numItems = $('.selected').length;
        var col = $('.col3.selected').length;

        if (col == 5) {
            if ($('td.col3').hasClass('selected')) {
                // the deselected class preserves the expected cell styling,
                // but also clearly shows when a cell has been deselected
                $('td.col3').removeClass('selected');

                // add a listener to the deselected element
                $('th.col3').mouseout(function() {
                    $('th.col3').removeClass('deselected').off('mouseout');
                })
                return;
            }
            lastSelectedIndex = thisIndex;
            $.fn.myFunction();
        }
        if (((col == 4) && (numItems <= 7)) || ((col == 3) && (numItems <= 6)) || ((col == 2) && (numItems <= 5)) || ((col == 1) && (numItems <= 4)) || ((col == 0) && (numItems <= 3))) {
            $('td.col3').addClass('selected').off('mouseout');
        }
    }
}

function clickFunctionColor(e) {
    if (touch == false) {
        var numItems = $('.selected').length;
        var color = $('.color1.selected').length;

        if (color == 7) {
            if ($('td.color1').hasClass('selected')) {
                // the deselected class preserves the expected cell styling,
                // but also clearly shows when a cell has been deselected
                $('td.color1').removeClass('selected');

                // add a listener to the deselected element
                $('th.color1').mouseout(function() {
                    $('th.color1').removeClass('deselected').off('mouseout');
                })
                return;
            }
            lastSelectedIndex = thisIndex;
            $.fn.myFunction();
        }
        if (((color == 6) && (numItems <= 7)) || ((color == 5) && (numItems <= 6)) || ((color == 4) && (numItems <= 5)) || ((color == 3) && (numItems <= 4)) || ((color == 2) && (numItems <= 3)) || ((color == 1) && (numItems <= 2)) || ((color == 0) && (numItems <= 1))) {
            $('td.color1').addClass('selected').off('mouseout');
        }
    }
}

function clickFunctionColor1(e) {
    if (touch == false) {
        var numItems = $('.selected').length;
        var color = $('.color2.selected').length;


        if (color == 7) {
            if ($('td.color2').hasClass('selected')) {
                // the deselected class preserves the expected cell styling,
                // but also clearly shows when a cell has been deselected
                $('td.color2').removeClass('selected');

                // add a listener to the deselected element
                $('th.color2').mouseout(function() {
                    $('th.color2').removeClass('deselected').off('mouseout');
                })
                return;
            }
            lastSelectedIndex = thisIndex;
            $.fn.myFunction();
        }
        if (((color == 6) && (numItems <= 7)) || ((color == 5) && (numItems <= 6)) || ((color == 4) && (numItems <= 5)) || ((color == 3) && (numItems <= 4)) || ((color == 2) && (numItems <= 3)) || ((color == 1) && (numItems <= 2)) || ((color == 0) && (numItems <= 1))) {
            $('td.color2').addClass('selected').off('mouseout');
        }
    }
}

function clickFunctionRan(e) {
    $('.selected').removeClass('selected');

    numbers = [];
    fillticket();
    $.fn.myFunction();

    var math = Math.floor((Math.random() * 8)) + 1;

    var flot = getRandom(todos, math);
    numbers = flot;
    marcar();
    $.fn.myFunction();
    fillticket();

}

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result.sort();
}

function marcar() {
    if ($.inArray(0, numbers) != -1) {
        $('td.cero').addClass('selected');
    }
    if ($.inArray(1, numbers) != -1) {
        $('td.uno').addClass('selected');
    }
    if ($.inArray(2, numbers) != -1) {
        $('td.dos').addClass('selected');
    }
    if ($.inArray(3, numbers) != -1) {
        $('td.tres').addClass('selected');
    }
    if ($.inArray(4, numbers) != -1) {
        $('td.cuatro').addClass('selected');
    }
    if ($.inArray(5, numbers) != -1) {
        $('td.cinco').addClass('selected');
    }
    if ($.inArray(6, numbers) != -1) {
        $('td.seis').addClass('selected');
    }
    if ($.inArray(7, numbers) != -1) {
        $('td.siete').addClass('selected');
    }
    if ($.inArray(8, numbers) != -1) {
        $('td.ocho').addClass('selected');
    }
    if ($.inArray(9, numbers) != -1) {
        $('td.nueve').addClass('selected');
    }
    if ($.inArray('a', numbers) != -1) {
        $('td.a').addClass('selected');
    }
    if ($.inArray('b', numbers) != -1) {
        $('td.b').addClass('selected');
    }
    if ($.inArray('c', numbers) != -1) {
        $('td.c').addClass('selected');
    }
    if ($.inArray('d', numbers) != -1) {
        $('td.d').addClass('selected');
    }
    if ($.inArray('e', numbers) != -1) {
        $('td.e').addClass('selected');
    }
    if ($.inArray('f', numbers) != -1) {
        $('td.f').addClass('selected');
    }
}

function sel() {
    if ((numbers.length > 0) && ($('.selected').length > 0)) {
        $('.sel').css({
            'animation': 'none'
        })
        $('#button').removeClass();
        $('#button').addClass('ready');
    } else {
        $('.sel').css({
            'animation': ''
        })
        $('#button').removeClass();
        $('#button').addClass('off');
    }
}

function clickFunctionWelcome(e) {
    $('.welcome1').hide();
    $('.welcome2').show();
    $('.flecha').css({
        'display': 'none'
    })
    $('.flecha1').css({
        'display': 'block'
    })
}

function clickFunctionWelcome1(e) {
    $('.welcome2').hide();
    $('.welcome3').show();
    $('.flecha1').css({
        'display': 'none'
    })
    $('.flecha2').css({
        'display': 'block'
    })
}

function clickFunctionWelcome2(e) {
    $('.welcome3').hide();
    $('.welcome4').show();
    $('.flecha2').css({
        'display': 'none'
    })
    $('.flecha3').css({
        'display': 'block'
    })
}

function clickFunctionWelcome3(e) {
    $('.welcome4').hide();
    $('.welcome5').show();
    $('.flecha3').css({
        'display': 'none'
    })
    $('.flecha4').css({
        'display': 'block'
    })
}

function clickFunctionWelcome4(e) {
    $('.welcome').css({
        'opacity': '0',
    })
    $('#cortina').removeClass('deployed');
    $('#cortina').addClass('undeployed');
    deplo = false;

    setTimeout(function() {
        $('.welcome').css({
            'display': 'none',
        })
    }, 500);
}

function toHHMMSS(temp) {
    var sec_num = parseInt(temp, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}

function notx() {
    $('.hashtitle').find('p')[0].innerHTML = 'BET NOT FOUND - PLEASE TYPE AGAIN';
    $('.hashdata').find('p')[0].innerHTML = '&nbsp;';
    $('.hashblocktittle').find('p')[0].innerHTML = '&nbsp;';
    $('.hashblocktittle').css({
        'background-color': ''
    })
    $('.blockhashdata').find('p')[0].innerHTML = '&nbsp;';
    $('.blockhashdata').css({
        'background-color': ''
    })
    $('.ticketa').find('p')[0].innerHTML = '&nbsp;';
    $('.ticketa').css({
        'display': 'none'
    })
    $('.numbers').find('p')[0].innerHTML = '&nbsp;';
    $('.numbers').css({
        'display': 'none'
    })
    $('.amount').find('p')[0].innerHTML = '&nbsp;';
    $('.amount').css({
        'display': 'none'
    })
    $('.amountdata').find('p')[0].innerHTML = '&nbsp;';
    $('.amountdata').css({
        'display': 'none'
    })
    $('.prize').find('p')[0].innerHTML = '&nbsp;';
    $('.prize').css({
        'display': 'none'
    })
    $('.prizenumbers').find('p')[0].innerHTML = '&nbsp;';
    $('.prizenumbers').css({
        'display': 'none'
    })
    $('.status').find('p')[0].innerHTML = '&nbsp;';
    $('.status').css({
        'color': '',
        'background-color': 'var(--color16)'
    })
    $('.pago').css({
        'display': 'none'
    })
    $('.transa').css({
        'background-color': '',
        'height': '90'
    })
}


$('.ihash').hover(function() {
    $('.ihash').css({
        'border': '1px solid white'
    })
}, function() {
    $('.ihash').css({
        'border': ''
    })
})

$('.ihash').click(linkhash);

function linkhash() {
    tex = $('.hashdata').find('p')[0].innerHTML
    url = 'https://blockchair.com/bitcoin-cash/transaction/' + tex
    var win = window.open(url, '_blank');
    win.focus();
}



$('.iblock').hover(function() {
    $('.iblock').css({
        'border': '1px solid white'
    })
}, function() {
    $('.iblock').css({
        'border': ''
    })
})

$('.iblock').click(linkblock);

function linkblock() {
    tex = $('.blockhashdata').find('p')[0].innerHTML
    url = 'https://blockchair.com/bitcoin-cash/block/' + tex
    var win = window.open(url, '_blank');
    win.focus();
}

$('.istatus').hover(function() {
    $('.istatus').css({
        'border': '1px solid var(--gris2)'
    })
}, function() {
    $('.istatus').css({
        'border': ''
    })
})

$('.istatus').click(linkpago);

function linkpago() {
    tex = $('.pago').find('p')[0].innerHTML
    url = 'https://blockchair.com/bitcoin-cash/transaction/' + tex
    var win = window.open(url, '_blank');
    win.focus();
}


$('.spinner').click(linklast);
$('.spinner1').click(linklast);
$('.spinner2').click(linklast);
$('.lasthash').click(linklast);
$('.hashblockbox ').click(linklast);

function linklast() {
    tex = $('.hashblockbox').html();
    url = 'https://blockchair.com/bitcoin-cash/block/' + tex;
    var win = window.open(url, '_blank');
    win.focus();
}
