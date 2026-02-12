async function fetchData() {
	const loadingEl = document.getElementById('loading');
	try {
		// show loading indicator
		loadingEl.style.display = 'block';

		// fetch data from api
		const response = await fetch('https://jsonplaceholder.typicode.com/users');
		if (!response.ok) throw new Error('Network response was not ok');
		const users = await response.json();
		renderData(users);
	} catch (error) {
		console.error('Error fetching data:', error);
		alert('Failed to fetch data');
	} finally {
		loadingEl.style.display = 'none';
	}
}

function renderData(data) {
	const dataBody = document.getElementById('dataBody');
	dataBody.innerHTML = '';
	data.forEach((user) => {
		const row = document.createElement('tr');
		row.innerHTML = `
			<td>${user.id}</td>
			<td>${user.name}</td>
			<td>${user.email}</td>
		`;
		dataBody.appendChild(row);
	});
}

fetchData();
