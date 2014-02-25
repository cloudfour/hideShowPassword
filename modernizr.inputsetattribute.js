Modernizr.addTest('inputsetattribute', function(){
  var body = document.body
    , input = document.createElement('input')
    , result = true;
  if (! body) {
    body = document.createElement('body');
  }
  input = body.appendChild(input);
  try {
    input.setAttribute('type', 'text');
  } catch (e) {
    result = false;
  }
  body.removeChild(input);
  return result;
});