
// mat is 10x10, each cell is 17 pixels wide (3 pixel border on all sides)
var max_size=10;
var width=17;
var border=3;
var fill_prob=0.18;
var step_count=0;
var mat = new Array(max_size);
var neighbors = new Array(max_size);
var new_mat = new Array(max_size);
var changingCells = 0;
var max_steps = 60;

// function to generate a random initial matrix
function getRandomMatrix (mat) {
  for (var x = 0; x < max_size; x++) {
    for (var y = 0; y < max_size; y++) {
      var rnd = Math.random();
      var fill = 0;
      if(rnd < fill_prob) {
        fill=1;
      } else {
        fill=0;
      }
      mat[x][y] = fill;
    }
  }
  return mat;
}


// function to draw individual cells
function drawCell(x,y,width,border) {
  g.fillRect(x*width+border,y*width+border,x*width+(width-1)+border,y*width+(width-1)+border);
}


// function to get the number of living neighbors around a given cell
function checkNeighbors(x,y,mat) {
  var neighbors = 0;
  
  for (var dx = -1; dx <= 1; dx++) {
    var x2 = x+dx;
    
    for (var dy = -1; dy <= 1; dy++) {
      var y2 = y+dy;

      // wrap neighbors around the border      
      if(x2<0) {
        x2 = x2+max_size;
      } else if(x2>=max_size) {
        x2 = x2-max_size;
      }
      
      if(y2<0) {
        y2 = y2+max_size;
      } else if(y2>=max_size) {
        y2 = y2-max_size;
      }
      
      var neighbor_alive = mat[x2][y2];
      if (neighbor_alive==1 && (x2!=x || y2!=y)) {
        neighbors++;
      }
    }
  }
  return neighbors;
}


// function to get the number of living neighbors around a given cell
function countChangingCells(mat, neighbors) {
  var changing = 0;
   
  for (var x = 0; x < max_size; x++) {
    for (var y = 0; y < max_size; y++) {
      if(mat[x][y]==1 & (neighbors[x][y] < 2 || neighbors[x][y] > 3)) {
        changing++;
      } else if(mat[x][y]==0 & neighbors[x][y] == 3) {
        changing++;          
      }
    }
  }
  return changing;
}


// function to get the number of neighbors for each cell
function getNeighborCount(mat) {
  for (var x = 0; x < max_size; x++) {
    for (var y = 0; y < max_size; y++) {
      // get number of living neighbors at the start of the cycle
      neighbors[x][y] = checkNeighbors(x,y,mat);  
    }
  }
  return neighbors;
}


// function to generate a random initial matrix
function updateMatrix(mat, neighbors) {  
  for (var x = 0; x < max_size; x++) {
    for (var y = 0; y < max_size; y++) {
      
      // first, take the current value of mat
      new_mat[x][y] = mat[x][y];
      
      // check if current cell is alive at start of this cycle
      var alive = mat[x][y]; 
      
      // get number of living neighbors at the start of the cycle
      var nn=neighbors[x][y];
      
      // only changes to initial alive value
      if(alive==1 && (nn<2 || nn>3)) {
        // cell dies due to over/undercrowding
        alive = 0;      
        
      } else if(alive==0 && nn==3) {
        // new cell is born when EXACTLY 3 neighbors
        alive = 1;        
      
      }
   
      // print array with values for debugging
      new_mat[x][y] = alive;
    }
  }
   
  // copies new_mat back into mat
  mat = new_mat.map((x) => x);
  return mat;
}


// not working, the numbers are reset but the matrix isn't
function restart() {
  g.clear();
  changingCells = 0;
  step_count = 0;
  E.showMessage("Restarting");
  console.log("Restarting");
}


function step() {
  console.log(step_count);
  
  // show the current state before any updates
  //console.log(mat);
  //console.log(neighbors);
  
  // clear screen
  g.clear();
  
  // check if extinct, if so, regenerate all
  changingCells = countChangingCells(mat, neighbors);  
  
  // not working, the numbers are reset but the matrix isn't
  // if user presses button, restart it by setting step_count to 0
  //setWatch(restart, (process.env.HWVERSION==2) ? BTN1 : BTN2);
  
  if(changingCells==0 || step_count >= max_steps) {
    mat = getRandomMatrix(mat);
    step_count = 0;
  
  } else {
    // get the new matrix values
    mat = updateMatrix(mat, neighbors);
    step_count++;
  }
  
  // get the neighbors for each cell
  neighbors = getNeighborCount(mat);
  
  for (var x = 0; x < mat.length; x++) {
    for (var y = 0; y < mat.length; y++) {
      
      // draw cell if it has value=1
      cellExists = mat[x][y];
      if(cellExists==1) {
        drawCell(x,y,width,border);
      }
    }
  }
  
  // optional - this keeps the watch LCD lit up
  //Bangle.setLCDPower(1);
}



// initialize the matrix (array of arrays) mat
// then for each element of the array mat, create a new array
for (var i = 0; i < max_size; i++) {
  mat[i] = new Array(max_size);
  new_mat[i] = new Array(max_size);
  neighbors[i] = new Array(max_size);
}


mat = getRandomMatrix(mat);
neighbors = getNeighborCount(mat);
var interval = setInterval(step, 100);




