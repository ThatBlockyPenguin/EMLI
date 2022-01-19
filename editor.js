const src = document.getElementById('src');
const iframe = document.getElementById('frame');

document.getElementById('form').onsubmit = (e) => {
  e.preventDefault(true);
  iframe.srcdoc = src.value;
};
