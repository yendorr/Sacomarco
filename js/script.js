const maxVariaveis = 12, minVariaveis = 1, maxRestricoes = 12, minRestricoes = 1;
const M = (27+10+1998)*999999999999999999999999999, m = 999999999999999999999999999;
var variaveis = 3,restricoes = 3;
var max = false;
var i,j,j;
var b = [], Cr = [], A = [], funcaoObjetivo = [], s = [], ba = [];
var basica = [], naoBasica = [],sobra = [], deOnde = [], artificial = [];
var contadorBasicas, contadorSobras,contadorArtificiais;
primeiraExecução = true;
for(i=0;i<=maxVariaveis*3;i++) A[i]=[];

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
	salvaDados();
	$("#tabela").empty();
	//coloca função objetivo
	$("#tabela").append("Z = ");		
	for(i=1;i<=variaveis;i++){
		$("#tabela").append("<input class='Input ' type='text' id='z"+i+"'> X");
		$("#tabela").append("<label class='Indice' >"+i+" </label>");
		if(i!=variaveis)	$("#tabela").append(" + ");		
	}
	$("#tabela").append("<br><br>");
	//coloca tabela restiçoes _times variaveis		
	for(i=1;i<=restricoes;i++){
		for(j=1;j<=variaveis;j++){
			$("#tabela").append("<input class='Input' type='text' id='A"+i+j+"'> X");
			$("#tabela").append("<label class='Indice'>"+j+" </label>");
			if(j!=variaveis)	$("#tabela").append(" + ");		
		}
		//coloca vetor b
		$("#tabela").append("<select class='S' id='s"+i+"'> <option><</option> <option>=</option> <option>></option> </select>"); 
		$("#tabela").append("<input type='text' class='Input ' id='b"+i+"'>");
		$("#tabela").append("<br>");
	}
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
		for(j=1;j<=variaveis;j++)
			A[i][j] = $("#A"+i+j).val();
		s[i] = $("#s"+i).find('option:selected').text();
		b[i] = $("#b"+i).val();
	}
}

function restauraDados(){
	for(i=1;i<=restricoes;i++){
		$("#z"+i).val(funcaoObjetivo[i]);
		for(j=1;j<=variaveis;j++)
			$("#A"+i+j).val(A[i][j]);
		$("#b"+i).val(b[i]);
	}	
	if(s[1])
		for(i=1;i<=restricoes;i++)
			$("#s"+i).val(s[i]);
}

function go(){
	salvaDados();
	resolve();
}

function resolve(){
	zeraContadores();
	formaPadrao();

	calculaCr();
	preview();
}

function continua(){

}

function zeraContadores(){
	contadorBasicas=0;
	contadorSobras=0;
	contadorArtificiais=0;
	variaveis = $("#variaveis").val();
	restricoes = $("#restricoes").val();

}

function formaPadrao(){
	if(max)
		for(j=1;j<=variaveis;i++)
			funcaoObjetivo[j]*=-1;	

	positivaB();	

	for(i=1;i<=restricoes;i++){
		if (s[i]=='<') 
			formaMenor(i);
		else if (s[i]=='=') 
			formaIgual(i);
		else if (s[i]=='>') 
			formaMaior(i);		
	}
}

function positivaB(){
	for(i=1;i<=restricoes;i++)
		if(b[i]<0){
			b[i]*=-1;

			if (s[i]=='>') 
				s[i]='<';
			else if(s[i]=='<')
				s[i]='>';

			for(j=1;j<=variaveis;j++)
				A[i][j]*=-1
		}
}

function formaMenor(linha){
	variaveis++;	
	for(j=1;j<=restricoes;j++)
		A[j][variaveis] = 0;
	basica[++contadorBasicas] = variaveis;
	sobra[++contadorSobras] = variaveis;
	deOnde[contadorSobras] = j;
	A[linha][variaveis] = 1;
	funcaoObjetivo[variaveis] = 0;
}

function formaMaior(linha){
	variaveis++;	
	for(j=1;j<=restricoes;j++)
		A[j][variaveis]=0;
	sobra[++contadorSobras] = variaveis;
	deOnde[contadorSobras] = j;
	A[linha][variaveis] = -1;	
	funcaoObjetivo[variaveis] = 0;


	variaveis++;
	for(j=1;j<=restricoes;j++)
		A[j][variaveis] = 0;
	basica[++contadorBasicas] = variaveis;
	artificial[++contadorArtificiais] = variaveis;
	A[linha][variaveis] = 1;
	funcaoObjetivo[variaveis] = M; 
}

function formaIgual(linha){
	variaveis++;
	for(j=1;j<=restricoes;j++)
		A[j][variaveis] = 0;
	basica[++contadorBasicas] = variaveis;
	artificial[++contadorArtificiais] = variaveis;
	A[linha][variaveis] = 1;
	funcaoObjetivo[variaveis] = M;
}

function calculaCr(){
	for(j=1;j<=variaveis;j++){
		soma=0;
		for(i=1;i<=restricoes;i++){
			soma+=funcaoObjetivo[basica[i]]*A[i][j];
		}
		Cr[j]=funcaoObjetivo[j] - soma;
	}
}

function preview(){
	console.log(A);
	console.log(s);
	console.log(b);
	console.log(funcaoObjetivo);
	$("#preview").append("z = ");
	console.log("var = "+variaveis);
	console.log("res = "+restricoes);
	for(j=1;j<=variaveis;j++){
		if(funcaoObjetivo[j]>m)
		$("#preview").append("M");	
		else
		$("#preview").append(funcaoObjetivo[j]);
		$("#preview").append("X"+j+" + ");
	}
	$("#preview").append("<br><br>");

	for(i=1;i<=restricoes;i++){
		$("#preview").append(basica[i]+" |");
		for(j=1;j<=variaveis;j++){
			$("#preview").append(A[i][j]);
			$("#preview").append("X"+j+" + ");
		}
		$("#preview").append(" = "+b[i]);
		$("#preview").append("<br>");
	}
	$("#preview").append("<br>--------------------------------------------<br>");
	for(j=1;j<=variaveis;j++){
		if(Cr[j]>m||-m>Cr[j]){
			if(Cr[j]>0)
				$("#preview").append("M | ");		
			else
				$("#preview").append("-M | ");
		}
		else
		$("#preview").append(Cr[j]+" | ");
	}

}

function atualizaMax(){
	$("#max").empty();
	if(max)	$("#max").append("Minimizar");
	else	$("#max").append("Maximizar");
	max=!max;
}