

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
            var valid, wanted = [];
            $.each(response.data.description.split("\n"),
                function (i, line) {
                    if (line.match(/NEXT MEET UP/)) {
                        valid = true;
                        return true;
                    } else if (line.match(/\*\*Weekend/)) {
                        valid = false;
                    };

                    if (valid) {
                        wanted.push(line.replace(/\W+/, ""));
                    }
                }
            );

            // Too simplistic to bother with a template
            $(".sidebar-content").append( markdown.toHTML(wanted.join("\n")) );
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