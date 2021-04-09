export function elementExistsById(id:string): Boolean{
    let element : HTMLElement|null = document.getElementById(id);
    return element !==null
}
export function debounce(fn, delay) {
    var timer = null;
    return function() {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    };
  }

// The following function are copying from 
// https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
export function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export var csrftoken = getCookie('csrftoken');

export function postRequest (url, data){
const params = new URLSearchParams(data);
            return fetch(url, {
                method: "POST", 
                body: params.toString(),
                headers: { "X-CSRFToken": csrftoken,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            })
}
