"use strict";

$(document).ready(function(){

    var grid = new hashgrid();

    // List of posts
    $.ajax("http://api.reddit.com/r/londonfootballmeetup/new.json?jsonp=?", {
        dataType : "json",
        data     : { limit: 20 },
        success  : function(response, textStatus, jqXHR) {
            var $template = $("#latest-posts-template").html();

            $.each(response.data.children,
                function (i, post) {
                    
                    // Munge the data structure to what we need with formatted date/time
                    var createdDate = moment.unix(post.data.created_utc);

                    var renderData = {
                        relativeDate: createdDate.fromNow(),
                        fullDate: createdDate.format("dddd, MMMM Do YYYY, h:mm:ss a"),
                        permalink: post.data.permalink,
                        author: post.data.author,
                        title: post.data.title.replace(/&amp;/g, "&"),
                        num_comments: post.data.num_comments
                    }

                    $(".latest-posts").append(
                        Mustache.render($template, renderData)
                    );
                }
            );
        },
        error : function(jqXHR, textStatus) {
            var $template = $("#latest-posts-template").html();

            $(".latest-posts").append(
                Mustache.render($template, {
                    "title" : "Reddit is down :(",
                    "url" : "#"
                })
            );
        }
    });

    // FAQ page
    $.ajax("http://api.reddit.com/comments/19wn4j.json?jsonp=?", {
        dataType : "json",
        data     : { limit: 5 },
        success  : function(response, textStatus, jqXHR) {
            // Nice nesting reddit...
            var selfText = response[0].data.children[0].data.selftext;

            // Hacky and crap regex cleanup of the markdown
            selfText = selfText.replace(/\*\*FAQ\*\*/, "");
            selfText = selfText.replace(/London Football Meetup = Football for all/, "");
            selfText = selfText.replace(/&amp;/g, "&");

            // Too simplistic to bother with a template
            $(".faq-content").append( markdown.toHTML(selfText) );
        },
        error : function() {
            console.log(arguments);
        }
    });


    // Subreddit info page
    $.ajax("http://api.reddit.com/r/londonfootballmeetup/about.json?jsonp=?", {
        dataType : "json",
        data     : { limit: 5 },
        success  : function(response, textStatus, jqXHR) {
            var description = response.data.description;

            // Remove links to the FAQ which we show inline
            description = description.replace(/&amp;/g, "&");

            // This info doesn't work well in a website format, so strip it for now
            // If people like the site, we can modify the content to work everywhere
            description = description.replace(/\[Photo Albums\][\s\S]+/g, "");

            $(".sidebar-content").append( markdown.toHTML(description) );
        },
        error : function() {
            console.log(arguments);
        }
    });


    var map;
    initializeGMap();

});


function initializeGMap() {
    var styles = [{
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "elementType": "geometry",
        "stylers": [{
            "saturation": -100
        }, {
            "lightness": -80
        }, {
            "visibility": "simplified"
        }]
    }];

    var styledMap = new google.maps.StyledMapType(styles, {
        name: "Styled Map"
    });

    var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(51.511858,-0.077204),
        disableDefaultUI: true,
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: true,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
}
