const user = document.querySelector('body').dataset.user;

document.querySelector('body').addEventListener('click', (e) => {
  const target = e.target;

  const needLoginUserEl = target.closest('[data-need-login-user]');
  if (!needLoginUserEl) return;

  if (!user) return location.assign('/auth/login/0');
  const { link } = needLoginUserEl.dataset;

  if (link) location.assign(link);
});
