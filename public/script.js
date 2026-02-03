document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule');
  const searchInput = document.getElementById('search');
  let talks = [];

  // Fetch talk data from the API
  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      talks = data;
      renderTalks(talks);
    })
    .catch(error => {
      console.error('Error fetching talks:', error);
      scheduleContainer.innerHTML = '<p class="text-center text-danger">Could not load talks. Please try again later.</p>';
    });

  // Render talks to the DOM
  function renderTalks(talksToRender) {
    scheduleContainer.innerHTML = '';
    talksToRender.forEach(talk => {
      const talkElement = document.createElement('div');
      talkElement.classList.add('talk', 'row');
      
      const time = `
        <div class="col-md-2 text-center">
            <h6>${talk.startTime} - ${talk.endTime}</h6>
        </div>
      `;

      const talkDetails = `
        <div class="col-md-10">
            <h5>${talk.title}</h5>
            <p><strong>Speakers:</strong> ${talk.speakers.join(', ')}</p>
            <p>${talk.description}</p>
            <div>
                ${talk.category.map(cat => `<span class="badge badge-primary mr-2">${cat}</span>`).join('')}
            </div>
        </div>
      `;

      talkElement.innerHTML = time + talkDetails;
      scheduleContainer.appendChild(talkElement);
    });
  }

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTalks = talks.filter(talk => {
      return talk.category.some(cat => cat.toLowerCase().includes(searchTerm));
    });
    renderTalks(filteredTalks);
  });
});
