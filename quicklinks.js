quicklinks = {

  //scrollLocation: 0, //holds page scroll val

  /**
   * Initializes quicklinks plugin, gets page color determined by header
   */
  setUp: function(color) {
    quicklinks.color = color;
    this.panel = document.createElement('div');
    this.panel.className = 'quicklinks';

    this.panel.addEventListener('touchmove', function preventBodyScroll(e){
      e.preventDefault();
    }, false);

    document.body.appendChild(this.panel);
    this.pushHeaders();
    this.addMobileButtonListeners();
  },



  /**
   * Gets all header elements on page and gives class and listeners, also makes 'top' page link
   */
  pushHeaders: function(){
    var pageHeaders = $("h1, h2, h3, h4, h5, h6").toArray();

    var topP = document.createElement("p");
    topP.className = 'quicklinks_top';
    topP.innerHTML = 'Top';

    topP.addEventListener('click', function topLinkClickAnon(){
      quicklinks.topLinkClick(topP);
    });

    quicklinks.panel.appendChild(topP);

    for ( var i = 0; i < pageHeaders.length; i++ ) {
      var headerP = document.createElement("p");
      headerP.className = "quicklinks_" + pageHeaders[i].localName;
      headerP.innerHTML = pageHeaders[i].innerHTML;

      (function(h,j){
        headerP.addEventListener('click', function headerLinkClickAnon(){
          quicklinks.headerLinkClick(h,pageHeaders[j]);
        });
      })(headerP, i);

      quicklinks.panel.appendChild(headerP);
    }
  },

  /**
   * Adds click listener to the 'top' link that is present in every quicklinks panel
   * @param {object} link - Clickable link created in quicklinks panel
   * @param {object/string} el - Element associated with link that page will scroll to when link is clicked
   */
  topLinkClick: function(link){
    quicklinks.inMotion = true;

    $('html, body').stop().animate({
      scrollTop: 0
    }, 500, function() {
      quicklinks.inMotion = false;
    });

    quicklinks.scrollLocation = 0;
    quicklinks.changeSectionStyle( link, "top");
    quicklinks.changeLinkStyle( link );
  },



  /**
   * Adds listeners to links created in quicklinks panel and associates a scroll location with each link's element.
   * @param {object} link - Clickable link created in quicklinks panel
   * @param {object/string} el - Element associated with link that page will scroll to when link is clicked. Special case "top" goes to scroll position 0
   */
  headerLinkClick: function( link, el ) {
    var location = el.offsetTop - ( el.offsetHeight * 3 );

    el.style.color = quicklinks.color;

    quicklinks.inMotion = true;
    $('html, body').stop().animate({
        scrollTop: location
    }, 500, function() {
      quicklinks.inMotion = false;
    });

    quicklinks.scrollLocation = location;
    quicklinks.changeSectionStyle( link, el );
    quicklinks.changeLinkStyle( link );
  },



  /**
   * Adds listener to mobile button that displays quicklinks
   */
  addMobileButtonListeners: function() {
    var el = this.mobileButton = document.getElementsByClassName( "quicklinks_mobile-button" )[0];
    var svg = quicklinks.mobileButtonSvg = $( el ).children('svg').toArray()[0];

    if ( this.smallWindow === true ) this.showMobileButton();

    quicklinks.divDisplay = $( quicklinks.div ).css("display");

    $( el ).click(function() {
      if ( quicklinks.divDisplay === "none" ) {
        quicklinks.openMobileQuicklinks( this );
      } else {
        quicklinks.closeMobileQuicklinks( this );
      }
    });
  },



  /**
   * Makes mobile button visible
   */
  showMobileButton: function() {
    this.mobileButton.style.display = "block";
  },



  // /**
  //  * Makes mobile button invisible and changes inner svg element
  //  */
  // hideMobileButton: function() {
  //   this.mobileButton.style.display = "none";
  //   this.mobileButton.style.background = "white";
  //   $( this.mobileButton ).load( "assets/svgs/menu--quicklinks.svg", function() {
  //     this.children('svg')[0].style.fill = quicklinks.color;
  //   });
  // },



  /**
   * Opens the mobile version of the quicklinks panel
   * @param  {object} el - Button that was touched/clicked
   */
  openMobileQuicklinks: function( el ) {
    if ( el === undefined ) el = document.getElementsByClassName( "quicklinks_mobile-button" )[0];

    $( quicklinks.panel ).stop().fadeIn();
    $( el ).load( "assets/svgs/menu--quicklinks--close.svg");
    el.style.background = quicklinks.color;

    if ( navMenu ) navMenu.hideMenu();
    quicklinks.divDisplay = "block";
  },



  /**
   * Closes the mobile version of the quicklinks panel
   * @param  {object} el - Button that was touched/clicked
   */
  closeMobileQuicklinks: function( el ) {
    if ( quicklinks.largeWindow ) return;
    if ( el === undefined ) el = document.getElementsByClassName( "quicklinks_mobile-button" )[0];

    $( quicklinks.panel ).stop().fadeOut();

    $( el ).load( "assets/svgs/menu--quicklinks.svg", function() {
      $( el ).children('svg')[0].style.fill = quicklinks.color;
    });

    el.style.background = "white";
    quicklinks.divDisplay = "none";
  },


  /**
   * Changes the styling of header elements on the page. No style change for top.
   * @param  {[object} link - Link touched/clicked in quicklinks panel
   * @param  {object} el - Element associated with touched/clicked link, or "top"
   */
  changeSectionStyle: function( link, el ) {
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



  /**
   * Changes the quicklinks link styles if a link is touched/clicked
   * @param  {object} el - The touched/clicked quicklinks link
   */
  changeLinkStyle: function( el ) {
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



  /**
   * Returns quicklink links and page header elements to default styling on scroll
   */
  scrollReset: function() {
    if ( quicklinks.inMotion === true ) {
      return;
    }

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



  // /**
  //  * Handles switch to mobile interface on resize
  //  */
  // moveWithScrollSmallWindow: function() {
  //   $( '.quicklinks' ).css({
  //     "position": "fixed",
  //     "top": "",
  //     "bottom": "0px",
  //     "right": "0px",
  //     "display": "none"
  //   });

  //   quicklinks.divDisplay = "none";
  //   this.smallWindow = true;
  //   this.largeWindow = false;
  // },



  // /**
  //  * Handles switch to desktop interface on resize
  //  */
  // moveWithScrollLargeWindow: function() {
  //   var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  //   if ( windowWidth < 960 ) return;

  //   if( $( window ).scrollTop() >= (navMenu.gradientHeight - 70 + 4) ) {
  //     $( '.quicklinks' ).css({
  //       "position": "fixed",
  //       "top": "87px",
  //       "margin": "0px",
  //       "float": "none",
  //       "display": "block"
  //     });
  //     quicklinks.setQuicklinksRight();
  //   } else {
  //     $( '.quicklinks' ).css({
  //       "position": "relative",
  //       "top": "",
  //       "right": "",
  //       "margin": "20px 0 0 0",
  //       "float": "right",
  //       "display": "block"
  //     });
  //   }

  //   quicklinks.divDisplay = "block";
  //   quicklinks.largeWindow = true;
  //   quicklinks.smallWindow = false;
  // // },



  // /**
  //  * Handles 'right' css value of desktop quicklinks panel
  //  */
  // setQuicklinksRight: function() {
  //   var windowWidth = document.body.clientWidth;
  //   var right = ( windowWidth - 860 ) / 2;

  //   $( '.quicklinks' ).css("right", right);
  // },

};
