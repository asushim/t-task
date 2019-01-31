function findG0Cells(transportData, scoringMatrix) {
	var g0 = [];

	for(var i = 0; i < transportData.length; i++)
		for(var j = 0; j < transportData[i].length; j++) 
			if(transportData[i][j] == 0 && scoringMatrix[i][j].greater(0))
				g0.push({i, j, g:'0'});

	return g0;
}

function rebuildScoringMatrix(scoringMatrix, basisMatrix, cell) {

	const cellValue = scoringMatrix[cell.i][cell.j];

	const rowVisited = new Array(scoringMatrix.length).fill(false);
	const colVisited = new Array(scoringMatrix[0].length).fill(false);

	var rows = [cell.i];
	var cols = [];

	var cellIdxes = [];

	while(true) {
		rows.forEach(i => {
			for(var j = 0; j < scoringMatrix[i].length; j++) {
				if(!colVisited[j] && basisMatrix[i][j])
					cols.push(j);

				scoringMatrix[i][j] = scoringMatrix[i][j].sub(cellValue);
				cellIdxes.push({i, j, g: 'red'});
			}
			rowVisited[i] = true;
		});

		if(cols.length == 0)
			break;

		rows = [];

		cols.forEach(j => {
			for(var i = 0; i < scoringMatrix.length; i++) {
				if(!rowVisited[i] && basisMatrix[i][j])
					rows.push(i);

				scoringMatrix[i][j] = scoringMatrix[i][j].add(cellValue);
				cellIdxes.push({i, j, g: 'red'});
			}
			colVisited[j] = true;
		});

		if(rows.length == 0)
			break;

		cols = [];
	}

	return cellIdxes;
}

function findMaxScore(set, scoringMatrix) {
	let maxValue = undefined;
	let newCell = undefined;

	//Выбираем клетку с наиб. по модулю оценкой.
	set.forEach(el => {
		if(maxValue == undefined || scoringMatrix[el.i][el.j].greater(maxValue)) {
			maxValue = scoringMatrix[el.i][el.j];
			newCell = el;
		}
	});
	return newCell;
}

function potentialMethodIteration(iter, transportData, basisMatrix, basisArray, scoringMatrix) {
	print('Итерация ' + (iter + 1));

	const g0 = findG0Cells(transportData, scoringMatrix);

	if(iter == 0){
		// reportPotentialIter1(g0, gd);
	} else {
		const g0str = g0.map(el => `(${el.i + 1};${el.j + 1})`).join(', ');
		print(`<font color='green'>G<sub>0</sub></font> = {<i>i,j</i> : x<sub><i>i,j</i></sub> = 0, △<sub><i>i,j</i></sub> > 0}</b> = { ${g0str} }`);
	}

	const merged = [...g0];

	if(merged.length == 0) {
		print('Полученное множество пусто, а значит, план оптимален:');
		return true;
	}

	const newCell = findMaxScore(merged, scoringMatrix);

	if(iter == 0)
		reportPotentialIter1_2(newCell);
	else
		print(`Выбираем из <font color='green'>G<sub>0</sub></font> и <font color='blue'>G<sub>d</sub></font> клетку с наибольшей по модулю оценкой: это (${newCell.i + 1};${newCell.j + 1}).
			Строим от нее цикл пересчета по базисным клеткам.`);

	//Строим цикл пересчета.
	const loop = findLoop(newCell.i, newCell.j, basisMatrix);

	var iter = newCell.g == 'd';
	print(loop.map(el => `(${el.i + 1};${el.j + 1})(${(iter = !iter) ? '+' : '-'})`).join(' → '));

	iter = !iter;

	const plusMinus = new Array(transportData.length).fill([]).map(() => new Array(transportData[0].length).fill(undefined));
	
	loop.forEach(el => {
		plusMinus[el.i][el.j] = iter ? '+' : '-';
		iter = !iter;
	});

	var moveSize = BIGGEST_VALUE;
	var oldCell;

	for(var i = 1; i < loop.length; i+=2) {
		const franxx = loop[i];
		const loopValue = transportData[franxx.i][franxx.j];
		
		const current = loopValue;

		if(current < moveSize) {
			moveSize = current;
			oldCell = franxx;
		}
	}

	if(newCell.g == 'd')
		moveSize = -moveSize;

	reportSpecial(transportData, scoringMatrix, merged, plusMinus, oldCell, [...basisArray, {i:newCell.i, j:newCell.j, g:'border'}]);

	loop.forEach(el => {
		transportData[el.i][el.j] += moveSize;
		moveSize = -moveSize;
	});

	var cellIdxes;

	if(newCell.i != oldCell.i || newCell.j != oldCell.j){
		basisMatrix[oldCell.i][oldCell.j] = false;
		cellIdxes = rebuildScoringMatrix(scoringMatrix, basisMatrix, newCell);
		basisMatrix[newCell.i][newCell.j] = true;

		basisArray = [];

		for(var i = 0; i < basisMatrix.length; i++)
			for(var j = 0; j < basisMatrix[i].length; j++)
				if(basisMatrix[i][j])
					basisArray.push({i, j});
	}

	reportSpecial2(transportData, plusMinus, oldCell, newCell, Math.abs(moveSize), basisArray, scoringMatrix, cellIdxes);

	return false;
}