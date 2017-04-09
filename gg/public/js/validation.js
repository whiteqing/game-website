$(function() {
  	$('#btn-submit').attr("disabled", "disabled");
  	$('form :input').blur(function() {
  		var $parent = $(this).parent().parent();
  		$parent.find(".prompt-info").remove();
      var $name = $('#username').val();
      var $nickname = $('#nickname').val();
  		// 验证用户名
  		if(this.id === 'username') {
  			if(this.value == "" || this.value.length < 5 || this.value.length > 11) {
  				var erroMsg = '请输入5-11位的用户名!';
  				$parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
  			}else{
  				var correctMsg = 'OK';
  				$parent.append('<div class="col-sm-3 prompt-info correct"><span class="glyphicon glyphicon-ok">' + correctMsg + '</span></div>');
  			}
        // ajax PUT请求验证用户名是否存在
            $.ajax({
                type: 'PUT',
                url: '/signup/username?name=' + $name
            }).done(function(results) {
                if(results.success === 1) {
                    $parent.find(".prompt-info").remove();
                    var erroMsg = '用户名已存在!';
                    $parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
                }
            });
  		}
  		// 验证密码是否符合规则
  		if(this.id === 'password') {
  			var value = $('#password').val();
  			var num = 0;
  			var number = 0;
  			var upperCase = 0;
  			var lowerCase = 0;
  			if(value.search(/[0-9]/) != -1) {
  				num += 1;
  				number = 1;
  			}
  			if(value.search(/[A-Z]/) != -1) {
  				num += 1;
  				upperCase = 1;
  			}
  			if(value.search(/[a-z]/) != -1) {
  				num += 1;
  				lowerCase = 1;
  			}
  			if(num >= 2 && (value.length >= 6 && value.length <= 16)) {
  				var correctMsg = 'OK';
  				$parent.append('<div class="col-sm-3 prompt-info correct"><span class="glyphicon glyphicon-ok">' + correctMsg + '</span></div>');
  			}else if(value.length < 6 || value.length > 16) {
  				var erroMsg = '密码由6-16个字符组成!';
  				$parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
  			}else if(num == 1) {
  				if(number == 1) {
  				var erroMsg = '不能全为数字!';
  				$parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
  				}
  				if(upperCase == 1 || lowerCase == 1) {
  				var erroMsg = '不能全为字母!';
  				$parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
  				}
  			}
  		}
  		// 验证确认密码和密码是否一致
  		if(this.id == 'confirmPassword') {
  			var password = $('#password').val();
  			var confirmPassword = $('#confirmPassword').val();
  			if(password != '' && password === confirmPassword) {
  				var correctMsg = 'OK';
  				$parent.append('<div class="col-sm-3 prompt-info correct"><span class="glyphicon glyphicon-ok">' + correctMsg + '</span></div>');
  			}else{
  				var erroMsg = '两次密码输入不一致!';
  				$parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
  			}
  		}
      // 验证昵称是否符合规则
      if(this.id === 'nickname') {
        if(this.value.length > 7) {
          var erroMsg = '昵称过长！！！';
          $parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
        }else if(this.value == "") {
          var erroMsg = '不能为空哦！';
          $parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
        }else{
          var correctMsg = 'OK';
          $parent.append('<div class="col-sm-3 prompt-info correct"><span class="glyphicon glyphicon-ok">' + correctMsg + '</span></div>');
        }
        // ajax PUT请求验证用户名是否存在
        $.ajax({
          type: 'PUT',
          url: '/signup/nickname?nickname=' + $nickname
        }).done(function(results) {
          if(results.success === 1) {
            $parent.find(".prompt-info").remove();
            var erroMsg = '昵称已存在!';
            $parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
          }
        });
      }
      // 验证年龄
      if(this.id == 'age') {
        if(this.value == ''){
          var erroMsg = '不能是空岁哦！！';
          $parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
        }else if(this.value < 16) {
          var erroMsg = '太小的乖乖还是好好读书吧！！';
          $parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
        }else if(this.value > 59) {
          var erroMsg = '这么潮吗？老爷爷老奶奶？';
          $parent.append('<div class="col-sm-3 prompt-info error">' + erroMsg + '</div>');
        }else{
          var correctMsg = 'OK';
          $parent.append('<div class="col-sm-3 prompt-info correct"><span class="glyphicon glyphicon-ok">' + correctMsg + '</span></div>');
        }
      }

      // 有错误信息禁用提交按钮
    	var numError = $('form .error').length;
        if(numError){
          $('#btn-submit').attr("disabled", "disabled");
        }else{
        	$('#btn-submit').removeAttr("disabled", "disabled");
        } 	
  	});
    
    $('select').blur(function() {
      var $parent = $(this).parent().parent();
      $parent.find(".prompt-info").remove();

      if(this.id == 'gender') {
        var correctMsg = 'OK';
        $parent.append('<div class="col-sm-3 prompt-info correct"><span class="glyphicon glyphicon-ok">' + correctMsg + '</span></div>');
      }
      if(this.id == 'constellation') {
        var correctMsg = 'OK';
        $parent.append('<div class="col-sm-3 prompt-info correct"><span class="glyphicon glyphicon-ok">' + correctMsg + '</span></div>');
      }
    });
  	//重置按钮
    $('#btn-reset').click(function(){
      $('.prompt-info').remove();
      var formGroups = $('.form-group');
      for(var i = 0; i < 3;i++) {
        $(formGroups[i]).append('<div class="col-sm-3 glyphicon glyphicon-asterisk prompt-info error"></div>');
      }
   });
});