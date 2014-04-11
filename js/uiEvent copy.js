/*
 *  uievent.js 
 * -------------------------------------------
 * this uiEvent library normalizes touch event
 * requirement : EDOMUtility.js
 * author : Yuri Fukuda
 *  
 * Example
 * this.uiEvent = new UiEvent(this.element);
 * jQuery(this.element).bind(UiEvent.ZommedEvent, callback);
 * jQuery(this.element).bind(UiEvent.MovedEvent, callback);
 */

(function() {    
    
  //window capability checking
  vendor = EDOMUtility.vPStyle,
  has3d = EDOMUtility.has3d,	
  hasTouch = EDOMUtility.hasTouch,	
  hasTransform = EDOMUtility.hasTransform,
  // Events
	RESIZE_EV =  EDOMUtility.hasOwnProperty("resize")?'resize' : 'orientationchange',
	START_EV = EDOMUtility.vEvUserMoveStartAll[0],
	MOVE_EV = EDOMUtility.vEvUserMove,
	END_EV = EDOMUtility.vEvUserMoveEndAll[0],
	CANCEL_EV = null,//EDOMUtility.vEvUserMoveCancel,
  WHEEL_EV =  EDOMUtility.vEvMouseWheel,
    
 
  UiEvent = (function() {
      function UiEvent(el,option,doc){
        var that = this;
        that._document = document; 
        if(doc)that._document = doc; 
        that.elem = typeof el == 'object' ? el : that._document.getElementById(el);
        if(that.elem == null ) return null;
        if(option !=null ){
         if(option.movingTriggerDuration!=null) that.movingTriggerDuration=option.movingTriggerDuration;
         if(option.ignoreDefaultBehavior!=null) that.ignoreDefaultBehavior=option.ignoreDefaultBehavior;
         if(option.moveEndMonitorCheckEndDuration!=null)that.moveEndMonitorCheckEndDuration=option.moveEndMonitorCheckEndDuration;
          
        }
        that._unregisterAll();
        that._registerEventForStart();
      }
    UiEvent.eventPrefix="TOUCHJSEVENT";
    UiEvent.ZoomStartEvent=UiEvent.eventPrefix+"ZOOMSTART";
    UiEvent.MoveStartEvent=UiEvent.eventPrefix+"TOUCHSTART";
    UiEvent.ZommedEvent=UiEvent.eventPrefix+"ZOOM";
    UiEvent.MovedEvent=UiEvent.eventPrefix+"MOVED";
    UiEvent.ZoomingEvent=UiEvent.eventPrefix+"ZOOMING";
    UiEvent.MovingEvent=UiEvent.eventPrefix+"MOVING";
    UiEvent.stateType={"IDLE":0,"SCROLLING":1}
    UiEvent.directionType={"IDLE":0,"TOP":1,"BOTOM":2,"RIGHT":3,"LEFT":4}
    UiEvent.prototype={
        debugFlag:false,
        enabled: true,
        elem:null,
        elemW:0,
        elemH:0,
        ignoreDefaultBehavior:false,
        scale: 1,
        x:0,
        y:0, 
        scrolled:false,
        startX:0,
        startY:0,
        startOffsetX:0,
        startOffsetY:0,
        moved:false,
        lastEvent:null,
        moveEndMonitoring:false,
        moveEndMonitorInterval:null,
        zoomMonitorTimer:null,
        moveEndMonitorCheckEndDuration:1000,
        movedDelta:0,
        movedDeltaX:0,
        movedDeltaY:0,
        latestDeltaX:0,
        latestDeltaY:0,
        pointX:0,
        pointY:0,
        scrollX:0,
        scrollY:0,
        state:0,
        direction:UiEvent.directionType.CENTER,
        movingTriggerDuration:10,
        createEvent: function (e) {
          if(hasTouch){
          }else{
          }
        },
        handleEvent: function (e) {
            var that = this;
            switch(e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that.ui_start(e);
                    break;
                case EDOMUtility.vEvUserScrollEnd: that.ui_move(e); break;
                case MOVE_EV: that.ui_move(e); break;
                case END_EV: that.ui_end(e); break
                case CANCEL_EV: that.ui_cancel(e); break;
                case RESIZE_EV: that.ui_resize(); break;
                case EDOMUtility.vTransitionEnd : that._transitionEnd(e); break;
                case WHEEL_EV:
                    if(that.stauts==UiEvent.stateType.IDLE) that.ui_start(e);
                    else that.ui_move(e);

            }
        },
        _checkDOMChanges: function () {
            if (this.moved || this.zoomed || this.animating ||
                (this.elemW == this.elem.offsetWidth * this.scale && this.elemH == this.elemW.offsetHeight * this.scale)) return;
            this.refresh();
        },
        
        ui_start: function (e){
        	var that = this,
			    point = hasTouch ? e.touches[0] : e,
			    matrix, x, y,
			    c1, c2;
          this.log("___start");
          if(that.ignoreDefaultBehavior) e.preventDefault();
          that._resetMouseMonitor();
          that._registerEventAfterStart();
          if (!that.enabled) return;
          // Gesture start
          if (hasTouch && e.touches.length > 1) {
                c1 = Math.abs(e.touches[0].pageX-e.touches[1].pageX);
                c2 = Math.abs(e.touches[0].pageY-e.touches[1].pageY);
                that.touchesDistStart = Math.sqrt(c1 * c1 +2 * c2);
                that.startX = Math.abs(e.touches[0].pageX + e.touches[1].pageX) / 2 - that.x;
                that.startY = Math.abs(e.touches[0].pageY + e.touches[1].pageY) / 2 - that.y;
                this.log("start:touchesDistStart"+that.touchesDistStart + " originX:"+that.originX+" originY:"+that.originY);
                that.zoomed = true;
                try{
                  jQuery(that.elem).trigger(UiEvent.ZoomStartEvent,{originalEvent:e,currentStatus:that});
                }catch(e){
                  that.log("callback some error for "+UiEvent.ZoomStartEvent+":"+e);
                }
          }
          this.lastEvent=e;
          that.startX = that.pointX = point.pageX;
          that.startY = that.pointY = point.pageY;
          that.latestDeltaX=0;
          that.latestDeltaY=0;
          that.movedDeltaX=0;
          that.movedDeltaY=0;
          that.startOffsetX = that.scrollX  = e.target.scrollLeft;
          that.startOffsetY = that.scrollY  = e.target.scrollTop;
            
          that.startTime = e.timeStamp || Date.now();
          this.log("start: "+that.pointX + ","+that.pointY+","+that.startX+","+that.startY);
            //bind next possible move
          that._registerEventForMoveOrEnd();
          try{
            jQuery(that.elem).trigger(UiEvent.MoveStartEvent,{originalEvent:e,currentStatus:that});
          }catch(e){
            that.log("callback some error for "+UiEvent.MoveStartEvent+":"+e);
          }
		    },
        
        ui_end:function (e) {
            var that = this;
            this.log("end_____");
            that.moveEndMonitoring=false;
            clearTimeout(this.moveEndMonitorTimeout);
            that._registerEventAfterEnd();
            if(that.ignoreDefaultBehavior) e.preventDefault();
            try{
              if(that.zoomed){
               jQuery(that.elem).trigger(UiEvent.ZommedEvent,{originalEvent:e,currentStatus:that});
              }else if(that.moved){
               jQuery(that.elem).trigger(UiEvent.MovedEvent,{originalEvent:e,currentStatus:that});
              }
            }catch(e){
              that.log("callback some error for "+UiEvent.MovedEvent+":"+e);
            }
            that._registerEventForStart();
        },
        ui_move:function(e){
        	  var that = this,
			      c1, c2,
			      point = hasTouch ? e.touches[0] : e;
            scrolldelta=(e.type=='scroll')?this._wheeldata(e):null,
			      deltaX = (e.type=='scroll')?(that.scrollX-scrolldelta.x):(point.pageX - that.pointX),
			      deltaY =(e.type=='scroll')?(that.scrollY-scrolldelta.Y):(point.pageY - that.pointY),
      			newX = that.x + deltaX,
		      	newY = that.y + deltaY,
		      	timestamp = e.timeStamp || Date.now();
            that.scrolling=true;
            this.log("===========_move: "+that.latestDeltaX + ","+that.latestDeltaY);
            if(that.ignoreDefaultBehavior) e.preventDefault();
            if(that.moveEndMonitorTimeout!=null){
                this.log("moveEndMonitor killed");
                clearTimeout(that.moveEndMonitorTimeout);
                that.moveEndMonitorTimeout=null;
            }
            this.moveEndMonitoring=true;
            this.lastEvent=e;
            if ( hasTouch && e.touches.length > 1){
              c1 = e.touches[0].pageX - e.touches[1].pageX;
              c2 = e.touches[0].pageY - e.touches[1].pageY;
              that.touchesDist = Math.sqrt(c1*c1+c2*c2);
              that.movedDelta = that.touchesDist - that.touchesDistStart;
              that.zoomed = true;
              that.dirX=0;
              that.dirY=0;
              this.log("zoomed:"+that.movedDelta);
              if (Math.abs(that.movedDelta) < 6) {
                that._startMoveEndMonitor(that.lastEvent);
                return;
              }
              if (timestamp - that.startTime > that.movingTriggerDuration) {
                that.startTime = timestamp;
                that._startMoveEndMonitor();
                try{
                  jQuery(that.elem).trigger(UiEvent.ZoomingEvent,{originalEvent:e,currentStatus:that});
                }catch(e){
                  that.log("callback some error for "+UiEvent.ZoomingEvent+":"+e);
                }
              }
              return;
            }else{
              if(e.type == 'scroll'){
                /*--- scrolling case ------------*/
                that.scrollX = scrolldelta.x;
                that.scrollY = scrolldelta.y;
                that.latestDeltaX=that.scrollX-that.startOffsetX;
                that.latestDeltaY=that.scrollY-that.startOffsetY;
                that.scrolled = true;

              }else{
                that.pointX = point.pageX;
                that.pointY = point.pageY;
                that.latestDeltaX=that.pointX-that.startX;
                that.latestDeltaY=that.pointY-that.startY;
             }
             c1 = deltaX;
             c2 = deltaY;
             that.movedDelta = Math.sqrt(c1*c1+c2*c2);
             that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
             that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
            }
            absDistX = Math.abs(that.movedDeltaX);
            absDistY = Math.abs(that.movedDeltaY);
            that.movedDeltaX += c1;
            that.movedDeltaY += c2;
            if (absDistX < 6 && absDistY< 6) {
                that._startMoveEndMonitor(that.lastEvent);
                return;
            }
            that.moved = true;
        		if ((timestamp - that.startTime) > that.movingTriggerDuration) {
                that.startTime = timestamp;
                try{
                  that.log("Moved ("+ that.movedDeltaX + ","  + that.movedDeltaY + ")");
                  jQuery(that.elem).trigger(UiEvent.MovingEvent,{originalEvent:e,currentStatus:that});
                }catch(e){
                  that.log("callback some error for "+UiEvent.MovingEvent+":"+e);
                }
            }
            /*
            if (timestamp - that.startTime > 300) {
  	      		that.startTime = timestamp;
  			      that.startX = that.x;
  			      that.startY = that.y;
              return;
  		      }
            */
            

            that._startMoveEndMonitor(that.lastEvent);
                                
        },//end of ui_move

      	ui_scroll: function (e) {
        // TODO ########################################################
          /*
		      var that = this,
			    scrollDeltaX,scrollDeltaY,
			    deltaX, deltaY,
			    deltaScale;
          var wheelDistance = function(evt){
            if (!evt) evt = event;
            var w=evt.wheelDelta, d=evt.detail;
            if (d){
              if (w) return w/d/40*d>0?1:-1; // Opera
              else return -d/3;              // Firefox;         TODO: do not /3 for OS X
            } else return w/120;             // IE/Safari/Chrome TODO: /3 for Chrome OS X
          };

          var wheelDirection = function(evt){
            if (!evt) evt = event;
            return (evt.detail<0) ? 1 : (evt.wheelDelta>0) ? 1 : -1;
          };


		      if ('wheelDeltaX' in e) {
			      wheelDeltaX = e.wheelDeltaX / 12;
			      wheelDeltaY = e.wheelDeltaY / 12;
		      } else if ('detail' in e) {
			      wheelDeltaX = wheelDeltaY = -e.detail * 3;
		      } else {
			      wheelDeltaX = wheelDeltaY = -e.wheelDelta;
		      }
		
		      if (that.options.wheelAction == 'zoom') {
			        deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
			        if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
			        if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
			
			        if (deltaScale != that.scale) {
				      if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
				      that.wheelZoomCount++;
				
				      that.zoom(e.pageX, e.pageY, deltaScale, 400);
				
				      setTimeout(function() {
					      that.wheelZoomCount--;
					      if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
				        }, 400);
			      }
			
			      return;
		      }

            c1 = deltaX;
            c2 = deltaY;
            that.latestDeltaX=point.pageX-that.startX;
            that.latestDeltaY=point.pageY-that.startY;
            that.movedDeltaX=c1;
            that.movedDeltaY=c2;
            that.movedDelta = Math.sqrt(c1*c1+c2*c2);
            that.pointX = point.pageX;
            that.pointY = point.pageY;
            that.moved = true;
            
            that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		
      		deltaX = that.x + wheelDeltaX;
		      deltaY = that.y + wheelDeltaY;

		      if (deltaX > 0) deltaX = 0;
		      else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

		      if (deltaY > that.minScrollY) deltaY = that.minScrollY;
		      else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;

		      that.scrollTo(deltaX, deltaY, 0);
          */
        // TODO ########################################################
	},//end of ui_wheel
        _startMoveEndMonitor:function(lastevent){
            var that=this;
            that.log("move end monitoring: will be triggered after "+this.moveEndMonitorCheckEndDuration+"ms");
            /*
            //bind next possible move
            if(this.moveEndMonitorInterval!=null) clearInterval(this.moveEndMonitorInterval);
                that.moveEndMonitorInterval= setInterval(function(){ 
                that.moveEndMonitoring=false;
                },that.moveEndMonitorSetFlaseDuration);
            if(that.moveEndMonitorTimeout!=null){
                clearTimeout(that.moveEndMonitorTimeout);
                that.moveEndMonitorTimeout=null;
            }*/
            
            if(this.moveEndMonitorTimeout!=null){
                clearTimeout(this.moveEndMonitorTimeout);
                this.moveEndMonitorTimeout=null;
            }
    
            this.moveEndMonitorTimeout = setTimeout(function(){
                that.log("manually triggering last event");
                // simulating end event for zoom out --------------
                that.ui_end(that.lastEvent);
            },this.moveEndMonitorCheckEndDuration);
        },
        ui_cancel:function(e){
            this.ui_end(this.lastEvent);
        },
        _resetMouseMonitor:function(){
            var that = this;
            that.lastEvent=null;
            that.startX = 0;
            that.startY = 0;
            that.pointX = 0;
            that.pointY = 0;
            that.scrollX=0;
            that.scrollY=0;
            that.moved = false;
            that.animating = false;
            that.zoomed = false;
            that.scrolled=false;
            that.distX = 0;
            that.distY = 0;
            that.movedDelta=0;
            that.movedDeltaX=0;
            that.movedDeltaY=0;
            that.latestDeltaX=0;
            that.latestDeltaY=0;
            that.startOffsetX = 0;
            that.startOffsetY = 0;

        },
        _registerEventForStart:function(){
            this.log("register---_registerEventForStart");
            var that = this;
            that._bind(RESIZE_EV, window);
            that._bind(START_EV);
            that._bind(WHEEL_EV);
        },
        _registerEventAfterStart:function(){
            this.log("register---_registerEventAfterStart");
            var that = this;
            that._unbind(START_EV);
            that._unbind(RESIZE_EV, window);
            that._unbind(START_EV);
            that._unbind(WHEEL_EV);
        },

        _registerEventForMoveOrEnd:function(){
            this.log("register---_registerEventForMoveOrEnd");
            var that = this;
        	  that._bind(MOVE_EV);
            that._bind(WHEEL_EV);
            that._bind(EDOMUtility.vTransitionEnd);//[YF]
            that._bind(END_EV);
            that._bind(CANCEL_EV);
        },
        _registerEventAfterMove:function(){
            this.log("register---_registerEventAfterMove");
            var that = this;
            that._unbind(WHEEL_EV);
            that._unbind(MOVE_EV);
            that._unbind(EDOMUtility.vTransitionEnd);//[YF]
            that._unbind(END_EV);
            that._unbind(CANCEL_EV);
        },
        _registerEventAfterEnd:function(){
            var that = this;
            this.log("register---_registerEventAfterEnd");
        	  that._unbind(WHEEL_EV);
        	  that._unbind(MOVE_EV);
            that._unbind(EDOMUtility.vTransitionEnd);//[YF]
            that._unbind(END_EV);
            that._unbind(CANCEL_EV);
       },
       _unregisterAll:function(){
            var that = this;
        	  that._unbind(START_EV);
        	  that._unbind(WHEEL_EV);
        	  that._unbind(MOVE_EV);
            that._unbind(EDOMUtility.vEvUserScrollEnd);//[YF]
            that._unbind(EDOMUtility.vTransitionEnd);//[YF]
            that._unbind(END_EV);
            that._unbind(RESIZE_EV);
            that._unbind(CANCEL_EV);
       },
       ui_resize:function(){
        },
       _bind: function (type, el, bubble) {
            (el || this.elem).addEventListener(type, this, !!bubble);
       },
       _unbind: function (type, el, bubble) {
            (el || this.elem).removeEventListener(type, this, !!bubble);
       },
       log:function(msg) {
          if(this.debugFlag){
            if ((typeof console != "undefined" && console !== null) && console['log']) {
              console['log'](msg);
            }
         }
       },
       /*----------- Utility function set ----------------------------*/
        _wheeldata:function(e){
          var scrollObj = {},delta=0;
          scrollObj.x=0;
          scrollObj.y=0;
          offsetX = e.target.scrollLeft;
          offsetY = e.target.scrollTop;
          this.log("scrollOffset: " + offsetX + " scrollOffsetY: "+offsetY);
          /*
          if (!event){ /* For IE. 
            event = window.event;
          }else if(e.wheelDelta){
            delta = event.wheelDelta/120;
          }else if (event.detail) {
            delta = -event.detail/3;
          }
          */
          scrollObj.x = offsetX;
          scrollObj.y = offsetY;
          return scrollObj;
        }
    
      };
      
      return UiEvent;
    })();
}).call(this);

