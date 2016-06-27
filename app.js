var app = firebase.database()
var storageRef = firebase.storage().ref();

app.ref('photos').on('value', function(results) {
	$('.cat-container').empty()

	results.forEach(function(photoContainer) {

		var data = photoContainer.val()
		var comments = data.comments;
		var commentContainer = $('#catCommentContainer');

		var html =
		'<div class="col-md-4">' +
			'<img src="' + data.url + '" width="100%"/>' +
			'<h2>' + data.name + '</h2>' +
			'<p>' + data.description  + '</p>' +	
			'<ul class="nav nav-pills bottom-buffer" role="tablist">' +
				'<li role="presentation" class="active">'  +
					'<a href="#" class="likeCat">Adorable<span class="badge">' + data.likes + '</span>' + '</a>' +
				'</li>' +
				'<li role="presentation pull-right">' +
					'<a href="#" class="triggerCommentModal">Comment<span class="badge">'+ (data.comments || []).length + '</span>' + '</a>' +
				'</li>' +
			'</ul>' +
		'</div>'

		var $cat = $(html).appendTo('.cat-container')

		$cat.on('click', '.likeCat', function() {
			app.ref('photos/' + photoContainer.key).update({
				likes: data.likes + 1
			})
		})

		$cat.on('click', '.triggerCommentModal', function() {

			$('#myCommentModal').attr('data-photo-id', photoContainer.key);

			appendComments();

			$('#myCommentModal').modal('show');
		});

		function appendComments() {
			commentContainer.empty();
			if (!comments) return;

			var commentHTML = '';
			comments.forEach(function (comment) {
				commentHTML += '<p class="catComment">' + comment.text + '</p>';
			});
			$(commentHTML).appendTo(commentContainer);
		}
		
	})
})

// What am I doing wrong? This should have been the code to pull the comment data that was entered and display below the input field.
app.ref('photos').on('value', function(results) {

	$('#catCommentContainer').empty()	

	/*results.forEach(function(photoContainer) {
		
		var commentData = photoContainer.val().comments;

		var commenthtml =
			'<p class="catComment">' + commentData.text + '</p>'

			//$(commenthtml).appendTo('#catCommentContainer')
		})*/
})		


//Add Cat Modal
$('#newCat').submit(function(event) {
	// This prevents the browser from submitting the form
	event.preventDefault();

	var catName = $('#newCat input.cat-name').val()
	var catDescription = $('#newCat textarea.addDescription').val()


//Upload Photo
var file = $("#catImage")[0].files[0];

var uploadTask = storageRef.child('images/' + file.name).put(file);

uploadTask.on('state_changed', function(snapshot){}, function(error) {}, function() {
	var downloadURL = uploadTask.snapshot.downloadURL;
	
	app.ref('photos').push({
		name: catName,
		description: catDescription,
		likes: 0,
		comments: [],
		url: downloadURL 
	})
	//to close on click
	$('#myModal').modal('hide')
});	
	// Create a new message
	// https://firebase.google.com/docs/reference/js/firebase.database.Reference#push
})

//Comments Modal
$('#myCommentModal').submit(function(event) {
	// This prevents the browser from submitting the form
	event.preventDefault();

	var photoId = $('#myCommentModal').attr('data-photo-id')

	var addComment = $('#myCommentModal textarea.addCommentField').val()

	app.ref('photos/' + photoId).once('value', function(photoContainer){
		var data = photoContainer.val()
		var comments = data.comments || []	

		comments.push ({
			text: addComment
		})
		app.ref('photos/' + photoId).update({
			comments: comments
		})	
	})

	//to close on click
	$('#myCommentModal').modal('hide')
	$('#myCommentModal textarea.addCommentField').val('')
});	
		
// Show pop-up
$(document).ready(function () {
	$("#triggerModal").click(function(){
		$('#myModal').modal('show')
	});
});



