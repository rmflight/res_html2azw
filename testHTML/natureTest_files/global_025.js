var com = com || {};
com.nature = com.nature || {};

com.nature.ArticleSetup = (function($) {
	
	var ArticleSetup = function() {
		this.isAbstract = $('meta[name="abstract"]').attr('content') == 'yes';
		this.PageManager = com.nature.PageManager;
		this.highlighter = null;
		
		var pm = this.PageManager;
		$('.compound_link').click(function(ev){
			var t = $(this),
				href = t.attr('href');
			
			pm.trackCompoundNumberClick({
				destination: (href.indexOf('http://') !== -1) ? href : 'http://' + window.location.hostname + href,
				section: pm.getParentSection(t)
			});
			
			window.location.href = href;
			return false;
		});

	};
	ArticleSetup.prototype = {
		initHighlighting: function() {
			this.highlighter = new com.nature.Highlighter();
			this.highlighter = $.extend(this.highlighter, new com.nature.Broadcaster());
			this.highlighter.init();
			
			this.highlighter.subscribe('toggle', this.PageManager.trackHighlighting, this.PageManager);
		},
		initBookmarking: function() {
			var pm = this.PageManager;
			var $tbl = $('#toggle-bookmarking-links');
			if ($tbl.length) {
				var popup = new com.nature.Popup($tbl.linkify().find('a'), $('#bookmarking-links').addClass('bookmarking-popup'), {
					hasArrow: false,
					position: 'below'
				});
				popup.title('Bookmark &amp; Share');
				popup = $.extend(popup, new com.nature.Broadcaster());
				popup.init();
				popup.subscribe('open', pm.trackSocialBookmarking, pm);
			}
		},
		initCitations: function() {
			var pm = this.PageManager;
			var $tbl = $('#toggle-citation-links');
			if ($tbl.length) {
				var popup = new com.nature.Popup($tbl.linkify().find('a'), $('#citation-links').addClass('citation-popup'), {
					hasArrow: false,
					position: 'below'
				});
				popup.title('Citation Formats');
				popup = $.extend(popup, new com.nature.Broadcaster());
				popup.init();
			}
		},
		initDeliveryServices: function(){
			var pm = this.PageManager;
			var $tbl = $('.toggle-delivery-services');
			if ($tbl.length) {
				var popup = new com.nature.Popup($tbl.linkify(), $('.document-delivery').addClass('delivery-popup'), {
					hasArrow: false,
					position: 'below'
				});
				popup.title('Available document delivery services');
				popup = $.extend(popup, new com.nature.Broadcaster());
				popup.init();
			}
		},
		initAuthors: function() {
			var setupAuthors = function($authors, cutoff) {
				var buildAuthorPopup = function($target) {
					var authorDetailsId = $target.attr('href').replace(/^[^#]*#/, ''),
						popupId = 'author-' + authorDetailsId,
						popupHtml = '',
						$affiliations = null,
						$details = null,
						$popupHtml = null,
						details = '',
						popup = group.get(popupId);

					if (popup) {
						return popup;
					}

					popupHtml = '<div id="' + popupId + '">';
					
					$details = $('#' + authorDetailsId).clone();
					$details.find('h3').remove();
					$img = $details.find('img.photo').remove();
					
					details = $details.html();
					
					$affiliations = $target.closest('li').children('sup').children('a');
					if ($affiliations.length) {
						popupHtml += '<ul class="author-affiliations';
						if ($img.length) {
							popupHtml += ' author-img-wrapper" style="background-image:url(' + $img.attr('src') + ')">'
						} else {
							popupHtml += '">';
						}
						
						$affiliations.each(function() {
							var affiliationId = this.href.replace(/^[^#]*/, ''),
								$affiliation = $(affiliationId);
							if ($affiliation.length) {
								popupHtml += '<li>' + $affiliation.find('h3').html() + '</li>';
							} else {
								$affiliation = $(affiliationId + '-c');
								if ($affiliation.length) {
									popupHtml += '<li>' + $affiliation.html() + '</li>';
								}
							}
						});
						popupHtml += '</ul>';
					}
					
					if (!com.nature.StringUtils.isEmpty(details)) {
						popupHtml += '<div class="author-details">' + details + '</div>';
					}

					popupHtml += '</div>';
					
					
					popup = new com.nature.Popup($target, $(popupHtml), {id: popupId});
					popup = $.extend(popup, new com.nature.Broadcaster());
					popup.init(true);
					popup.subscribe('open', group.onOpen, group);
					popup.subscribe('close', group.onClose, group);

					group.add(popup);
					return popup;
				};
				
				var $authorItems = $authors.children('li'),
					$hiddenAuthors = null,
					$lastVisibleAuthor = null,
					hasHiddenAuthors = false;
					
				if ($authorItems.length > 1) {
					$hiddenAuthors = $authorItems.filter('li:gt(' + cutoff + ')');
				
					hasHiddenAuthors = $hiddenAuthors.length != 0;
					if (hasHiddenAuthors) {
						$lastVisibleAuthor = $authorItems.filter('li:eq(' + cutoff + ')');
					}
					
					renderAuthors($authorItems, $hiddenAuthors, $lastVisibleAuthor);
				}

				$authors.bind('click', function(e) {
					var $target = $(e.target).closest('a'),
						target = null,
						cls = '',
						isCollapsed = false,
						isExpanded = false,
						popup = null,
						popupId = null,
						etal = null;
						
					if (!$target.length) {
						return false;
					}
					if ($target.parent().hasClass('group-name')) {
						return true;
					}

					target = $target.get(0);
					cls = $target.attr('class') || '';
					isCollapsed = cls.indexOf('collapsed') != -1;
					isExpanded = cls.indexOf('expanded') != -1;
				
					if (isExpanded || isCollapsed) {
						while (target.hasChildNodes()) {
							target.removeChild(target.firstChild);
						}
						
						if (isCollapsed) {
							$hiddenAuthors.css({display: 'inline'});
							$lastVisibleAuthor.find('span.comma').css({display: 'inline'});
							$target.removeClass('collapsed').addClass('expanded');
							
							target.appendChild(document.createTextNode('Show fewer authors'))
														
							pm.trackAuthorListDisplay('expand');
						} else {
							$hiddenAuthors.each(function() {
								var id = 'author-' + $(this).find('a').attr('href').replace(/^[^#]*#/, ''),
									popup = group.get(id);
								
								if (popup && popup.isOpen) {
									popup.close();
									return false;
								}
							});
							
							$hiddenAuthors.hide();
							$lastVisibleAuthor.find('span.comma').hide();
							$target.removeClass('expanded').addClass('collapsed');
							
							etal = document.createElement('i');
							etal.appendChild(document.createTextNode('et al.'));
							target.appendChild(etal);
							
							pm.trackAuthorListDisplay('collapse');
						}
					} else {
						buildAuthorPopup($target).toggle(e);					
					}
					e.stopPropagation();
					return false;
				});
			};
			
			
			var renderAuthors = function($authors, $hidden, $last) {
				$authors.filter('li.last-in-group, li:last').each(function() {
				var $el = $(this);
				
					$el.addClass('no-comma');
					$el.prev('li').addClass('no-comma');
				
					if (!$el.hasClass('group-with-authors') && !$el.hasClass('collab')) {
						// only if more than 2 groups with authors
						if($el.prev().length != 0){
							$el.find('a.name, a[href*="#group-"]').before('&amp; ');
						}
					}
					// VIEW-3454 collab authors
					if ($el.hasClass('collab')) {
						// only if more than 2 authors
						if($el.prev().prev().length != 0){
							$el.prev().find('a.name, a[href*="#group-"]').before('&amp; ');
							$el.prev().prev().addClass('no-comma');
						}
					}
				});
				$authors.filter('li:not(.no-comma)').children('a.name, a[href*="#group-"]').after('<span class="comma">,</span>');
				
				if (!$hidden.length) {
					return;
				}
				$hidden.hide();
				$last.find('span.comma').hide();
				
				$authors.parent().append('<li class="authors-toggle"><a href="javascript:;" class="collapsed"><i>et al.</i></a></li>');
			};
				
			var pm = this.PageManager,
				group = new com.nature.PopupGroup(true),
				correspondingAuthors = [],
				$primaryAuthorList = $('#content.article-template ul.authors:first, #content.related-content ul.authors:first, .video-header ul.authors:first');
				$sibling = $primaryAuthorList.prev();
			$primaryAuthorList.remove();


			setupAuthors($primaryAuthorList, com.nature.Configuration.get('authorLimit') || 24);

			//$('h1.article-heading, h1.main-heading').after($primaryAuthorList);
			$sibling.after($primaryAuthorList);
				
			$('ul.authors:gt(0)').each(function() {
				setupAuthors($(this), 5);
			});
			
			$('#author-extra-details').find('p.email').each(function() {
				correspondingAuthors.push($(this).html().replace(/>contact\s+/i, '>'));
			});
						
			if (correspondingAuthors.length) {
				var html = '<div id="author-correspondence-popup"><ul class="corresponding-authors">';
				html += '<li>' + correspondingAuthors.join('</li><li>') + '</li>';
				html += '</ul></div>';
				
				var popup = new com.nature.Popup(
					$('#author-links').find('a[href$="#corres-auth"]'),
					$(html)
				);
				popup = $.extend(popup, new com.nature.Broadcaster());
				popup.init();
				
				popup.subscribe('open', group.onOpen, group);
				popup.subscribe('close', group.onClose, group);

				group.add(popup);
			}
		},
		initCommenting: function() {
			/*
			var hiddenComments = $('#comments ol.comments:first > li:gt(2)');
			
			var hidden = true;
			if (hiddenComments.length > 1) {
				hiddenComments.css({display: 'none'});

				$('#comments ol.comments:first').after('<p class="right-arrow view-all"><a href="javascript:;" id="comments-toggle">View all comments</a></p>');
				$('#comments-toggle').click(function() {
					if (hidden) {
						$(this).text('Hide comments');
						hiddenComments.css({display: 'block'});
					} else {
						$(this).text('View all comments');
						hiddenComments.css({display: 'none'});
					}
					hidden = !hidden;
				});			
			}
			*/
			var active = null;
			var showLinks = function(e) {
				var $target = $(e.target).closest('li[id]');
				if (!$target) return;
				
				hideLinks();
				
				$target.find('p.moderation').first().css({position: 'static', left: '0'});	
				active = $target.attr('id');
			};
			var hideLinks = function() {
				if (active) {
					$('#' + active).find('p.moderation').css({position: 'absolute', left: '-9999em'});
				}
				active = null;
			};

			$('#comments ol.comments').mouseover(showLinks).mouseout(hideLinks).find('a').focus(showLinks);

			if (!$('#comment-preview').length) {
				return;
			}
			
			var helpHidden = true;
			$('#comment-help h3').linkify().find('a').click(function() {
				if (helpHidden) {
					$('#comment-help ul').slideDown('fast');
					$(this).addClass('collapse');
				} else {
					$('#comment-help ul').slideUp('fast');
					$(this).removeClass('collapse');
				}
				helpHidden = !helpHidden;
			});
						
			$('#comment-body').preview('#comment-preview dd', 'textile').grow(); //resizeTextarea();
		},
		initCompoundNumbers: function(scope) {
			var pm = this.PageManager,
				selector = scope ? scope + ' a[class*="compound-ref-"]' : 'a[class*="compound-ref-"]';
			
			$(selector).each(function() {
				var t = $(this),
					compId = /compound-ref-[-a-z0-9]+/i.exec(this.className)[0],
					href = t.attr('href'),
					popup_content = $('#' + compId),
					WtIdent = pm.getParentSection(t),
					
					tracking = {
						destination: (href.indexOf('http://') !== -1) ? href : 'http://' + window.location.hostname + href,
						section: WtIdent.indexOf("figure-browser-preview") != -1 ? "figure-browser-preview" : WtIdent
					},
					popup = new com.nature.Popup(t, popup_content, {
						hasTitle: false,
						hasCloseButton: false,
						event: 'mouseover'
					});
				
				popup.init();
				
				t.click(function(){
					pm.trackCompoundNumberClick(tracking);
					window.location.href = href;
					return false;
				});
			});
		},
		initDbLinks: function(scope, parentSection) {
			var pm = this.PageManager,
				selector = scope ? scope + ' a.database_link' : 'a.database_link';
			
			$(selector).each(function() {
				var t = $(this),
					href = t.attr('href'),
					db = t.attr('data-database'),
					dbType = t.attr('data-dbType'),
					tracking = {
						section: parentSection ? parentSection : pm.getParentSection(t),
						destination: 'link: '+db.replace(' ', '')
					};
				
				if (document.location.href.indexOf('/inside.html') != -1)
					tracking.section = 'view-all-'+dbType;
				
				t.click(function(){
					pm.trackDbLinksClick(tracking);
					window.location.href = href;
					return false;
				});
			});
		},
		initCompoundViewer: function() {
			var pm = this.PageManager;
			$(window).load(function() {
				var $compoundItems = $('#inside-article-compounds ol a[class*="compound-ref-"]'),
					i = 0, 
					numCompounds = $compoundItems.length,
					$html = $('<ol></ol>'),
					maxHeight = 0, 
					heights = [];
					
				$compoundItems.each(function() {
					var cls = '';
					if (i == 0) {
						cls = 'start active';
					} else if (i == numCompounds - 1) {
						cls = 'end';
					}
					++i;

					var compoundId = /compound-ref-[-a-z0-9]+/i.exec(this.className)[0];
					var $compound = $('#' + compoundId);
					var h = $compound.outerHeight()
					maxHeight = Math.max(maxHeight, h);
					heights.push(h);

					var item = '<li class="' + cls + ' cmp-' + i + '">';
					item += '<figure>';
					item += '<div class="compound-img">';
					item += '<a href="' + $(this).attr('href') + '" tabindex="-1" class="compound-link">';
					item += $compound.html();
					item += '</a>';
					item += '</div>';
					item += '<figcaption class="compound-name">';
					item += '<a href="' + $(this).attr('href') + '" class="compound-link">';
					item += $(this).html();
					item += '</a>';
					item += '</figcaption>';
					item += '</figure>';
					item += '</li>';

					$html.append(item);
				});
				$('#inside-article-compounds ol').replaceWith($html);
				
				$('#inside-article-compounds .compound-link').click(function(ev){
					var t = $(this),
						href = t.attr('href');
					
					pm.trackCompoundNumberClick({
						destination: (href.indexOf('http://') !== -1) ? href : 'http://' + window.location.hostname + href,
						section: pm.getParentSection(t)
					});
					window.location.href = href;
					return false;
				});

				var i = 0;
				$('#inside-article-compounds div.compound-img').each(function() {
					$(this).css({
						height: maxHeight + 'px',
						border: '1px solid #ccc'
					});
					$(this).find('img').css({
						paddingTop: ((maxHeight - heights[i]) / 2) + 'px'
					});
					++i;
				});

				if (numCompounds > 1) {
					$('#inside-article-compounds ol').before('<a href="javascript:;" class="prev compound-nav inactive" tabindex="-1"><span>Prev</span></a>');
					$('#inside-article-compounds ol').after('<a href="javascript:;" class="next compound-nav"><span>Next</span></a>');

					setTimeout(function() {
						$('#inside-article-compounds a.compound-nav').css({height: maxHeight + 'px'});
					}, 100);
					$('#inside-article-compounds p.box-footer').prepend('<span class="compound-pos"><span class="index">1</span>/<span class="total">' + numCompounds + '</span></span>');

					var animating = false;
					$('#inside-article-compounds a.compound-nav').click(function() {
						if (animating || $(this).hasClass('inactive')) {
							return;
						}

						$('#inside-article-compounds a.compound-nav.inactive').removeClass('inactive').removeAttr('tabindex');

						$current = $('#inside-article-compounds li.active');
						if ($(this).hasClass('next')) {
							$next = $current.next('li');
							if ($next.hasClass('end')) {
								$(this).addClass('inactive').attr('tabindex', '-1');
							}
						} else {
							$next = $current.prev('li');
							if ($next.hasClass('start')) {
								$(this).addClass('inactive').attr('tabindex', '-1');
							}
						}
						animating = true;
						$current.find('div.compound-img').find('img').fadeOut('fast', function() {
							$next.find('div.compound-img').find('img').fadeIn('fast', function() {
								$next.addClass('active');
								$current.removeClass('active');
								var pos = /cmp-([0-9]+)/.exec($next.get(0).className)[1];
								$('#inside-article-compounds span.index').html(pos);
								animating = false;
							});
						});
					});
				}
			});
		},
		initDraggable: function() {
			var suppGroup = new com.nature.PopupGroup(true),
				pm = this.PageManager;

			var togglezoom = function() {
				var $target = $(this);
				if ($target.attr('class')=='zoom-off') {
					$target.attr('class','zoom-on').text('Disable zoom');
					// enable zoomer, but don't show it yet (user's mouse will not be over the image)
					$('#zoomer').css({'visibility':'visible','display':'none'}); 
					// handle fade out & positioning of info box
					var parentel = $target.parents('div.popup-content:first');
					// there are several images on the page; grab dimensions of the right one
					var zoomimg = $(parentel).children('div.supp-wrapper:first').children('img:first');
					$('div.zoom-info').css({'top':($(zoomimg).height()/2)+50,'left':($(zoomimg).width()/2)-30}).show();
					setTimeout("$('div.zoom-info').fadeOut('slow')", 2500);
				}
				else {
					$target.attr('class','zoom-off').text('Enable zoom');
					// hide zoomer
					$('#zoomer').css({'visibility':'hidden','display':'none'}); 
				}
				return false;
			}

			$("a.draggable").each(function(i) {
			    var related_id = '#'+$(this).attr('data-related-id'),
					popup_content = $($(related_id)[0]).clone(),
					$wrapper = $(related_id).closest('li'),
					showMoreLink = $('<a href="#" class="show-more">Show More</a>'),
					captionHeight = 44,
					popup;

				popup_content.find('.meta').append($wrapper.find('div.larger').html());
				popup_content.find('.meta').append($wrapper.find('div.control-zoom').html());
				popup = new com.nature.Popup($(this), popup_content, { hasArrow: false });
			    popup.title($wrapper.find('.supp-title').html());
			    popup = $.extend(popup, new com.nature.Broadcaster());
			    popup.init();
				popup.subscribe('open', suppGroup.onOpen, suppGroup);
				popup.subscribe('close', suppGroup.onClose, suppGroup);
				suppGroup.add(popup);
			    popup = $.extend(popup, new com.nature.DraggablePopup(null, '.title-bar'));
				popup.subscribe('open', popup.onOpen, popup);

				if($(this).hasClass('supp-fig') || $(this).hasClass('supp-vid') || $(this).hasClass('supp-tab')) {
					popup.subscribe('build', function(){
						var $popup = popup._$popup,
							$captionWrapper = $popup.find('.caption-wrapper');
							
						$captionWrapper.css('height',captionHeight*2);
					});
				}
				
				if($(this).hasClass('supp-fig')) {
					popup.wtAction = 'figure-supp';
					popup.destination = 'figure_popover';
					popup.fullSizeDestination = 'figure_fullsize';
					popup.subscribe('build', function(){
						this._$popup.find('.supp-figures-wrapper img').addpowerzoom();
						this._$popup.find('.zoom-toggle a').bind('click', togglezoom);
					}, popup);
				}
				else if($(this).hasClass('supp-tab')) {
					popup.wtAction = 'table-supp';
					popup.destination = 'table_popover';
					popup.fullSizeDestination = 'table_fullsize';
					popup.subscribe('build', function(){
						this._$popup.find('.supp-tables-wrapper img').addpowerzoom();
						this._$popup.find('.zoom-toggle a').bind('click', togglezoom);
					}, popup);
				}
				else if($(this).hasClass('supp-vid')) {
					popup.wtAction = 'video-supp';
					popup.destination = 'video_popover';
					popup.fullSizeDestination = 'video_fullsize';
					popup.subscribe('build', function(){
						var maxWidth = 100,
							maxHeight = 80,
							expectedAspect = maxWidth / maxHeight,
							$popup = popup._$popup.append('<div class="simple-carousel"><ol></ol></div>'),
							$meta = $popup.find('.meta'),
							$captionWrapper = $popup.find('.caption-wrapper'),
							$caption = $popup.find('.caption'),
							carouselList = $popup.find('.simple-carousel ol'),
							listItems = $("ul#supplementary-video-list li"),
							loadedCount = 0,
							vidId = $wrapper.data('video'),
							playerStr = '<div style="display:none"></div><object id="'+$popup.attr('id')+'-video" class="BrightcoveExperience"><param name="width" value="100%" /><param name="height" value="284" /><param name="playerID" value="1649028541001" /><param name="playerKey" value="AQ~~,AAAAAFNl7zk~,OmXvgxJOvrFrcXbraSu6og61fTJA63C7" /><param name="isVid" value="true" /><param name="isUI" value="true" /><param name="dynamicStreaming" value="true" /><param name="@videoPlayer" value="'+vidId+'" /><param name="bgcolor" value="#EEEEEE" /><param name="includeAPI" value="true" /></object>';
						
						
						$popup.find('.vid-loader').append(playerStr);
						brightcove.createExperiences();
						if(listItems.length){
							listItems.each(function(idx, li) {
								var thumbUrl = "http://api.brightcove.com/services/library?command=find_video_by_id&video_id="+$(li).data('video')+"&video_fields=thumbnailURL&token=AgH8MUSmnBCjckglT9OGOEV3EYJoiHhnTfZkdhxKgWw.&callback=?", // added &callback=? to the end to invoke jquery JSONP
									carouselListLi = $('<li />');
								
								carouselList.append(carouselListLi);
							
								$.getJSON(thumbUrl, function(data) {
									var trashImg = new Image();
									trashImg.onload = function() {
										var imgAspect = trashImg.width / trashImg.height;
										if(imgAspect >= expectedAspect) {
											var newImgWidth = maxWidth + "px",
												newImgHeight = Math.floor(maxWidth / imgAspect)+"px",
												padding = Math.floor((maxHeight-(maxWidth / imgAspect))/2)+"px 0";
										} else {
											var newImgWidth = Math.floor(maxHeight * imgAspect)+"px",
												newImgHeight = maxHeight + "px",
												padding = "0 "+Math.floor((maxWidth-(maxHeight * imgAspect))/2)+"px";
										}
										carouselListLi.append('<img src="'+data.thumbnailURL+'" style="padding:'+padding+'; width:'+newImgWidth+'; height:'+newImgHeight+';" data-video="'+$(li).data('video')+'" />');
										loadedCount++;
										if(listItems.length === loadedCount){
											var suppid = popup.id.split('-')[1].substr(2),
												caro = new com.nature.SimpleCarousel(popup._$popup.find('div.simple-carousel'), {
													showLoader:false, 
													initialActive:(suppid-1), 
													height:maxHeight, 
													title:'More videos from this article'
												});
											caro = $.extend(caro, new com.nature.Broadcaster());
											caro.subscribe('scrolled', pm.trackVideoCarouselScroll, pm);
											caro.subscribe('thumbClicked', pm.trackVideoCarouselThumbs, pm);
											caro.init();
											$('.thumbs a',$popup).click(function(){
												var objTagId = $popup.attr('id')+'-video',
													player = brightcove.api.getExperience(objTagId),
											    	modVP = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER),
													index = $(this).parent().prevAll().length,
													hiddenDataLi = listItems.eq(index);
													
												$popup.find('.title-bar h2').html(hiddenDataLi.find('.supp-title').html());										
												$popup.find('.caption').html(hiddenDataLi.find('.caption').html())
												$popup.find('a.view-full-size').attr('href', hiddenDataLi.find('a.view-full-size').attr('href'));	
												modVP.loadVideoByID($(this).find('img').data('video'));
												
												if($caption.height() < 50)
													showMoreLink.hide();
												else
													showMoreLink.show();
												
												$captionWrapper.css('height',captionHeight);
												showMoreLink.text('Show More');
												showMoreLink.data('isClosed',true);
												
												return false;
											});
										}
									}
									trashImg.src = data.thumbnailURL;
								});
							});
						}

					}, pm);
				}	
				popup.subscribe('open', pm.trackSupInfoPopup, pm);
				popup.subscribe('build', function(){
					$('p.full-size a', popup._$popup).click(function(ev){
						ev.preventDefault();
						var params = {
							action: popup.destination,
							destination: popup.fullSizeDestination,
							source: popup.id.split('-')[1]
						};
						pm.track(params);
						window.location.href = $(this).attr('href').indexOf('http://') != -1 ? $(this).attr('href') : 'http://' + window.location.hostname + $(this).attr('href');
					});
				}, pm);
			});
		},
		initFigureBrowser: function() {
			var pm = this.PageManager;
			var figs = new com.nature.FigureBrowser($('div.figure-browser'));
			figs = $.extend(figs, new com.nature.Broadcaster());
			figs.subscribe('scrolled', pm.trackFigureBrowser, pm);
			figs.subscribe('popupShown', pm.trackFigurePopup, pm);
			figs.init();
			
			var self = this;
			figs.subscribe('created', function(ev, obj, id) {
				self.initCompoundNumbers('#' + id);
				self.highlighter.initPopups('#' + id);
			});
			figs.subscribe('close', function(ev, obj, id) {
				com.nature.Popups.redraw('close', id);
			});
			
			$(window).load(function() {
				figs.start();
			});
		},
		initReferenceContextLinks: function() {
			var self = this;
			var getRefContext = function() {
				var $parent = $(this).closest('li[id^="ref"]');
				var id = $parent.attr('id');
			
				var $contextBlock = $('#' + id + '-context');
				if ($contextBlock.length && $contextBlock.css('display') != 'none') {
					$contextBlock.css({display: 'none'});				
					$(this).removeClass('collapse').text('Show context');
				} else {
					
					if ($contextBlock.length) {
						$contextBlock.css({display: 'block'});
					} else {
						var html = '';
						$('#content a[href$="#' + id + '"]').each(function() {
							if ($(this).parents('ol.references, div.figure-browser').length) {
								return true;
							}							
							var item = com.nature.Truncator.getContextSnippet(
								$(this).closest('p,li,div'),
								$(this)
							);							
							html += '<li>' + item + ' <a href="#' + $(this).attr('id') + '" title="Skip to this reference in the article" class="ref-return">in article</a></li>';
						});

						html = html.replace(/ id="[^"]+"/ig, '');				
						html = '<ul id="' + id + '-context" class="context">' + html + '</ul>';

						$parent.append(html);
						self.initCompoundNumbers('#' + id + '-context');
						self.highlighter.initPopups('#' + id + '-context');
					}
					$(this).addClass('collapse').text('Hide context');
				}
				self.PageManager.trackClick({"action": "context_link", "source": id});
			};
			
			if (!this.isAbstract) {
				var $refs = $('#references ol.references li[id^="ref"]');
				$refs.each(function() {
					if ($('#content a[href$="#' + $(this).attr('id') + '"]').length) {
						var $uls = $(this).find('ul');
						if (!$uls.length) {
							$(this).append('<ul class="cleared has-ref-links"></ul>');
						} else {
							$uls.addClass('has-ref-links')
						}
					}
				});
				$refs.find('ul.has-ref-links').append('<li class="show-context-item"><a href="javascript:;">Show context</a></li>').find('li.show-context-item').find('a').click(getRefContext);
			}
		},
		initEdsumms: function() {
			$('#edsumm div.full-snippet').each(function() {
				if ($(this).text().length > 200) {
					$(this).parent().append('<div class="snippet">' + com.nature.Truncator.truncate($(this).html(), 200) + '</div><a href="javascript:;" class="toggle-bar"><span>Toggle</span></a>');
				} else {
					$(this).css({display: 'block'});
				}
			});
			$('#edsumm a.toggle-bar').click(function() {
				var $parent = $(this).closest('div.editors-summary');
				if ($(this).hasClass('collapse')) {
					var startHeight = $parent.find('div.full-snippet').height();
					var targetHeight = $parent.find('div.snippet').css({display: 'block', visibility: 'hidden'}).height();
					
					$parent.find('div.full-snippet').css({height: startHeight + 'px', visibility: 'visible', overflow: 'hidden'}).animate({
						height: targetHeight + 'px'
					}, 'fast', function() {
						$parent.find('div.snippet').css({visibility: 'visible'});
						$parent.find('div.full-snippet').css({display: 'none'});
					});
					$(this).removeClass('collapse');
				} else {
					var startHeight = $parent.find('div.snippet').height();
					var targetHeight = $parent.find('div.full-snippet').css({display: 'block', visibility: 'hidden', height: 'auto'}).height();
					$parent.find('div.snippet').css({display: 'none'});
					$parent.find('div.full-snippet').css({height: startHeight + 'px', visibility: 'visible', overflow: 'hidden'}).animate({
						height: targetHeight + 'px'
					}, 'fast');
					$(this).addClass('collapse');
				}
			});
		},
		initBoxes: function() {
			$('.box-internal').each(function() {
				if ($(this).text().length > 200) {
					$(this).append('<a href="javascript:;" class="toggle-bar collapse"><span>Reduce</span></a>');
				} else {
					$(this).css({display: 'block'});
				}
			});
			$('.box-internal a.toggle-bar').click(function() {
				var $box = $(this).parent().find('.item-content').first();

				if ($(this).hasClass('collapse')) {
					if (!$box.data("startHeight")) {
						var boxHeight = $box.height(),
							boxSection = $box.parents('div.content');
						/*
						[VIEW 2135]
						All element heights inside of a display: none container
						will calcuate to 0 - we know it isn't true because the
						 inner text is over 2000 chars so need to flash display 
						block on the container to get the correct value
						*/
						if (boxHeight === 0) {
							boxSection.addClass("calculateHeights");
							boxHeight = $box.outerHeight(true);
							boxSection.removeClass("calculateHeights");
						}
						$box.data("startHeight", boxHeight);
					}
					$box.css({overflow: 'hidden'}).animate({
						height: '50px'
					}, 'fast');
					$(this).removeClass('collapse');
					$(this).find("span").text("Expand");
				} else {
					$box.animate({
						height: $box.data("startHeight") + 'px'
					}, 'fast');
					$(this).addClass('collapse');
					$(this).find("span").text("Reduce");
				}
			});
			//Boxes should start collapsed but we need to render open initially to get the height, and then simulate a click
			$('.box-internal a.toggle-bar').click();
		},
		initArticleNavigation: function() {
			var a = new com.nature.Article();
			a = $.extend(a, new com.nature.Broadcaster());
			a.init();
			
			a.subscribe('expand', this.PageManager.saveSectionState, this.PageManager);
			a.subscribe('expand', this.PageManager.trackSections, this.PageManager);
			a.subscribe('expand', function(ev, section, id) {
				com.nature.Popups.redraw('open', id);
			});
			a.subscribe('collapse', this.PageManager.saveSectionState, this.PageManager);
			a.subscribe('collapse', this.PageManager.trackSections, this.PageManager);
			a.subscribe('collapse', function(ev, section, id) {
				com.nature.Popups.redraw('close', id);
			});
			a.subscribe('scroll', this.PageManager.trackNavigation, this.PageManager);
		},
		initToggleAll: function() {
			$("span.toggleAll").linkify();
			$("span.toggleAll a").addClass("toggleAll collapsed");
			$("a.toggleAll").click(function() {
				if ($(this).hasClass('expanded')) {
					$(this).removeClass('expanded').addClass('collapsed').text('Expand all');
					$(this).parent().parent().find('.sub-section').each(function(){
						$(this).removeClass('expanded').addClass('collapsed');
					});
				} else {
					$(this).removeClass('collapsed').addClass('expanded').text('Collapse all');
					$(this).parent().parent().find('.sub-section').each(function(){
						$(this).removeClass('collapsed').addClass('expanded');
					});
				}
			});
		},
		//Generic handler to track items which do not have their own functions/non-js
		initClickTrack: function() {
			var pm = this.PageManager;
			var _trackData = {
				"print-link": {
					"action": "print",
					"source": "print-link"
				},
				"next-article": {
					"action": "next_article",
					"source": 'doi:'+com.nature.Configuration.get("articleDoi"),
					"destination": com.nature.Configuration.get("nextDoi"),
					"dl": "1",
					"ndl": "1"
				},
				"prev-article": {
					"action": "prev_article",
					"source": 'doi:'+com.nature.Configuration.get("articleDoi"),
					"destination": com.nature.Configuration.get("prevDoi"),
					"dl": "1",
					"ndl": "1"
				},
				"top-content": {
					"dl": "1",
					"ndl": "1"
				},
				"news-views-box": {
					"source": 'doi:'+com.nature.Configuration.get("articleDoi"),
					"es": window.location.href,
					"dl": "1",
					"ndl": "1"
 				},
 				"supp-fig": {
					"action" : "figure_supp",
					"source": 'supp-fig',
					"destination": "figure_fullsize"
 				},
 				"supp-video": {
					"action" : "video_supp",
					"source": 'supp-video',
					"destination": "video_fullsize"
 				},
 				"reprints": {
					"action" : "reprints",
					"source": "reprints-link",
					"destination": "", 
					"dl": "1",
					"ndl": "1"
 				},
 				"permissions": {
					"source": "permissions-link",
					"action" : "permissions",
					"dl": "1",
					"ndl": "1",
					"destination": ""
 				},
 				"supp-table": {
					"action" : "table_supp",
					"source": 'supp-tab',
					"destination": "table_fullsize"
 				},
 				"bidi": {
					"source": com.nature.Configuration.get("typeText"),
					"dl": "1",
					"ndl": "1"
 				},
 				"interactive-link": {
					"dl": "1",
					"ndl": "1"
 				}

			}
			$(".track").click(function() {
				var _data = _trackData[$(this).attr('id')] || null;
				if (_data) {
					pm.trackClick(_data);
				}
			});

			$(".track-bidi").click(function() {
				var _data = _trackData['bidi'];
				
				_data.action = $(this).parents(".module-bidi").attr("id")+'-box';
				_data.action = _data.action.replace(/-/g, '_');
				_data.destination = $(this).parents('li').data('category');
				if (_data) {
					pm.trackClick(_data);
				}
			});

			if($(document.body).hasClass('small-screen')){
				$(".draggable").click(function() {
					if($(this).hasClass('supp-vid')){
						var _data = _trackData['supp-video'];
						_data.source = $(this).attr('data-related-id');
					}
					else if($(this).hasClass('supp-tab')){
						var _data = _trackData['supp-table'];
						_data.source = $(this).attr('data-related-id');
					} else {
						var _data = _trackData['supp-fig'];
						_data.source = $(this).attr('data-related-id');
	
					}
					if (_data) {
						pm.trackClick(_data);
					}
				});
			}
			$(".order-reprints a").click(function() { 
				var _data = _trackData['reprints'] || null;
				if (_data) {
					pm.trackClick(_data);
				}
			});	
			$(".rights a").click(function() {
				var _data = _trackData['permissions'] || null;
				if (_data) {
					pm.trackClick(_data);
				}
			});

			$(".track-news-views-box").click(function() {
				var _data = _trackData['news-views-box'] || null;
				_data.action = 'continue_box';
				_data.source = $(this).data('category');
				_data.destination = $(this).data('dest-category');
				if (_data) {
					pm.trackClick(_data);
				}
			});
			$("#top-content ol a").click(function() {
				var _data = _trackData["top-content"];
				_data.ti, _data.destination = "link:" + $(this).text();
				_data.action = $(this).parents(".tab-box").attr("id");
				_data.source = 'doi:'+com.nature.Configuration.get("articleDoi");
				pm.trackClick(_data);
			});
			$(".track-encode a").click( function() {
				var _data = _trackData["interactive-link"];
				var theDOI = 'doi:'+com.nature.Configuration.get("articleDoi");
					_data.source = theDOI;
					_data.destination = 'link:' + $(this).attr('href');
					_data.action = "illustration";
					_data.es = window.location.href;
				if (_data) {
					pm.trackClick(_data);
				}
			});
		},


		initBeanData: function() {
			var btn = $("#bakedbean a");
			setTimeout(function() {
				$("#bakedbean .inner").slideDown(1000);
			}, 100);		
			
			btn.click(function(e) {
				$("#bakedbean .inner").slideToggle(1000);
					$("html:not(:animated),body:not(:animated)").animate({ scrollTop: 0}, 500 );
				e.preventDefault();
			});
		},
		initPlaceholders: function() {
			$('form').initPlaceholders();
		},
		initReshighCarousel: function() {
			var defaultShowCount = 4;
			var animationEnabled = true;
			$(".reshigh-carousel").each(function(){
				var $carousel = $(this),
					$container = $(".container",$carousel),
					$list = $("> ul",$container),
					$items = $("> li",$list),
					showCount = (this.className.match(/show-(\d)/)||[defaultShowCount]).pop();


				if ($items.length <= showCount) {
					$items.width(Math.floor($container.width()/$items.length));
					return;
				} else {
					$carousel.addClass("active");
				}

				var $left = $('<a href="javascript:;" title="Scroll Left" class="left"><span></span></a>').prependTo($carousel),
					$right = $('<a href="javascript:;" title="Scroll Right" class="right"><span></span></a>').appendTo($carousel),
					idealWidth = Math.floor($container.width()/showCount) + 1,
					width,
					interval;

				var scroll = {
					left: function(shouldAnimate) {
					    var newScroll = (parseInt($list.css('left')) || 0) - width;
				        $(".reshigh-carousel .left").show();
				        var currentItems = -(parseInt($list.css('left')) / width) + defaultShowCount;
					    
					    if(currentItems >= $items.length) {
					        newScroll += width;
					    } else {
					        $(".reshigh-carousel .right").show();
					    }
					    if(currentItems + 1 >= $items.length) {
					        $(".reshigh-carousel .right").hide();
					    }
					    
					    if(shouldAnimate) {
						    $list.animate({left:newScroll-1}, function() { animationEnabled = true; });
					    } else {
					        $list.css("left", newScroll);
					        animationEnabled = true;
					    }
						/*,{
							complete: function ( ) {
								$items = $("li",$list);
								$list.append($items[0]);
								$list.css("left",0);
							}
						});*/
					},
					right: function(shouldAnimate) {
					//	$items = $("li",$list);
					//	$list.css("left",-width);
					//	$list.prepend($items[$items.length-1]);
					    var newScroll = (parseInt($list.css('left')) || 0) + width;
					    $(".reshigh-carousel .right").show();
				        
					    if (newScroll >= 0) {
					        newScroll = 0;
					        $(".reshigh-carousel .left").hide();
					    } else {
					        $(".reshigh-carousel .left").show();
					    }					    
						$list.animate({left:newScroll+1}, function() { animationEnabled = true; });
					},
					click: function(dir) {
						return function(e) {
						/*	clearInterval(timer);
							clearTimeout(timer);
							timer = setTimeout(function(){
								timer = setInterval(scroll.left,5000);
							},15000)*/
							if(animationEnabled) {
							    animationEnabled = false;
							    scroll[dir](true);
						    }
							e.preventDefault();
						}
					},
					init: function() {
						var _current = $list.find("li.current").index();
						for(var i=0;i<_current;i++) {
							scroll.left(false);
						}
					}
				}

				$(function(){
					width = Math.min(idealWidth,$list.outerWidth());
					$items.css("width",width);
					$list.css("width",$items.length * width);
					$left.click(scroll.click('right'));
					$right.click(scroll.click('left'));
					scroll.init();
				});

			});			
		},
		initIcbViewer: function() {
			var icb;
			var datapacks = com.nature.Configuration.get("icb");
			$.each(datapacks, function(key,val) {
				var icb = new com.nature.Icb(key, val);
				icb.init();
			});
		},
		initDownloading: function() {
			var pm = this.PageManager,
				$tbl = $('#toggle-download-links'),
				$theText = $("h1.article-heading"),
				theString = "",
				titleText,
				articleTitle,
				popup;
			//trim unneccesary html
			$theText.find(":not(sup,sub,b,i)").replaceWith(function() { 
				return this.innerHTML;
			});
			titleText = $theText.html();
			// insert article title in popup and trim if over 125 charachters
			if(titleText && titleText.length){
				if(titleText.length >= 125){
					articleTitle = theString.concat(titleText.substring(0, 125), "...");
				}else {
					articleTitle = titleText;		
				};
			};

			$('#download-links').prepend('<p>' + articleTitle +'</p>');

			if ($tbl.length) {
					popup = new com.nature.Popup($tbl.linkify().find('a'), $('#download-links').addClass('download-modal'), {
					hasArrow: false,
					position: 'modal',
					hasMask: true
				});
				popup.title('');
				popup = $.extend(popup, new com.nature.Broadcaster());
				popup.init();
				popup.subscribe('open', pm.trackDownloadPopup, pm);
			}
		},
		initVideoDesc: function() {
			$('.in-page-video', '#content').each(function (i) {
				var inPageVid = $(this);
				var vidWidth = inPageVid.find('.video-player').css('width');
				inPageVid.find('.video-information').css("max-width", vidWidth);
			});
		},
		initCopyLink: function() {
			var pm = this.PageManager;
			var $tbl = $('#toggle-getvideo-link');
			if ($tbl.length) {
				var popup = new com.nature.Popup($tbl.linkify().find('a'), $('#get-video-link').addClass('bookmarking-popup'), {
					hasArrow: false,
					position: 'below'
				});
				popup.title('Get link to video');
				popup = $.extend(popup, new com.nature.Broadcaster());
				popup.init();
			}
		},
		initRelatedVideoThumb: function() {
			var maxWidth = 179;
			var maxHeight = 120;
			var expectedAspect = maxWidth / maxHeight;
			var listItems = $("ul#related-videos li");
			var numLoaded = 0;
			listItems.each(function(idx, li) {
			    var videoNum = $(li);
				// added &callback=? to the end to invoke jquery JSONP
				var thumbUrl = "http://api.brightcove.com/services/library?command=find_video_by_id&video_id="+videoNum.data('video')+"&video_fields=thumbnailURL,length&token=AgH8MUSmnBCjckglT9OGOEV3EYJoiHhnTfZkdhxKgWw.&callback=?";
				$.getJSON(thumbUrl, function(data) {
					var trashImg = new Image();
					trashImg.onload = function() {
						var imgAspect = trashImg.width / trashImg.height;
						if(imgAspect >= expectedAspect) {
							var pageWidth = maxWidth + "px";
							var pageHeight = (maxWidth / imgAspect)+"px";
							var padding = (maxHeight-(maxWidth / imgAspect))/2;
							padding = padding+"px 0";
						} else {
							var pageWidth = (maxHeight * imgAspect)+"px";
							var pageHeight = maxHeight + "px";
							var padding = (maxWidth-(maxHeight * imgAspect))/2;
							padding = "0 "+padding+"px";
						}
						// calculate the length of the video
						var d, h, m, s;
						s = Math.floor(data.length / 1000);
						m = Math.floor(s / 60);
						s = s % 60;
						h = Math.floor(m / 60);
						m = m % 60;
						d = Math.floor(h / 24);
						h = h % 24;
						len = "";
						if(d!=0){len+=d+"d";}
						if(h!=0){len+=h+":";}
						if(m!=0){len+=m+":";}
						if(s!=0 && s < 10){len+="0"+s;} else if(s!=0){len+=s;}
						if(d==0&&h==0&&m==0){len+="s";}
						// add items to page
						$('a .thumbnail', li).append('<img src="'+data.thumbnailURL+'" style="padding:'+padding+'; width:'+pageWidth+'; height:'+pageHeight+';" />')
						$('a', li).append('<h4>'+len+'</h4>');
						if($(li).hasClass('selected')){
							$('a', li).append('<h6>Now Playing</h6>');
						}
						numLoaded++;
						// once all thumbnails and data loaded, create equal height boxes
						if(listItems.length === numLoaded){
							var cte = $('.equal-height');
							$(cte).each(function(){
								var currentTallest = 0;
								$(cte).children().each(function(i){
									if ($('a',this).height() > currentTallest) { currentTallest = $('a',this).height(); }
								});
								// for ie6, set height since min-height isn't supported
								if ($.browser.msie && $.browser.version == 6.0) { $(cte).children().find('a').css({'height': currentTallest}); }
								$(cte).children().find('a').css({'min-height': currentTallest});
							});
						}
					}
					trashImg.src = data.thumbnailURL;
				});
			});
		}
	};
		
	/* subsection expand/collapse */
	$('.sub-section-heading').linkify();
	
	$('.sub-section-heading').parent().addClass('collapsed');
	$('.sub-section-heading a').addClass('sub-title');
	
	$(".sub-section-heading a").click(function() {
		if ($(this).parent().parent().hasClass('collapsed')) {
			$(this).parent().parent().removeClass('collapsed');
			$(this).parent().parent().addClass('expanded');
			return false;
			
		}
		if ($(this).parent().parent().hasClass('expanded')) {
			$(this).parent().parent().removeClass('expanded');
			$(this).parent().parent().addClass('collapsed');
			return false;
			
		}
	});
	
	return ArticleSetup;

})(jQuery);


