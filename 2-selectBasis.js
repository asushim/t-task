function goRow(basisMatrix, targetI, targetJ, fromI, fromJ, idxes) {
	for(var j = 0; j < basisMatrix[fromI].length; j++) {

		if(j == fromJ)
			continue;

		if(fromI == targetI && j == targetJ) {
			idxes.push({i:fromI, j});
			return true;
		}

		if(basisMatrix[fromI][j] && goColumn(basisMatrix, targetI, targetJ, fromI, j, idxes)) {
			if(idxes.length > 0)
				idxes.push({i:fromI, j});
			return true;
		}

	}
	return false;	
}

function goColumn(basisMatrix, targetI, targetJ, fromI, fromJ, idxes) {
	for(var i = 0; i < basisMatrix.length; i++) {

		if(i == fromI)
			continue;

		if(i == targetI && fromJ == targetJ) {
			idxes.push({i, j:fromJ});
			return true;
		}

		if(basisMatrix[i][fromJ] && goRow(basisMatrix, targetI, targetJ, i, fromJ, idxes)) {
			if(idxes.length > 0)
				idxes.push({i, j:fromJ});
			return true;
		}

	}
	return false;	
}

function findLoop(i, j, basisMatrix) {
	var idxes = [];
	const result = goRow(basisMatrix, i, j, i, j, idxes) || goColumn(basisMatrix, i, j, i, j, idxes);

	return result ? idxes : false;
}

//Выбираем по условию 0 < xij < dij
function findMainVariables(transportData) {

	const basisMatrix = new Array(senders.length).fill(false).map(() => new Array(receivers.length).fill(false));
	var founded = 0;

	for(var i = 0; i < transportData.length; i++)
		for(var j = 0; j < transportData[i].length; j++)
			if(0 < transportData[i][j]){
				basisMatrix[i][j] = true;
				founded++;
			}

	return {basisMatrix, founded};
}

//Выбираем переменную, не образующую цикл.
function findNextVariable(transportData, basisMatrix) {
	for(var i = 0; i < transportData.length; i++) { //Поменяйте эту
		for(var j = 0; j < transportData[0].length; j++) {//и эту строчку местами
			if(basisMatrix[i][j])
				continue;

			if(!findLoop(i, j, basisMatrix))
				return {i, j};
		}
	}
}

function selectBasis(transportData, targetCount) {

	const {basisMatrix, founded} = findMainVariables(transportData);

	reportBasis1(transportData, basisMatrix);
	
	const needed = targetCount - founded;

	const newCells = [];

	for(var z = 0; z < needed; z++) {
		const idx = findNextVariable(transportData, basisMatrix);

		if(idx == undefined) {
			reportFucked(needed - z);
			return;
		}

		newCells.push(idx);

		basisMatrix[idx.i][idx.j] = true;
	}

	// reportBasis2(transportData, basisMatrix, newCells, needed, targetCount);

	return basisMatrix;
}