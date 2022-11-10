(function($) {
	var selectNetwork = {

		container: $('.goto'),

		panelTemplate: '\
			<div class="selectNetwork">\
				<div class="title">' + message.networkCheck + '</div>\
					<div class="isps f-cb">\
					</div>\
				</div>',
		panel: undefined,

		ispTemplate: '\
			<a href="#" class="isp">\
				<div class="name"></div>\
				<div class="status">' + message.connecting + '</div>\
			</a>',
		isps: {},

		knownAddress: {
			t: [message.telecom, 'http://tp.127.net/cte/ttest'],
			c: [message.unicom, 'http://cp.127.net/cte/ctest'],
			h: [message.hangzhou, 'http://hzp.127.net/cte/hzp']
		},

		entry: {
			t: 'tentry.qiye.163.com',
			c: 'centry.qiye.163.com',
			h: 'hentry.qiye.163.com'
		},

		availableAddress: [],

		recordStartTime: {},

		duration: {},

		dnsReady: false,

		selectManually: undefined,

		scripts: [],

		reset: function () {
			if (!this.panel) {
				this.panel = $(this.panelTemplate);
				this.panel.hide().click(function (event) {
					event.stopPropagation();
				});
				this.panel.appendTo(this.container);
				var panel = this.panel;
				$(document.body).click(function () {
					panel.hide();
				});
			} else {
				this.panel.find('.isps').empty();
			}
			this.availableAddress = [];
			this.recordStartTime = {};
			this.duration = {};
		},

		clickIsp: function (event) {
			event.preventDefault();
			var isp = $(event.currentTarget);
			this.panel.find('.isp').removeClass('selected');
			isp.addClass('selected');
			this.setBestIsp(isp.attr('name'));
			this.selectManually = isp.attr('name');
			this.panel.hide();
		},

		setBestIsp: function (name) {
			var action = $('#loginform').attr('action');
			action = action.replace(/[tch]?entry.qiye.163.com/, this.entry[name]);
			$('#loginform').attr('action', action);

			// $('#ch').val(name);

			$('#selectNetwork').text(message.server + this.knownAddress[name][0]);
		},

		showPanel: function (addresses) {
			this.reset();	// 重置数据记录

			addresses = addresses.split(',');
			for (var i=0; i<addresses.length; i++) {
				var name = addresses[i],
					addr = this.knownAddress[name],
					isp = $(this.ispTemplate);
				this.availableAddress.push(name);
				isp.attr('name', name).find('.name').text(addr[0]);
				if (name === this.selectManually) {
					isp.addClass('selected');
				}
				if (i === addresses.length - 1) {
					isp.addClass('isp-1');
				}
				this.isps[name] = isp;
				this.panel.find('.isps').append(isp);
			}

			this.panel.css('width', 101 * addresses.length - 1);

			this.panel.find('.isp').click(function (event) {
				selectNetwork.clickIsp(event);
			});

			var container = this.container;
			this.panel.css('top', function () {
				return 0;
			}).css('left', function () {
				return ($(container).outerWidth() - $(this).outerWidth()) / 2;
			}).show();	// 面板显示完毕，开始测速

			if ($.browser.msie && $.browser.version.indexOf('6') != -1) {
				this.panel.css('left',function () {
					return ($(container).outerWidth() - $(this).outerWidth()) / 2 - 67;
				});
			}	// 单独处理ie6

			this.detectNetwork();
		},

		detectNetwork: function () {

			// if (!this.dnsReady) {
			// 	for (var i=0; i<this.availableAddress.length; i++) {
			// 		var name = this.availableAddress[i],
			// 			url = this.knownAddress[name][1];
			// 		$("<link rel='stylesheet'/>").attr("href", url).appendTo(document.body);
			// 	}
			// }	// 为了避免dns解析对测速的影响，首先向测速地址发送一遍请求

			if (this.scripts) {
				$.each(this.scripts, function(index, val) {
					val.remove();
				});
			}	// 删掉原有的script

			for (var i=0; i<this.availableAddress.length; i++) {
				var name = this.availableAddress[i],
					time = new Date();
				this.recordStartTime[name] = new Date();

				var script = $("<script></script>").attr('type', 'text/javascript').attr('src', this.knownAddress[name][1] + '?' + time.getTime());
				this.scripts.push(script);
				script.appendTo(document.body);
			}
		},

		detectNetworkCB: function (code) {
			var name;
			switch (code) {
				case 0:
					name = 't';
					break;
				case 1:
					name = 'c';
					break;
				case 2:
					name = 'h';
					break;
			}	// 根据code值解析网络名称

			var duration = new Date().getTime() - this.recordStartTime[name].getTime();
			this.duration[name] = duration;
			this.isps[name].find('.status').text(
				duration + "ms"
			);	// 成功获取到检测结果，显示所用时间

			var array = [];
			for (var name in this.duration) {
				if (this.duration.hasOwnProperty(name)) {
					array.push(this.duration[name]);
				}
			}
			var min = Math.min.apply(Math, array);
			for (var name in this.duration) {
				if (this.duration.hasOwnProperty(name)) {
					if (this.duration[name] === min) {
						this.isps[name].find('.status').addClass('best');
						if (!this.selectManually) {
							this.panel.find('.isp').removeClass('selected');
							this.isps[name].addClass('selected');
							this.setBestIsp(name);
						}
						break;
					}
				}
			}	// 为最好的网络加冕
		}
	};

	if (window.addresses) {
		window.fSpeedTest = function (code) {
			selectNetwork.detectNetworkCB(code);
		};
		window.fSpd = function (code) {
			selectNetwork.detectNetworkCB(2);
		};
		$("#selectNetwork").click(function(event) {
			event.preventDefault();
			event.stopPropagation();
			selectNetwork.showPanel(window.addresses);
		});
	}
})(jQuery);
