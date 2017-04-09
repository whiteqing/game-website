$(function() {
	$('.del').click(function(e) {
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.post-id-' + id);
		$.ajax({
			type: 'DELETE',
			url: '/admin/postlist?id=' + id
		}).done(function(results) {
			if(results.success === 1) {
				if(tr.length > 0) {
					tr.remove();
				}
			}
		});
	});
});