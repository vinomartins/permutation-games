pos1 = ['01','02','00','03','05','06','07','04','09','10','11', '08', '13', '14', '15','12']
pos2 = ['01','02','03','04','05','06','07','08','09','10','11', '12', '13', '15', '14','00']

endOfGameBoxClass = ".popupsubmit"; // mudar o nome no index
closeButtonClass = ".close-button";// mudar o nome no index

$('document').ready(function(){  
  game.setup() 
  game.play();
  checkHover();
  listeners();
})

let game = {
  solvedPosition: ['01','02','03','04','05','06','07','08',
                    '09','10','11', '12', '13', '14', '15','00'],
  
  currentStatus: undefined,
  running: undefined,

  setup (position = this.solvedPosition){
    // Inicia o jogo na posição resolvida
    // TODO: permitir posição embaralhada
    this.running = true;
    this.writePosition(position);
    this.currentStatus = position.slice();
    this.restartTimer();
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
      console.log('Conseguiu!');
      $(endOfGameBoxClass).removeClass("hide");
      this.running = false;
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

function coordFromList(index,size = 4){
  // retorna linha e coluna de acordo com índice
  let colJS = index % size;
  let rowJS = (index - colJS)/size;
  // +1 para ficar com o índice do CSS
  return [rowJS+1,colJS+1];
}

function checkHover(){
  $(".cards-wrapper").hover(function () { // mouse on
      id = $(this).attr("id").slice(-2);
      if (id == "00") return;
      else if (game.allowedMove($(this))) {
        $(this).addClass("available-card");
      } else {
        $(this).addClass("unavailable-card");
      }
    }, function () { // mouse off
      $(this).removeClass("available-card unavailable-card");
    }
  );
}

function listeners(){
  // Fechar o popup-submit após clicar no X
  $(closeButtonClass).click(function(){
    $(endOfGameBoxClass).addClass("hide");
  });

}