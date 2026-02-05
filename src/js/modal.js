export function initModal() {
  const modal = document.getElementById('exercise-modal');
  const closeBtn = document.querySelector('.close');
  const submitBtn = document.getElementById('modal-submit-rating');

  document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-start')) {
      const id = e.target.dataset.id;
      showExerciseModal(id);
    }
  });

  closeBtn.onclick = () => modal.hidden = true;
  window.onclick = e => {
    if (e.target === modal) modal.hidden = true;
  };

  async function showExerciseModal(id) {
    try {
      const data = await fetch(`/api/exercises/${id}`);
      const json = await data.json();
      document.getElementById('modal-title').textContent = json.name;
      document.getElementById('modal-image').src = json.imageUrl;
      document.getElementById('modal-description').textContent = json.description;
      modal.hidden = false;
    } catch (err) {
      console.error('Modal load failed', err);
    }
  }
}