$(document).ready(() => {
	const conversionRate = 2.7;

	if (window.location.href.includes('amazon.com')) {
		function addXCDPrice() {
			$.fn.hasAttr = function (name) {
				return this.attr(name) !== undefined;
			};

			if ($('body').hasAttr('amazon-currency-changer-ext-prices-changed')) {
				if (window.location.href.includes('s?')) {
					document.querySelectorAll('.a-price').forEach((el) => {
						let priceChanged = $(el).hasAttr('amazon-currency-changer-ext');

						if (!priceChanged) {
							$(el).attr('amazon-currency-changer-ext', '');

							let USDPrice = el.getElementsByClassName('a-offscreen')[0].innerHTML;

							USDPrice = USDPrice.replace(/[^\d\.]+/g, '');
							USDPrice = USDPrice.replace(/(\..*)\./g, '$1');

							let XCDPrice = USDPrice * conversionRate;

							XCDPrice = (Math.round(XCDPrice * 100) / 100).toFixed(2);
							XCDPrice = XCDPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

							const injectXCDPrice = document.createElement('span');
							$(injectXCDPrice).attr('amazon-currency-changer-ext-xcd-price', '');

							$(el).append(injectXCDPrice);
							$(injectXCDPrice).html('$' + XCDPrice + ' XCD');
							$(injectXCDPrice).css({
								color: '#333',
								padding: '0 10px',
								'font-size': '0.75rem',
							});
						}
					});
				}

				if (window.location.href.includes('cart')) {
					document.querySelectorAll('.sc-price').forEach((el) => {
						let priceChanged = $(el).hasAttr('amazon-currency-changer-ext');

						if (!priceChanged) {
							$(el).attr('amazon-currency-changer-ext', '');

							let USDPrice = el.innerHTML;

							USDPrice = USDPrice.replace(/[^\d\.]+/g, '');
							USDPrice = USDPrice.replace(/(\..*)\./g, '$1');

							let XCDPrice = USDPrice * conversionRate;

							XCDPrice = (Math.round(XCDPrice * 100) / 100).toFixed(2);
							XCDPrice = XCDPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

							const injectXCDPrice = document.createElement('p');
							$(injectXCDPrice).attr('amazon-currency-changer-ext-xcd-price', '');

							$(el).append(injectXCDPrice);
							$(injectXCDPrice).html('$' + XCDPrice + ' XCD');

							if ($(el).parent().attr('id') == 'sc-subtotal-amount-buybox') {
								$(injectXCDPrice).css({
									color: '#333',
									'font-size': '0.75rem',
									'text-align': 'center',
								});
							} else {
								$(injectXCDPrice).css({
									color: '#333',
									'font-size': '0.75rem',
								});
							}
						}
					});
				}

				document.querySelectorAll('.p13n-sc-price').forEach((el) => {
					let priceChanged = $(el).hasAttr('amazon-currency-changer-ext');

					if (!priceChanged) {
						$(el).attr('amazon-currency-changer-ext', '');

						let USDPrice = el.innerHTML;

						USDPrice = USDPrice.replace(/[^\d\.]+/g, '');
						USDPrice = USDPrice.replace(/(\..*)\./g, '$1');

						let XCDPrice = USDPrice * conversionRate;

						XCDPrice = (Math.round(XCDPrice * 100) / 100).toFixed(2);
						XCDPrice = XCDPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

						const injectXCDPrice = document.createElement('p');
						$(injectXCDPrice).attr('amazon-currency-changer-ext-xcd-price', '');

						$($(el).parent()).append(injectXCDPrice);
						$(injectXCDPrice).html('$' + XCDPrice + ' XCD');
						$(injectXCDPrice).css({
							color: '#333',
							'font-size': '0.75rem',
							'font-weight': '700',
						});
					}
				});
			}
		}

		chrome.storage.sync.get('state', ({ state }) => {
			if (state === 'On') {
				$('body').attr('amazon-currency-changer-ext-prices-changed', '');

				setInterval(function () {
					addXCDPrice();
				}, 500);
			}
		});

		chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
			if (request.state === 'On') {
				$('body').attr('amazon-currency-changer-ext-prices-changed', '');

				setInterval(function () {
					addXCDPrice();
				}, 500);
			} else if (request.state === 'Off') {
				$('body').removeAttr('amazon-currency-changer-ext-prices-changed', '');

				document.querySelectorAll('[amazon-currency-changer-ext-xcd-price]').forEach((el) => {
					el.remove();
				});

				document.querySelectorAll('[amazon-currency-changer-ext]').forEach((el) => {
					el.removeAttribute('amazon-currency-changer-ext');
				});
			} else {
				$('body').attr('amazon-currency-changer-ext-prices-changed', '');

				setInterval(function () {
					addXCDPrice();
				}, 500);
			}
		});
	}
});
