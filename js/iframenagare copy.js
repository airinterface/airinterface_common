(function(){
  iFrameNagare = (function() {
    var m = Math,
	  nextFrame = (function() {
		  return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) { return setTimeout(callback, 1); };
	  })(),
	  cancelFrame = (function () {
	  	return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
	  })();

    function iFrameNagare(el,option){
      var that=null;
      if( option != null || option != undefined  ) this.options = option
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
      animating:false,
      debugFlag:true,
      element:null,
      uiEvent:null,
      x:0,
      y:0,
      resized:false,
      viewConfig:null,
      maxScrollH:0,
      maxScrollW:0,
		  minScrollY:0,
		  minScrollX:0,
      moved:false,
      options:{},
      positioningInterval:null,
      positioningIntervalDuration:10,
      startTime:0,
      startX:0,
		  startY:0,
      steps:[],
      initialize:function(){
        var that = this;

        if((EDOMUtility.vOsType == EDOMUtility.osTypes.WINDOWS  ) && (EDOMUtility.ua.indexOf('Mobile') > -1)){
          that.element.parentNode.style.overflow="scroll";
        }else{
          //if(that.scroller.style[ESDOMUtility.vTransform]==null){
          /* document.ontouchmove = function(event) { if (document.body.scrollHeight == document.body.clientHeight) event.preventDefault(); }; [YF]*/
          jQuery(that.element).css({"position":"absolute","left":that.x+"px","top":that.y+"px"});
          that.element.style.overflow="hidden";
        }
        that.uiEvent = new UiEvent(this.element,{moveEndMonitorCheckEndDuration:100,movingTriggerDuration:10},document);
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
    		that.moved = false;
	    	that.animating = false;
        e = data.originalEvent;
    		that.startTime = e.timeStamp || Date.now();
		  	cancelFrame(that.aniTime);
				x = getComputedStyle(that.element, null).left.replace(/[^0-9-]/g, '') * 1;
				y = getComputedStyle(that.element, null).top.replace(/[^0-9-]/g, '') * 1;
				that.steps = [];
        this.log( "y = "+y + ", that.y " + that.y + ", that.startY="+that.startY);
				cancelFrame(that.aniTime);
			  if (x != that.x || y != that.y) {
				  if (that.options.useTransition) that._unbind(ESDOMUtility.vTransitionEnd);//[YF]
          that.x = x; 
          that.y = y; 
			  }
    		that.startX = that.x = x;
		    that.startY = that.y = y;
				that._pos(x, y);
  		  if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);

      },
      moving:function(data){
        var that = this;
        e = data.originalEvent;
        duration = (e.timeStamp || Date.now()) - that.startTime;
        that.updateViewConfigData();
        newX=that.startX +(data.currentStatus.movedDeltaX);
        newY=that.startY +(data.currentStatus.movedDeltaY);
        this.log("newY = "+newY+" that.startY = "+that.startY+", data.currentStatus.movedDeltaY="+data.currentStatus.movedDeltaY);
        if( newY < (that.maxScrollH * -1))
          newY = that.maxScrollH *-1;
        if(newY > 0)
          newY= 0;
    		that.moved = true;
  		  that._pos(newX, newY);
  		  if (timestamp - that.startTime > 300) {
  			  that.startTime = timestamp;
  			  that.startX = that.x;
  			  that.startY = that.y;
        }
        
  		  if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
      },
      end:function(data){
        var that = this,
        e = data.originalEvent,
   	    momentumX = { dist:0, time:0 },
			  momentumY = { dist:0, time:0 },
	      newPosX = that.x,
			  newPosY = that.y,
   			duration = (e.timeStamp || Date.now()) - that.startTime;
        this.log('end-------------------------');
        if(true) return;
        
        //that.y = that.y + (data.currentStatus.movedDeltaY);
        if( that.y < (that.maxScrollH * -1))
          that.y = that.maxScrollH *-1;
        if(that.y > 0)
          that.y= 0;

        that.updateViewConfigData();
    		if (!that.moved) {
          that._resetPos(400);
			    if (that.options.onTouchEnd){
            that.options.onTouchEnd.call(that, e);
          }
			    return;
        }
        /* applying momentum */

       if (duration < 300) {
          momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, this.maxScrollW + that.x, 0) : momentumX;
          momentumY = newPosY ? that._momentum(newPosY - that.startY, 
                                               duration, 
                                               - that.y, 
                                               (  -1 * that.maxScrollH  < 0 ?   -(-1 * that.maxScrollH  - that.y - that.minScrollY) : 0),
                                               0) : momentumY;
    			newPosX = that.x + momentumX.dist;
	    		newPosY = that.y + momentumY.dist;

 		    	if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollW && newPosX < that.maxScrollW)) momentumX = { dist:0, time:0 };
 			    if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
	     	}
        if (momentumX.dist || momentumY.dist) {
          newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);
          this.log("IFRAME: MOVING WITH NEW DURATION : momentumY.time:" + momentumY.time +"  momentumY.dist:" + momentumY.dist + " NEW DURATION:"+newDuration);
          that.scrollTo(m.round(newPosX),  m.round(newPosY),  newDuration);
          if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			    return;
			  }
                 that._resetPos(200);
        if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
      },
      updateViewConfigData:function(){
        this.viewConfig=ELayoutUtility.getViewportConfig();
        this.maxScrollH = jQuery(this.element).height() - this.maxBodyH;
        this.maxScrollW = jQuery(this.element).width() - this.maxBodyW;
      },
    	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		    var deceleration = 0.00001,
			  speed = m.abs(dist) / time,
			  newDist = (speed * speed) / (2 * deceleration),
			  newTime = 0, outsideDist = 0;
        var that = this;
        this.log("IFRAME:dist:"+dist+"  Momentum that.y = "+that.y+" maxDistUpper = "+maxDistUpper+" maxDistLower:"+maxDistLower);

	    	// Proportinally reduce speed if we are outside of the boundaries 
	    	if (dist > 0 && newDist > maxDistUpper) {
		    	outsideDist = size / (6 / (newDist / speed * deceleration));
		    	maxDistUpper = maxDistUpper + outsideDist;
			    speed = speed * maxDistUpper / newDist;
		    	newDist = maxDistUpper;
	    	} else if (dist < 0 && newDist > maxDistLower) {
	    		outsideDist = size / (6 / (newDist / speed * deceleration));
	    		maxDistLower = maxDistLower + outsideDist;
	    		speed = speed * maxDistLower / newDist;
	    		newDist = maxDistLower;
    		}
	    	newDist = newDist * (dist < 0 ? -1 : 1);
	    	newTime = speed / deceleration;
        this.log("IFRAME:newDist = "+newDist+" newTime="+newTime);
	    	return { dist: newDist, time: m.round(newTime) };
	   },
     _pos:function(x, y){
			  x = 0; // for now 
			  y = m.round(y);
        jQuery(this.element).css({"left":x+"px","top":y+"px"});
        if(y > 0 ){
          this.log("POS----y="+y);
        }
    		this.x = x;
	    	this.y = y;
     },
     scrollTo: function (x, y, time, relative) {
		   var that = this,
			  step = x,
			  i, l;
		   that.stop();
		   if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
		   for (i=0, l=step.length; i<l; i++) {
			    if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
		      that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
		   }
		   that._startAni();
	   },
     stop:function(){
   		 cancelFrame(this.aniTime);
		   this.steps = [];
		   this.moved = false;
		   this.animating = false;
     },
     _resetPos: function (time) {
		   var that = this,
		   resetX = that.x >= 0 ? 0 : that.x < (-1)*that.maxScrollW ? -that.maxScrollW : that.x,
			 resetY = that.y >= 0  ? 0 : that.y < (-1)*that.maxScrollH ? -that.maxScrollH : that.y;
		   if (resetX == that.x && resetY == that.y) {
			  if (that.moved) {
			    that.moved = false;
			    if (that.options.onScrollEnd) setTimeout( function(){ that.options.onScrollEnd.call(that);},10);		// YF Execute custom code on scroll end
			  }
			  return;
       }
		   that.scrollTo(resetX, resetY, time || 0);
	   },
	   _startAni: function () {
      var that = this,
      startX = that.x, startY = that.y,
      startTime = Date.now(),
      step, easeOut,
      animate;
        
      if (that.animating) return;
      if (that.steps.length == 0) {
        //that.log("IFRAME4: ResetPos ");
        that._resetPos(400);
        return;
      }
      step = that.steps.shift();
		  if (step.x == startX && step.y == startY) step.time = 0;
      that.animating = true;
      that.moved = true;
      animate = function () {
        var now = Date.now(),
        newX, newY;
        if (now >= startTime + step.time) {
				  that.animating = false;
				  if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
				  that._startAni();
				  return;
			  }
        now = (now - startTime) / step.time - 1;
        if ( now > 0  ) {
  			  that.animating = false;
				  that._startAni();
				  return;
        }
			  easeOut = m.sqrt(1 - now * now);
 			  newX =  ( step.x - startX) * easeOut + that.startX;
			  newY =  ( step.y - startY) * easeOut + that.startY;
        that._pos(newX, newY);
			  if (that.animating) that.aniTime = nextFrame(animate);
		  };
  		animate();
    }
    };
    return iFrameNagare;
  })();
}).call(this);



