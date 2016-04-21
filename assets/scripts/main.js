(function(){
  "use strict";

  //see if jquery is present and throw error if it isn't
  try{
    $();
  } catch(e){
    console.log("Quicklinks needs jQuery to work!");
    return;
  }



  var quicklinksObject, prototype, svgAssets, pageHeaders, topP;

  //establish prototype object and its properties and elements
  prototype = {};

  //store inline button svgs in prototype array
  prototype.svgAssets = [
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="59.951px" height="59.953px" viewBox="0 0 59.951 59.953" enable-background="new 0 0 59.951 59.953" xml:space="preserve"><g><g><path d="M14.341,37.396c9.767,0,19.533,0,29.3,0c3.225,0,3.225-5,0-5c-9.767,0-19.533,0-29.3,0C11.117,32.396,11.117,37.396,14.341,37.396L14.341,37.396z"/></g></g><g><g><path d="M28.892,46.396c4.917,0,9.833,0,14.749,0c3.225,0,3.225-5,0-5c-4.916,0-9.833,0-14.749,0C25.668,41.396,25.668,46.396,28.892,46.396L28.892,46.396z"/></g></g><g><g><path d="M23.091,28.396c6.85,0,13.7,0,20.55,0c3.225,0,3.225-5,0-5c-6.85,0-13.7,0-20.55,0C19.867,23.396,19.867,28.396,23.091,28.396L23.091,28.396z"/></g></g><g><g><path d="M14.341,19.396c9.767,0,19.533,0,29.3,0c3.225,0,3.225-5,0-5c-9.767,0-19.533,0-29.3,0C11.117,14.396,11.117,19.396,14.341,19.396L14.341,19.396z"/></g></g></svg>',
    '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="59.951px" height="59.953px" viewBox="0 0 59.951 59.953" enable-background="new 0 0 59.951 59.953" xml:space="preserve"><g><path d="M17.849,21.385c6.906,6.906,13.812,13.812,20.718,20.718c2.281,2.282,5.817-1.254,3.535-3.535c-6.906-6.906-13.812-13.813-20.718-20.718C19.103,15.568,15.567,19.104,17.849,21.385L17.849,21.385z"/></g><g><path d="M21.4,42.022c6.906-6.906,13.812-13.812,20.718-20.718c2.282-2.282-1.254-5.817-3.535-3.535c-6.906,6.906-13.812,13.812-20.718,20.718C15.583,40.769,19.118,44.304,21.4,42.022L21.4,42.022z"/></g></svg>'
  ];

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
   * Adds listeners to links created in quicklinks panel and associates a scroll location with each link's element.
   *
   * @param {object} link - Clickable link created in quicklinks panel
   * @param {object/string} el - Element associated with link that page will scroll to when link is clicked. Special case "top" goes to scroll position 0
   */
  prototype.panelLinkClick = function(link, el){
    var windowHeight, location;

    windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    location = el.offsetTop - ( windowHeight / 6 );

    el.style.color = this.color;

    this.inMotion = true;

    $('html, body').stop().animate({
      scrollTop: location
    }, 500, function() {
      quicklinksObject.inMotion = false;
    });

    this.scrollLocation = location;

    this.changeSectionStyle(link, el);
    this.changeLinkStyle(link);
  };




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
      quicklinksObject.inMotion = false;
    });

    this.scrollLocation = 0;

    this.changeSectionStyle( link, "top");
    this.changeLinkStyle( link );
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
    //exit function if the page is in motion due to a quicklinks event
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



  // /**
  //  * Currently disabled --- Closes panel after user clicks link and waits a period
  //  of time. Each click resets the timer.
  //  */
  // prototype.fadePanelAfterClick = function(){
  //   window.clearTimeout(this.timer);
  //
  //   this.timer = window.setTimeout(function(){
  //     this.closePanel(this.button);
  //   },1500);
  // };



  /**
   * Property on the global window object which allows the user to initiate the
   * quicklinks plugin. Creates a new object with the quicklinks prototype, and
   * calls the function that searches the DOM for the header elements that have been
   * loaded.
   *
   * @param  {string} color - hex/rgb/rgba/color string value for the quicklinks accent color
   */
  window.quicklinksInit = function(color){
    if (!color) color = "red";

    //create a new quicklinks object with prototype defined below
    quicklinksObject = Object.create(prototype);

    quicklinksCreatePanelLinks.call(quicklinksObject);

    //set the color used in this quicklinks instance as the value passed by the user
    quicklinksObject.color = color;
    quicklinksObject.svg.style.fill = color;

    //append the quicklinks panel and quicklinks button to the DOM
    document.body.appendChild(quicklinksObject.panel);
    document.body.appendChild(quicklinksObject.button);

    //add a listener to the window scroll event that removes selected header and link styles
    window.addEventListener('scroll', function windowScrollListenerAnon(){
      quicklinksObject.resetHeaderAndLinkStyles.call(quicklinksObject);
    });
  };



  /**
  * Gets all header elements on page and gives class and listeners, also makes 'top' page link
  */
  function quicklinksCreatePanelLinks(){
    var pageHeaders, topP;

    //jquery -- gets all html header elements and makes an array
    pageHeaders = $("h1, h2, h3, h4, h5, h6").toArray();

    topP = document.createElement("p");
    topP.className = 'quicklinks_top';
    topP.innerHTML = 'Top';

    //click listener that will allow the user to interact with the link in the panel
    topP.addEventListener('click', function topLinkClickAnon(){
      //checks if links are clickable before calling function -- links are not clickable when panel is closing
      if (quicklinksObject.panelLinksClickable) quicklinksObject.topLinkClick(topP);
    });

    this.panel.appendChild(topP);

    //loops through all of the HTML header elements and creates a panel link and attaches a click listener
    for ( var i = 0; i < pageHeaders.length; i++ ) {
      var headerP = document.createElement("p");

      headerP.className = "quicklinks_" + pageHeaders[i].localName;
      headerP.innerHTML = pageHeaders[i].innerHTML;

      //click listener that will allow the user to interact with the link in the panel
      headerP.addEventListener('click', makeHeaderClickHandler(headerP, i));

      this.panel.appendChild(headerP);
    }

    function makeHeaderClickHandler(headerP, pos){
      headerP.addEventListener('click', function headerLinkClickAnon(){
        //checks if links are clickable before calling function -- links are not clickable when panel is closing
        if (quicklinksObject.panelLinksClickable) quicklinksObject.panelLinkClick(headerP,pageHeaders[pos]);
      });
    }
  }
})();
