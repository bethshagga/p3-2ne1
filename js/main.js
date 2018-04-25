var cards=[];
var playerCard = [ ]; //to see what card the player is holding.
var dealerCard = [ ];
//crate var to keep track of what card you are at in the deck
var cardCount =0;
var mydollars=100;

//below is an array to hold card values and types
	  var suits = ["spades", "hearts", "clubs", "diams"];
    var numb = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
     //save object info using IDs
    var message = document.getElementById("message");
    var output = document.getElementById("output");
    var dealerHolder = document.getElementById("dealerHolder");
    var playerHolder = document.getElementById("playerHolder");
    var pValue = document.getElementById("pValue");//sum of dealers cards
    var dValue = document.getElementById("dValue");//sum of players cards
    var dollarValue = document.getElementById("dollars");//sum of money on diplay
    
    //below we create loops to build deck of cards
    for (s in suits) {
      var suit = suits[s][0].toUpperCase();
      var bgcolor = (suit == "S" || suit == "C") ? "black" : "blue";
      //"s" represent the suites
      for (n in numb) {
       //assign values to the cards so we know how much it is worth as we loop through
       var cardValue = (n>9) ? 10 : parseInt(n)+1
       //build card object to hold values and pass into card array
       var card={
       	suit: suit,
       	icon:suits[s],
       	bgcolor: bgcolor,
       	cardnum: numb[n],
       	cardvalue:cardValue
       }
       //pushing the value of card to the card array.
       cards.push(card);
       //console.log(cards);
      }
    }

//create a function that will sratr the game.
function start(){

 shuffleDeck(cards); //shuffles the card to make sure the same one doesn't show up twice
 newDeal(); //starting a new game
 document.getElementById('start').style.display = 'none';
 document.getElementById('dollars').innerHTML = mydollars;

}
function newDeal(){
	//below are functions to clare out the players hand everytime the game starts over.
	    playerCard = []; 
	    dealerCard =[];
	    dealerHolder.innerHTML = "";
	    playerHolder.innerHTML = "";
  //create a var to hold the betting value.
      var betvalue = document.getElementById('mybet').value; 
  //takes the current ammount of money you have and decrase it by the amount you bet.
       mydollars=mydollars-betvalue;
       document.getElementById('dollars').innerHTML = mydollars;
       document.getElementById('myactions').style.display = 'block';
       message.innerHTML = "Get up to 2NE1 and beat the dealer to win.<br>Current bet is $"+betvalue;
       document.getElementById('mybet').disabled = true;
       document.getElementById('maxbet').disabled = true;
          deal();
}

  function deal(){     
	//crate loop for dealing out the cards
	for(x=0; x<2; x++){
		dealerCard.push(cards[cardCount]);
		dealerHolder.innerHTML +=  cardOutput(cardCount, x);
    //create a loop that checks to see if the dealer has been delt his first card, then hide the card from the player.
		if(x==0){
			    dealerHolder.innerHTML += '<div id="cover" style="left:100px;"></div>';
		}
		cardCount++ //increment the card to avoid repeted numbers.
		playerCard.push(cards[cardCount]);
		playerHolder.innerHTML += cardOutput(cardCount, x);
		cardCount++;

	}
//console.log(playerCard); test out playerHolder.
    pValue.innerHTML = checktotal(playerCard); //check the total value of cards 
           //console.log(dealerCard);
          // console.log(playerCard);
  }


//adding in card value to get generated. the function below will return the generated value.
function cardOutput(n,x){

        var hpos = (x > 0) ? x * 60 + 100 : 100;
        //displays the cards using the css
        return '<div class="icard ' + cards[n].icon + '" style="left:' + hpos + 'px;">  <div class="top-card suit">' + cards[n].cardnum + '<br></div>  <div class="content-card suit"></div>  <div class="bottom-card suit">' + cards[n].cardnum +
          '<br></div> </div>';

}
//below we will create a swich stament for whenthe player wants to hold or hit. a swich statment basiclly checks if the conditions have been met then exicute the code, it's similar to a nest if statment.
 function cardAction(a){
          //console.log(a);
          switch (a){
            case 'hit':
              playucard(); // add new card to players hand
              break;
            case 'hold':
              playend(); // playout and calculate
              break;
            default:
              console.log('done');
              playend(); // playout and calculate
          }
  }
//create a function to check if the player value is above 21 and outprint the message "busted".
  function playucard(){
          playerCard.push(cards[cardCount]);
          playerHolder.innerHTML += cardOutput(cardCount, (playerCard.length -1)); //we're subtracting from one bacuse it starts at zero and we want to make sure it doesn't add to 53
          cardCount++;
          var rValu = checktotal(playerCard);
          pValue.innerHTML = rValu;
          //create an if statment that will end the game if the value is over 21.
          if(rValu>21){
            message.innerHTML = "busted!";
            playend();
          }
  }
//create a function that will end the game if the player goes over 21.
        function playend(){
          endplay = true; 
          document.getElementById('cover').style.display = 'none'; //removes cover from dealers card
          document.getElementById('myactions').style.display = 'none'; //this gets rid of the buttons so the player cannot continue playing
          document.getElementById('btndeal').style.display = 'block';
          document.getElementById('mybet').disabled = false;
          document.getElementById('maxbet').disabled = false;
          message.innerHTML = "Game Over";
          var payoutJack = 1;
          //create a var that will check and display the dealer value at the end i
          var dealervalue =  checktotal(dealerCard);
          dValue.innerHTML = dealervalue;
//the dealer will hold while his total is less then 17
          while(dealervalue<17){
            dealerCard.push(cards[cardCount]);
            dealerHolder.innerHTML += cardOutput(cardCount, (dealerCard.length -1));
            cardCount++;
            dealervalue =  checktotal(dealerCard);
            dValue.innerHTML = dealervalue;
          }

          //WHo won???
          var playervalue =  checktotal(playerCard);
          if(playervalue == 21 && playerCard.length == 2){
            message.innerHTML = "Player Blackjack";
             payoutJack = 1.5;
          }

          var betvalue = parseInt(document.getElementById('mybet').value)*payoutJack;

          if((playervalue < 22 && dealervalue < playervalue) || (dealervalue > 21 && playervalue < 22 )){
            message.innerHTML += '<span style="color:green;">You WIN! You won $'+betvalue+'</span>';
            mydollars = mydollars + (betvalue *2);
          }
          else if (playervalue > 21){
            message.innerHTML += '<span style="color:red;">Dealer Wins! You lost $'+betvalue+'</span>';
          }
          else if (playervalue == dealervalue) {
            message.innerHTML += '<span style="color:red;">Dealer Wins! You lost $'+betvalue+'</span>';
          }
          else {
            message.innerHTML += '<span style="color:red;">Dealer Wins! You lost $'+betvalue+'</span>';
          }

          pValue.innerHTML = dealervalue;
          dollarValue.innerHTML = mydollars;
        }
 function checktotal(arr){
    var rValue = 0;
    var aceAdjust = false;
    for(var i in arr ){
    if(arr[i].cardnum =='A' && !aceAdjust){
              aceAdjust=true;
              rValue=rValue+10;
            }
            rValue=rValue+arr[i].cardvalue;
          }

    if(aceAdjust && rValue >21  ){
            rValue=rValue-10;
          }
     return rValue;
 }
function shuffleDeck(array){
for (var i = array.length -1; i>0; i--){
	var j= Math.floor(Math.random()*(i+1));
	var temp = array[i]; //assign  a random value of i too j
	array[i] = array[j];
	array[j] = temp;
}
return array;
}
function outputCard(){
	output.innerHTML += "<span style='color:" +cards[cardCount].bgcolor+"'>"+cards[cardCount].cardnum + "&"+cards[cardCount].icon + "; </span>  ";
}