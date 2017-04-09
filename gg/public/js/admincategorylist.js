$(function() {
	$('.del').click(function(e) {
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.category-id-' + id);
		$.ajax({
			type: 'DELETE',
			url: '/admin/categorylist?id=' + id
		}).done(function(results) {
			if(results.success === 1) {
				if(tr.length > 0) {
					tr.remove();
				}
			}
			if(results.mes){
				alert(results.mes);
			}
		});
	});
});
