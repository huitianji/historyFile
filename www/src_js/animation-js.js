	var AnimationJs = {

		startMove: function(obj, json, options) {
			options = options || {};
			options.type = options.type || 'linear';
			options.time = options.time || 800;

			var count = Math.round(options.time / 30);
			var oNow = {};
			var dis = {};
			for (var key in json) {
				if (key == 'opacity') {
					oNow[key] = Math.round(parseFloat(AnimationJs.getStyle(obj, key) * 100));
					if (isNaN(oNow[key])) {
						oNow[key] = 100;
					}
				} else {
					oNow[key] = parseInt(AnimationJs.getStyle(obj, key));
				}

				if (!oNow[key]) {
					switch (key) {
						case 'left':
							oNow[key] = obj.offsetLeft;
							break;
						case 'top':
							oNow[key] = obj.offsetTop;
							break;
						case 'width':
							oNow[key] = obj.offsetWidth;
							break;
						case 'height':
							oNow[key] = obj.offsetHeight;
							break;
					}
				}

				dis[key] = json[key] - oNow[key];
			}

			var n = 0;
			clearInterval(obj.timer);
			obj.timer = setInterval(function() {
				n++;
				for (var key in json) {
					switch (options.type) {
						case 'linear':
							var a = n / count;
							var iValue = oNow[key] + dis[key] * a;
							break;
						case 'ease-in':
							var a = n / count;
							var iValue = oNow[key] + dis[key] * a * a * a;
							break;
						case 'ease-out':
							var a = 1 - n / count;
							var iValue = oNow[key] + dis[key] * (1 - a * a * a);
							break;
					}
					if (key == 'opacity') {
						obj.style.opacity = iValue / 100;
						obj.style.filter = 'alpha(opacity:' + iValue + ')';
					} else {
						obj.style[key] = iValue + 'px';
					}
				}
				if (n == count) {
					clearInterval(obj.timer);
					options.succFn && options.succFn();
				}
			}, 30);
		},

		getStyle: function(obj, attr) {
			return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
		}

	}