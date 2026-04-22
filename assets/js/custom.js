$(document).ready(function(){
	"use strict";
    
        /*==================================
* Author        : "ThemeSine"
* Template Name : Khanas HTML Template
* Version       : 1.0
==================================== */



/*=========== TABLE OF CONTENTS ===========
1. Scroll To Top 
2. Smooth Scroll spy
3. Progress-bar
4. owl carousel
5. theme switcher
6. hero grid animation
7. welcome animation support
======================================*/

    // 1. Scroll To Top 
		$(window).on('scroll',function () {
			if ($(this).scrollTop() > 600) {
				$('.return-to-top').fadeIn();
			} else {
				$('.return-to-top').fadeOut();
			}
		});
		$('.return-to-top').on('click',function(){
				$('html, body').animate({
				scrollTop: 0
			}, 1500);
			return false;
		});
	
	
	
	// 2. Smooth Scroll spy
		
		if ($.fn.sticky) {
			$('.header-area').sticky({
		          topSpacing:0
		       });
		}
		
		//=============

		$('li.smooth-menu a').bind("click", function(event) {
			var anchor = $(this);
			var href = anchor.attr('href') || '';
			if (href.charAt(0) !== '#') {
				return;
			}

			var target = $(href);
			if (!target.length) {
				return;
			}
			event.preventDefault();
			$('html, body').stop().animate({
				scrollTop: target.offset().top - 0
			}, 1200,'easeInOutExpo');
		});
		
		if ($.fn.scrollspy) {
			$('body').scrollspy({
				target:'.navbar-collapse',
				offset:0
			});
		}

	// 3. Progress-bar
	
		var dataToggleTooTip = $('[data-toggle="tooltip"]');
		var progressBar = $(".progress-bar");
		if (progressBar.length && $.fn.appear) {
			progressBar.appear(function () {
				if ($.fn.tooltip) {
					dataToggleTooTip.tooltip({
						trigger: 'manual'
					}).tooltip('show');
				}
				progressBar.each(function () {
					var each_bar_width = $(this).attr('aria-valuenow');
					$(this).width(each_bar_width + '%');
				});
			});
		}
	
	// 4. owl carousel
	
		// i. client (carousel)
		var clientCarousel = $('#client');
		if (clientCarousel.length && $.fn.owlCarousel) {
			clientCarousel.owlCarousel({
				items:7,
				loop:true,
				smartSpeed: 1000,
				autoplay:true,
				dots:false,
				autoplayHoverPause:true,
				responsive:{
						0:{
							items:2
						},
						415:{
							items:2
						},
						600:{
							items:4

						},
						1199:{
							items:4
						},
						1200:{
							items:7
						}
					}
				});
		}

	// 5. theme switcher

		var themeToggle = $('#theme-toggle');
		var themeStorageKey = 'umarThemePreference';

		var getStoredTheme = function() {
			try {
				return localStorage.getItem(themeStorageKey);
			} catch (error) {
				return null;
			}
		};

		var storeTheme = function(theme) {
			try {
				localStorage.setItem(themeStorageKey, theme);
			} catch (error) {
				// Ignore storage errors in private browsing modes.
			}
		};

		var applyTheme = function(theme) {
			var isDark = theme === 'dark';
			$('body').toggleClass('dark-mode', isDark);
			if (themeToggle.length) {
				themeToggle.attr('aria-pressed', isDark ? 'true' : 'false');
				themeToggle.attr('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
			}
		};

		var savedTheme = getStoredTheme();
		var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		var initialTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : (prefersDark ? 'dark' : 'light');
		applyTheme(initialTheme);

		if (themeToggle.length) {
			themeToggle.on('click', function() {
				var nextTheme = $('body').hasClass('dark-mode') ? 'light' : 'dark';
				applyTheme(nextTheme);
				storeTheme(nextTheme);
			});
		}

	// 6. hero grid animation

		var initHeroGridAnimation = function() {
			var canvas = document.getElementById('hero-grid-canvas');
			if (!canvas) {
				return;
			}

			var context = canvas.getContext('2d');
			if (!context) {
				return;
			}

			var width = 0;
			var height = 0;
			var columns = 0;
			var rows = 0;
			var verticalSeeds = [];
			var horizontalSeeds = [];
			var frameId = null;
			var lastFrame = 0;
			var resizeTimer = null;
			var spacing = 52;
			var segmentStep = 22;

			var createSeed = function() {
				return {
					phaseA: Math.random() * Math.PI * 2,
					phaseB: Math.random() * Math.PI * 2,
					speed: 0.45 + Math.random() * 0.4,
					amplitude: 3.6 + Math.random() * 3.8
				};
			};

			var verticalOffset = function(seed, yProgress, time) {
				return Math.sin((yProgress * 6.2) + (time * seed.speed) + seed.phaseA) * seed.amplitude +
					Math.cos((yProgress * 3.8) + (time * seed.speed * 0.58) + seed.phaseB) * (seed.amplitude * 0.45);
			};

			var horizontalOffset = function(seed, xProgress, time) {
				return Math.sin((xProgress * 5.6) + (time * seed.speed) + seed.phaseA) * seed.amplitude +
					Math.cos((xProgress * 4.2) + (time * seed.speed * 0.62) + seed.phaseB) * (seed.amplitude * 0.5);
			};

			var rebuildSeeds = function() {
				var i;

				columns = Math.ceil(width / spacing) + 2;
				rows = Math.ceil(height / spacing) + 2;
				verticalSeeds = [];
				horizontalSeeds = [];

				for (i = 0; i < columns; i += 1) {
					verticalSeeds.push(createSeed());
				}

				for (i = 0; i < rows; i += 1) {
					horizontalSeeds.push(createSeed());
				}
			};

			var resizeCanvas = function() {
				var bounds = canvas.getBoundingClientRect();
				var dpr = Math.min(window.devicePixelRatio || 1, 2);

				width = Math.max(1, Math.floor(bounds.width));
				height = Math.max(1, Math.floor(bounds.height));

				canvas.width = Math.floor(width * dpr);
				canvas.height = Math.floor(height * dpr);
				context.setTransform(dpr, 0, 0, dpr, 0, 0);
				rebuildSeeds();
			};

			var drawGrid = function(time) {
				var i;
				var x;
				var y;
				var yProgress;
				var xProgress;

				context.clearRect(0, 0, width, height);
				context.lineWidth = 1;

				context.strokeStyle = 'rgba(255, 255, 255, 0.45)';
				for (i = 0; i < columns; i += 1) {
					var verticalSeed = verticalSeeds[i];
					x = (i * spacing) - spacing;

					context.beginPath();
					for (y = 0; y <= height; y += segmentStep) {
						yProgress = height ? (y / height) : 0;
						if (y === 0) {
							context.moveTo(x + verticalOffset(verticalSeed, yProgress, time), y);
						} else {
							context.lineTo(x + verticalOffset(verticalSeed, yProgress, time), y);
						}
					}
					context.stroke();
				}

				context.strokeStyle = 'rgba(212, 225, 240, 0.34)';
				for (i = 0; i < rows; i += 1) {
					var horizontalSeed = horizontalSeeds[i];
					y = (i * spacing) - spacing;

					context.beginPath();
					for (x = 0; x <= width; x += segmentStep) {
						xProgress = width ? (x / width) : 0;
						if (x === 0) {
							context.moveTo(x, y + horizontalOffset(horizontalSeed, xProgress, time));
						} else {
							context.lineTo(x, y + horizontalOffset(horizontalSeed, xProgress, time));
						}
					}
					context.stroke();
				}
			};

			var animate = function(timestamp) {
				if (timestamp - lastFrame < 28) {
					frameId = window.requestAnimationFrame(animate);
					return;
				}

				lastFrame = timestamp;
				drawGrid(timestamp * 0.001);
				frameId = window.requestAnimationFrame(animate);
			};

			resizeCanvas();
			drawGrid(0);
			frameId = window.requestAnimationFrame(animate);

			$(window).on('resize', function() {
				window.clearTimeout(resizeTimer);
				resizeTimer = window.setTimeout(function() {
					resizeCanvas();
					drawGrid(lastFrame * 0.001);
				}, 120);
			});
		};

		initHeroGridAnimation();


    // 7. welcome animation support

		$(window).on('load', function(){
        	$(".header-text h2,.header-text p").removeClass("animated fadeInUp").css({'opacity':'0'});
            $(".header-text a").removeClass("animated fadeInDown").css({'opacity':'0'});
        });

		$(window).on('load', function(){
        	$(".header-text h2,.header-text p").addClass("animated fadeInUp").css({'opacity':'0'});
            $(".header-text a").addClass("animated fadeInDown").css({'opacity':'0'});
        });

});	
	