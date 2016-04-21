(function(){
  "use strict";

  //see if jquery is present and throw error if it isn't
  if( !$ ){
    throw "Quicklinks needs jquery to work";
  }

  var quicklinksObject, svgAssets, pageHeaders, topP;
  var prototype = {};

  prototype.svgAssets = [
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="59.951px" height="59.953px" viewBox="0 0 59.951 59.953" enable-background="new 0 0 59.951 59.953" xml:space="preserve"><g><g><path d="M14.341,37.396c9.767,0,19.533,0,29.3,0c3.225,0,3.225-5,0-5c-9.767,0-19.533,0-29.3,0C11.117,32.396,11.117,37.396,14.341,37.396L14.341,37.396z"/></g></g><g><g><path d="M28.892,46.396c4.917,0,9.833,0,14.749,0c3.225,0,3.225-5,0-5c-4.916,0-9.833,0-14.749,0C25.668,41.396,25.668,46.396,28.892,46.396L28.892,46.396z"/></g></g><g><g><path d="M23.091,28.396c6.85,0,13.7,0,20.55,0c3.225,0,3.225-5,0-5c-6.85,0-13.7,0-20.55,0C19.867,23.396,19.867,28.396,23.091,28.396L23.091,28.396z"/></g></g><g><g><path d="M14.341,19.396c9.767,0,19.533,0,29.3,0c3.225,0,3.225-5,0-5c-9.767,0-19.533,0-29.3,0C11.117,14.396,11.117,19.396,14.341,19.396L14.341,19.396z"/></g></g></svg>',
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="59.951px" height="59.953px" viewBox="0 0 59.951 59.953" enable-background="new 0 0 59.951 59.953" xml:space="preserve"><g><path d="M17.849,21.385c6.906,6.906,13.812,13.812,20.718,20.718c2.281,2.282,5.817-1.254,3.535-3.535c-6.906-6.906-13.812-13.813-20.718-20.718C19.103,15.568,15.567,19.104,17.849,21.385L17.849,21.385z"/></g><g><path d="M21.4,42.022c6.906-6.906,13.812-13.812,20.718-20.718c2.282-2.282-1.254-5.817-3.535-3.535c-6.906,6.906-13.812,13.812-20.718,20.718C15.583,40.769,19.118,44.304,21.4,42.022L21.4,42.022z"/></g></svg>'
  ];



  window.quicklinksInit = function(color){
    //create a new prototype for our quicklinks object

    //create a new quicklinks object with prototype defined below
    quicklinksObject = Object.create(prototype);

    quicklinksCreatePanelLinks.call(quicklinksObject);

    //set the color used in this quicklinks instance as the value passed by the user
    quicklinksObject.color = color;
    quicklinksObject.svg.style.fill = color;

    //append the quicklinks panel and quicklinks button to the DOM
    document.body.appendChild(quicklinksObject.panel);
    document.body.appendChild(quicklinksObject.button);

    //add a listener to the window element that removes selected header and link styles
    window.addEventListener('scroll', quicklinksObject.resetHeaderAndLinkStyles);
  };





  //set initial states of object
  prototype.currEl = undefined;
  prototype.panelLinksClickable = false;
  prototype.panelVisible = false;
  prototype.timer = undefined;



  //create the quicklinks panel element that will hold the clickable header links
  prototype.panel = document.createElement('div');
  prototype.panel.className = 'quicklinks';

  //create the display button and add the correct svg
  prototype.button = document.createElement('div');
  prototype.button.className = 'quicklinks_mobile-button';
  prototype.button.innerHTML = prototype.svgAssets[0];

  //save a reference to the svg and set its color
  prototype.svg = $( prototype.button ).children('svg').toArray()[0];


  //prevent touchmove events on the panel from scrolling the entire page
  prototype.panel.addEventListener('touchmove', function preventBodyScrollAnon(e){
    e.preventDefault();
  }, false);

  //attach a listener on the button the opens or closes the panel
  prototype.button.addEventListener('click', function quicklinksButtonClickAnon(){
    if ( quicklinksObject.panelVisible === false ) {
      quicklinksObject.openPanel( this );
    } else {
      quicklinksObject.closePanel( this );
    }
  });



  /**
   * Adds click listener to the 'top' link that is present in every quicklinks panel
   *
   * @param {object} link - Clickable link created in quicklinks panel
   */
  prototype.topLinkClick = function(link){
    this.inMotion = true;

    $('html, body').stop().animate({
      scrollTop: 0
    }, 500, function() {
      this.inMotion = false;
    });

    this.scrollLocation = 0;

    this.changeSectionStyle( link, "top");
    this.changeLinkStyle( link );
  };



  /**
   * Adds listeners to links created in quicklinks panel and associates a scroll location with each link's element.
   *
   * @param {object} link - Clickable link created in quicklinks panel
   * @param {object/string} el - Element associated with link that page will scroll to when link is clicked. Special case "top" goes to scroll position 0
   */
  prototype.panelLinkClick = function(link, el){
     console.log(link);
     console.log(el);

    var windowHeight, location;

    windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    location = el.offsetTop - ( windowHeight / 6 );//( el.offsetHeight * 5 );

    el.style.color = this.color;

    this.inMotion = true;

    $('html, body').stop().animate({
      scrollTop: location
    }, 500, function() {
      this.inMotion = false;
    });

    this.scrollLocation = location;

    this.changeSectionStyle(link, el);
    this.changeLinkStyle(link);
  };



  /**
   * Closes panel after user clicks link and waits a period of time. Each click
   * resets the timer.
   */
  prototype.fadePanelAfterClick = function(){
    window.clearTimeout(this.timer);

    this.timer = window.setTimeout(function(){
      this.closePanel(this.button);
    },1500);
  };



  /**
   * Opens the quicklinks panel
   *
   * @param  {object} el - Button that was touched/clicked
   */
  prototype.openPanel = function(el){
    $( this.panel ).stop().fadeIn(function makeLinksClickableAnon(){
      //after the panel is fully faded-in the links become clickable
      quicklinksObject.panelLinksClickable = true;
    });

    console.log(this);

    el.innerHTML = this.svgAssets[1];
    el.style.background = this.color;
    el.style.boxShadow = 'none';

    this.panelVisible = true;
  };



  /**
   * Closes the quicklinks panel
   *
   * @param  {object} el - Button that was touched/clicked
   */
  prototype.closePanel = function(el){
    //links are not clickable when the close process begins
    this.panelLinksClickable = false;

    $( this.panel ).stop().fadeOut();

    el.innerHTML = this.svgAssets[0];
    $( el ).children('svg')[0].style.fill = this.color;
    el.style.background = 'white';
    el.style.boxShadow = '0px 3px 6px rgba(0,0,0,.5)';

    this.panelVisible = false;
  };



  /**
   * Changes the styling of header elements on the page, and updates the currentEl
   * property of the quicklinks object. No header element style change for a 'top selection'
   *
   * @param  {object} link - Link touched/clicked in quicklinks panel
   * @param  {object/string} el - Element associated with touched/clicked link, or "top"
   */
  prototype.changeSectionStyle = function(link, el){
    if( el === "top"){
      if( this.currEl ){
        this.currEl.style.color = "#424242";
        this.currEl = undefined;
      }else{
        this.currEl = undefined;
      }
    }
    else{
      if( this.currEl ){
        this.currEl.style.color = "#424242";
        this.currEl = el;
      }else{
        this.currEl = el;
      }
    }
  };



  /**
   * Changes the quicklinks link styles if a link is touched/clicked
   *
   * @param  {object} el - The touched/clicked quicklinks link
   */
  prototype.changeLinkStyle = function(el){
    if( this.currLink ){
      $( this.currLink ).removeClass( "quicklinks--selected" );
      this.currLink.style.borderColor = "#424242";
      this.currLink.style.color = "#424242";
    }

    el.className += " quicklinks--selected";
    el.style.borderColor = this.color;
    el.style.color = this.color;

    this.currLink = el;
  };



  /**
   * Returns quicklink links and page header elements to default styling on scroll
   */
  prototype.resetHeaderAndLinkStyles = function() {
    if( this.inMotion === true ) return;

    var topScrollBuffer = this.scrollLocation - 5;
    var bottomScrollBuffer = this.scrollLocation + 5;
    var currentLocation =  $( window ).scrollTop();

    //cancel if within small buffer of +-5px from the elements scroll position
    if( currentLocation >= topScrollBuffer && currentLocation <= bottomScrollBuffer ) return;

    if( this.currEl ){
      this.currEl.style.color = "#424242";
      this.currEl = undefined;
    }

    if( this.currLink ){
      $( this.currLink ).removeClass( "quicklinks--selected" );

      this.currLink.style.borderColor = "#424242";
      this.currLink.style.color = "#424242";
      this.currLink = undefined;
    }
  };















  /**
  * Gets all header elements on page and gives class and listeners, also makes 'top' page link
  */
  function quicklinksCreatePanelLinks(){
    var pageHeaders, topP;

    pageHeaders = $("h1, h2, h3, h4, h5, h6").toArray();

    topP = document.createElement("p");
    topP.className = 'quicklinks_top';
    topP.innerHTML = 'Top';

    topP.addEventListener('click', function topLinkClickAnon(){
      //checks if links are clickable before calling function -- links are not clickable when panel is closing
      console.log(this);
      if (quicklinksObject.panelLinksClickable){
        quicklinksObject.topLinkClick(topP);
      }
    });

    this.panel.appendChild(topP);

    for ( var i = 0; i < pageHeaders.length; i++ ) {
      var headerP = document.createElement("p");
      headerP.className = "quicklinks_" + pageHeaders[i].localName;
      headerP.innerHTML = pageHeaders[i].innerHTML;

      (function(h,j){
        headerP.addEventListener('click', function headerLinkClickAnon(){
          console.log(this);
          //checks if links are clickable before calling function -- links are not clickable when panel is closing
          if (quicklinksObject.panelLinksClickable){
            quicklinksObject.panelLinkClick(h,pageHeaders[j]);
          }
        });
      })(headerP, i);

      this.panel.appendChild(headerP);
    }
  }





})();












quicklinks = {

  svgAssets:[
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="59.951px" height="59.953px" viewBox="0 0 59.951 59.953" enable-background="new 0 0 59.951 59.953" xml:space="preserve"><g><g><path d="M14.341,37.396c9.767,0,19.533,0,29.3,0c3.225,0,3.225-5,0-5c-9.767,0-19.533,0-29.3,0C11.117,32.396,11.117,37.396,14.341,37.396L14.341,37.396z"/></g></g><g><g><path d="M28.892,46.396c4.917,0,9.833,0,14.749,0c3.225,0,3.225-5,0-5c-4.916,0-9.833,0-14.749,0C25.668,41.396,25.668,46.396,28.892,46.396L28.892,46.396z"/></g></g><g><g><path d="M23.091,28.396c6.85,0,13.7,0,20.55,0c3.225,0,3.225-5,0-5c-6.85,0-13.7,0-20.55,0C19.867,23.396,19.867,28.396,23.091,28.396L23.091,28.396z"/></g></g><g><g><path d="M14.341,19.396c9.767,0,19.533,0,29.3,0c3.225,0,3.225-5,0-5c-9.767,0-19.533,0-29.3,0C11.117,14.396,11.117,19.396,14.341,19.396L14.341,19.396z"/></g></g></svg>',
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="59.951px" height="59.953px" viewBox="0 0 59.951 59.953" enable-background="new 0 0 59.951 59.953" xml:space="preserve"><g><path d="M17.849,21.385c6.906,6.906,13.812,13.812,20.718,20.718c2.281,2.282,5.817-1.254,3.535-3.535c-6.906-6.906-13.812-13.813-20.718-20.718C19.103,15.568,15.567,19.104,17.849,21.385L17.849,21.385z"/></g><g><path d="M21.4,42.022c6.906-6.906,13.812-13.812,20.718-20.718c2.282-2.282-1.254-5.817-3.535-3.535c-6.906,6.906-13.812,13.812-20.718,20.718C15.583,40.769,19.118,44.304,21.4,42.022L21.4,42.022z"/></g></svg>'
  ],
  currEl: undefined,
  panelLinksClickable: false,
  panelVisible: false,
  timer: undefined,



  /**
   * Creates link panel and display button, prevents touch scrolling on panel from
   * scrolling the whole page, adds scroll listener to window, and calls following functions
   *
   * @param {string} color - accent color for quicklink button, link elements, and page elements
   */
  setUp: function(color){

    //see if jquery is present and alert the user if it isn't
    if( !$ ){
      throw "Quicklinks needs jquery to work";
    }

    //set the color property based on the argument passed by the user
    this.color = color;

    //create the panel element that will hold the header links
    this.panel = document.createElement('div');
    this.panel.className = 'quicklinks';

    //prevent dragging on the panel from scrolling the entire page
    this.panel.addEventListener('touchmove', function preventBodyScroll(e){
      e.preventDefault();
    }, false);

    //create the display button and add the correct svg
    this.button = document.createElement('div');
    this.button.className = 'quicklinks_mobile-button';
    this.button.innerHTML = this.svgAssets[0];

    //attach a listener on the button the opens or closes the panel
    this.button.addEventListener('click', function quicklinksButtonClickAnon(){
      if ( quicklinks.panelVisible === false ) {
        quicklinks.openPanel( this );
      } else {
        quicklinks.closePanel( this );
      }
    });

    //save a reference to the svg and set its color
    this.svg = $( this.button ).children('svg').toArray()[0];
    this.svg.style.fill = this.color;

    //append the panel and button to the DOM
    document.body.appendChild(this.panel);
    document.body.appendChild(this.button);

    //add a listener to the window element that removes selected header and link styles
    window.addEventListener('scroll', this.resetHeaderAndLinkStyles);

    //set up the rest of the panel elements
    this.createPanelLinks();
  },



  // /**
  //  * Gets all header elements on page and gives class and listeners, also makes 'top' page link
  //  */
  // createPanelLinks: function(){
  //   var pageHeaders = $("h1, h2, h3, h4, h5, h6").toArray();

  //   var topP = document.createElement("p");
  //   topP.className = 'quicklinks_top';
  //   topP.innerHTML = 'Top';

  //   topP.addEventListener('click', function topLinkClickAnon(){
  //     //checks if links are clickable before calling function -- links are not clickable when panel is closing
  //     if( quicklinks.panelLinksClickable ) quicklinks.topLinkClick(topP);
  //   });

  //   quicklinks.panel.appendChild(topP);

  //   for ( var i = 0; i < pageHeaders.length; i++ ) {
  //     var headerP = document.createElement("p");
  //     headerP.className = "quicklinks_" + pageHeaders[i].localName;
  //     headerP.innerHTML = pageHeaders[i].innerHTML;

  //     (function(h,j){
  //       headerP.addEventListener('click', function headerLinkClickAnon(){
  //         //checks if links are clickable before calling function -- links are not clickable when panel is closing
  //         if( quicklinks.panelLinksClickable ) quicklinks.panelLinkClick(h,pageHeaders[j]);
  //       });
  //     })(headerP, i);

  //     quicklinks.panel.appendChild(headerP);
  //   }
  // },



  // /**
  //  * Adds click listener to the 'top' link that is present in every quicklinks panel
  //  *
  //  * @param {object} link - Clickable link created in quicklinks panel
  //  * @param {object/string} el - Element associated with link that page will scroll to when link is clicked
  //  */
  // topLinkClick: function(link){
  //   quicklinks.inMotion = true;

  //   $('html, body').stop().animate({
  //     scrollTop: 0
  //   }, 500, function() {
  //     quicklinks.inMotion = false;
  //   });

  //   quicklinks.scrollLocation = 0;

  //   quicklinks.changeSectionStyle( link, "top");
  //   quicklinks.changeLinkStyle( link );
  //   //this.fadePanelAfterClick();
  // },



  // /**
  //  * Adds listeners to links created in quicklinks panel and associates a scroll location with each link's element.
  //  *
  //  * @param {object} link - Clickable link created in quicklinks panel
  //  * @param {object/string} el - Element associated with link that page will scroll to when link is clicked. Special case "top" goes to scroll position 0
  //  */
  // panelLinkClick: function(link, el){
  //   var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  //   var location = el.offsetTop - windowHeight/6;//( el.offsetHeight * 5 );

  //   el.style.color = this.color;

  //   this.inMotion = true;

  //   $('html, body').stop().animate({
  //     scrollTop: location
  //   }, 500, function() {
  //     quicklinks.inMotion = false;
  //   });

  //   this.scrollLocation = location;

  //   this.changeSectionStyle(link, el);
  //   this.changeLinkStyle(link);
  //   //this.fadePanelAfterClick();
  // },



  // /**
  //  * Closes panel after user clicks link and waits a period of time. Each click
  //  * resets the timer.
  //  */
  // fadePanelAfterClick: function(){
  //   window.clearTimeout(this.timer);

  //   this.timer = window.setTimeout(function(){
  //     quicklinks.closePanel(quicklinks.button);
  //   },1500);
  // },



  // /**
  //  * Opens the quicklinks panel
  //  *
  //  * @param  {object} el - Button that was touched/clicked
  //  */
  // openPanel: function(el){
  //   $( quicklinks.panel ).stop().fadeIn(function makeLinksClickableAnon(){
  //     //after the panel is fully faded-in the links become clickable
  //     quicklinks.panelLinksClickable = true;
  //   });

  //   el.innerHTML = this.svgAssets[1];
  //   el.style.background = quicklinks.color;
  //   el.style.boxShadow = 'none';

  //   quicklinks.panelVisible = true;
  // },



  // /**
  //  * Closes the quicklinks panel
  //  *
  //  * @param  {object} el - Button that was touched/clicked
  //  */
  // closePanel: function(el){
  //   //links are not clickable when the close process begins
  //   this.panelLinksClickable = false;

  //   $( quicklinks.panel ).stop().fadeOut();

  //   el.innerHTML = this.svgAssets[0];
  //   $( el ).children('svg')[0].style.fill = quicklinks.color;
  //   el.style.background = 'white';
  //   el.style.boxShadow = '0px 3px 6px rgba(0,0,0,.5)';

  //   quicklinks.panelVisible = false;
  // },



  // /**
  //  * Changes the styling of header elements on the page, and updates the currentEl
  //  * property of the quicklinks object. No header element style change for a 'top selection'
  //  *
  //  * @param  {object} link - Link touched/clicked in quicklinks panel
  //  * @param  {object/string} el - Element associated with touched/clicked link, or "top"
  //  */
  // changeSectionStyle: function(link, el){
  //   if( el === "top"){
  //     if( quicklinks.currEl ){
  //       quicklinks.currEl.style.color = "#424242";
  //       quicklinks.currEl = undefined;
  //     }else{
  //       quicklinks.currEl = undefined;
  //     }
  //   }
  //   else{
  //     if( quicklinks.currEl ){
  //       quicklinks.currEl.style.color = "#424242";
  //       quicklinks.currEl = el;
  //     }else{
  //       quicklinks.currEl = el;
  //     }
  //   }
  // },



  // /**
  //  * Changes the quicklinks link styles if a link is touched/clicked
  //  *
  //  * @param  {object} el - The touched/clicked quicklinks link
  //  */
  // changeLinkStyle: function(el){
  //   if( quicklinks.currLink ){
  //     $( quicklinks.currLink ).removeClass( "quicklinks--selected" );
  //     quicklinks.currLink.style.borderColor = "#424242";
  //     quicklinks.currLink.style.color = "#424242";
  //   }

  //   el.className += " quicklinks--selected";
  //   el.style.borderColor = quicklinks.color;
  //   el.style.color = quicklinks.color;

  //   quicklinks.currLink = el;
  // },



  // /**
  //  * Returns quicklink links and page header elements to default styling on scroll
  //  */
  // resetHeaderAndLinkStyles: function() {
  //   if( quicklinks.inMotion === true ) return;

  //   var topScrollBuffer = quicklinks.scrollLocation - 5;
  //   var bottomScrollBuffer = quicklinks.scrollLocation + 5;
  //   var currentLocation =  $( window ).scrollTop();

  //   //cancel if within small buffer of +-5px from the elements scroll position
  //   if( currentLocation >= topScrollBuffer && currentLocation <= bottomScrollBuffer ) return;

  //   if( quicklinks.currEl ){
  //     quicklinks.currEl.style.color = "#424242";
  //     quicklinks.currEl = undefined;
  //   }

  //   if( quicklinks.currLink ){
  //     $( quicklinks.currLink ).removeClass( "quicklinks--selected" );

  //     quicklinks.currLink.style.borderColor = "#424242";
  //     quicklinks.currLink.style.color = "#424242";
  //     quicklinks.currLink = undefined;
  //   }
  // },
};
