const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

const setCookie = (name: string, value: string, days: number): void => {
  if (typeof document === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookieValue =
    encodeURIComponent(value) +
    '; expires=' +
    expires.toUTCString() +
    '; path=/';
  document.cookie = name + '=' + cookieValue;
};

export { getCookie, setCookie };
