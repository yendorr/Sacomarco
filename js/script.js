const maxVariaveis = 12, minVariaveis = 1, maxRestricoes = 12, minRestricoes = 1;
const M = (27+10+1998)*999999999999999999999999999, m = 999999999999999999999999999;
var variaveis = 3,restricoes = 3;
var variaveisOriginais, restiçoesOriginais;
var max = false;
var temArtificial = true;
var temBaOk = true;
var i,j;
var b = [], Cr = [], A = [], funcaoObjetivo = [], s = [], ba = [], x = [];
var basica = [], naoBasica = [],sobra = [], deOnde = [], artificial = [],basesVisitadas = [];
var contadorBasicas, contadorSobras, contadorArtificiais, contadorVisitadas;
var z;
var interpretacao;


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
	$("#checkSobras").click(verSobras)
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
	resolve();
	colocaResposta();
	ColocaFoto();

}

function resolve(){
	var pivoI, pivoJ;
	zeraContadores();
	formaPadrao();
	previewFuncaoObjetivo();
	calculaCr();
	pivoJ = escolheNaoBasica();
	calculaBa(pivoJ);
	pivoI = escolheBasica();
	calculaX();
	calculaZ();
	preview(pivoI,pivoJ);

	while(!deuRuim(pivoI,pivoJ)){
		trocaBase(pivoI,pivoJ);
		escalona(pivoI,pivoJ);
		calculaCr();
		pivoJ = escolheNaoBasica();
		calculaBa(pivoJ);
		pivoI = escolheBasica();
		calculaX();
		calculaZ();
		preview(pivoI,pivoJ);
	}
		previewExtra();
}

function escalona(I,J){
	var pivo = A[I][J];
	var multiplicador;

	for(j=1;j<=variaveis;j++)
		A[I][j]/=pivo;
		b[I]/=pivo;
	
	for(i=1;i<I;i++){
		multiplicador = A[i][J];
		for(j=1;j<=variaveis;j++)
			A[i][j]-=A[I][j] * multiplicador;
			b[i]-=b[I] * multiplicador;
	}

	for(i=I+1;i<=restricoes;i++){
		multiplicador = A[i][J];
		for(j=1;j<=variaveis;j++)
			A[i][j]-=A[I][j] * multiplicador;
			b[i]-=b[I] * multiplicador;
	}

}

function deuRuim(i,j){
	if(CrNaoNegativo()){

		interpretacao = "O custo reduzido de todas as variaveis não é mais negativo";
		// if(baseJaVisitada()){
		// 	return 3;
		// }
		return 1;
	}
	// else
	// 	salvaBase();
	if(!i){
		return 3;
	}
	if(!j){
		return 4;
	}


	return 0;
}


function CrNaoNegativo(){
	for(j=1;j<variaveis;j++)
		if(Cr[j]<0)
			return false;
	return true;
}

// function baseJaVisitada(){
// 	var visitada;
// 	for (i=1;i<=contadorVisitadas;i++){
// 		visitada = true;
// 		for(j=1;j<=restricoes;i++){
// 			console.log("j = "+j);
// 			console.log("basica = "+basica[j]);
// 			console.log("visitada = "+basesVisitadas[i][j] );
// 			if(basica[j]!=basesVisitadas[i][j])
// 				visitada = false;
// 		}
// 		if(visitada)	return true;
// 	}
// 	salvaBase();
// 	return false;
// }

function salvaBase(){
	contadorVisitadas++;
	for(j=1;j<=restricoes;j++)
		basesVisitadas[contadorVisitadas][j]=basica[j];
}

function calculaX(){

	for(j=1;j<=variaveis;j++)
		x[j] = 0

	for(i=1;i<=restricoes;i++)
		x[basica[i]] = b[i];
	
}

function calculaZ(){
	z = 0;
	for(j=1;j<=variaveisOriginais;j++)
		z += x[j]*funcaoObjetivo[j];
	if(max)
		z = -z;
}


function zeraContadores(){
	contadorBasicas = 0;
	contadorSobras = 0;
	contadorArtificiais = 0;
	contadorVisitadas = 0;

	variaveis = $("#variaveis").val();
	restricoes = $("#restricoes").val();
	variaveisOriginais = variaveis;
	restiçoesOriginais = restricoes;
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
	temArtificial = true;

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
	temArtificial
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

		if(temBaOk){
			temBaOk = false;
			for(i=1;i<=restricoes;i++){
				if (ba[i]>0 && ba[i]<m) temBaOk = true;
			}
		}
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
	menorValor = m;
	indice = 0;
	for(j=1;j<=variaveis;j++)	
		if(Cr[j]<menorValor &&Cr[j]<0){
			menorValor = Cr[j];
			indice = j;
		}
	return indice;
}

function trocaBase(I,J){
	basica[I] = J;
	if(temArtificial)
		verificaArtificiais();
}

function verificaArtificiais(){
	for(i=1;i<=contadorArtificiais;i++){
		for(j=1;j<=restricoes;j++){
			if(artificial[i]==basica[j]){
				temArtificial = true
				return 1;
			}
		}
	}
	temArtificial = false;
	return 0;
}

function colocaResposta(){
	var tabela
	$("#resultados").empty();
	if(temArtificial){
		$("#resultados").append("X = { }");
		$("#resultados").append("<br><br>");
	}
	else{
		$("#resultados").append("z = "+z+"<br><br>");
		coluna1 = "";
		coluna2 = "<table class='vetor'>";
		for(j=1;j<=variaveisOriginais;j++){
			coluna2+="<tr><td>"
			coluna2+=x[j];
			coluna2+="</td></tr>"
		}
		coluna2+="</table>"
		$("#resultados").append("<table style='text-align=center;'><tr><td id='chess'>X = </td><td>"+coluna2+"<td></tr></table>");
		if(!temBaOk && !(CrNaoNegativo())){
		$("#resultados").append("<br>");
			$("#resultados").append("e outas infinitas soluções");
		}
				$("#resultados").append("<br><br>");

	}

	$("#checkSobras").prop('checked', false);
	$("#divSobras").collapse('hide');
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

function preview(I,J){
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
				if(I==i && J==j)
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
			if(temArtificial)
				$("#preview").append("<td class='esq up red'>"+z+"</td>");
			else
				$("#preview").append("<td class='esq up green'>"+z+"</td>");
			$("#preview").append("<td class='up'></td>");
		$("#preview").append("</tr>");
	$("#preview").append("</table>");
}

function previewExtra(){
	$("#divSobras").empty();
	for(i=1;i<=restricoes;i++)
		if(x[sobra[i]]){
		$("#divSobras").append("Restrição "+i+": x<sub>"+sobra[i]+"</sub> = "+x[sobra[i]]);
		$("#divSobras").append("<br>");
	}
}

function verSobras(){
	$('#divSobras').collapse('toggle'); 
    
}

function atualizaMax(){
	$("#max").empty();
	if(max)	$("#max").append("Minimizar");
	else	$("#max").append("Maximizar");
	max=!max;
}