pos1 = ['01','02','00','03','05','06','07','04','09','10','11', '08', '13', '14', '15','12']
pos2 = ['01','02','03','04','05','06','07','08','09','10','11', '12', '13', '15', '14','00']

const endOfGameBoxClass = ".popupsubmit"; // mudar o nome no index
const closeButtonClass = "#submitbuttontest";// mudar o nome no index
const timerClass = ".timer-text";
const submitPopUpTime = ".totaltime";
const formNameInput = "#namefield";
const formSlugInput = "#slugfield";
const formTimeInput = "#timefield";

let start = undefined;

$('document').ready(function(){  
  game.setup() 
  game.play();
  listeners(); // encapsular os listeners aqui?
})

let game = {
  solvedPosition: ['01','02','03','04','05','06','07','08',
                    '09','10','11', '12', '13', '14', '15','00'],
  
  currentStatus: undefined,
  running: undefined,
  prettyTime: undefined,

  setup (position = this.solvedPosition){
    // Inicia o jogo na posição resolvida
    // TODO: permitir posição embaralhada
    this.running = true;
    this.writePosition(position);
    this.currentStatus = position.slice();
    start = new Date();

  },

  startGame (){
    // TODO: implementar quando tiver o timer OU colocar no setup
  },

  writePosition (status = this.solvedPosition){
    /* Recebe o array de posição e 
    muda na pagina via o grid-area do css.  
    */

    for (let i = 0; i < 16; i++){
      // Indexação do CSS (inicia do 1)
      row = coordFromList(i)[0];
      col = coordFromList(i)[1];

      let gridAreaAttr = row + "/" + col + "/" + (row+1) + "/" + (col+1);
      
      $("#card-"+status[i]).css('grid-area',gridAreaAttr)

    };
    // this.currentStatus = status.slice(); // .slice() usado para clonar o array
    
  },
  
  
  allowedMove (card){
    id = card.attr('id').slice(-2)
    currentCard = this.currentStatus.indexOf(id);
    emptyCard = this.currentStatus.indexOf('00');
    if ((currentCard == emptyCard + 1 && ![4,8,12].includes(currentCard)) ||
        (currentCard == emptyCard - 1 && ![3,7,11].includes(currentCard)) ||
        (currentCard == emptyCard + 4) || (currentCard == emptyCard - 4)) {
      return true;
    }
  },

  makeMove (card){
    id = card.attr("id").slice(-2);
    currentCard = this.currentStatus.indexOf(id);
    emptyCard = this.currentStatus.indexOf("00");
    this.currentStatus[emptyCard] = id;
    this.currentStatus[currentCard] = "00";
    this.writePosition(this.currentStatus);
  },

  solved (){
    if (JSON.stringify(game.currentStatus) === JSON.stringify(game.solvedPosition)){
      this.running = false;
      clearInterval(this.interval);
      this.solvingTime = Math.floor((new Date() - start) / 1000);

      // Adiciona o tempo no popup submit
      // talvez o texto inteiro
      $(submitPopUpTime).text(game.prettyTime);
      $(endOfGameBoxClass).removeClass("hide");
 
    }
  },

  restartTimer (){
  },

  play (){
    $(".cards-wrapper").click(function () {
      allowed = game.allowedMove($(this));
      if (allowed) {
        game.makeMove($(this));
        game.solved();
      }
    });
  }
}

function formSubmit(){
  nome = $(formNameInput).val();
  user = {
    userName: nome,
    userSlug: nome.replaceAll(/\s+/gi, "-"),
    userTime: game.solvingTime,
  }
  $.ajax({
    url: "https://hook.us1.make.com/smwd9u54bvr4j2xq9fip7lfsr4rcb4du",
    type: "POST",
    data: JSON.stringify(user),
    contentType: "application/json",
    complete: function() {console.log("requisição enviada")},
  });
  
}

function coordFromList(index,size = 4){
  // retorna linha e coluna de acordo com índice
  let colJS = index % size;
  let rowJS = (index - colJS)/size;
  // +1 para ficar com o índice do CWave Function CollapseSS
  return [rowJS+1,colJS+1];
}



function listeners(){
  // Fechar o popup-submit após clicar no X
  $(closeButtonClass).click(function () {
    if ($(namefield).val()) {
      formSubmit();
    }
    $(endOfGameBoxClass).addClass("hide");
  });

  // hover dos cards
  $(".cards-wrapper").hover(
    function () {
      // mouse on
      id = $(this).attr("id").slice(-2);
      if (id == "00") return;
      else if (game.allowedMove($(this))) {
        $(this).addClass("available-card");
      } else {
        $(this).addClass("unavailable-card");
      }
    },
    function () {
      // mouse off
      $(this).removeClass("available-card unavailable-card");
    }
  );

  // atualiza o timer 
  game.interval = setInterval(function () {
    segundos = Math.round((new Date() - start) / 1000);
    gamingTime = new Date(0,0,0,0,0,segundos);
    options = {minute:"2-digit", second:"2-digit"}
    game.prettyTime = gamingTime.toLocaleDateString("en-US", options).slice(-5);
    $(timerClass).text(game.prettyTime);
  },1000);   
}