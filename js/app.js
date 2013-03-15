

"use strict";

$(document).ready(function(){


    $.ajax("http://api.reddit.com/r/londonfootballmeetup/new.json?jsonp=?", {
        dataType : "json",
        data     : { limit: 5 },
        success  : function(response, textStatus, jqXHR) {
            $.each(response.data.children,
                function (i, post) {
                    var $link = $("<li/>").append(
                        $("<a/>")
                            .attr("href", post.data.url)
                            .attr("title", post.data.title)
                            .text(post.data.title)
                    );

                    $('.latest-posts').append($link);
                }
            );
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