function chapter1() {
	let person = {
		firstName: "Bob",
		lastName: "Loblaw",
		address: {
			street: "123 Fake St",
			city: "Emberton",
			state: "NJ"
		}
	}
	function giveAwesomePowers(person) {
		person.specialPower = "invisibility";
		return person;
	}
	// Initially, Bob has no powers
	console.log(person);
	// Then we call our function...
	let samePerson = giveAwesomePowers(person);
	// Now Bob has powers!
	console.log(person);
	console.log(samePerson);
}

function chapter2() {
	const a = [1, 2, 3];
	const copy1 = [...a];
	const copy2 = a.slice();
	const copy3 = a.concat();
	a[0] = 10;
	a.sort((a, b) => a <= b ? -1 : 1);
	console.log(a, copy1, copy2, copy3);
}

function chaper3() {
	const person = {
		name: "Chondan",
		age: 22,
	}
	function giveAwesomePowers(person) {
		const newPerson = Object.assign({}, person, {
			specialPower: "visibility",
		});
		return newPerson;
	}
	const personWithPower = giveAwesomePowers(person);
	console.log(person, personWithPower);
}	

function chaper4() {
	const nums = [1, 2, 3];
	const newNums = [...nums];
	console.log(nums === newNums);
	const person = {
		name: "Chondan",
		age: 22,
	}
	const olderPerson = { ...person, age: 23 };
	console.log(person, olderPerson);

	const house = {
		color: "red",
		rooms: ["bedroom", "bathroom"]
	}
	const newHouse = {...house, color: "blue"};
	const anotherHouse = {...house, rooms: [...house.rooms], color: "green"};
	house.rooms[0] = "living rooms";
	console.log("house: ", house);
	console.log("newHouse: ", newHouse);
	console.log("anotherHouse: ", anotherHouse);
}

function chapter5() {
	const person = {
		name: "Chondan", 
		age: 22
	}
	const key = "name";
	const newPerson = {
		...person, 
		[key]: person[key] + " Susuwan"
	}
	person.name = "Mohamed Salah";
	console.log(person, newPerson);
}

function chapter6() {
	const numbers = [1, 2, 3];
	const x = 0;
	const newNumbers = [x, ...numbers];
	console.log(numbers, newNumbers);
	const items = [5, 6, 7];
	const newItems = items.slice();
	newItems.push(8);
	console.log(items, newItems);
}

function chapter7() {
	const players = [{ name: "Mohamed Salah", team: "Liverpool" }, { name: "Paul Pogba", team: "Man utd" }];
	const updatedPlayers = players.map(player => {
		if (player.name == "Paul Pogba") {
			return {
				...player,
				team: "Juventus"
			}
		}
		return player;
	});
	console.log(players, updatedPlayers);
}

function chapter8() {
	// slice(start, end) vs splice(index, numberOfItemToRemove, [...items to add])
	const numbers = [1, 2, 3, 4, 5];
	const newNumbers = numbers.slice();
	newNumbers.splice(2, 0, 5);
	console.log(numbers, newNumbers);
}

function chapter9() {
	const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const evenNumbers = numbers.filter(num => num % 2 == 0);
	console.log(numbers, evenNumbers);
}
