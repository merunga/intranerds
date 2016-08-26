// Agency Theme JavaScript
// $(function() {
//   var cursor;
//   var $input;
//   
//   $('.cmd').click(function() {
//     var $this = $(this);
//     var $parent = $this.parent();
//     $input = $parent.find('input');
//     $input.focus();
//     
//     var $cursor = $parent.find('.cursor')
//     
//     cursor = window.setInterval(function() {
//       if ($.css('visibility') === 'visible') {
//         $cursor.css({ visibility: 'hidden' });
//       } else {
//         $cursor.css({ visibility: 'visible' });  
//       }  
//     }, 500);
//     
//   });
//   
//   if($input) {
//     $input.keyup(function() {
//       $this.find('span').text($this.val());
//     });
//     
//     $input.blur(function() {
//       clearInterval(cursor);
//       $cursor.css({ visibility: 'visible' });    
//     });
//   }
// });


function typer(e, s, d, t) {
  var eI = 0;
  var speed = s;
  var delay = d;
  var eLength = t.length;
  var z = 1;
  var cursor = '<span class="blink-fast">∎</span>';
  function loop() {
    var p = $("<div class='azy-typer-container'></div>");
    var c_t = $("<span class='azy-typer-element'></span>")
    p.append(c_t);
    $(e).append(p);
    interval = setInterval(function() {
      var c = (z + 1 <= t[eI].length)? cursor: ""
      if(t[eI].indexOf('*-*-*-*-*') > -1) {
        speed = 1;
        delay = 1;
        eI = eI + 1;
        z = 0;
      }
      
      c_t.html(t[eI].substring(0, z).replace(/ /g,"&nbsp;") + c);
      
      if (z + 1 > t[eI].length) {
        clearInterval(interval);
        eI = eI + 1;
        if (eI + 1 <= t.length) {
        	z = 0;
        	setTimeout(loop,delay);
        } else {
          p.append($(cursor));
        }
      } else {
        z = z + 1;
      }
    }, speed)
  }
  loop();
}

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a:not(.dropdown-toggle)').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    });

    // typer effect
    // if(!window.introTyped) {
    //
    // }
    // $('body').scrollspy({ target: '.terminal' })
    // $('.terminal').on('activate.bs.scrollspy', function () {
    //   var $elem = $(this);
    //   console.log($elem)
    // })
    $('body').scrollspy({ target: '.terminal' })
    var $elem = $('.terminal')
    var lines = $elem.html().split('\n')
    $elem.html('')

    new typer(".terminal", 30, 50, lines);


})(jQuery); // End of use strict
