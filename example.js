const exampleSenders = [180, 90, 170];
const exampleReceivers = [45, 45, 100, 160, 90];

const exampleCosts = [
	[6, 7, 3, 2, 0],
	[5, 1, 4, 3, 0],
	[3, 2, 6, 2, 0]
	]

function checkThisShit() {
	if(senders.length != exampleSenders.length  || receivers.length != exampleReceivers.length)
		return false;

	for(var i = 0; i < exampleSenders.length; i++)
		if(exampleSenders[i] != senders[i])
			return false;

	for(var i = 0; i < exampleReceivers.length; i++)
		if(exampleReceivers[i] != receivers[i])
			return false;

	for(var i = 0; i < exampleCosts.length; i++) {
		for(var j = 0; j < exampleCosts[i].length; j++) {
			if(exampleCosts[i][j] != costs[i][j])
				return false;
		}
	}

	return true;
}