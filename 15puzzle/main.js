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
      coord = getCoord($(this));
      if (allowedMove(coord.col, coord.row)) {
        $(this).addClass("available-card");
      } else {
        $(this).addClass("unavailable-card");
      }
    },
    function () {
      $(this).removeClass("available-card unavailable-card");
    }
  );

  $(".cards-wrapper").click(newFunctionCLICOU());
  //$(".cards-wrpper").makeMove
});

function newFunctionCLICOU() {
  return function () {
    // define o estado inicial
    defineInitialState();

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
    // Movendo o emptyCard para a posição nova
    emptyCoord = [emptyCoord[0], emptyCoord[1] + 1];
    $("#card-00").css("grid-row-start", rowClickJS + 1);
    j = i - 4;
  } else if (above(colClickJS, rowClickJS)) {
    // Movendo a peça para a posição nova
    card.css("grid-row-start", rowClickJS + 2);

    // Movendo o emptyCard para a posição nova
    emptyCoord = [emptyCoord[0], emptyCoord[1] - 1];
    $("#card-00").css("grid-row-start", rowClickJS + 1);
    j = i + 4;
  } else if (left(colClickJS, rowClickJS)) {
    // Movendo a peça para a posição nova
    card.css("grid-column-start", colClickJS + 2);

    // Movendo o emptyCard para a posição nova
    emptyCoord = [emptyCoord[0] - 1, emptyCoord[1]];
    $("#card-00").css("grid-column-start", colClickJS + 1);
    j = i + 1;
  } else {
    // right(x,y)
    // Movendo a peça para a posição nova
    card.css("grid-column-start", colClickJS);

    // Movendo o emptyCard para a posição nova
    emptyCoord = [emptyCoord[0] + 1, emptyCoord[1]];
    $("#card-00").css("grid-column-start", colClickJS + 1);
    j = i - 1;
  }

  changeGameStatus(i, j);
}

function changeGameStatus(i, j) {
  // console.log("i = " + i + "j = " + j);
  // console.log(inicial);
  inicial[j] = inicial[i];
  inicial[i] = 0;
  // console.log(inicial);
  for (let index = 0; index < 15; index++) {
    if (inicial[index] != index + 1) {
      // console.log('posição do 00: ' + index);
      return;
    }
  }

  endOfGame();
}

function allowedMove(x, y) {
  // console.log("card vazio:" + emptyCoord)
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