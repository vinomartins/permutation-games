/*
Ideias:
  - implementar um timer para solução
  - implementar posição inicial embaralhada
  - Ranking
    - enviar nome/tempo via javascript para webhook
    - Make: webhook -> airtable -> webflow
  - Criar um botão para embaralhar ou campo para inserir
    condições iniciais específicas, pode ser feito por
    códigos (guardamos as condições iniciais em um JSON)
*/

// Condições iniciais do jogo
emptyCoord = [3, 3]; // [coluna,linha]
initialStatus = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0],
];
gameStatus = initialStatus;

inicial = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

$(document).ready(function () {
  // muda a classe dependendo do card ao hover
  // estar disponível para se mover ou não
  $(".cards-wrapper").hover(
    function () {
      let coord = getCoord($(this));
      console.log($(this).attr("id"));
      if (allowedMove(coord.col, coord.row)) {
        $(this).addClass("available-card");
      } else if ($(this).attr("id") != "card-00") {
        $(this).addClass("unavailable-card");
      }
    },
    function () {
      $(this).removeClass("available-card unavailable-card");
    }
  );
  
  $(".divlink").click(function (){
    // TODO: Inicia novo jogo com posição aleatória
    console.log("Inicia novo jogo com posição aleatória");
  })

  $(".cards-wrapper").click(newFunctionCLICOU());
});


function newFunctionCLICOU() {
  return function () {
    // define o estado inicial
    if (allowedMove(colClickJS, rowClickJS)) {
      makeMove(colClickJS, rowClickJS, $(this));
    } else console.log("Impossível mover essa peça");
  };
}

function makeMove(colClickJS, rowClickJS, card) {
  i = rowClickJS * 4 + colClickJS;

  if (under(colClickJS, rowClickJS)) {
    // Move o card para a linha acima (rowClickJS - 1).
    // No grid CSS a indexação começa do 1,
    // Assim, o índice final (no CSS) vai ser
    // (rowClickJS - 1) + 1 = rowClickJS
    card.css("grid-row-start", rowClickJS);
    card.css("grid-row-end", rowClickJS);
    // Movendo o emptyCard para a posição nova
    emptyCoord = [emptyCoord[0], emptyCoord[1] + 1];
    $("#card-00").css("grid-row-start", rowClickJS + 1);
    $("#card-00").css("grid-row-end", rowClickJS + 1);
    j = i - 4;
  } else if (above(colClickJS, rowClickJS)) {
    // Movendo a peça para a posição nova
    card.css("grid-row-start", rowClickJS + 2);
    card.css("grid-row-end", rowClickJS + 2);

    // Movendo o emptyCard para a posição nova
    emptyCoord = [emptyCoord[0], emptyCoord[1] - 1];
    $("#card-00").css("grid-row-start", rowClickJS + 1);
    $("#card-00").css("grid-row-end", rowClickJS + 1);

    j = i + 4;
  } else if (left(colClickJS, rowClickJS)) {
    // Movendo a peça para a posição nova
    card.css("grid-column-start", colClickJS + 2);
    card.css("grid-column-end", colClickJS + 2);

    // Movendo o emptyCard para a posição nova
    emptyCoord = [emptyCoord[0] - 1, emptyCoord[1]];
    $("#card-00").css("grid-column-start", colClickJS + 1);
    $("#card-00").css("grid-column-end", colClickJS + 1);

    j = i + 1;
  } else {
    // right(x,y)
    // Movendo a peça para a posição nova
    card.css("grid-column-start", colClickJS);
    card.css("grid-column-end", colClickJS);

    // Movendo o emptyCard para a posição nova
    emptyCoord = [emptyCoord[0] + 1, emptyCoord[1]];
    $("#card-00").css("grid-column-start", colClickJS + 1);
    $("#card-00").css("grid-column-end", colClickJS + 1);
    j = i - 1;
  }

  changeGameStatus(i, j);
}

function changeGameStatus(i, j) {
  // verifica se o puzzle foi resolvido
  // (essa funçao devia ter outro nome)
  inicial[j] = inicial[i];
  inicial[i] = 0;
  for (let index = 0; index < 15; index++) {
    if (inicial[index] != index + 1) {
      return;
    }
  }
  endOfGame();
}

function allowedMove(x, y) {
  return under(x, y) || above(x, y) || left(x, y) || right(x, y);
}

function under(x, y) {
  return x == emptyCoord[0] && y == emptyCoord[1] + 1;
}

function above(x, y) {
  return x == emptyCoord[0] && y == emptyCoord[1] - 1;
}

function left(x, y) {
  return x == emptyCoord[0] - 1 && y == emptyCoord[1];
}

function right(x, y) {
  return x == emptyCoord[0] + 1 && y == emptyCoord[1];
}

function getCoord(card) {
  colClickJS = card.css("grid-column-start") - 1; // x
  rowClickJS = card.css("grid-row-start") - 1; // y
  return { col: colClickJS, row: rowClickJS };
}

function endOfGame() {
  console.log("Vc conseguiu");
}

function defineInitialState(state){

}