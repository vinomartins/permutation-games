$('document').ready(function(){
  game.setup()

// deveria estar dentro do .ready?
  $(".cards-wrapper").click(function () {
    allowed = game.allowedMove($(this))
    if (allowed){
     game.makeMove($(this),allowed);
}});

  $(".cards-wrapper").hover(function(){
    if (game.allowedMove($(this))){
      $(this).addClass("available-card");
    } else{
      $(this).addClass("unavailable-card");
    }
  },function(){
    $(this).removeClass("available-card unavailable-card")
  })

})

let game = {
  solvedPosition: ['01','02','03','04','05','06','07','08',
                    '09','10','11', '12', '13', '14', '15','00'],
  
  currentStatus: this.solvedPosition,

  setup: function(){
    // Inicia o jogo na posição resolvida
    // TODO: permitir posição embaralhada
    this.writePosition(this.solvedPosition)
  },

  startGame: function(){
    // TODO: implementar quando tiver o timer
  },

  writePosition: function (status = this.solvedPosition){
    // mudar no html e no currentStatus
    // tentar deixar toda interação com o css aqui!

    for (let i = 0; i < 16; i++){
      // Indexação do CSS (inicia do 1)
      row = coordFromList(i)[0];
      col = coordFromList(i)[1];

      let gridAreaAttr = row + "/" + col + "/" + (row+1) + "/" + (col+1);
      
      $("#card-"+status[i]).css('grid-area',gridAreaAttr)

    }
    this.currentStatus = status;
  },
  
  readPosition: function(){
    
  },
  allowedMove: function(card){
    id = card.attr('id').slice(-2)
    currentCard = this.currentStatus.indexOf(id);
    emptyCard = this.currentStatus.indexOf('00');
    if ((currentCard == emptyCard + 1 && ![4,8,12].includes(currentCard)) ||
        (currentCard == emptyCard - 1 && ![3,7,11].includes(currentCard)) ||
        (currentCard == emptyCard + 4) || (currentCard == emptyCard - 4)) {
      return true;
    }
  },

  makeMove: function(card,position){
    id = card.attr("id").slice(-2);
    currentCard = this.currentStatus.indexOf(id);
    emptyCard = this.currentStatus.indexOf("00");
    this.currentStatus[emptyCard] = id;
    this.currentStatus[currentCard] = "00";
    this.writePosition(this.currentStatus);
  }
}

function coordFromList(index,size = 4){
  // retorna linha e coluna de acordo com índice
  let colJS = index % size;
  let rowJS = (index - colJS)/size;
  return [rowJS+1,colJS+1];
}

