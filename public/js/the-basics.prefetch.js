

var airports = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  // url points to a json file that contains an array of country names, see
  // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
  prefetch: '/data/airports.json'
});


// passing in `null` for the `options` arguments will result in the default
// options being used
$('.prefetch .typeahead').typeahead({
	hint:true,
	highlight: true,
	minlength: 1	
}, {
  name: 'airports',
  source: airports 
});