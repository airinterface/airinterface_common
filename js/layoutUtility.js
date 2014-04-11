(function(){

this.LayoutUtility = (function() {
    LayoutUtility.currentConfig = null;
    LayoutUtility.getViewportConfig = function() {
      var currentConfig, height, tmp, width;
      currentConfig = new PositionConfig();
      tmp=null
      
      currentConfig.visibleWidth = ((window.innerWidth!=undefined)?window.innerWidth:
                                    (document.documentElement!=undefined && document.documentElement.clientWidth!=undefined)?document.documentElement.clientWidth:
                                    (document.body.clientWidth));
      currentConfig.visibleHeight =((window.innerHeight!=undefined)?window.innerHeight:
                                    (document.documentElement!=undefined && document.documentElement.clientHeight!=undefined)?document.documentElement.clientHeight:
                                    (document.body.clientHeight));


      currentConfig.viewportWidth = window.innerWidth;
      currentConfig.viewportHeight = window.innerHeight;
      currentConfig.pageOffsetLeft = window.self.pageXOffset * -1;
      currentConfig.pageOffsetTop = window.self.pageYOffset * -1;
      currentConfig.windowScreenWidth = window.screen.width;
      currentConfig.windowScreenHeight = window.screen.height;
      /*
      if (currentConfig.visibleWidth < currentConfig.visibleHeight && ESDOMUtility.vOsType === ESDOMUtility.osTypes.ANDROID) {
        currentConfig.visibleHeight += 52;
      }
      if (currentConfig.visibleWidth > currentConfig.visibleHeight && ESDOMUtility.vOsType === "ios") {
        currentConfig.visibleHeight += 100;
      }
      if (ESDOMUtility.vOsType === ESDOMUtility.osTypes.BLACKBERRY || ESDOMUtility.vOsType === ESDOMUtility.osTypes.UNKNOWN) {
        width = Math.min(currentConfig.visibleWidth, currentConfig.visibleHeight);
        height = Math.max(currentConfig.visibleWidth, currentConfig.visibleHeight);
        currentConfig.windowScreenWidth = width;
        currentConfig.windowScreenHeight = height;
      }
      */
      LayoutUtility.currentConfig = currentConfig;
      return currentConfig;
    };
    function LayoutUtility() {
      LayoutUtility.__super__.constructor.call(this);
    }
    return LayoutUtility;
  })();
  this.PositionConfig = (function(){
    function PositionConfig(){
    
    }
    PositionConfig.prototype={
      scale:0,
      viewportWidth:0, // size in pixel that is visible to the user
      viewportHeight:0,
      visibleWidth:0, // size in pixel that is stylable in the content
      visibleHeight:0,
      pageOffsetLeft:0,
      pageOffsetTop:0,
      windowScreenWidth:0,
      windowScreenHeight:0
    };
    return PositionConfig;
  });
}).call(this);
