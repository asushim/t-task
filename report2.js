function reportBasis1(transportData, basisMatrix) {
	print('<h1>Этап 2: Метод потенциалов.</h1>');
	print('<h3>Шаг 1: Выбор базисных переменных.</h3>');
	print('Прежде всего, выберем так называемые "базисные переменные".')
	print('Сперва выбираем в нашем плане все клетки, значение которых больше нуля.');

	rp1(transportData, basisMatrix);
}

function reportBasis2(transportData, basisMatrix, newCells, needed, target) {

	rp1(transportData, basisMatrix);
}

function reportPotentials(uArray, vArray, basisArray) {
	print('<h3>Шаг 2: Вычисление потенциалов.</h3>');
	print(`Ладно, с базисными клетками мы разобрались. Теперь нам нужно найти потенциалы всех пунктов,
		которые обозначаются как U<sub>i</sub> для отправителей, и V<sub>j</sub> - для получателей. Не вздумайте перепутать!`);
	print('Необходимо, чтобы для базисных клеток выполнялось вот такое вот равенство:');
	print('<b>V<sub>j</sub> - U<sub>i</sub> = <font color="blue">c<sub>ij</sub></font></b> (1)');

	print('Составим систему уравнений и по цепочке найдем все потенциалы, полагая, что U<sub>1</sub> = 0.');

	var split1;
	var split2;

	if(basisArray.length > 8) {
		split1 = basisArray.slice(0, basisArray.length / 2);
		split2 = basisArray.slice(basisArray.length / 2, basisArray.length);
	} else {
		split1 = basisArray;
	}

	const s = sum(receiversLeft);
	const customData = [...transports.map((row, idx) => [...row, uArray[idx]]), vArray];

	var str = '<div style="display: inline-block;">' + 
		createTable(customData, undefined, infCosts, [...receivers, 'U<sub>i</sub>'], [...senders, 'V<sub>j</sub>'], basisArray) +
		'</div><div style="display: inline-block; margin-left: 30px; vertical-align:top;"><p>' +
		split1.map(el => `<b>V<sub>${el.j + 1}</sub> - U<sub>${el.i + 1}</sub> = ${infCosts[el.i][el.j]}`).join('</p><p>') + 
		'</p></div>';

	if(split2)
		str += '<div style="display: inline-block; margin-left: 30px; vertical-align:top;"><p>' +
		split2.map(el => `<b>V<sub>${el.j + 1}</sub> - U<sub>${el.i + 1}</sub> = ${infCosts[el.i][el.j]}`).join('</p><p>') + 
		'</p></div>';

	print(str);

	print(`Можете убедиться в правильности расчетов: пикните какую-нибудь <font color="red">базисную</font> клетку, выберите V из нижней строчки, и U из правого столбика,
		вычтите V - U, и это будет равно <font color="blue">стоимости</font> для этой клетки.`)
}

function reportScoringMatrix(scoringMatrix, basisArray) {
	print('<h3>Шаг 3: Матрица оценок.</h3>');
	print('Теперь, когда у нас есть значения всех потенциалов, построим матрицу оценок.');
	print(`Найдем оценки во всех клетках по формуле <b>△<sub>ij</sub> = V<sub>j</sub> - U<sub>i</sub> - <font color="blue">c<sub>ij</sub></font></b>.
		Самые умные наверняка уже сравнили эту формулу с (1), и поняли, что для базисных клеток △<sub>ij</sub> будет 0.`);

	print(createTable(scoringMatrix, undefined, undefined, undefined, undefined, basisArray));
	
	print(`Начиная с этого момента, можете спокойно забыть про таблицу <font color='blue'>стоимостей</font>. Она нам больше не потребуется, поскольку теперь
		при оценивании клеток мы руководствуемся матрицей оценок.`);
}

function reportPotentialIter1(g0, gd) {

	// enableBuffered();

	// print('<details open><summary>Объяснение выбора множеств G<sub>0</sub> и G<sub>d</sub> (развернуть)</summary>')

	const g0str = g0.map(el => `(${el.i + 1};${el.j + 1})`).join(', ');
	const gdstr = gd.map(el => `(${el.i + 1};${el.j + 1})`).join(', ');

	let rep = `Найдем в транспортной таблице все клетки, которые <b>равны нулю</b>, но имеют соответствующую <b>оценку больше нуля</b>.`;

	if(g0.length > 0)
		rep += ` У нас такие клетки имеются (обозначены зеленым цветом).`;
	else
		rep += ' У нас таких клеток пока что нет.'

	print(rep);

	print(`Вот в чем смысл таких клеток: раз их оценка положительна, но при этом само их значение нулевое, то это значит,
	что они могли бы подойти для перевозки груза. Понятно? Вообще, считайте, что <b>оценка клетки - это показатель, насколько она подходит
	для того, чтобы вместить нее еще больше груза</b>.`);
	print('Математически множество таких клеток записывается так:');
	print(`${g0_char} = {<i>i,j</i> : x<sub><i>i,j</i></sub> = 0, △<sub><i>i,j</i></sub> > 0}</b> = { ${g0str} }`);

	print(`${gd_char}, по сути, работает наоборот: мы ищем клетки, которые <b>равны их ограничению d<sub><i>ij</i></sub></b>,
		но имеют <b>оценку меньше нуля</b>. Отрицательная оценка говорит о том, что эти клетки мало подходят для перевозки, но почему-то при этом они заполнены по максимуму 
		и их следовало бы разгрузить.`);

	print(`${gd_char} = {<i>i,j</i> : x<sub><i>i,j</i></sub> = d<sub><i>ij</i></sub>, △<sub><i>i,j</i></sub> < 0}</b> = { ${gdstr} }`);
	// print('</details>');

	// flushBuffer();
}

const g0_char = '<font color="green">G<sub>0</sub></font>';
const gd_char = '<font color="blue">G<sub>d</sub></font>';

function reportPotentialIter1_2(newCell) {
	print(`Теперь выбираем из ${g0_char} и ${gd_char} клетку с наибольшей <b>по модулю</b> оценкой,
		поскольку мы хотим сперва заполнить/разгрузить наиболее подходящую для этого клетку. Наибольшую по модулю оценку имеет клетка (${newCell.i + 1};${newCell.j + 1})
		из множества ${newCell.g == '0' ? g0_char : gd_char}.`);

	print(`Теперь построим от нее цикл пересчета по базисным клеткам. Напомню правила его построения: можно двигаться только по вертикали или горизонтали, и менять направление
		только в базисных клетках.`);
	print(`Для каждой клетки цикла мы определяем, вычитаем ли мы из нее груз или прибавляем. Определиться со знаками можно очень просто: если в клетке начала цикла <b>значение 0,
		то ставим "+"</b>, т.к. мы хотим заполнить ее грузом. Если значение <b>не ноль - ставим "-"</b>, т.к. ее наоборот, нужно разгрузить. Затем знак просто чередуется.`);
	print('Направление цикла не имеет значения, поскольку число его вершин всегда четно.')
	print('Получаем вот такой цикл:')
}

function reportSpecial(transportData, scoringMatrix, merged, plusMinus, oldCell, colors) {

	for(var i = 0; i < colors.length; i++)
		if(colors[i].i == oldCell.i && colors[i].j == oldCell.j) {
			colors[i].g = 'colored-and-gray';
			break;
		}

	print('<div style="display: inline-block">' +
 	'Транспортная таблица' +
 	createTable(transportData, undefined, plusMinus, undefined, undefined, colors) +
 	'</div><div style="display: inline-block; margin-left: 20px;">' +
 	'Матрица оценок' +
 	createTable(scoringMatrix, undefined, undefined, undefined, undefined, merged) +
 	'</div>');
}

function reportSpecial2(transportData, plusMinus, oldCell, newCell, moveSize, colors, scoringMatrix, cellIdxes) {

	const equals = newCell.i == oldCell.i && newCell.j == oldCell.j;

	print(`Собственно, определяем, сколько груза можно таскать. Это определяет клетка (${oldCell.i + 1};${oldCell.j + 1}).
			Ее значение: ${moveSize}.`);

	if(moveSize == 0)
		print('Раз таскать нечего, то транспортная матрица не меняется, а только пересчитывается таблица оценок.');

	if(!equals)
		print(`Вспоследствии она выбывает из базиса, зато (${newCell.i + 1};${newCell.j + 1}) - вносится.`);
	else
		print(`Мы добавляем эту клетку в базис, но ее же и сразу оттуда выносим. В результате базисные переменные не меняются, и матрица оценок не пересчитывается.`);

	print('<div style="display: inline-block">' +
 	(moveSize == 0 ? 'Транспортная таблица не меняется' : `К ячейкам "+" добавляем, ${moveSize}, из ячеек "-" - вычитаем.<br>Получаем новую транспортную таблицу:`) +
 	createTable(transportData, undefined, moveSize == 0 ? undefined : plusMinus, undefined, undefined, colors) + (equals ? '' :
 	'</div><div style="display: inline-block; margin-left: 20px;">' +
 	`Из строк таблицы оценок вычитаем значение ячейки (${newCell.i + 1};${newCell.j + 1}),<br>к столбцам его прибавляем.` +
 	createTable(scoringMatrix, undefined, undefined, undefined, undefined, cellIdxes)) +
 	'</div>');
}
