window.onload = function() {
	var p = document.getElementById('error-info');
	var timer = null;
	var time = 30;
	timer = setInterval(function() {
		time--;
		p.innerHTML = time + '秒后自动转入首页！！';
		if(time < 1) {
			clearInterval(timer);
			window.location = '/';
		}
	}, 1000);
};