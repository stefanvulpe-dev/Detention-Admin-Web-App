const form = document.getElementById('importData');

form.addEventListener('submit', async event => {
  event.preventDefault();
  const files = document.getElementById('myFileUpload').files;
  if (files.length > 0) {
    const file = files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    const formData = new FormData();
    formData.append('file', file);

    let request;

    if (fileExtension === 'json') {
      request = fetch('/uploadJSON', {
        method: 'POST',
        body: formData,
      });
    } else if (fileExtension === 'csv') {
      request = fetch('/uploadCSV', {
        method: 'POST',
        body: formData,
      });
    } else {
      alert('The file extension is not CSV or JSON.');
      return;
    }

    const response = await request;
    if (response.error) {
      alert(response.error);
    } else {
      window.location.replace('/views/userProfile.html');
      alert('Fisier transmis cu succes');
    }
  } else {
    alert('The file was not uploaded correctly.');
  }
});
