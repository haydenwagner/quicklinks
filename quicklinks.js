quicklinks = {

  scrollLocation: 0,
  smallWindow: false,
  largeWindow: false,

  setUp: function() {
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    this.div = $( '.quicklinks' )[0];

    //get color of header of page--will switch between about/project/contact
    $( document ).ready( function() {
      var test = $('.section').css("background");
      var regEx = /[^)]*/;
      var color = test.match( regEx );
      color = color + ")";
      quicklinks.color = color;
      if ( quicklinks.mobileButtonSvg ) quicklinks.mobileButtonSvg.style.fill = quicklinks.color;
    });

    //
    if ( windowWidth < 960 ) {
      this.smallWindow = true;
    } else {
      this.largeWindow = true;
    }

    this.pushHeaders();
    this.addMobileButtonListeners();
  },

  pushHeaders: function() {
    var jqHeaders = $("h1, h2, h3, h4, h5, h6");
    for ( var i = -1; i < jqHeaders.length; i++ ) {
      var p = document.createElement("p");

      if ( i === -1 ) {
        p.innerHTML = "Top";
        p.className = "quicklinks_top";
        quicklinks.div.appendChild( p );
        quicklinks.addClickListeners( p, "top" );
      } else {
        p.innerHTML = jqHeaders[i].innerHTML;
        p.className = "quicklinks_" + jqHeaders[i].localName;
        if ( jqHeaders[i].id ) {
          p.id = jqHeaders[i].id;
        }
        quicklinks.div.appendChild( p );
        quicklinks.addClickListeners( p, jqHeaders[i] );
      }
    }

  },


  addMobileButtonListeners: function() {
    var el = this.mobileButton = document.getElementsByClassName( "quicklinks_mobile-button" )[0];
    if ( this.smallWindow === true ) this.showMobileButton();
    var svg = quicklinks.mobileButtonSvg = $( el ).children('svg').toArray()[0];

    quicklinks.divDisplay = $( quicklinks.div ).css("display");

    $( el ).click(function() {
      console.log( quicklinks.divDisplay );
      if ( quicklinks.divDisplay === "none" ) {
        //$( quicklinks.div ).css("display", "block");
        // $( quicklinks.div ).stop().fadeIn();
        // $( el ).load( "assets/svgs/menu--quicklinks--close.svg");
        // el.style.background = quicklinks.color;
        // quicklinks.divDisplay = "block";
        quicklinks.openMobileQuicklinks( this );
      } else {
        quicklinks.closeMobileQuicklinks( this );
        //$( quicklinks.div ).css("display", "none");
        // $( quicklinks.div ).stop().fadeOut();
        // $( el ).load( "assets/svgs/menu--quicklinks.svg", function() {
        //   console.log( $( el ).children('svg') );
        //   $( el ).children('svg')[0].style.fill = quicklinks.color;
        // });
        // el.style.background = "white";
        // quicklinks.divDisplay = "none";
      }
    });
  },

  showMobileButton: function() {
    this.mobileButton.style.display = "block";
  },

  hideMobileButton: function() {
    this.mobileButton.style.display = "none";
    this.mobileButton.style.background = "white";
    $( this.mobileButton ).load( "assets/svgs/menu--quicklinks.svg", function() {
      this.children('svg')[0].style.fill = quicklinks.color;
    });
  },


  openMobileQuicklinks: function( el ) {
    if ( el === undefined ) el = document.getElementsByClassName( "quicklinks_mobile-button" )[0];

    $( quicklinks.div ).stop().fadeIn();
    $( el ).load( "assets/svgs/menu--quicklinks--close.svg");
    el.style.background = quicklinks.color;

    if ( navMenu ) navMenu.hideMenu();
    quicklinks.divDisplay = "block";
  },


  closeMobileQuicklinks: function( el ) {
    if ( quicklinks.largeWindow ) return;
    if ( el === undefined ) el = document.getElementsByClassName( "quicklinks_mobile-button" )[0];
            //$( quicklinks.div ).css("display", "none");
    $( quicklinks.div ).stop().fadeOut();

    $( el ).load( "assets/svgs/menu--quicklinks.svg", function() {
      console.log( $( el ).children('svg') );
      $( el ).children('svg')[0].style.fill = quicklinks.color;
    });

    el.style.background = "white";
    quicklinks.divDisplay = "none";
  },





  addClickListeners: function( link, el ) {
    if ( el === "top" ) {
      $( link ).click(function (){

        quicklinks.inMotion = true;
        $('html, body').stop().animate({
          scrollTop: 0
        }, 500, function() {
          quicklinks.inMotion = false;
        });

        // $('html, body').promise().done(function(){
        //  quicklinks.inMotion = false;
        //});

        quicklinks.scrollLocation = 0;
        quicklinks.changeSectionStyle( link, el );
        quicklinks.changeLinkStyle( link );
      });
    }
    else {
      $( link ).click(function (){

        var location = el.offsetTop - ( el.offsetHeight * 3 );

        el.style.color = quicklinks.color;
        //el.style.borderLeft = "4px solid " + quicklinks.color;
        //el.style.paddingLeft = "5px";


        quicklinks.inMotion = true;
        $('html, body').stop().animate({
            scrollTop: location
        }, 500, function() {
          quicklinks.inMotion = false;
        });

        //$('html, body').promise().done(function(){
        //  quicklinks.inMotion = false;
        //});

        quicklinks.scrollLocation = location;
        quicklinks.changeSectionStyle( link, el );
        quicklinks.changeLinkStyle( link );
      });
    }
  },

  changeSectionStyle: function( link, el ) {

    console.log ( "change section style");
    if ( el === "top") {
      if ( quicklinks.currEl ) {
        quicklinks.currEl.style.color = "#424242";
        quicklinks.currEl = undefined;
      } else {
        quicklinks.currEl = undefined;
      }
    }
    else {
      if ( quicklinks.currEl ) {
        quicklinks.currEl.style.color = "#424242";
        quicklinks.currEl = el;
      } else {
        quicklinks.currEl = el;
      }
    }
  },

  changeLinkStyle: function( el ) {

    console.log( "change link style" );
    if ( quicklinks.currLink ) {
      $( quicklinks.currLink ).removeClass( "quicklinks--selected" );
      quicklinks.currLink.style.borderColor = "#424242";
      quicklinks.currLink.style.color = "#424242";
    }
    el.className += " quicklinks--selected";
    el.style.borderColor = quicklinks.color;
    el.style.color = quicklinks.color;
    quicklinks.currLink = el;
  },

  scrollReset: function() {
    if ( quicklinks.inMotion === true ) {
      console.log("stop reset");
      return;
    }

    console.log("reset");

    var topScrollBuffer = quicklinks.scrollLocation - 5;
    var bottomScrollBuffer = quicklinks.scrollLocation + 5;
    var currentLocation =  $( window ).scrollTop();

    if ( quicklinks.inMotion || ( currentLocation >= topScrollBuffer && currentLocation <= bottomScrollBuffer ) ) return;

    if ( quicklinks.currEl ) {
      quicklinks.currEl.style.color = "#424242";
      quicklinks.currEl = undefined;
    }

    if ( quicklinks.currLink ) {
      $( quicklinks.currLink ).removeClass( "quicklinks--selected" );
      quicklinks.currLink.style.borderColor = "#424242";
      quicklinks.currLink.style.color = "#424242";
      quicklinks.currLink = undefined;
    }
  },

  moveWithScrollSmallWindow: function() {
    $( '.quicklinks' ).css({
      "position": "fixed",
      "top": "",
      "bottom": "0px",
      "right": "0px",
      "display": "none"
    });

    quicklinks.divDisplay = "none";
    this.smallWindow = true;
    this.largeWindow = false;
  },

  moveWithScrollLargeWindow: function() {
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if ( windowWidth < 960 ) return;

    if( $( window ).scrollTop() >= (navMenu.gradientHeight - 70 + 4) ) {
      $( '.quicklinks' ).css({
        "position": "fixed",
        "top": "87px",
        "margin": "0px",
        "float": "none",
        "display": "block"
      });
      quicklinks.setQuicklinksRight();
    } else {
      $( '.quicklinks' ).css({
        "position": "relative",
        "top": "",
        "right": "",
        "margin": "20px 0 0 0",
        "float": "right",
        "display": "block"
      });
    }

    quicklinks.divDisplay = "block";
    quicklinks.largeWindow = true;
    quicklinks.smallWindow = false;
  },


  setQuicklinksRight: function() {
    var windowWidth = document.body.clientWidth;
    var right = ( windowWidth - 860 ) / 2;

    $( '.quicklinks' ).css("right", right);
  },

};
