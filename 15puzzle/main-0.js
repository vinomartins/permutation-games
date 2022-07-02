pos1 = ['01','02','00','03','05','06','07','04','09','10','11', '08', '13', '14', '15','12']
pos2 = ['01','02','03','04','05','06','07','08','09','10','11', '12', '13', '15', '14','00']

endOfGameBoxClass = ".popupsubmit"; // mudar o nome no index


$('document').ready(function(){  
  game.setup() // inicia na posição de resolvido

// deveria estar dentro do .ready?
  $(".cards-wrapper").click(function () {
    allowed = game.allowedMove($(this))
    if (allowed){
      game.makeMove($(this),allowed);
      game.solved()
    }
  });

  $(".cards-wrapper").hover(function(){
    id = $(this).attr("id").slice(-2);
    if (id == '00')
      return;
    else if (game.allowedMove($(this))){
      $(this).addClass("available-card");
    } else {
      $(this).addClass("unavailable-card");
    }
  },function(){
    $(this).removeClass("available-card unavailable-card")
  })

})

let game = {
  solvedPosition: ['01','02','03','04','05','06','07','08',
                    '09','10','11', '12', '13', '14', '15','00'],
  
  currentStatus: undefined, //this.solvedPosition,

  setup (position = this.solvedPosition){
    // Inicia o jogo na posição resolvida
    // TODO: permitir posição embaralhada
    this.writePosition(position, true)
    this.restartTimer();
  },

  startGame (){
    // TODO: implementar quando tiver o timer OU colocar no setup
  },

  writePosition (status = this.solvedPosition){
    /* Recebe 
    */

    for (let i = 0; i < 16; i++){
      // Indexação do CSS (inicia do 1)
      row = coordFromList(i)[0];
      col = coordFromList(i)[1];

      let gridAreaAttr = row + "/" + col + "/" + (row+1) + "/" + (col+1);
      
      $("#card-"+status[i]).css('grid-area',gridAreaAttr)

    }
    this.currentStatus = status.slice(); // .slice() usado para clonar o array
    
  },
  
  readPosition (){
    
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

  makeMove (card,position){
    id = card.attr("id").slice(-2);
    currentCard = this.currentStatus.indexOf(id);
    emptyCard = this.currentStatus.indexOf("00");
    this.currentStatus[emptyCard] = id;
    this.currentStatus[currentCard] = "00";
    this.writePosition(this.currentStatus);
  },

  solved (){
    if (JSON.stringify(game.currentStatus) === JSON.stringify(game.solvedPosition)){
      console.log('Conseguiu!')
    
    $(endOfGameBoxClass).removeClass("hide")
    }
  },

  restartTimer: function(){

  }
}

function coordFromList(index,size = 4){
  // retorna linha e coluna de acordo com índice
  let colJS = index % size;
  let rowJS = (index - colJS)/size;
  // +1 para ficar com o índice do CSS
  return [rowJS+1,colJS+1];
}