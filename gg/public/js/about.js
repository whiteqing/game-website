$(function() {
	var $aboutTitles = $('#about-list a');
	$aboutTitles.click(function() {
		$(this).addClass("active").siblings().removeClass("active");
		var index = $aboutTitles.index(this);
		console.log(index);
		$('#about-content .about-content').eq(index).show().siblings().hide();
	});
});