var infCosts = costs.map(row => row.map(val => new VirtualNumber(0, val)));

function calcPotentials(basisArray) {
	//const vCosts = costsData.map(row => row.map(el => el == BIGGEST_NUMBER ? new VirtualNumber(1, 0) : new VirtualNumber(0, el)));

	const uArray = new Array(infCosts.length).fill(undefined);
	const vArray = new Array(infCosts[0].length).fill(undefined);

	uArray[0] = new VirtualNumber(0, 0);

	//v - u = c;

	//v = u + c;
	//u = v - c;
	// for(var b = 0; b < 100; b++)
	while(true) {

		basisArray.forEach(el =>{
			const {i, j} = el;
			if(!uArray[i] && vArray[j])
				uArray[i] = vArray[j].sub(infCosts[i][j])
			if(!vArray[j] && uArray[i])
				vArray[j] = uArray[i].add(infCosts[i][j]);
		});

		if(!vArray.some(el => el == undefined) && !uArray.some(el => el == undefined))
			break;
	}

	reportPotentials(uArray, vArray, basisArray);

	return {uArray, vArray};
}

function buildScoringMatrix(uArray, vArray) {

	var scoringMatrix = [];

	for(var i = 0; i < infCosts.length; i++) {
		var row = [];
		for(var j = 0; j < infCosts[0].length; j++)
			row.push(vArray[j].sub(uArray[i]).sub(infCosts[i][j]));
		scoringMatrix.push(row);
	}

	return scoringMatrix;
}

function potentialMethod(transportData, basisMatrix) {

	const s = sum(sendersLeft);

	var basisArray = [];

	for(var i = 0; i < basisMatrix.length; i++)
		for(var j = 0; j < basisMatrix[i].length; j++)
			if(basisMatrix[i][j])
				basisArray.push({i, j});

	const {uArray, vArray} = calcPotentials(basisArray);

	var scoringMatrix = buildScoringMatrix(uArray, vArray, basisArray);
	reportScoringMatrix(scoringMatrix, basisArray);

	print('<h3>Шаг 4: Работа метода потенциалов.</h3>');

	for(var b = 0; b < 100; b++) {

		const result = potentialMethodIteration(b, transportData, basisMatrix, basisArray, scoringMatrix);

		basisArray = [];

		for(var i = 0; i < basisMatrix.length; i++)
			for(var j = 0; j < basisMatrix[i].length; j++)
				if(basisMatrix[i][j])
					basisArray.push({i, j});

		if(result)
			return transportData;
	}
	// print(basisArray.map(el => `${el.i};${el.j}`).join(', '));
}
