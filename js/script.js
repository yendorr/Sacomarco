const maxVariaveis = 12, minVariaveis = 1, maxRestricoes = 12, minRestricoes = 1;
const M = (27+10+1998)*999999999999999999999999999, m = 999999999999999999999999999;
var variaveis = 3,restricoes = 3;
var max = false;
var i,j,j;
var pivoI, pivoJ;
var b = [], Cr = [], A = [], funcaoObjetivo = [], s = [], ba = [];
var basica = [], naoBasica = [],sobra = [], deOnde = [], artificial = [],basesVisitadas = [];
var contadorBasicas, contadorSobras, contadorArtificiais, contadorVisitadas;

primeiraExecução = true;
for(i=0;i<=maxVariaveis*3;i++){
	basesVisitadas[i] = [];

	A[i] = [];
} 

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
		$("#tabela").append("<sub>"+i+" </sub>");
		if(i!=variaveis)	$("#tabela").append(" + ");		
	}
	$("#tabela").append("<br><br>");
	//coloca tabela restiçoes _times variaveis		
	for(i=1;i<=restricoes;i++){
		for(j=1;j<=variaveis;j++){
			$("#tabela").append("<input class='Input' type='text' id='A"+i+j+"'> X");
			$("#tabela").append("<sub>"+j+" </sub");
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
		funcaoObjetivo[i] = null;
		$("#z"+i).val(null);
		for(j=0;j<=variaveis;j++){
			A[i][j] = null;
			$("#A"+i+j).val(null);
		}
		b[i] = null;
		$("#b"+i).val(null);
		$("#foto").empty();
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
	ColocaFoto();
	resolve();
}

function resolve(){
	zeraContadores();
	formaPadrao();
	previewFuncaoObjetivo();
	calculaCr();
	pivoJ = escolheNaoBasica();
	calculaBa(pivoJ);
	pivoI = escolheBasica();
	console.log(A);
	preview();

	while(!deuRuim()){
		trocaBase();
		calculaCr();
		pivoJ = escolheNaoBasica();
		calculaBa(pivoJ);
		pivoI = escolheBasica();
		preview();
	}
}

function deuRuim(){
	if(CrNaoNegativo()){
		return 1;
	}
	if(baseJaVisitada()){
		return 2;
	}
	else
		salvaBase();
	if(!pivoI){
		return 3;
	}



	return 0;
}


function CrNaoNegativo(){
	for(j=1;j<variaveis;j++)
		if(Cr[j]<0)
			return false;
	return true;
}

function baseJaVisitada(){
	var visitada;
	for (i=1;i<=contadorVisitadas;i++){
		visitada = true;
		for(j=1;j<=restricoes;i++){
			if(basica[j]!=basesVisitadas[i][j])
				visitada = false;
		}
		if(visitada)	return true;
	}
	return false;
}

function salvaBase(){
	contadorVisitadas++;
	for(j=1;j<=restricoes;j++)
		basesVisitadas[contadorVisitadas][j]=basica[j];
}


function zeraContadores(){
	contadorBasicas = 0;
	contadorSobras = 0;
	contadorArtificiais = 0;
	contadorVisitadas = 0;

	variaveis = $("#variaveis").val();
	restricoes = $("#restricoes").val();
}

function formaPadrao(){
	if(max)
		for(j=1;j<=variaveis;j++)
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
				s[i] = '<';
			else if(s[i]=='<')
				s[i] = '>';

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
		A[j][variaveis] = 0;
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
		Cr[j] = funcaoObjetivo[j] - soma;
	}
}

function calculaBa(coluna){
	for(i=1;i<=restricoes;i++)
		if (A[i][coluna])
			ba[i] = b[i]/A[i][coluna];
		else
			ba[i] = M;
}	

function escolheBasica(){
	var menorValor, indice;
	menorValor = m;
	indice = 0;
	for(i=1;i<=restricoes;i++)
		if(ba[i]<menorValor && ba[i]>0){
			menorValor = ba[i];
			indice = i;
		}
	return indice;
}

function escolheNaoBasica(){
	var menorValor,indice;
	menorValor = Cr[1];
	indice = 1;
	for(j=2;j<=variaveis;j++)	
		if(Cr[j]<menorValor &&Cr[j]<0){
			menorValor = Cr[j];
			indice = j;
		}
	return indice;
}

function trocaBase(){
	basica[pivoI] = pivoJ;
}

function ColocaFoto(){
	 var ap = "<img src='img/Rodney.jpg' data-toggle='modal' data-target='#folha'>";

	 $("#foto").empty();
	 $("#foto").append(ap);
}

function previewFuncaoObjetivo(){
	$("#preview").empty();
	$("#preview").append("Z = ");
	for(j=1;j<=variaveis;j++){

		if(funcaoObjetivo[j]>m)
		$("#preview").append("M");	
		else
		$("#preview").append(funcaoObjetivo[j]);

		$("#preview").append("X<sub>"+j+"</sub>");
		if(j!=variaveis)
			$("#preview").append(" +");
	}
}

function preview(){
	$("#preview").append("<br><br>");
	$("#preview").append("<table>");
		$("#preview").append("<tr>");
			$("#preview").append("<td></td>");
			$("#preview").append("<td class='tabeleiro dir' >variaveis</td>");
			for(j=1;j<=variaveis;j++)
				$("#preview").append("<td class='tabeleiro'>X<sub>"+j+"</sub></td>");		

		$("#preview").append("</tr>");	

		$("#preview").append("<tr>");
			$("#preview").append("<td class='tabeleiro down'> bases </td>");
			$("#preview").append("<td class='down dir'> </td>");

			for(j=1;j<=variaveis;j++)
				if(funcaoObjetivo[j]<m)
					$("#preview").append("<td class='down'>"+ funcaoObjetivo[j] +"</td>");	
				else
					$("#preview").append("<td class='down'>M</td>");	

			$("#preview").append("<td class='esq down tabeleiro'>b</td>");
			$("#preview").append("<td class='down tabeleiro'>b/a</td>");
		$("#preview").append("</tr>");

		for(i=1;i<=restricoes;i++){
			$("#preview").append("<tr>");
			$("#preview").append("<td class='tabeleiro'>X<sub>"+ basica[i] +"</sub></td>");
			if(funcaoObjetivo[basica[i]]<m)
				$("#preview").append("<td class='dir'>"+ funcaoObjetivo[basica[i]] +"</td>");
			else
				$("#preview").append("<td class='dir'>M</td>");
			for(j=1;j<=variaveis;j++)
				if(pivoI==i && pivoJ==j)
					$("#preview").append("<td class='pivo'>"+A[i][j]+"</td>");
				else
					$("#preview").append("<td>"+A[i][j]+"</td>");
			$("#preview").append("<td class='esq'>"+b[i]+"</td>");			
			if(ba[i]<m)
				$("#preview").append("<td>"+ba[i]+"</td>");			
			else
				$("#preview").append("<td>ºº</tr>")
			$("#preview").append("</tr>");
		}
		$("#preview").append("<tr>");
		$("#preview").append("<td class= 'up'></td>");
		$("#preview").append("<td class='dir up'></td>");
			for(j=1;j<=variaveis;j++)
				if(Cr[j]>m)
					$("#preview").append("<td class='up'>M</td>");
				else if (Cr[j]<-m)
					$("#preview").append("<td class='up'>-M</td>");
				else
					$("#preview").append("<td class='up'>"+Cr[j]+"</td>");
			$("#preview").append("<td class='esq up'>Z</td>");
			$("#preview").append("<td class='up'></td>");
		$("#preview").append("</tr>");
	$("#preview").append("</table>");


	$("#preview").append("");

}

function atualizaMax(){
	$("#max").empty();
	if(max)	$("#max").append("Minimizar");
	else	$("#max").append("Maximizar");
	max=!max;
}