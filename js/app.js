

"use strict";

$(document).ready(function(){

    // List of posts
    $.ajax("http://api.reddit.com/r/londonfootballmeetup/new.json?jsonp=?", {
        dataType : "json",
        data     : { limit: 5 },
        success  : function(response, textStatus, jqXHR) {
            var $template = $("#latest-posts-template").html();

            $.each(response.data.children,
                function (i, post) {
                    $(".latest-posts").append(
                        Mustache.render($template, post.data)
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
            selfText = selfText.replace(/\*\*FAQ\*\*/,"");
            selfText = selfText.replace(/Time to update FAQ! Please post below if you see anything wrong or needs adding\./,"");

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
            // Bit hacky to parse out bits of the post with regexen, but will do for now
            var dates = [];
            $.each(response.data.description.split("\n"),
                function (i, line) {
                    if (line.match(/\d{1,2}(?:st|nd|rd|th)/)) {
                        dates.push(line.replace(/\W+/, ""));
                    }
                }
            );

            // Too simplistic to bother with a template
            $(".sidebar-content").append( markdown.toHTML(dates.join(" & ")) );
        },
        error : function() {
            console.log(arguments);
        }
    });


    // Workaround for google maps in an iframe on bootstrap tabs / modals
    $("a[href=#stratford]").one('click', function(event) {
        // Get the map link from the HTML, and re-insert it into the DOM
        $("#stratford").html(
            $("#stratford").html()
        );
    });


    // Render the hexagons using mustache
    var $hexTemplate = $("#hexagon-template").html();
    var i = 0;
    $.each(people, function (key, value) {
        $(".hexagons").append(
            Mustache.render($hexTemplate, { "picture" : key, "name" : value })
        );

        var breakPoints = {
            "desktopWide" : [6, 12, 19, 25, 32],
            "desktop" : [4, 8, 13, 17, 22, 26, 31],
            "mobileWide" : [2, 4, 7, 9, 12, 14, 17, 19, 21, 23],
            "mobile" : [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17]
        }

        var $br = $("<br/>");

        if ($.inArray(i, breakPoints.mobile) > -1) {
            $br.addClass("mobile");
        }

        if ($.inArray(i, breakPoints.mobileWide) > -1) {
            $br.addClass("mobile-wide");
        }

        if ($.inArray(i, breakPoints.desktop) > -1) {
            $br.addClass("desktop");
        }

        if ($.inArray(i, breakPoints.desktopWide) > -1) {
            $br.addClass("desktop-wide");
        }

        $(".hexagons").append($br)

        i++;
    });



    // Show names on picture hover 
    // TODO: Make it handle touch events too
    $(".hexagons div").hover(
        function () {
            var $hexDiv = $(this);
            $hexDiv.append(
                $("<span/>").addClass("overlay").text( $hexDiv.data("name") )
            )
        },
        function () {
            $(this).find("span:last").remove();
        }
    );

});

