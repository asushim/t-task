//a ij - кол-во груза в ПО
//b ij - потребность в ПН
//c ij - затраты
//d ij - пропускная способность


//1 vARIANT

const senders = [10, 20, 10, 20];
const receivers = [10, 20, 20, 10];

const costs = [
[10, 15, 15, 8],
[40, 10, 30, 5],
[35, 25, 40, 10],
[0, 0, 0, 0]
]

//BARSUKOV
// const senders = [30, 84, 20, 110];
// const receivers = [56, 74, 60, 54];

// const costs = [
// [8, 14, 6, 4],
// [7, 10, 9, 7],
// [12, 16, 18, 6],
// [14, 24, 10, 9]
// ];

// const senders = [180, 90, 170];
// const receivers = [45, 45, 100, 160, 90];

// const costs = [
// 	[6, 7, 3, 2, 0],
// 	[5, 1, 4, 3, 0],
// 	[3, 2, 6, 2, 0]
// 	]