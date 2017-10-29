var variaveis = 3,restricoes = 3;
var max = false;
var primeiraExecucao = true;
var i,j;
const maxVariaveis = 12, minVariaveis = 3, maxRestricoes = 12, minRestricoes = 3;
var b = [];
var Cr = [];
var A = [];
var funcaoObjetivo = [];
var ba = [];
var basica = []
var naoBasica = [];
var sobra = [];
var artificial = [];
for(i=0;i<maxVariaveis*3;i++) A[i]=[];

$(document).ready(function(){
	atulizaTabela();
	$(".Input").blur(atulizaTabela);
	$("#max").click(atualizaMax);
	$("#go").click(go);
	$("#clear").click(zera);
});

function atulizaTabela(){
	variaveis = $("#variaveis").val();
	restricoes = $("#restricoes").val();

	validaValores();
	if(!primeiraExecucao)
		salvaDados();
	else
		primeiraExecucao=false;

	$("#tabela").empty();
	$("#tabela").append("Z = ");		
	//coloca função objetivo
	for(i=1;i<=variaveis;i++){
			$("#tabela").append("<input class='Input ' type='text' id='z"+i+"'> X");
			$("#tabela").append("<label class='Indice' >"+i+" </label>");
			if(i!=variaveis)	$("#tabela").append(" + ");		
		}
	$("#tabela").append("<br><br>");
	//coloca tabela restiçoes x variaveis		
	for(i=1;i<=restricoes;i++){
		for(j=1;j<=variaveis;j++){
			$("#tabela").append("<input class='Input' type='text' id='A"+i+j+"'> X");
			$("#tabela").append("<label class='Indice'>"+j+" </label>");
			if(j!=variaveis)	$("#tabela").append(" + ");		
		}
		//coloca vetor b
		$("#tabela").append("<select class='S' id='S"+i+"'> <option><</option> <option>=</option> <option>></option> </select>"); 
		$("#tabela").append("<input type='text' class='Input ' id='b"+i+"'>");
		$("#tabela").append("<br>");
	}
	var teste = 27* $("#b1").val();
	console.log(teste);
	 restauraDados();	
} 

function validaValores(){
	if(variaveis<minVariaveis){
		$("#variaveis").val(minVariaveis);
		variaveis = minVariaveis;
	}
	if(variaveis>maxVariaveis){
		$("#variaveis").val(maxVariaveis);
		variaveis = maxVariaveis;	
	}
	if(restricoes<minRestricoes){
		$("#restricoes").val(minRestricoes);
		restricoes = minRestricoes;
	}
	if(restricoes>maxRestricoes){
		$("#restricoes").val(maxRestricoes);
		restricoes = maxRestricoes;
	}
}

function zera(){
	primeiraExecucao = true;
	
	for(i=0;i<=restricoes;i++){
		funcaoObjetivo[i]=null;
		$("#z"+i).val(null);
		for(j=0;j<=variaveis;j++){
			A[i][j]=null;
			$("#A"+i+j).val(null);
		}
		b[i]=null;
		$("#b"+i).val(null);
	}
}



function salvaDados(){
	for(i=1;i<=restricoes;i++){
		funcaoObjetivo[i] = $("#z"+i).val();
		for(j=1;j<=variaveis;j++){
			A[i][j] = $("#A"+i+j).val();	
		}
		b[i] = $("#b"+i).val();
	}
}

function restauraDados(){
	for(i=1;i<=restricoes;i++)
		$("#z"+i).val(funcaoObjetivo[i]);
	for(i=1;i<=restricoes;i++){
		for(j=1;j<=variaveis;j++){
			$("#A"+i+j).val(A[i][j]);
		}
		$("#b"+i).val(b[i]);
	}	
}


function go(){
	salvaDados();
	// resolve();
}

function organizaDados(){

}

function atualizaMax(){
	$("#max").empty();
	if(max)	$("#max").append("Minimizar");
	else	$("#max").append("Maximizar");
	max=!max;
}