$( document ).ready(()=> {

    

    const getFieldSize = () => {return parseInt($('#FiledSizeSelect').val())*5};
    const getMineCount = () => {return Math.ceil(getFieldSize()*getFieldSize()/10*parseInt($('#MineCountSelect').val()))};    
    
    let mineArray;
    let fieldSize = getFieldSize();
    let mineCount = getMineCount();


    const getNeighbouringCellsIndexes = (fieldSize, index) => {
        let minRow = -1;
        let maxRow = 1;
        if(index < fieldSize) {
            minRow = 0;
        } else if (index >= fieldSize*(fieldSize - 1)){
            maxRow = 0;
        } 
        let minCol = -1;
        let maxCol = 1;
        if(index%fieldSize === 0) {
            minCol = 0;
        } else if ((index+1)%fieldSize === 0){
            maxCol = 0;
        }
    
        let neighbouringCellsIndexes = [];
        for(let row = minRow; row <= maxRow; ++row){
            for (let col = minCol; col <= maxCol; ++col) {
                if (row !== 0 || col !== 0) neighbouringCellsIndexes.push(index + row*fieldSize + col);
    
            }
        }
        return neighbouringCellsIndexes;
    }
    
    const generateMinesArray = (fieldSize, mineAmount) => {
        let arr = new Array(fieldSize*fieldSize);
        arr = arr.fill(0);
        let mineIndexes = new Array(mineAmount);
        for(let i = 0; i < mineAmount; ++i) {
            
            let spawnIndex;
            do{
                spawnIndex = Math.floor(Math.random() * fieldSize*fieldSize);
            }
            while(arr[spawnIndex] === -1);
            arr[spawnIndex] = -1;
            mineIndexes[i] = spawnIndex;
        } 
        for(let i = 0; i < mineAmount; ++i) {
            let neighboutIndexes = getNeighbouringCellsIndexes(fieldSize, mineIndexes[i]);
            for(let neigbourIndex of neighboutIndexes) {
                if(arr[neigbourIndex] !== -1) {
                    arr[neigbourIndex] += 1;
                }
            }
        }
    
        return arr;
    }
    
    const generateField = (fieldSize) => {
        $( '#Playground' ).empty();
        for (let row = 0; row < fieldSize; row++) {
            $( '#Playground' ).append('<div class="row"></div>');
    
            for(let col = 0; col < fieldSize; col++) {
                $( `.row:eq(${row})` ).append(`<button id="${row*fieldSize+col}" class='hidden'></button>`);
            }
        }
    }
    
     
    const handleClick = (index, arr) => {
        $( "#"+JSON.stringify(index) ).removeClass('hidden');
        $( "#"+JSON.stringify(index) ).text(arr[index]);
        $( "#"+JSON.stringify(index) ).addClass(`n${arr[index]}`);
    
        if(arr[index] === -1) gameOver(arr);
        if( $(".hidden").length === mineCount) victory(arr);
        if(arr[index] !== 0) return;
        
        let neighbours = getNeighbouringCellsIndexes(fieldSize, index);
        for (let neighbour of neighbours) {
            if ($( "#"+JSON.stringify(neighbour) ).hasClass('hidden')) {
                handleClick(neighbour, arr);
            }
        }
    }

    const revealAllTiles = (arr) => {
        for(let i = 0 ; i < getFieldSize()*getFieldSize(); i++) {
            $( "#"+JSON.stringify(i) ).removeClass('hidden');
            $( "#"+JSON.stringify(i) ).text(arr[i]===-1?"":arr[i]);
            $( "#"+JSON.stringify(i) ).addClass(arr[i]===-1?`mine`:`n${arr[i]}`);
        }
    }


    const gameOver = (arr) => {
        revealAllTiles(arr);
        alert("Game Over");
    }
    
    const victory = (arr) => {
        revealAllTiles(arr);
        alert("Victory");
    }
    
    const addMineFieldListeners = () => {
        $( ".row button" ).on( "click", (event) => {
            let index = parseInt(event.target.id);
            handleClick(index, mineArray);
        });
    }
    
    const startOver = () => {

        mineArray = generateMinesArray(fieldSize,mineCount);
        generateField(fieldSize);
        addMineFieldListeners();
    
    }
    const handleFieldSizeSelect = () => {
        let readValue = getFieldSize();
        $('#Playground').removeClass(`s${fieldSize}`);
        if (fieldSize !== readValue) {
            fieldSize = readValue;
            mineCount = getMineCount(); 
            startOver();
        }
        console.log(fieldSize);
        $('#Playground').addClass(`s${fieldSize}`);
    }

    $( "#FiledSizeSelect" ).on("change mousemove", () => {
        handleFieldSizeSelect();
    });

    $( "#MineCountSelect" ).on("change mousemove", () => {
        let newMineCount = getMineCount();
        if (newMineCount !== mineCount) {
            mineCount = newMineCount;
            startOver();
        }
    });
    
    $( "#Restart" ).on( "click", () => {
        startOver();
    });
    
    
    startOver();
    handleFieldSizeSelect();
});


