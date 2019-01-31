document.addEventListener('DOMContentLoaded', start);

function start() {
	//Тем кто читает и возможно хочет понять этот код:
	//Можете не брать во внимание все функции, начинающиеся на report.
	//Они всего лишь выводят (в html) тексты и таблицы.
	//Их код можете найти в файле report.js.
	//Если потереть эти вызовы, прога даже не сломается.

	// reportIntro();

	// if(!checkValid())
		// return;

	// buildInitPlan(); //Смотрим объявление в файле initPlan.js
	// reportResultTable();

	const rowsCount = senders.length;
	const colsCount = receivers.length;

	// transports = [
	// [45, 45, 90, 0, 0],
	// [0, 0, 10, 80, 0],
	// [0, 0, 0, 80, 90],
	// ];

	transports = new Array(senders.length).fill([]).map(() => new Array(receivers.length).fill(0));

	sendersLeft = senders.slice();
	receiversLeft = receivers.slice();

	var i = 0;
	var j = 0;
	while(i < sendersLeft.length && j < receiversLeft.length) {
		const val = Math.min(sendersLeft[i], receiversLeft[j]);
		sendersLeft[i] -= val;
		receiversLeft[j] -= val;
		transports[i][j] = val;

		if(sendersLeft[i] == 0)
			i++;
		if(receiversLeft[j] == 0)
			j++;

	}

	const basisMatrix = selectBasis(transports, rowsCount + colsCount - 1);

	//ПО + ПН - 1 !!!
	// const basisMatrix = [
	// [true, true, true, false, false],
	// [false, false, true, true, false],
	// [false, false, false, true, true],
	// ];

	const resultPlan = potentialMethod(transports, basisMatrix);

	checkIsRealPlan(resultPlan);

	print(createTable(resultPlan, undefined, costs, receivers, senders));

	checkValidResultPlan(resultPlan);

	var criteria = 0;

	for (var i = 0; i < resultPlan.length; i++)
		for (var j = 0; j < resultPlan[i].length; j++)
			criteria += resultPlan[i][j] * costs[i][j];

	print(`Значение критерия: <b>${criteria}</b>`);
}
