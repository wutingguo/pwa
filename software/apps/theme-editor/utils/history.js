export function goBack() {
  history.go(-1);
  const software = document.getElementsByClassName('active-app');
  if (software && software.length > 0) {
    software.navbar.style.height = '48px';
    software.software.style.top = '48px';
  }
}
