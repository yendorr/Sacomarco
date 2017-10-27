var variaveis=3,restricoes=3;
var max = false;
var i,j;
var A[][];
$(document).ready(function(){
	atulizaTabela();
	$(".Input").blur(atulizaTabela);
	$("#max").click(atualizaMax);
	$("#go").click(go);
});


function atulizaTabela(){
	variaveis = $("#variaveis").val();
	restricoes = $("#restricoes").val();

	console.log("chamou");
	validaValores();
	


	$("#tabela").empty();
	$("#tabela").append("Z = ");		
	for(i=1;i<=variaveis;i++){
			$("#tabela").append("<input class='Input A' type='text'> X");
			$("#tabela").append("<label class='Indice'>"+i+" </label>");
			if(i!=variaveis)	$("#tabela").append(" + ");		
		}
	$("#tabela").append("<br><br>");		
	for(j=1;j<=restricoes;j++){
		for(i=1;i<=variaveis;i++){
			$("#tabela").append("<input class='Input A' type='text'> X");
			$("#tabela").append("<label class='Indice'>"+i+" </label>");
			if(i!=variaveis)	$("#tabela").append(" + ");		
		}
		$("#tabela").append("  <select class='S' id='S"+j+"'> <option><</option> <option>=</option> <option>></option> </select>"); 
		$("#tabela").append("<input type='text' class='Input B' id='B"+i+j+"'>");
		$("#tabela").append("<br>");
	}

} 

function validaValores(){
	if(variaveis<3){
		$("#variaveis").val("3");
		variaveis = 3;
	}
	if(variaveis>12){
		$("#variaveis").val("12");
		variaveis = 12;	
	}
	if(restricoes<3){
		$("#restricoes").val("3");
		restricoes = 3;
	}
	if(restricoes>12){
		$("#restricoes").val("12");
		restricoes = 12;
	}
}

function zera(){

}

function go(){
	organizaDados();
	resolve();
}

organizaDados(){
	for()
}


function atualizaMax(){
	$("#max").empty();
	if(max)	$("#max").append("Minimizar");
	else	$("#max").append("Maximizar");
	max=!max;
}