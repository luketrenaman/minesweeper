const WIDTH = 20;
const atlas = {
    "1":[0,0],
    "2":[0,1],
    "3":[0,2],
    "4":[0,3],
    "5":[1,0],
    "6":[1,1],
    "7":[1,2],
    "8":[1,3],
    "0":[2,0],
    "unclicked":[3,0],
    "flag":[3,1],
    "redmine":[3,2],
    "mine":[3,3],
}
class Minesweeper{
    random = (min, max) => Math.floor(Math.random() * (max - min)) + min;
    constructor(r,c,m){
        this.rows = r;
        this.columns = c;
        this.mines = m;
        //Create a canvas, tie it to Minesweeper instance
        let canvas = document.createElement('canvas');
        this.canvas = canvas;
        canvas.id = "game";
        canvas.width = r*WIDTH;
        canvas.height = c*WIDTH;
        canvas.onclick = this.reveal.bind(this);
        canvas.oncontextmenu = this.flag.bind(this);

        let body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);
        this.ctx = canvas.getContext("2d");
        //2D mines array
        this.mines = [];
        for(let i = 0;i<r;i++){
            this.mines.push([]);
            for(let j = 0;j<c;j++){
                this.mines[i].push(false);
            }
        }
        //generate m mines
        while(m > 0){
            let rRow = this.random(0,r-1);
            let rCol = this.random(0,c-1);
            if(!this.mines[rRow][rCol]){
                //No mine here
                this.mines[rRow][rCol] = true;
                m--;
            }
        }
        //Ties spritesheet to Minesweeper class, although it does not need to be reloaded on each run
        this.spritesheet = new Image();
        this.spritesheet.src = 'spritesheet.png';
        this.spritesheet.onload = this.render.bind(this);
    }
    drawSprite(r,c,name){
        let loc = atlas[name];
        console.log(`Drawing sprite with name ${name}`);
        this.ctx.drawImage(this.spritesheet,loc[1]*WIDTH,loc[0]*WIDTH,WIDTH,WIDTH
            ,c*WIDTH,r*WIDTH,WIDTH,WIDTH);
    }
    getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let r = Math.floor(y/WIDTH);
        let c = Math.floor(x/WIDTH);
        return [r,c];
    }
    
    reveal(e){
        this.getCursorPosition(this.canvas,e);
    }
    flag(e){
        e.preventDefault(); e.stopPropagation();
        this.getCursorPosition(this.canvas,e);
    }
    render(){
        //Just show red for mines, black for all else
        for(let i = 0;i<this.rows;i++){
            for(let j = 0;j<this.columns;j++){
                let all = Object.keys(atlas);
                let idx = this.random(0,all.length);
                this.drawSprite(i,j,all[idx]);
            }
        }
    }
    deconstruct(){
        this.canvas.outerHTML="";
        delete this.canvas;
    }
}
window.onload = function(){
    let game = new Minesweeper(0,0,0);
    document.getElementById("beginner").onclick = () => {
        game.deconstruct();
        game = new Minesweeper(9,9,10);
    }
    document.getElementById("intermediate").onclick = () => {
        game.deconstruct();
        game = new Minesweeper(15,13,40);
    }
    document.getElementById("expert").onclick = () => {
        game.deconstruct();
        game = new Minesweeper(30,16,99);
    }
}