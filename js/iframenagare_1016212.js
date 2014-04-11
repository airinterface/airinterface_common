(function(){
  iFrameNagare = (function() {
      function iFrameNagare(el,option){
      var that=null;
      this.element=el;
      this.updateViewConfigData();
      tmpParent = this.element.parentNode;
      this.maxBodyW = jQuery(tmpParent).width() || parseFloat(this.viewConfig.visibleWidth);
      this.maxBodyH = jQuery(tmpParent).height()  || parseFloat(this.viewConfig.visibleHeight);
      this.maxScrollH = jQuery(this.element).height() - this.maxBodyH;
      this.maxScrollW = jQuery(this.element).width() - this.maxBodyW;
      that=this;
      that.initialize();
    }
    iFrameNagare.prototype={
      debugFlag:false,
      element:null,
      uiEvent:null,
      x:0,
      y:0,
      resized:false,
      viewConfig:null,
      maxScrollH:0,
      maxScrollW:0,
      positioningInterval:null,
      positioningIntervalDuration:10,
      initialize:function(){
        var that = this;

        if((EDOMUtility.vOsType == EDOMUtility.osTypes.WINDOWS  ) && (EDOMUtility.ua.indexOf('Mobile') > -1)){
          that.element.parentNode.style.overflow="scroll";
        }else{
          /* document.ontouchmove = function(event) { if (document.body.scrollHeight == document.body.clientHeight) event.preventDefault(); }; [YF]*/
          jQuery(that.element).css({"position":"absolute","left":that.x+"px","top":that.y+"px"});
          that.element.style.overflow="hidden";
        }
        that.uiEvent = new UiEvent(this.element,{moveEndMonitorCheckEndDuration:100},document);
        that.x=0;
        that.y=0;
        that.logInterval=0;
        jQuery(that.element).bind(UiEvent.MovingEvent, function(e, data){  
            that.moving(data);
        });
        jQuery(that.element).bind(UiEvent.MoveStartEvent, function(e, data){  
            that.start(data);
        });
        jQuery(that.element).bind(UiEvent.MovedEvent, function(e, data){  
            that.end(data);
        });
        

        this.initialized=true;
      },
      log:function(msg) {
        if(this.debugFlag){
          if ((typeof console != "undefined" && console !== null) && console['log']) {
            console['log'](msg);
          }
        }
      },
      start:function(data){
        var that = this;
        jQuery(that.element).css({"left":that.x+"px","top":that.y+"px"});
      },
      moving:function(data){
        var that = this;
        that.updateViewConfigData();
        //that.x=that.x+(data.currentStatus.movedDeltaX);
        that.y=that.y+(data.currentStatus.movedDeltaY);
        if( that.y < (that.maxScrollH * -1))
          that.y = that.maxScrollH *-1;
        if(that.y > 0)
          that.y= 0;
        jQuery(that.element).css({"left":that.x+"px","top":that.y+"px"});
      },
      end:function(data){
        var that = this;
        that.updateViewConfigData();
        //that.x=that.x+(data.currentStatus.movedDeltaX);
        that.y = that.y + (data.currentStatus.movedDeltaY);
        if( that.y < (that.maxScrollH * -1))
          that.y = that.maxScrollH *-1;
        if(that.y > 0)
          that.y= 0;
        this.log("----- end");
        jQuery(that.element).css({"left":that.x+"px","top":that.y+"px"});
      },
      updateViewConfigData:function(){
        this.viewConfig=ELayoutUtility.getViewportConfig();
        this.maxScrollH = jQuery(this.element).height() - this.maxBodyH;
        this.maxScrollW = jQuery(this.element).width() - this.maxBodyW;
      }
    };
    return iFrameNagare;
  })();
}).call(this);



