;
(function() {
	"use strict";

	function CookieManipulation(options) {
		//it's singletone
		if (CookieManipulation.instance) {
			return CookieManipulation.instance
		}
		CookieManipulation.instance = this;

		var self = this;

		//options is object that may include path, domain, expires, secure
		this.setCookie = function(name, value, options) {
			var cookieToSet;
			try {
				options = options || {};
				cookieToSet = name + '=' + value;
				for (var prop in options) {
					cookieToSet += '; ' + prop + '=' + options[prop];
				}
				console.log(cookieToSet);
				document.cookie = cookieToSet;
			} catch (e) {
				alert('Not accessible parameters for coookies');
			}

		};

		this.getCookies = function() {
			if (document.cookie) {
				return document.cookie.split('; ').map(function(el) {
					var cookieArr = el.split('=');
					return {
						name: cookieArr[0],
						value: decodeURIComponent(cookieArr[1])
					};
				});
			} else {
				return [];
			}
		};

		this.deleteCookie = function(cookieName) {
			var date = new Date(0);
			this.setCookie(cookieName, '', {
				expires: date.toUTCString()
			});
		};

		this.buildCookieTable = function(cookieArr) {
			var cookieRows,
				cookieRowTemplate = document.getElementById(options.cookieHtmlTemplateId).innerHTML,
				cookieTable = document.getElementById(options.cookieTableId),
				headerRow = document.getElementById(options.cookieHtmlRowHeaderId).innerHTML;

			if (cookieArr.length > 0) {
				cookieTable.innerHTML = headerRow;
				cookieArr.forEach(function(el) {
					cookieTable.insertAdjacentHTML('beforeend', cookieRowTemplate.replace(/\{name\}/g, el.name).replace(/\{value\}/g, el.value));
				});
			}
		};

		this.addCookieTableEvents = function() {
			document.getElementById(options.cookieTableId).addEventListener('click', function(e) {
				if (e.target.classList.contains(options.buttonClass)) {
					self.deleteCookie(e.target.getAttribute('data-cookie-name'));
					e.target.parentNode.parentNode.removeChild(e.target.parentNode);
				}
			});

			document.getElementById(options.addMoreCookiesButtonId).addEventListener('click', function(e) {
				console.log(1);
				for (var i = 0; i < 6; i++) {
					self.setCookie(Math.random().toString(36).substr(2, 7), Math.random().toString(36).substr(2, 7));
				}
				self.buildCookieTable(self.getCookies());
			});
		};

		this.showCookieInfo = function() {
			var cookies = this.getCookies();
			if (!navigator.cookieEnabled) {
				alert('Our site can\'t work without cookies, please, enable it in your browser!');
			}
			if (cookies.length > 0) {
				this.buildCookieTable(cookies);
			} else {
				document.getElementById(options.cookieTableId).innerHTML='NO COOKIES!';
			}
			this.addCookieTableEvents();
		};

		this.init = function() {
			this.showCookieInfo();
		};
	};

	document.addEventListener("DOMContentLoaded", function() {
		var options = {
				buttonClass: "deleteCookieButton",
				cookieTableId: "cookieTable",
				cookieHtmlTemplateId: "rowTemplate",
				cookieHtmlRowHeaderId: "headerRowTemplate",
				addMoreCookiesButtonId: "generateCookies"
			},
			cookieManipulation = new CookieManipulation(options);
		cookieManipulation.init();
	});
})();