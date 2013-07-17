"use strict";

$(document).ready(function(){

    // List of posts
    $.ajax("http://api.reddit.com/r/londonfootballmeetup/new.json?jsonp=?", {
        dataType : "json",
        data     : { limit: 10 },
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
            selfText = selfText.replace(/\*\*FAQ\*\*/, "");
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
            description = description.replace(/New to our subreddit.+\n\n/g, "");

            $(".sidebar-content").append( markdown.toHTML(description) );
        },
        error : function() {
            console.log(arguments);
        }
    });

});

