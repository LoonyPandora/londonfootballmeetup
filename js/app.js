

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

    // Generic "About Us" Info
    $.ajax("http://api.reddit.com/r/londonfootballmeetup/about.json?jsonp=?", {
        dataType : "json",
        data     : { limit: 5 },
        success  : function(response, textStatus, jqXHR) {
            $(".about-text").text( response.data.public_description );
        },
        error : function() {
            console.log(arguments);
        }
    });

    // FAQ page
    $.ajax("http://api.reddit.com/comments/19wn4j.json?jsonp=?", {
        dataType : "json",
        data     : { limit: 5 },
        success  : function(response, textStatus, jqXHR) {
            // Nice nesting reddit...
            var selfText = response[0].data.children[0].data.selftext;

            // Too simplistic to bother with a template
            $(".faq-content").append( markdown.toHTML(selfText) );
        },
        error : function() {
            console.log(arguments);
        }
    });



    $(".hexagons div").hover(
        function () {
            var $hexDiv = $(this);
            $hexDiv.append(
                $("<span/>").addClass("overlay").text( $hexDiv.data("name") )
            )
            // $(this).data("name");
        },
        function () {
            $(this).find("span:last").remove();
        }
    );

});