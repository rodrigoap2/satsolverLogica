var fs = require('fs')
var logger = fs.createWriteStream('tabela.txt', {
    flags: 'a'
})
function readFile(fileName) {
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
        logger.write("Sim, é satisfatível.\n" + "\n");
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
function tratamentoClausulas(variablesValue,clausesSolved,clause,posP,posQ,posR,posS,clauses) {
    var qtdAbertos = 0;
    var qtdFechados = 0;
    var retorno = "";
    for(var i = 0; i < clause.length; i++){
        // tratamento NEGAÇÃO
        if(clause.charAt(i) == '~' && qtdAbertos == qtdFechados){
            var a = [];
            a[1] = clause.substring(i+1,clause.length);
            // tratar clausulas unitarias
            if(a[1].length == 1){
                if(a[1] == "P"){
                    if(variablesValue[posP] == 0){
                        retorno = 1;
                    }else{
                        retorno = 0;
                    }
                }else if(a[1] == "Q"){
                    if(variablesValue[posQ] == 0){
                        retorno = 1;
                    }else{
                        retorno = 0;
                    }
                }else if(a[1] == 'R'){
                    if(variablesValue[posR] == 0){
                        retorno = 1;
                    }else{
                        retorno = 0;
                    }
                }else if(a[1] == 'S') {
                    if (variablesValue[posS] == 0) {
                        retorno = 1;
                    } else {
                        retorno = 0;
                    }
                }
                break;
                // tratamento clausulas não unitárias
            }else {
                for(var k = 0; k < clauses.length; k++){
                    var aa = clauses[k] + ")";
                    aa = "(" + aa;
                    if(clauses[k] == a[1] || aa == a[1]){
                        if(clausesSolved[k] == 0){
                            retorno = 1;
                            break;
                        }else{
                            retorno = 0;
                            break;
                        }
                    }
                }
            }
        }
        else if(clause.charAt(i) == '('){
            qtdAbertos++;
        }else if(clause.charAt(i) == ')'){
            qtdFechados++;
        }
        // tratamento OU
        else if(clause.charAt(i) == 'v' && qtdAbertos == qtdFechados){
            var a = [];
            a[0] = clause.substring(0,i);
            a[1] = clause.substring(i+1,clause.length);
            var valor1;
            var valor2;
            if(a[0].length == 1){
                if (a[0] == 'P'){
                    valor1 = variablesValue[posP];
                }else if(a[0] == 'Q'){
                    valor1 = variablesValue[posQ];
                }else if(a[0] == 'R'){
                    valor1 = variablesValue[posR];
                }else if(a[0] == 'S'){
                    valor1 = variablesValue[posS];
                }
            }else if(a[0].length != 1){
                for(var k = 0; k < clausesSolved.length; k++){
                    var aa = clauses[k] + ")";
                    aa = "(" + aa;
                    if(clauses[k] == a[0] || aa == a[0]){
                        valor1 = clausesSolved[k];
                        break;
                    }
                }
            }if (a[1].length == 1){
                if (a[1] == 'P'){
                    valor2 = variablesValue[posP];
                }else if(a[1] == 'Q'){
                    valor2 = variablesValue[posQ];
                }else if(a[1] == 'R'){
                    valor2 = variablesValue[posR];
                }else if(a[1] == 'S'){
                    valor2 = variablesValue[posS];
                }
            }else if(a[1].length != 1){
                for(var k = 0; k < clausesSolved.length; k++){
                    var aa = clauses[k] + ")";
                    aa = "(" + aa;
                    if(clauses[k] == a[1] || aa == a[1]){
                        valor2 = clausesSolved[k];
                        break;
                    }
            }
        }
            if(valor1 == 0 && valor2 == 0){
                retorno = 0;
            }else if(valor1 == 0 && valor2 == 1){
                retorno = 1;
            }else if(valor1 == 1 && valor2 == 0){
                retorno = 1;
            }else if(valor1 == 1 && valor2 == 1){
                retorno = 1;
            }
            break;
        }
        else if(clause.charAt(i) == '&' && qtdAbertos == qtdFechados){
            var a = [];
            a[0] = clause.substring(0,i);
            a[1] = clause.substring(i+1,clause.length);
            var valor1;
            var valor2;
            if(a[0].length == 1){
                if (a[0] == 'P'){
                    valor1 = variablesValue[posP];
                }else if(a[0] == 'Q'){
                    valor1 = variablesValue[posQ];
                }else if(a[0] == 'R'){
                    valor1 = variablesValue[posR];
                }else if(a[0] == 'S'){
                    valor1 = variablesValue[posS];
                }
            }else if(a[0].length != 1){
                for(var k = 0; k < clausesSolved.length; k++){
                    var aa = clauses[k] + ")";
                    aa = "(" + aa;
                    if(clauses[k] == a[0] || aa == a[0]){
                        valor1 = clausesSolved[k];
                        break;
                    }
                }
            }if (a[1].length == 1){
                if (a[1] == 'P'){
                    valor2 = variablesValue[posP];
                }else if(a[1] == 'Q'){
                    valor2 = variablesValue[posQ];
                }else if(a[1] == 'R'){
                    valor2 = variablesValue[posR];
                }else if(a[1] == 'S'){
                    valor2 = variablesValue[posS];
                }
            }else if(a[1].length != 1){
                for(var k = 0; k < clausesSolved.length; k++){
                    var aa = clauses[k] + ")";
                    aa = "(" + aa;
                    if(clauses[k] == a[1] || aa == a[1]){
                        valor2 = clausesSolved[k];
                        break;
                    }
                }
            }
            if(valor1 == 0 && valor2 == 0){
                retorno = 0;
            }else if(valor1 == 0 && valor2 == 1){
                retorno = 0;
            }else if(valor1 == 1 && valor2 == 0){
                retorno = 0;
            }else if(valor1 == 1 && valor2 == 1){
                retorno = 1;
            }
            break;
        }
        else if(clause.charAt(i) == '<' && qtdAbertos == qtdFechados){
            var a = [];
            a[0] = clause.substring(0,i);
            a[1] = clause.substring(i+1,clause.length);
            var valor1;
            var valor2;
            if(a[0].length == 1){
                if (a[0] == 'P'){
                    valor1 = variablesValue[posP];
                }else if(a[0] == 'Q'){
                    valor1 = variablesValue[posQ];
                }else if(a[0] == 'R'){
                    valor1 = variablesValue[posR];
                }else if(a[0] == 'S'){
                    valor1 = variablesValue[posS];
                }
            }else if(a[0].length != 1){
                for(var k = 0; k < clausesSolved.length; k++){
                    var aa = clauses[k] + ")";
                    aa = "(" + aa;
                    if(clauses[k] == a[0] || aa == a[0]){
                        valor1 = clausesSolved[k];
                        break;
                    }
                }
            }if (a[1].length == 1){
                if (a[1] == 'P'){
                    valor2 = variablesValue[posP];
                }else if(a[1] == 'Q'){
                    valor2 = variablesValue[posQ];
                }else if(a[1] == 'R'){
                    valor2 = variablesValue[posR];
                }else if(a[1] == 'S'){
                    valor2 = variablesValue[posS];
                }
            }else if(a[1].length != 1){
                for(var k = 0; k < clausesSolved.length; k++){
                    var aa = clauses[k] + ")";
                    aa = "(" + aa;
                    if(clauses[k] == a[1] || aa == a[1]){
                        valor2 = clausesSolved[k];
                        break;
                    }
                }
            }
            if(valor1 == 0 && valor2 == 0){
                retorno = 1;
            }else if(valor1 == 0 && valor2 == 1){
                retorno = 0;
            }else if(valor1 == 1 && valor2 == 0){
                retorno = 0;
            }else if(valor1 == 1 && valor2 == 1){
                retorno = 1;
            }
            break;
        }
        else if(clause.charAt(i) == '>' && qtdAbertos == qtdFechados){
            var a = [];
            a[0] = clause.substring(0,i);
            a[1] = clause.substring(i+1,clause.length);
            var valor1;
            var valor2;
            if(a[0].length == 1){
                if (a[0] == 'P'){
                    valor1 = variablesValue[posP];
                }else if(a[0] == 'Q'){
                    valor1 = variablesValue[posQ];
                }else if(a[0] == 'R'){
                    valor1 = variablesValue[posR];
                }else if(a[0] == 'S'){
                    valor1 = variablesValue[posS];
                }
            }else if(a[0].length != 1){
                for(var k = 0; k < clausesSolved.length; k++){
                    var aa = clauses[k] + ")";
                    aa = "(" + aa;
                    if(clauses[k] == a[0] || aa == a[0]){
                        valor1 = clausesSolved[k];
                        break;
                    }
                }
            }if (a[1].length == 1){
                if (a[1] == 'P'){
                    valor2 = variablesValue[posP];
                }else if(a[1] == 'Q'){
                    valor2 = variablesValue[posQ];
                }else if(a[1] == 'R'){
                    valor2 = variablesValue[posR];
                }else if(a[1] == 'S'){
                    valor2 = variablesValue[posS];
                }
            }else if(a[1].length != 1){
                for(var k = 0; k < clausesSolved.length; k++){
                    var aa = clauses[k] + ")";
                    aa = "(" + aa;
                    if(clauses[k] == a[1] || aa == a[1]){
                        valor2 = clausesSolved[k];
                        break;
                    }
                }
            }
            if(valor1 == 0 && valor2 == 0){
                retorno = 1;
            }else if(valor1 == 0 && valor2 == 1){
                retorno = 1;
            }else if(valor1 == 1 && valor2 == 0){
                retorno = 0;
            }else if(valor1 == 1 && valor2 == 1){
                retorno = 1;
            }
            break;
        }
    }
    return retorno;
}
function doTable(array1,i) {
    var clauses = readClausess(array1,i);
    var variables = readVariables(clauses);
    var clausesValue = [];
    var str = "";
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
        clausesValue = [];
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
                str += a;
            }else{
                var a = variablesValue[k] + " |";
                str += a;
            }
        }
        //
        //
        //FIM TRATAMENTO VARIAVEIS
        //
        //INICIO TRATAMENTO CLAUSULAS
        // inicio tratamento hardcore
        var bbbb = variablesValue.reverse();
        for(var k = 0; k < clauses.length; k++){
            var abc = tratamentoClausulas(bbbb,clausesSolved,clauses[k],posP,posQ,posR,posS,clauses);
            clausesValue.push(abc);
            clausesSolved.push(abc);
        }
        for(var k = 0; k < clausesSolved.length; k++){
            var uu = clausesSolved[k];
            for(var ii = 0; ii < clauses[k].length; ii++){
                uu = " " + uu;
            }
            if(k != clausesSolved.length-1){
                str += uu + " ";
            }else{
                str += uu + "\n";
            }
        }
        if(clausesSolved[clausesSolved.length-1] == 1){
            isSat = true;
        }
    }
    logger.write(str);
    if (isSat){
        logger.write("Sim, é satisfatível.\n" + "\n");
    }else if(!isSat && clauses != ""){
        logger.write("Não, não é satisfatível.\n" + "\n");
    }
}
function doUnit(array1) {

}
readFile('C:\\Users\\rodri\\WebstormProjects\\untitled1\\entrada.txt');
