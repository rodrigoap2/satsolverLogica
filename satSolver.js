function readFile(fileName) {
    var fs = require("fs");
    var text = fs.readFileSync(fileName).toString();
    var textByLine = text.split("\n");
    var clauses = readClauses(textByLine);
}
function readClauses(textByLine) {
    var getLine = "";
    var numberOfLines = textByLine[0];
    for(var i = 1; i <= numberOfLines; i++){
        getLine = textByLine[i].split(" ");
        var array1 = [];
        for(var k = 0; k < getLine.length; k++){
            if(getLine[k] != ""){
                array1.push(getLine[k]);
            }
        }
        if(textByLine[i].charAt(0) === 'T' && textByLine[i].charAt(1) === 'T'){
            doTable(array1,i);
        }else if(textByLine[i].charAt(0) === 'R' && textByLine[i].charAt(1) === 'E'){
            console.log("Problema #" + i);
            doUnit(array1);
        }
    }
}

function readClausess(array1) {
    var str = "";
    var stk1 = [];
    var stk2 = [];
    var clauses = [];
    var aux = 0;
    for(var i = 0; i < array1.length; i++){
        str += array1[i];
    }
    for (var i = 0; i < str.length; i++){
        if (str.charAt(i) == '('){
            stk1.push(str.charAt(i))
            stk2.push(i);
        }else if(str.charAt(i) == ')'){
            var a = stk2.pop();
            clauses[aux] = str.substring(a+1,i);
            aux++;
        }
    }
    return clauses;
}
function  readVariables(clauses) {
    var variables = [];
    var hasP = false;
    var hasQ = false;
    var hasR = false;
    var hasS = false;
    for(var i = 0; i < clauses.length; i++){
        for(var j = 0; j < clauses[i].length; j++){
            if(clauses[i].charAt(j) == 'P' && !hasP){
                variables.push(clauses[i].charAt(j));
                hasP = true;
            }else if(clauses[i].charAt(j) == 'Q' && !hasQ){
                variables.push(clauses[i].charAt(j));
                hasQ = true;
            }else if(clauses[i].charAt(j) == 'R' && !hasR){
                variables.push(clauses[i].charAt(j));
                hasR = true;
            }else if(clauses[i].charAt(j) == 'S' && !hasS){
                variables.push(clauses[i].charAt(j));
                hasS = true;
            }
        }
    }
    variables.sort();
    return variables;
}
function doTable(array1,i) {
    var clauses = readClausess(array1);
    var variables = readVariables(clauses);
    var clausesValue = [];
    var fs = require('fs')
    var logger = fs.createWriteStream('tabela.txt', {
        flags: 'a'
    })
    logger.write("Problema #" + i + "\n");
    var binary = "";
    for (var k = 0; k < clauses.length-1; k++){
        binary += 0;
    }
    // printando o nome das variaveis
    for (var k = 0; k < variables.length; k++){
        if(k != variables.length-1){
            var a = variables[k] + " ";
            logger.write(a);
        }else{
            var a = variables[k] + " |" + "\n";
            logger.write(a);
        }
    }
    // começando o problema
    for(var i = 0; i < Math.pow(2,variables.length); i++){
        var clausesSolved = [];
        var variablesValue = [];
        // pegando os valores de pqrs
        if(i != 0){
            var a = parseInt(binary,2);
            a++;
            binary = a.toString(2);
            while (binary.length != variables.length){
                binary = 0 + binary;
            }
        }
        // colocando os valores das variaveis no array
        for (var k = binary.length; k >= 0; k--){
            variablesValue.push(binary.charAt(k));
        }
        // printando as variaveis e seus valores
        for (var k = variables.length; k > 0; k--){
            if (k != 1) {
                var a = variablesValue[k] + " ";
                logger.write(a);
            }else{
                var a = variablesValue[k] + " |" + "\n";
                logger.write(a);
            }
        }
    }
// colocando espaço entre os problemas
}
function doUnit(array1) {

}
readFile('C:\\Users\\rodri\\WebstormProjects\\untitled1\\entrada.txt');
