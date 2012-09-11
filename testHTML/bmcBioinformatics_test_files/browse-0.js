function parametersMap(url){
    var paramMap = {};
    if(url.indexOf('?') < 0){
        return paramMap;
    }
    var params = url.substring(url.indexOf('?')+1);
    if(params.indexOf('#') > 0){
        params = params.substring(0, params.indexOf('#'));
    }
    var nameValuePairs = params.split('&');
    for(var i = 0;i < nameValuePairs.length; ++i){
        var pair = nameValuePairs[i].split('=');
        if(pair[0].length > 0 && pair[1].length > 0){
            paramMap[pair[0]] = pair[1];
        }
    }
    return paramMap;
}
function parameters(url, name){
    var paramMap = parametersMap(url);
    if(paramMap[name])
        return paramMap[name];
    else
        return '';
}
function parameterMapToParameters(parameterMap){
    var parameters = $.makeArray();
    for(var key in parameterMap){
       if(parameterMap[key].length > 0)
        parameters.push(key+"="+parameterMap[key]);
    }
    return parameters.join('&');
}
function replaceOrAppendParameter(url, name, value){
    var paramMap = parametersMap(url);
    paramMap[name] = value;
    if(url.indexOf('?') >= 0){
        return url.substring(0,url.indexOf('?')+1)+parameterMapToParameters(paramMap);
    }else{
        return url + '?' + parameterMapToParameters(paramMap);
    }
}

var selected_articles = $.makeArray();
var selected_articles_param_name = 'a';

function selectArticles() {
    if (selected_articles.length > 0) {
        $.each(selected_articles, function(i, value) {
            var chk = $('input[name=articleId][value="' + value + '"]');
            if(chk.val()){
                chk.attr('checked', 'checked');
            }else{
                var element = '<input type=\"hidden\" name=\"articleId\" value=\"'+value+'\" />';
                $("#selected_articles").append(element);
            }
        });
    }
}

function modifyPagerLink() {
    $("a[name=pager_link]").each(function() {
        this.href = replaceOrAppendParameter(this.href, selected_articles_param_name, selected_articles.join(','));
    });
}

function recordSelectedArticles(article) {
    if (article.checked) {
        selected_articles.push(article.value);
        selected_articles = $.unique(selected_articles);
    } else {
        selected_articles = $.grep(selected_articles, function(value){return value != article.value});
    }
}

function initSelectedArticles() {
    var params = parameters(window.location.href, selected_articles_param_name);
    if (params.length > 0) {
        selected_articles = params.split(',');
    }

    $('input[name=articleId]:checked').each(function(){selected_articles.push(this.value);});
    selected_articles = $.unique(selected_articles);
}

function showSelectedArticlesCount(){
    if(selected_articles.length > 0) {
        var resultString = " selected result";
        if(selected_articles.length > 1)resultString+="s";
        $('#result-selection option[value=SELECTED]').html(selected_articles.length + resultString);
        $('#result-selection option[value=SELECTED]').attr('selected','selected');
    } else {
        $('#result-selection option[value=SELECTED]').html('Selected results');
    }
}
function reopenBox() {
    if (selected_articles.length > 0) {
        jQuery('p.options a.options-toggler').click();
    }
}

jQuery(document).ready(function() {
    // toggle background image of buttons
    jQuery('button, input:submit').hover(
        function(){jQuery(this).addClass('hover')},
        function(){jQuery(this).removeClass('hover')}
    );

    jQuery('div.summary').css('display', 'none'); /* for ie 6 and 7 this is being done with css also - due to a bug */
    jQuery('.checkbox-toggle').hide();
    jQuery('fieldset.options fieldset.left').css('display','block');
    jQuery('.articles-feed a.options-toggler').addClass('active').parents('.options').eq(0).next().show();
    jQuery('.display-options').each(function(){
        jQuery(this).attr('checked', true);
    });
    jQuery('button[name=save_and_continue]').hide();
    jQuery('a.summary-toggler').click(function(){
        var summaryToggled=jQuery(this).toggleClass('active').parents('.nav').eq(0).next('div.summary-toggled').eq(0);
        var self=this;
        summaryToggled.slideToggle('fast');
        return false;
    });

    /* prevent graphic abstract link from behaving like a link */
     jQuery('a.graphic-toggler').click(function(event){
         event.preventDefault();
     });

	/*onload show scope on sections page*/
	if(site.page=="sections" && site.type=="BMC_CORE" && (site.id!="1999" && site.id !="2999")){
		jQuery('#journal-sections div.select-options p.options a i.arrow').addClass('active').parent().parent().next().show();
	}
	
	//Altmetric score
	if(site.page=="article_stats"){
		var getDOI = jQuery("#altmetric-badge-container").attr("data-doi");
		$.ajax({
			type: "GET",
			url: "http://api.altmetric.com/v1/doi/"+getDOI,
			beforeSend: function(x) {
				if(x && x.overrideMimeType) {
					x.overrideMimeType("application/j-son;charset=UTF-8");
				}
			},
			dataType: "jsonp",
			success: function(data){
				if(data.score>0) {
					jQuery("#altmetric-badge-container").html("<a href='"+data.details_url+"'><img src='"+data.images.small+"'/></a><p>Altmetric score <br/>from <a href='http://altmetric.com/index.php'>Altmetric.com</a></p>");
				}
			}
		});
	}

    /* onload for citation actions */
    jQuery('input.citation-control').each(function(){
        jQuery(this).attr('checked', true);
        if ( getRequestParameter ('citation',"true")=='false'){
            jQuery(this).attr('checked', false);
            jQuery('.display-options input.citation-control').each(function(){
                jQuery('.citation span').hide();
            });
        }
        if (jQuery(this).is(':checked')){
            /* articles page*/
            appendToPagerLinks('citation', 'true');
        }else{
            appendToPagerLinks('citation', 'false');
        }
    });

    /* onload for abstract actions */
    jQuery('input.abstract-control').each(function(){
        jQuery(this).attr('checked', false);
        jQuery('.display-options input.abstract-control').each(function(){
            jQuery('div.abstract-toggled').hide();
        });
        if( getRequestParameter ('abstract',"false")=='true'){
            jQuery(this).attr('checked', true);
            jQuery('.display-options input.abstract-control').each(function(){
                jQuery('div.abstract-toggled').show();
            });
        }
        if (jQuery(this).is(':checked')){
            appendToPagerLinks('summary','true');
        }else{
            appendToPagerLinks('abstract','false');
        }
    });


    /* onload for summary actions */
    jQuery('input.summary-control').each(function(){
        jQuery(this).attr('checked', false);
        jQuery('.display-options input.summary-control').each(function(){
            jQuery('p.summary-toggled').hide();
            jQuery('a.summary-toggler').removeClass('active');
        });
        if( getRequestParameter ('summary',"false")=='true'){
            jQuery(this).attr('checked', true);
            jQuery('.display-options input.summary-control').each(function(){
                jQuery('div.summary-toggled').show();
                jQuery('a.summary-toggler').addClass('active');
            });
        }
        if (jQuery(this).is(':checked')){
            appendToPagerLinks('summary','true');
        }else{
            appendToPagerLinks('summary','false');
        }
    });

    /* onload for format */
    var selected = getRequestParameter ('format',"ENDNOTE_WITH_ABSTRACT");
    jQuery('#format option[value='+selected+']').attr('selected','selected');

/* Display options*/

    jQuery('.display-options input.abstract-control').click(function(){
        if (jQuery(this).is(':checked')){
            jQuery('div.abstract-toggled').show();
            appendToPagerLinks('abstract','true');
        }else{
            jQuery('div.abstract-toggled').hide();
            appendToPagerLinks('abstract','false');
        }
    });


    jQuery('.display-options input.summary-control').click(function(){
        if (jQuery(this).is(':checked')){
            jQuery('div.summary-toggled').show();
            jQuery('a.summary-toggler').addClass('active');
            appendToPagerLinks('summary','true');
        }else{
            jQuery('div.summary-toggled').hide();
            jQuery('a.summary-toggler').removeClass('active');
            appendToPagerLinks('summary','false');
        }
    });


    jQuery('.display-options input.citation-control').click(function(){
        if (jQuery(this).is(':checked')){
            jQuery('.citation span').show();
            appendToPagerLinks('citation', 'true');
        }else{
            jQuery('.citation span').hide();
            appendToPagerLinks('citation', 'false');
        }
    });


    jQuery('#format').change(function(){
        appendToPagerLinks('format', jQuery('#format option:selected').val());
    });

    jQuery('a.options-toggler').click(function() {
        jQuery('button[name=save_and_continue]').toggle();
    });
    jQuery('button[name=save_and_continue]').click(function(){
        modifyPagerLink();
    });
    jQuery('#articles-list input[name=articleId]').change(function() {
        if(!this.checked){
            jQuery('input[name=select_all]').removeAttr('checked');
        }
        recordSelectedArticles(this);
        showSelectedArticlesCount();
    });
    jQuery('input[name=select_all]').click(function(){
        if(this.checked){
            jQuery('input[name=articleId]:not(:checked)').click();
        }else {
            jQuery('input[name=articleId]:checked').click();
        }
    });

    /*generic functions to be used above */
    function appendToPagerLinks(parameterName, value) {
        jQuery('[name=' + 'pager_link' + ']').each(function() {
            this.href = replaceOrAppendParameter(this.href, parameterName, value);
        });
    }

    function getRequestParameter (name, defaultValue){
        var params = window.location.href;
        if(params.indexOf(name)>-1){
            var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
            var str = (results != null) ? results[1] : defaultValue;
            return str;
        }
        return defaultValue;
    };

    initSelectedArticles();
    reopenBox();
    selectArticles();
    modifyPagerLink();
    showSelectedArticlesCount();
});