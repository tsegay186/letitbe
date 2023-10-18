export default function generateMatrix(column, row, start, range,) {

    const collection = []
 
    for(let i=0; i<row; i++){
        let elements = arrayFrom(start + (range*i), start + (range*(i + 1)))
        collection.push(elements)
    }


    let matrix = []
    
    for (let i = 0; i < column; i++) {
        let column = []

        for (let j = 0; j < row; j++) {
            
            let randomNumber = pickRandomNumberFrom(collection[j])
            if (randomNumber) {
                column.push(randomNumber)
                collection[j] = arrayWithOut(collection[j], randomNumber)
        
            }
        }
        matrix.push(column)
    }
    return matrix
}
function arrayWithOut(array, element) {
    let index = array.indexOf(element)
    let temp = [...array]
    temp.splice(index, 1)

    return temp
}
function arrayFrom(start, end) {
    let array = []
    for (let i = start; i < end; i++) {
        array.push(i)
    }
    return array
}

export function pickRandomNumberFrom(array) {
    let arrayLength = array.length
    if (arrayLength) {
        let firstIndex = 0;
        let lastIndex = arrayLength-1
        let index = randomInteger(firstIndex, lastIndex)
        return array[index]

    }
    else {
       return false
    }
}

function randomInteger(min, max) {
    // here rand is from min to (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }

  export  function allNumbersInDomain(minimum, maximum, difference) {

    let matrix = []
    for (let i = 0; i < maximum / difference; i++) {
        let columnNumbers = arrayFrom(minimum + (difference * i), minimum + (difference * (i + 1)))
        matrix.push(columnNumbers)
    }
    return matrix
}

console.log(allNumbersInDomain(1, 80, 10))