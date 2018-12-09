
/* A jQuery plugin to infinite scroll forever */
(function($) {
    $.frevr = function (options) {

        var defaults = {
            next    : '#next-page',
            posts   : '#posts',
            trigger : 500,
        },
        plugin = this,
        options = options || {};

        plugin.init = function () {
            var settings = $.extend({}, defaults, options);
            // private settings
            settings.is_loading = false;
            settings.first_call = true;
            settings.version    = '0.2';
 
            // Save to data
            $.data(document, 'frevr', settings);
        }

        plugin.init();

    }

    $.frevr.init = function (calls) {
        
        var settings = $.data(document, 'frevr');

        calls = $.extend({}, { before : null, after : null }, calls);

        $(window).scroll(function() {
            
           if($(window).scrollTop() + $(window).height() > $(document).height() - settings.trigger) {
                if(!settings.is_loading){
                    
                    settings.is_loading = true;
                    
                    if(typeof calls.after == 'function'){
                        calls.before();    
                    }
                    
                    $.frevr.load_more_posts(settings);     
                    
                    if(typeof calls.after == 'function'){
                        calls.after();    
                    } 
                }
           }

        });
    }

    // Get the link and attempt to load more posts
    $.frevr.load_more_posts = function (settings) {
        if(settings.first_call){
            settings.first_href = settings.next_href = $(settings.next).attr('href');
            settings.first_call = false;
        }

        if(settings.next_href){
            var jqxhr = $.get( settings.next_href, function(data){
                
                var $response = $('<div />').html(data);

                var $new_posts = $response.find(settings.posts).html();
                var new_href = $response.find(settings.next ).attr('href');

                if(typeof new_href == 'undefined' || new_href == ''){
                    // INFINITY!!
                    settings.next_href = settings.first_href;
                }else{
                    settings.next_href = new_href;    
                }
                // Update link and page
                $(settings.posts).append($new_posts);

                $(settings.next ).attr('href',settings.next_href);


            },'html').always(function(){
                settings.is_loading = false;
            });    
        }else{
            console.log('Error next_href: '+settings.next_href);
        }
        
    }

}(jQuery));
