export function set_cookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + (expires + ";");
}

export function get_cookie(name) {
  let cks = document.cookie.split(";");
  for (let i = 0; i < cks.length; i++) {
    let ck = cks[i].trim();
    let [key, value] = ck.split("=");
    if (key == name) {
      return value;
    }
  }
  return "";
}

export function delete_all_cookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export function delete_cookie(name, path) {
  if (get_cookie(name)) {
    document.cookie =
      name +
      "=" +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT" +
      (path ? ";path=" + path : "");
  }
}
