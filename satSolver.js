var fs = require('fs')
var logger = fs.createWriteStream('tabela.txt', {
    flags: 'a'
})
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
        getLine = "";
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
function sortByLength(array) {
    for(var i = 0; i < array.length-1; i++){
        for(var k = 0; k < array.length-i-1; k++){
            if(array[k].length > array[k+1].length){
                var aux = array[k];
                array[k] = array[k+1];
                array[k+1] = aux;
            }
        }
    }
    return array;
}
function readClausess(array1,op) {
    var str = "";
    var stk1 = [];
    var stk2 = [];
    var clauses = [];
    var aux = 0;
    for(var i = 0; i < array1.length; i++){
        str += array1[i];
    }
    if(str.length != 4){
        for (var i = 0; i < str.length; i++){
            if (str.charAt(i) == '('){
                stk1.push(str.charAt(i))
                stk2.push(i);
            }else if(str.charAt(i) == ')'){
                var a = stk2.pop();
                var aux3 = false;
                for(var k = 0; k < clauses.length; k++){
                    var aux2 = str.substring(a+1,i);
                    if(aux2 == clauses[k]){
                        aux3 = true;
                    }
                }
                if(!aux3) {
                    clauses[aux] = str.substring(a + 1, i);
                    aux++;
                }
            }
        }
    }else {
        // tratando caso de 1 variavel 0 clausulas
        var v = str.charAt(2);
        v = v + "";
        logger.write("Problema #" + op + "\n");
        logger.write(v + " |" + "\n");
        logger.write("0 |\n");
        logger.write("1 |\n");
        logger.write("Sim, é satisfatível.\n");
    }
    clauses = sortByLength(clauses);
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
    var clauses = readClausess(array1,i);
    var variables = readVariables(clauses);
    var clausesValue = [];
    var isSat = false;
    var posP = -1,posQ = -1,posR = -1,posS = -1;
    for(var k = 0; k < variables.length; k++){
        if(variables[k] == "P"){
            posP = k;
        }else if(variables[k] == "Q"){
            posQ = k;
        }else if(variables[k] == "R"){
            posR = k;
        }else if(variables[k] == "S"){
            posS = k;
        }
    }
    // PRINT PROBLEMA
    if(clauses != "") {
        logger.write("Problema #" + i + "\n");
    }
    //
    //
    //INICIO TRATAMENTO VARIAVEIS/PRINT CLAUSULAS
    //
    //
    var binary = "";
    for (var k = 0; k < variables.length; k++){
        binary += 0;
    }
    // printando o nome das variaveis
    for (var k = 0; k < variables.length; k++){
        if(k != variables.length-1){
            var a = variables[k] + " ";
            logger.write(a);
        }else{
            var a = variables[k] + " | ";
            logger.write(a);
        }
    }
    // printando as clausulas
    for (var k = 0; k < clauses.length; k++){
        if(k != clauses.length-1){
            var a = clauses[k] + "  ";
            logger.write(a);
        }else{
            var a = clauses[k] + "\n";
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
        for (var k = binary.length-1; k >= 0; k--){
            variablesValue.push(binary.charAt(k));
        }
        // printando as variaveis e seus valores
        for (var k = variablesValue.length-1; k >= 0; k--){
            if (k != 0) {
                var a = variablesValue[k] + " ";
                logger.write(a);
            }else{
                var a = variablesValue[k] + " |" + "\n";
                logger.write(a);
            }
        }
        //
        //
        //FIM TRATAMENTO VARIAVEIS
        //
        //INICIO TRATAMENTO CLAUSULAS
        for(var k = 0; k < clauses.length; k++){
            for(var q = 0; q < clauses[k].length; q++){
                if(clauses[k].charAt(0) != "(" && clauses[k].charAt(0) == "~") {
                    var aux99 = clauses[k].charAt(1);
                    if(aux99 == 'P'){
                        if(variablesValue[posP] == 0){
                            clausesSolved.push(1);
                        }else{
                            clausesSolved.push(0);
                        }
                    }else if(aux99 == 'Q'){
                        if(variablesValue[posQ] == 0){
                            clausesSolved.push(1);
                        }else{
                            clausesSolved.push(0);
                        }
                    }else if(aux99 == 'R'){
                        if(variablesValue[posR] == 0){
                            clausesSolved.push(1);
                        }else{
                            clausesSolved.push(0);
                        }
                    }else if(aux99 == 'S'){
                        if(variablesValue[posS] == 0){
                            clausesSolved.push(1);
                        }else{
                            clausesSolved.push(0);
                        }
                    }
                }
            }
            console.log(clausesSolved[0]);
        }
    }
    if (isSat){
        logger.write("Sim, é satisfatível.\n");
    }else if(!isSat && clauses != ""){
        logger.write("Não, não é satisfatível.\n");
    }
}
function doUnit(array1) {

}
readFile('C:\\Users\\rodri\\WebstormProjects\\untitled1\\entrada.txt');
