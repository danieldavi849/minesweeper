const blockGrid = document.querySelector("[data-block-grid]");
const blockTemplate = document.querySelector("[data-block-template]");
//select refresh button by id 
const refresh =  document.getElementById("btn-restart");
const topsection = document.getElementById("topsection");
const loserContain = document.getElementById("loserContain");
refresh.addEventListener("click", function(){
  location.reload();
});

// blocksY contains an array of 'mapSize' blocksX
var blocksY = [];
// The size of the map (number of rows and columns)
const mapSize = 16;
// The number of mines on the map
const numMines = 40;
// the max number of flags
const flagCap = numMines;
//contains the counts of the mine neighbors for each block
var MineNeighborsY = [];
loser=false;


//initialize the negiher counter array 
for(let i = 0; i < mapSize; i++){
  var MineNeighborsX = Array.from({length: mapSize}).fill(0);
  MineNeighborsY.push(MineNeighborsX);
}
// Create the 16x16 grid of squares
for (let i = 0; i < mapSize; i++) {
  // blocksX contains an array of 16 blocks
  var blocksX = [];
  for (let j = 0; j < mapSize; j++) {
    // Create a block and add it to the blocksX array
    const block = blockTemplate.content.cloneNode(true).children[0];
    // Set the color of the block based on its position in the grid
    if ((i % 2 === 0 && j % 2 === 0) || (i % 2 !== 0 && j % 2 !== 0)) {
        block.classList.add("light");
    } else if((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0)){
         block.classList.add("dark");
    }
    blocksX.push(block);
    // Add the block to the block grid
    blockGrid.append(block);
  }
  // Add the array of blocksX to the blocksY array
  blocksY.push(blocksX);
}



// Generate a random number between 0 and the map size
function randomNumber(size) {
    return Math.floor(Math.random() * size);
  }

function createMine() {
    // Generate a random x and y coordinate on the map
    const x = randomNumber(mapSize);
    const y = randomNumber(mapSize);
  
    // Check if a mine already exists at this location
    if (blocksY[y][x].classList.contains("mine")) {
      // If a mine already exists, generate a new random location and try again
      createMine();
      
    } else {
      // Clone the mine template and add it to the map
      blocksY[y][x].classList.add("mine");
    }
  }  
  // Create the specified number of mines on the map
  mapGenerated = false;
  function astablishMines(){

  for (let i = 0; i < numMines; i++) {
    createMine();
  }
 
  }
// Add a click event listener to each block in the grid
blocksY.forEach((blocksX) => {
  blocksX.forEach((block) => {
    block.addEventListener("click", (event) => {  
      // intializing the game map
      if (mapGenerated===false){
        astablishMines()
           // Check if the clicked block contains a mine
        while(event.target.classList.contains("mine")){
  
          blocksY.forEach((blocksX) => {  //initalize array
            blocksX.forEach((block) => {
              if (block.classList.contains("mine")) {
              
                block.classList.remove("mine");
                
              }
            });
          });
          astablishMines()
        }
        //count neighbors with mines for each block and push them into mineNeighborsY
        checkNeighbors(blocksY);
        //add class ".clicked.hasNumber" to each block with a neighbor
        printneighbors(MineNeighborsY);
        
        
        //calls for spread island with the index of the element
        if(!event.target.classList.contains("hasNumber") && !event.target.classList.contains("mine") && !event.target.classList.contains("clicked")){
          x=blocksX.indexOf(event.target);
          y=blocksY.indexOf(blocksY.find(element => element === blocksX));
          spreadIsland(event.target,y,x,"up");

    
        }
        //when a block has a number, it will reveal the number
        else if(event.target.classList.contains("hasNumber")&&!event.target.classList.contains("clicked")){
          event.target.classList.add("clicked")
          x=blocksX.indexOf(event.target);
          y=blocksY.indexOf(blocksY.find(element => element === blocksX));
          event.target.innerHTML = MineNeighborsY[y][x];
        }
        mapGenerated = true;
        

      }

      else{
        // when a block is empty, it will spread the island
        if(!event.target.classList.contains("hasNumber")&&!event.target.classList.contains("mine")&&!event.target.classList.contains("clicked")){
          x=blocksX.indexOf(event.target);
          y=blocksY.indexOf(blocksY.find(element => element === blocksX));

          spreadIsland(event.target,y,x,"up");
        }
        //when a block has a number, it will reveal the number
        else if(event.target.classList.contains("hasNumber")&&!event.target.classList.contains("clicked")){
          event.target.classList.add("clicked")
          x=blocksX.indexOf(event.target);
          y=blocksY.indexOf(blocksY.find(element => element === blocksX));
          event.target.innerHTML = MineNeighborsY[y][x];
        }
        //when a block has a mine, it will highlight the mine
        else if(event.target.classList.contains("mine")){
          
          event.target.classList.add("highlighted")
          callLoser()
      

        }
         if( event.target.classList.contains("flag")){
          event.target.classList.remove("flag");
        }
        
      }
    });
  });
});

// Add a right click event listener to each block in the grid
blockGrid.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
blocksY.forEach((blocksX) => {
  blocksX.forEach((block) => {
    block.addEventListener("contextmenu", (event) => {  
      // if the map is generated, the player can flag the blocks
      if (mapGenerated){
        //when a block is flagged, it will remove the flag
        if(event.target.classList.contains("flag")){
          event.target.classList.remove("flag")
        }
        //when a block is not flagged, it will add the flag
        else if(!event.target.classList.contains("clicked")){
          event.target.classList.add("flag")
        }
        //when a block is clicked, it will reveal the blocks around it
        else if (event.target.classList.contains("hasNumber")&&event.target.classList.contains("clicked")){
          x=blocksX.indexOf(event.target);
          y=blocksY.indexOf(blocksY.find(element => element === blocksX));
          revealAroundFlag(y, x);
        }
      }
    });
  });
});

function spreadIsland(element,y,x,direction){
 if(!blocksY[y][x].classList.contains("flag"))
  blocksY[y][x].classList.add("clicked")
  revealNumAround(y,x)
    if(y>0&&blocksY[y-1][x]!=null&&!blocksY[y-1][x].classList.contains("mine")&&!blocksY[y-1][x].classList.contains("clicked")&&!blocksY[y-1][x].classList.contains("hasNumber")){
      spreadIsland(element,y-1,x,"up")
    }
    if(x<mapSize-1&&blocksY[y][x+1]!=null&&!blocksY[y][x+1].classList.contains("mine")&&!blocksY[y][x+1].classList.contains("clicked")&&!blocksY[y][x+1].classList.contains("hasNumber")){
        spreadIsland(element,y,x+1,"right")
    }
    if(y<mapSize-1&&blocksY[y+1][x]!=null&&!blocksY[y+1][x].classList.contains("mine")&&!blocksY[y+1][x].classList.contains("clicked")&&!blocksY[y+1][x].classList.contains("hasNumber")){
    spreadIsland(element,y+1,x,"down")
    }
    if(x>0&&blocksY[y][x-1]!=null&&!blocksY[y][x-1].classList.contains("mine")&&!blocksY[y][x-1].classList.contains("clicked")&&!blocksY[y][x-1].classList.contains("hasNumber")){
          spreadIsland(element,y,x-1,"left")
    }

  
    return
              
}
function revealAroundFlag(y, x) {
  const neighbors = [    // Top row    
  (y > 0 && x > 0) ? blocksY[y - 1][x - 1] : null,
    (y > 0) ? blocksY[y - 1][x] : null,
    (y > 0 && x < blocksY[y].length - 1) ? blocksY[y - 1][x + 1] : null,
    // Middle row
    (x > 0) ? blocksY[y][x - 1] : null,
    (x < blocksY[y].length - 1) ? blocksY[y][x + 1] : null,
    // Bottom row
    (y < blocksY.length - 1 && x > 0) ? blocksY[y + 1][x - 1] : null,
    (y < blocksY.length - 1) ? blocksY[y + 1][x] : null,
    (y < blocksY.length - 1 && x < blocksY[y].length - 1) ? blocksY[y + 1][x + 1] : null,
  ]; 
  const numFlagged = neighbors.filter(n => n !== null && n.classList.contains("flag")).length;
  const neighborsY = [y - 1, y - 1, y - 1, y,y, y + 1, y + 1, y + 1]
  const neighborsX =[x - 1, x, x + 1, x - 1, x + 1, x - 1,x, x + 1];
    
  if (numFlagged === MineNeighborsY[y][x]) {
    for (i=0; i<neighborsY.length; i++){
      currentNeighbor = blocksY[neighborsY[i]][neighborsX[i]]
      console.log("Y= "+neighborsY[i] + "X= " + neighborsX[i]);
      console.log(i)
      console.log(currentNeighbor)
      if (currentNeighbor && !currentNeighbor.classList.contains("clicked") && !currentNeighbor.classList.contains("flag")) {
        // If the neighbor has a number, reveal it
        if (currentNeighbor.classList.contains("hasNumber")) {
          currentNeighbor.innerHTML = MineNeighborsY[neighborsY[i]][neighborsX[i]];
          currentNeighbor.classList.add("clicked");
        }
        // If the neighbor is blank, reveal the neighbors of the neighbor
        else if (!currentNeighbor.classList.contains("hasNumber")&&!currentNeighbor.classList.contains("mine")) {
          spreadIsland(currentNeighbor,neighborsY[i],neighborsX[i],"up")
        }
        //if the neighbor is a mine, the player loses
        else if (currentNeighbor.classList.contains("mine")) {
        
          currentNeighbor.classList.add("highlighted")
          callLoser()
          
        }
      }
    }
}
}

function callLoser(){

  
  if(loser===false){

    loserContain.insertAdjacentHTML('afterbegin', '<p class="h1" id="loser">loser</p>');
    loser=true;
    }
}
function revealNumAround(y, x) {
  // Get the neighboring blocks
  const neighbors = [    // Top row    
  (y > 0 && x > 0) ? blocksY[y - 1][x - 1] : null,
    (y > 0) ? blocksY[y - 1][x] : null,
    (y > 0 && x < blocksY[y].length - 1) ? blocksY[y - 1][x + 1] : null,
    // Middle row
    (x > 0) ? blocksY[y][x - 1] : null,
    (x < blocksY[y].length - 1) ? blocksY[y][x + 1] : null,
    // Bottom row
    (y < blocksY.length - 1 && x > 0) ? blocksY[y + 1][x - 1] : null,
    (y < blocksY.length - 1) ? blocksY[y + 1][x] : null,
    (y < blocksY.length - 1 && x < blocksY[y].length - 1) ? blocksY[y + 1][x + 1] : null,
  ];

  // Create an array of the x and y coordinates for each neighbor
  const neighborsXY = [    y - 1, x - 1,    y - 1, x,    y - 1, x + 1,    y,x - 1 ,    y,x + 1,    y + 1,x - 1 ,     y + 1,x,   y + 1, x + 1  ];
  // Filter the list of neighbors to only include blocks with "hasNumber" class
  const filtered = neighbors.filter(n => n != null && n.classList.contains("hasNumber")&& !n.classList.contains("flag"));

  // For each filtered neighbor, set its inner HTML to the value in MineNeighborsY
  filtered.forEach(n => n.innerHTML = MineNeighborsY[neighborsXY[neighbors.indexOf(n) * 2]][neighborsXY[neighbors.indexOf(n) * 2 + 1]]);
  filtered.forEach(n => n.classList.add("clicked"));
}


function printneighbors(grid){
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if(grid[i][j]>0&&grid[i][j]!=9){
        blocksY[i][j].classList.add("hasNumber");
        //blocksY[i][j].innerHTML = grid[i][j];
        //console.log("i="+i+" j="+j+" "+blocksY[i][j].classList)
      }
      }
    }
   

}



function checkNeighbors(grid) {
  // Loop through the elements in the grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // Check the element's neighbors
      const element = grid[i][j];
      const neighbors = [        // Top row       
       (i > 0 && j > 0) ? grid[i - 1][j - 1] : null,
      (i > 0) ? grid[i - 1][j] : null,
      (i > 0 && j < grid[i].length - 1) ? grid[i - 1][j + 1] : null,
      // Middle row
      (j > 0) ? grid[i][j - 1] : null,
      (j < grid[i].length - 1) ? grid[i][j + 1] : null,
      // Bottom row
      (i < grid.length - 1 && j > 0) ? grid[i + 1][j - 1] : null,
      (i < grid.length - 1) ? grid[i + 1][j] : null,
      (i < grid.length - 1 && j < grid[i].length - 1) ? grid[i + 1][j + 1] : null,
      ];
      // Count the number of "mine" elements in the neighbors array
      const mineCount = neighbors.filter(n => n !== null && n.classList.contains("mine")).length;
      // Do something with the result
  
      if (mineCount > 0) {
        // Assign the mine count to the corresponding element in the MineNeighborsY array
        MineNeighborsY[i][j] = mineCount;
      }
      if (element.classList.contains("mine")){
        //9 represents a mine
        MineNeighborsY[i][j] = 9;
      }

    }
  }
}