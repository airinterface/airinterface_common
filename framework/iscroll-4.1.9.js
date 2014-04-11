/*!
 * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(){
var m = Math,
	// Browser capabilities
	has3d = EDOMUtility.has3d,//'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
	hasTouch = EDOMUtility.hasTouch, //[YF] for windows which can't detect  // 'ontouchstart' in window,
	hasTransform = EDOMUtility.hasTransform,

	isAndroid = (/android/gi).test(navigator.appVersion),
	isIDevice = (/android|ipod|iphone|ipad|iemobile/gi).test(navigator.appVersion),
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
	isPlaybook = (/playbook/gi).test(navigator.appVersion),
  eventHasData=false, // for Windows less than IE9
	//[YF]hasTransitionEnd = isIDevice || isPlaybook,
  hasTransitionEnd = EDOMUtility.vTransitionEnd,
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
	})(),

	// Events
	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	WHEEL_EV = EDOMUtility.vBrowserType == EDOMUtility.browserTypes.MOZILLA ? 'DOMMouseScroll' : 'mousewheel',
    
    
	// Helpers
  translateZ = has3d ? 'translateZ(0)' : '',

	trnOpen = 'translate' + ((has3d && (EDOMUtility.vOsType != EDOMUtility.osTypes.ANDROID ))? '3d(' : '('),
	trnClose = ( has3d && (EDOMUtility.vOsType != EDOMUtility.osTypes.ANDROID )) ? ',0)' : ')';
	trnClose = ( has3d && (EDOMUtility.vOsType != EDOMUtility.osTypes.ANDROID )) ? ',0)' : ')';

	// Constructor
	iScroll = function (el, options,frameDoc) {

		var that = this,
        _document=(frameDoc!=null?frameDoc:document),
			  i;
        that._document = _document;
		that.wrapper = typeof el == 'object' ? el : that._document.getElementById(el);
    if(that.wrapper == null ) return null;
    jQuery(that.wrapper).addClass(Nagare.clsName);
		that.wrapper.style.overflow = 'hidden';
		that.scroller = that.wrapper.children[0];
        
		// Default options
		that.options = {
			hScroll: true,
			vScroll: true,
			bounce: false,
			bounceLock: true,
			momentum: true,
			lockDirection: true,
			useTransform: true,
			useTransition: true,
			topOffset: 0,
			checkDOMChanges: false,		// Experimental

			// Scrollbar
			hScrollbar: true,
			vScrollbar: true,
			fixedScrollbar: isAndroid,
			hideScrollbar: isIDevice,
			fadeScrollbar: isIDevice && has3d,
			scrollbarClass: '',

			// Zoom
			zoomed: false,
			zoomMin: 1,
			zoomMax: 4,
			doubleTapZoom: 2,
			wheelAction: 'scroll',

			// Snap
			snap: false,
			snapThreshold: 1,

			// Events
			onRefresh: null,
		  onBeforeScrollStart: function (e) {e.preventDefault(); },
			onBeforeScrollStart: null,
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null,
			onZoomStart: null,
			onZoom: null,
			onZoomEnd: null,            
            //YF Custom From here
            pullToLastToRefresh:false,
            pullToFirstToRefresh:false,
		    pullToLastLabel: ['Pull down to refresh...', 'Release to refresh...', 'Loading...'],
		    pullToFirstLabel: ['Pull up to refresh...', 'Release to refresh...', 'Loading...']
		};

		// User defined options
		for (i in options) that.options[i] = options[i];

		// Set starting position
		if(that.options.x ) that.x = that.options.x;
		if(that.options.y ) that.y = that.options.y;


		// Normalize options
		that.options.useTransform = false;//hasTransform ? that.options.useTransform : false;
		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		that.options.zoom = that.options.useTransform && that.options.zoom;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

	  	
		// Set some default styles
		that.scroller.style[EDOMUtility.vTransitionProperty] = that.options.useTransform ? EDOMUtility.vTransform : 'all';
		that.scroller.style[EDOMUtility.vTransitionDuration] = '0';
		that.scroller.style[EDOMUtility.vTransformOrigin] = '0 0';
		if (that.options.useTransition) that.scroller.style[EDOMUtility.vTransitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
        //if(that.scroller.style[EDOMUtility.vTransform]==null){
		if (that.options.useTransform) that.scroller.style[EDOMUtility.vTransform] = trnOpen + '0,0' + trnClose;
		else that.scroller.style.cssText += ';position:absolute;top:0;left:0';
        //}
		if (that.options.useTransition) that.options.fixedScrollbar = true;
        
        
        //YF START -----------------------------------
        if (that.pullToFirstToRefresh) {
            div = that._document.createElement('div');
            div.className = 'iScrollPullToFirst';
            div.innerHTML = '<span class="iScrollPullToFirstIcon"></span><span class="iScrollpullToFirstLabel">' + that.options.pullToLastLabel[0] + '</span>\n';
            that.scroller.insertBefore(div, that.scroller.children[0]);
            that.options.bounce = true;
            that.pullToFirstEl = div;
            that.pullToFirstLabel = div.getElementsByTagName('span')[1];
        }
	
        if (that.pullToLastToRefresh) {
            div = that._document.createElement('div');
            div.className = 'iScrollPullToLast';
            div.innerHTML = '<span class="iScrollPullToLastIcon"></span><span class="iScrollpullToLastLabel">' + that.options.pullToFirstLabel[0] + '</span>\n';
            that.scroller.appendChild(div);
            that.options.bounce = true;
            that.pullToLastEl = div;
            that.pullToFirstLabel = div.getElementsByTagName('span')[1];
        }
        
        //YF END -----------------------------
        if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
			    that._checkDOMChanges();
		    }, 500);
	};

// Prototype
iScroll.prototype = {
	enabled: true,
	x: 0,
	y: 0,
	steps: [],
	scale: 1,
	currPageX: 0, currPageY: 0,
	pagesX: [], pagesY: [],
	aniTime: null,
	wheelZoomCount: 0,
    scrolling:false,
    lastEvent:null,
	
	handleEvent: function (e) {
    var that = ( e.data || this );
    var e = (e.originalEvent || e);
		switch(e.type) {
			case START_EV:
				//[YF]for windows, e.button doesn't matter if (!hasTouch && (e.button !== 0)) return;
				//if (!hasTouch && (EDOMUtility.ua.indexOf('Mobile') == -1) && (e.button !== 0)) return;
				that._start(e);
				break;
			case MOVE_EV: 
        if( e.consumed == undefined ) {
          e.consumed = false;
        }
        that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case RESIZE_EV: that._resize(); break;
			case WHEEL_EV: that._wheel(e); break;
			case 'mouseout': that._mouseout(e); break;
			case  EDOMUtility.vTransitionEnd : that._transitionEnd(e); break;
		}
	},
	
	_checkDOMChanges: function () {
		if (this.moved || this.zoomed || this.animating ||
			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

		this.refresh();
	},
	
	_scrollbar: function (dir) {
		var that = this,
			doc = that._document,
			bar;

		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[EDOMUtility.vTransform] = '';
                if(that[dir + 'ScrollbarWrapper'].parentNode){ //[YF]
				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
                }				that[dir + 'ScrollbarWrapper'] = null;
				that[dir + 'ScrollbarIndicator'] = null;
			}

			return;
		}

		if (!that[dir + 'ScrollbarWrapper']) {
			// Create the scrollbar wrapper
			bar = that._document.createElement('div');

			if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
			else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

			bar.style.cssText += ';pointer-events:none;-' + EDOMUtility.vP + 'transition-property:opacity;-' + EDOMUtility.vP + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;

			// Create the scrollbar indicator
			bar = that._document.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + EDOMUtility.vP + 'background-clip:padding-box;' + EDOMUtility.vP + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + EDOMUtility.vP + 'border-radius:3px;border-radius:3px';

			}
			bar.style.cssText += ';pointer-events:none;' + EDOMUtility.vP + 'transition-property:' + EDOMUtility.vP + 'transform;' + EDOMUtility.vP + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + EDOMUtility.vP + 'transition-duration:0;' + EDOMUtility.vP  + 'transform:'  + trnOpen + '0,0' + trnClose;

			if (that.options.useTransition) bar.style.cssText += ';' + EDOMUtility.vP + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';
			that[dir + 'ScrollbarWrapper'].appendChild(bar);
			that[dir + 'ScrollbarIndicator'] = bar;
		}


		if (dir == 'h') {
			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
			that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
		} else {
			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
			that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
		}

		// Reset position
		that._scrollbarPos(dir, true);
	},
	
	_resize: function () {
    /*
		var that = this;
		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
    */
	},
	
	_pos: function (x, y) {
		x = this.hScroll ? x : 0;
		y = this.vScroll ? y : 0;

		if ( this.options.useTransform) {
			this.scroller.style[EDOMUtility.vTransitionDelay] = '0ms';
			this.scroller.style[EDOMUtility.vTransform] = trnOpen + x + 'px,' + y + 'px' + trnClose;//  + ' scale(' + this.scale + ')';
		} else {
			x = m.round(x);
			y = m.round(y);
			this.scroller.style.left = x + 'px';
			this.scroller.style.top = y + 'px';
		}
		this.x = x;
		this.y = y;
		this._scrollbarPos('h');
		this._scrollbarPos('v');
	},

	_scrollbarPos: function (dir, hidden) {
		var that = this,
			pos = dir == 'h' ? that.x : that.y,
			size;

		if (!that[dir + 'Scrollbar']) return;

		pos = that[dir + 'ScrollbarProp'] * pos;
		if (pos < 0) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
			}
			pos = 0;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
			} else {
				pos = that[dir + 'ScrollbarMaxScroll'];
			}
		}
		that[dir + 'ScrollbarWrapper'].style[EDOMUtility.vTransitionDelay] = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style[EDOMUtility.vTransform] = trnOpen + (dir == 'h' ? pos + 'px,0' : '0,' + Math.floor(pos) + 'px') + trnClose;
	},
	
	_start: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			matrix, x, y,
			c1, c2;
    try{               
		if (!that.enabled) return;

		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

		if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

		that.moved = false;
		that.animating = false;
		that.zoomed = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;

		// Gesture start
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
			that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

			if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
		}

		if (that.options.momentum) {
			if (that.options.useTransform) {
				// Very lame general purpose alternative to CSSMatrix
				matrix = getComputedStyle(that.scroller, null)[EDOMUtility.vTransform].replace(/[^0-9-.,]/g, '').split(',');
        x = +matrix[4];
        y = +matrix[5];
			} else {
        x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
        y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
			}
			
			if (x != that.x || y != that.y) {
				if (that.options.useTransition) that._unbind(EDOMUtility.vTransitionEnd);//[YF]
				else cancelFrame(that.aniTime);
				that.steps = [];
				that._pos(x, y);
        if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);

			}
		}

		that.absStartX = that.x;	// Needed by snap threshold
		that.absStartY = that.y;

		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;
     
		that.startTime = e.timeStamp || Date.now();

		that._bind(MOVE_EV);
		that._bind(END_EV);
		that._bind(CANCEL_EV);
    that._bind('mouseout', that.wrapper);
   
    if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);
    }catch(e){alert(e);}
	},
	
	_move: function (e) {
    var that = this,
      reachedLimit = false,
			point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY,
			c1, c2, scale,
			timestamp = e.timeStamp || Date.now();
    that.scrolling=true;
    that.lastEvent=e;


		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

		// Zoom
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
			that.touchesDist = m.sqrt(c1*c1+c2*c2);

			that.zoomed = true;

			scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

			if (scale < that.options.zoomMin) {
        scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
      }else if (scale > that.options.zoomMax){
        scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);
      }
			that.lastScale = scale / this.scale;
      if(that.lastScale == 1 ){
        reachedLimit = true;
      }

			newX = this.originX - this.originX * that.lastScale + this.x,
			newY = this.originY - this.originY * that.lastScale + this.y;
      
      if( this._canMove(that, e, reachedLimit) ){
			  this.scroller.style[EDOMUtility.vTransform] = trnOpen + newX + 'px,' + newY + 'px' + trnClose;// + ' scale(' + scale + ')';
        if (that.options.onZoom) that.options.onZoom.call(that, e);
      }else{
     		that.moved = false;
		    that.animating = false;
		    that.zoomed = false;
		    that.distX = 0;
		    that.distY = 0;
		    that.absDistX = 0;
		    that.absDistY = 0;
		    that.dirX = 0;
		    that.dirY = 0;
			 	that.touchesDistStart = that.touchesDist;
        that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
			  that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;
      }
			return;
		}

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
      newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > that.minScrollY || newY < that.maxScrollY) { 
			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
// Pull down to refresh
			if ((that.options.pullToFirstToRefresh || that.options.pullToLastToRefresh ) && that.contentReady) {
				if (that.pullToLastToRefresh && newY > that.offsetBottom) {
					that.pullToLastEl.className = 'iScrollPullToLast flip';
					that.pullToLastLabel.innerText = that.options.pullToDownLabel[1];
				} else if (that.pullToFirstToRefresh && that.pullToLastEl.className.match('flip')) {
					that.pullToFirstEl.className = 'iScrollPullToLast';
					that.pullToFirstLabel.innerText = that.options.pullDownLabel[0];
				}
				
				if (that.pullToFirstRefresh && newY < that.maxScrollY - that.offsetTop) {
					that.pullToFirstEl.className = 'iScrollPullToLast flip';
					that.pullToFirstLabel.innerText = that.options.pullToFirstLabel[1];
				} else if (that.pullToFirstRefresh && that.pullUpEl.className.match('flip')) {
					that.pullToFirstEl.className = 'iScrollPullToLast';
					that.pullToFirstLabel.innerText = that.options.pullToFirstLabel[0];
				}
			}
		}
  	that.distX += deltaX;
		that.distY += deltaY;
		that.absDistX = m.abs(that.distX);
		that.absDistY = m.abs(that.distY);
    if (that.absDistX < 6 && that.absDistY < 6) {
      e.consumed = false;
			return;
		}
    
		// Lock direction
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY + 5) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX + 5) {
				newX = that.x;
				deltaX = 0;
			}
		}

		that.moved = true;

    if( that.hScroll && newX == that.x ){
        reachedLimit = true;
    }
    if( that.vScroll && newY == that.y ){
        reachedLimit = true;
    }
    if( !that.vScroll && !that.hScroll ){
        reachedLimit = true;
    }
    if( that._canMove(that, e, reachedLimit) ){
  		that._pos(newX, newY);
  		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
  		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
  		if (timestamp - that.startTime > 200) {
  			that.startTime = timestamp;
  			that.startX = that.x;
  			that.startY = that.y;
  		}
		
  		if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
    }else{
      /* ESLog.info("skipping" + jQuery(that.wrapper).closest(".esBlock").attr("class")); */
      /* event is consumed by the child component that has Nagare  */
			that.startX = that.x;
 			that.startY = that.y;
  		that.moved = false;
  		that.animating = false;
  		that.zoomed = false;
  		that.distX = 0;
  		that.distY = 0;
  		that.absDistX = 0;
  		that.absDistY = 0;
  		that.dirX = 0;
  		that.dirY = 0;
     }
    
/*        setTimeout(function(){
            t = Date.now();
            if(that.scrolling==true){
              if((t- that.startTime) > 300){
                that.scrolling=false;
                that._end(that.lastEvent);
              }
            }
        },350);
*/ 
        
	},
	
	_end: function (e) {

      this.scrolling = false;
      var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = (e.timeStamp || Date.now()) - that.startTime,
			newPosX = that.x,
			newPosY = that.y,
			distX, distY,
			newDuration,
			snap,
			scale;


      that._unbind(MOVE_EV);
      //that._unbind(EDOMUtility.vTransitionEnd);//[YF]
		  that._unbind(END_EV);
		  that._unbind(CANCEL_EV);
      that._unbind('mouseout', that.wrapper);
      that._unbind('mouseout');


		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);
		if (that.zoomed) {
        
			scale = that.scale * that.lastScale;
			scale = Math.max(that.options.zoomMin, scale);
			scale = Math.min(that.options.zoomMax, scale);
			that.lastScale = scale / that.scale;
			that.scale = scale;

			that.x = that.originX - that.originX * that.lastScale + that.x;
			that.y = that.originY - that.originY * that.lastScale + that.y;
			that.scroller.style[EDOMUtility.vTransitionDelay] = '0ms';
			that.scroller.style[EDOMUtility.vTransitionDuration] = '200ms';
			that.scroller.style[EDOMUtility.vTransform] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose;// + ' scale(' + that.scale + ')';
			that.zoomed = false;
			that.refresh();

			if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
			return;
		}


		if (!that.moved) {

			if (hasTouch) {
				if (that.doubleTapTimer && that.options.zoom) {
					// Double tapped
					clearTimeout(that.doubleTapTimer);
					that.doubleTapTimer = null;
					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
					that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
					if (that.options.onZoomEnd) {
						setTimeout(function() {
							that.options.onZoomEnd.call(that, e);
						}, 200); // 200 is default zoom duration
					}
				} else if (this.options.handleClick) {
					that.doubleTapTimer = setTimeout(function () {
						that.doubleTapTimer = null;

						// Find the last touched element
						target = point.target;
						while (target.nodeType != 1) target = target.parentNode;

						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
							ev = doc.createEvent('MouseEvents');
							ev.initMouseEvent('click', true, true, e.view, 1,
								point.screenX, point.screenY, point.clientX, point.clientY,
								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
								0, null);
							ev._fake = true;
							target.dispatchEvent(ev);
						}
					}, that.options.zoom ? 250 : 0);
				}

			}

			that._resetPos(400);
			if (that.options.onTouchEnd){
                that.options.onTouchEnd.call(that, e);
       }
			return;
		}
    
    if (that.pullToLastToRefresh && that.contentReady && that.pullToFirstEl.className.match('flip')) {
			that.pullToFirstEl.className = 'iScrollPullToLast loading';
			that.pullDownLabel.innerText = that.options.pullDownLabel[2];
			that.scroller.style.marginTop = '0';
			that.offsetBottom = 0;
			that.refresh();
			that.contentReady = false;
			that.options.onPullDown();
		}

		if (that.pullToFirstToRefresh && that.contentReady && that.pullToLastEl.className.match('flip')) {
			that.pullToLastEl.className = 'iScrollPullToFirst loading';
			that.pullUpLabel.innerText = that.options.pullUpLabel[2];
			that.scroller.style.marginBottom = '0';
			that.offsetTop = 0;
			that.refresh();
			that.contentReady = false;
			that.options.onPullUp();
		}
        
		if (duration < 300 && that.options.momentum) {
      
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;

 			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
 			if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}

		if (momentumX.dist || momentumY.dist) {
			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

			// Do we need to snap?
			if (that.options.snap) {
				distX = newPosX - that.absStartX;
				distY = newPosY - that.absStartY;
				if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
				else {
					snap = that._snap(newPosX, newPosY);
					newPosX = snap.x;
					newPosY = snap.y;
					newDuration = m.max(snap.time, newDuration);
				}
			}


			that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}
		// Do we need to snap?
		if (that.options.snap) {

			distX = newPosX - that.absStartX;
			distY = newPosY - that.absStartY;
			if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold){
         that.scrollTo(that.absStartX, that.absStartY, 200);
      }
			else {
				snap = that._snap(that.x, that.y);
				if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
			}

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		that._resetPos(200);
		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				that.moved = false;
				if (that.options.onScrollEnd) setTimeout( function(){ that.options.onScrollEnd.call(that);},10);		// YF Execute custom code on scroll end
				if (that.options.onAnimationEnd) setTimeout( function(){ that.options.onAnimationEnd.call(that);},20);		// YF Execute custom code on scroll end

			}

			if (that.hScrollbar && that.options.hideScrollbar) {
				if ( EDOMUtility.vBrowserType == EDOMUtility.browserTypes.WEBKIT ) that.hScrollbarWrapper.style[EDOMUtility.vTransitionDelay] = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				if ( EDOMUtility.vBrowserType == EDOMUtility.browserTypes.WEBKIT ) that.vScrollbarWrapper.style[EDOMUtility.vTransitionDelay] = '300ms';
				that.vScrollbarWrapper.style.opacity = '0';
			}

			return;
		}
		that.scrollTo(resetX, resetY, time || 0);
	},

	_wheel: function (e) {
		var that = this,
			wheelDeltaX, wheelDeltaY,
			deltaX, deltaY,
			deltaScale;

		if ('wheelDeltaX' in e) {
			wheelDeltaX = e.wheelDeltaX / 12;
			wheelDeltaY = e.wheelDeltaY / 12;
    } else if('wheelDelta' in e) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
		} else if ('detail' in e) {
			wheelDeltaX = wheelDeltaY = -e.detail * 3;
		} else {
		  return;
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
		
		deltaX = that.x + wheelDeltaX;
		deltaY = that.y + wheelDeltaY;

		if (deltaX > 0) deltaX = 0;
		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

		if (deltaY > that.minScrollY) deltaY = that.minScrollY;
		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
    if (that.maxScrollY < 0) {
			that.scrollTo(deltaX, deltaY, 0);
		}
	},
	
	_mouseout: function (e) {
      var t = e.relatedTarget;
      var that = this;
      if (!t) {
      that._end(e);
			return;
		}

		while (t = t.parentNode) if (t == this.wrapper) return;
		that._end(e);
	},

	_transitionEnd: function (e) {
		var that = this;
		if (e.target != that.scroller) return;
		//[YF]that._unbind('webkitTransitionEnd');
		that._unbind(EDOMUtility.vTransitionEnd);
		that._startAni();
	},


	/**
	 *
	 * Utilities
	 *
	 */
	_startAni: function () {
		var that = this,
			startX = that.x, startY = that.y,
			startTime = Date.now(),
			step, easeOut,
			animate;
        
		if (that.animating) return;
    
		if (that.steps.length == 0) {
			that._resetPos(300);
			return;
		}
		
		step = that.steps.shift();
		
		if (step.x == startX && step.y == startY) step.time = 0;

		that.animating = true;
		that.moved = true;

		if ( that.options.useTransition) {
			that._transitionTime(step.time);
			that.animating = false;
			that._pos(step.x, step.y);
			if (step.time){
         that._bind(EDOMUtility.vTransitionEnd);
      }else that._resetPos(200);
			return;
		}

		animate = function () {
      var now = Date.now(),
			    newX, newY;
			if ( step.time <= ( now - startTime ) || step.time == 0) {
				that._pos(step.x, step.y);
				that.animating = false;
				that._startAni();
				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
				return;
			}
      
      now = (now - startTime) / step.time - 1;
			easeOut = m.sqrt(1 - now * now);
 			newX = (step.x - startX) * easeOut + startX;
			newY = (step.y - startY) * easeOut + startY;
			that._pos(newX, newY);
			if (that.animating) that.aniTime = nextFrame(animate);
		};

		animate();

	},

	_transitionTime: function (time) {
		time += 'ms';
		this.scroller.style[EDOMUtility.vTransitionDuration] = time;
		if (this.hScrollbar) this.hScrollbarIndicator.style[EDOMUtility.vTransitionDuration] = time;
		if (this.vScrollbar) this.vScrollbarIndicator.style[EDOMUtility.vTransitionDuration] = time;
	},

	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var deceleration = 0.00001,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

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

		return { dist: newDist, time: m.round(newTime) };

	},

	_offset: function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;
			
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		
		if (el != this.wrapper) {
			left *= this.scale;
			top *= this.scale;
		}

		return { left: left, top: top };
	},

	_snap: function (x, y) {
		var that = this,
			i, l,
			page, time,
			sizeX, sizeY;

		// Check page X
		page = that.pagesX.length - 1;
		for (i=0, l=that.pagesX.length; i<l; i++) {
			if (x >= that.pagesX[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
		x = that.pagesX[page];
		sizeX = m.abs(x - that.pagesX[that.currPageX]);
		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
		that.currPageX = page;

		// Check page Y
		page = that.pagesY.length-1;
		for (i=0; i<page; i++) {
			if (y >= that.pagesY[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
		y = that.pagesY[page];
		sizeY = m.abs(y - that.pagesY[that.currPageY]);
		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
		that.currPageY = page;

		// Snap with constant speed (proportional duration)
		time = m.round(m.max(sizeX, sizeY)) || 200;

		return { x: x, y: y, time: time };
	},
  _bind: function (type, el, bubble) {
        try{ //[YF] for IE7 mobile
            (el || this.scroller).addEventListener(type, this, !!bubble);
        }catch(e){ //[YF] for IE7 mobile
             jQuery(el || this.scroller).unbind(type).bind(type, this,this.handleEvent);
        }
	},
	_unbind: function (type, el, bubble) {
        try{//[YF] for IE7 mobile
            (el || this.scroller).removeEventListener(type, this, !!bubble);
        }catch(e){ //[YF] for IE7 mobile
            jQuery(el || this.scroller).unbind(type);
        }
	},
  _canMove: function(data,e, reachedLimit){
    res = false;
    if(! e.consumed && !reachedLimit) { 
      // if ( direction & delta go over the wrapper ) 
      //    consume
      // else 
      //    don't consume
      e.consumed = true;
      res = true;
    }
    if( reachedLimit && res == this.options.bounce ){
      res =  true;
    }
    return res;
  },

	/**
	 *
	 * Public methods
	 *
	 */
	destroy: function () {
		var that = this;
        that.scroller.style[EDOMUtility.vTransform] = '';
    jQuery(that.wrapper).removeClass(Nagare.clsName);

		// Remove the scrollbars
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');

		// Remove the event listeners
		that._unbind(RESIZE_EV, window);
		that._unbind(START_EV);
		that._unbind(MOVE_EV);
		that._unbind(END_EV);
		that._unbind(CANCEL_EV);

    if (!hasTouch) {
			  that._unbind(WHEEL_EV);
		}
		
		if (!that.options.hasTouch) {
			that._unbind('mouseout', that.wrapper);
			that._unbind(WHEEL_EV);
		}
				
		if (that.pullToLastToRefresh) {
			that.pullToLastEl.parentNode.removeChild(that.pullToLastEl);
		}
		if (that.pullToFirstRefresh) {
			that.pullToFirstEl.parentNode.removeChild(that.pullToFirstEl);
		}
        
		if (that.options.useTransition) that._unbind(EDOMUtility.vTransitionEnd);
		
		if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
		
		if (that.options.onDestroy) that.options.onDestroy.call(that);
	},

	refresh: function () {
		var that = this,
			offset,
			i, l,
			els,
			pos = 0,
			page = 0;
    if(that.options==null) return; //[YF]

    if (that.pullToLastRefresh) {
			loading = that.pullToLastEl.className.match('loading');
			if (loading && !that.contentReady) {
				oldHeight = that.scrollerH;
				that.contentReady = true;
				that.pullToLastEl.className = 'iScrollPullToLast';
				that.pullToLastLabel.innerText = that.options.pullToLastLabel[0];
				that.offsetBottom = that.pullToLastEl.offsetHeight;
				that.scroller.style.marginTop = -that.offsetBottom + 'px';
			} else if (!loading) {
				that.offsetBottom = that.pullToLastEl.offsetHeight;
				that.scroller.style.marginTop = -that.offsetBottom + 'px';
			}
		}

		if (that.pullToFirstRefresh) {
			loading = that.pullUpEl.className.match('loading');
			if (loading && !that.contentReady) {
				oldHeight = that.scrollerH;
				that.contentReady = true;
				that.pullToFirstEl.className = 'iScrollPullToFirst';
				that.pullToFirstLabel.innerText = that.options.pullUpLabel[0];
				that.offsetTop = that.pullToFirstEl.offsetHeight;
				that.scroller.style.marginBottom = -that.offsetTop + 'px';
			} else if (!loading) {
				that.offsetTop = that.pullToFirstEl.offsetHeight;
				that.scroller.style.marginBottom = -that.offsetTop + 'px';
			}
		}


		if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
		that.wrapperW = that.wrapper.clientWidth || 1;
		that.wrapperH = that.wrapper.clientHeight || 1;

		that.minScrollY = -that.options.topOffset || 0;
		that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
		that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
		that.dirX = 0;
		that.dirY = 0;

		if (that.options.onRefresh) that.options.onRefresh.call(that);

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

		that.hScrollbar = that.hScroll && that.options.hScrollbar;
		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;
		offset = that._offset(that.wrapper);
		that.wrapperOffsetLeft = -offset.left;
		that.wrapperOffsetTop = -offset.top;

		// Prepare snap
		if (typeof that.options.snap == 'string') {
			that.pagesX = [];
			that.pagesY = [];
			els = that.scroller.querySelectorAll(that.options.snap);
			for (i=0, l=els.length; i<l; i++) {
				pos = that._offset(els[i]);
				pos.left += that.wrapperOffsetLeft;
				pos.top += that.wrapperOffsetTop;
				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
				that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
			}
		} else if (that.options.snap) {
			that.pagesX = [];
			while (pos >= that.maxScrollX) {
				that.pagesX[page] = pos;
				pos = pos - that.wrapperW;
				page++;
			}
			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

			pos = 0;
			page = 0;
			that.pagesY = [];
			while (pos >= that.maxScrollY) {
				that.pagesY[page] = pos;
				pos = pos - that.wrapperH;
				page++;
			}
			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
		}

		// Prepare the scrollbars
		that._scrollbar('h');
		that._scrollbar('v');

		if (!that.zoomed) {
			that.scroller.style[EDOMUtility.vTransitionDuration] = '0';
			that._resetPos(400);
		}
    that.unbindEvent();
    that.rebindEvent();
	},
  rebindEvent:function(){
    //		setTimeout(function () {
//### 
      that = this;//YF
			that._unbind(START_EV);
			that._unbind(MOVE_EV);
			that._unbind(END_EV);
			that._unbind(CANCEL_EV);
      that._unbind("mouseout", that.wrapper); //YF
      that._unbind(EDOMUtility.vTransitionEnd);//YF
      that._bind(START_EV);
      that._bind(RESIZE_EV, window);
      if (!hasTouch) {
			  that._bind(WHEEL_EV);
		  }
        

//		}, 0);
    },
    unbindEvent:function(){
    // Remove the event listeners
      that = this;//YF
      that._unbind(START_EV);
      that._unbind(MOVE_EV);
      that._unbind(END_EV);
      that._unbind(CANCEL_EV);
      that._unbind("mouseout",that.wrapper); //YF
      that._unbind(EDOMUtility.vTransitionEnd);//YF
      that._unbind(RESIZE_EV, window);
      if (!hasTouch) {
        that._unbind(WHEEL_EV);
      }
    },
	scrollTo: function (x, y, time, relative) {
		var that = this,
			step = [],
			i, l;
		that.stop();
    
		if (!isNaN(x) && !isNaN(y) > 0) {
      step = [{ x: x, y: y, time: time, relative: relative }];
    }
		
		for (i=0, l=step.length; i<l; i++) {
			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
		}
		that._startAni();
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.left += that.wrapperOffsetLeft;
		pos.top += that.wrapperOffsetTop;

		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
		pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

		that.scrollTo(pos.left, pos.top, time);
	},

	scrollToPage: function (pageX, pageY, time, afterScrollStart) {
		var that = this, x, y;

		time = time === undefined ? 400 : time;
    
		if ((afterScrollStart==null || afterScrollStart == false) && that.options.onScrollStart) that.options.onScrollStart.call(that);

		if (that.options.snap) {
			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

			that.currPageX = pageX;
			that.currPageY = pageY;
			x = that.pagesX[pageX];
			y = that.pagesY[pageY];
		} else {
			x = -that.wrapperW * pageX;
			y = -that.wrapperH * pageY;
			if (x < that.maxScrollX) x = that.maxScrollX;
			if (y < that.maxScrollY) y = that.maxScrollY;
		}

		that.scrollTo(x, y, time);
	},

	disable: function () {
		this.stop();
		this._resetPos(0);
		this.enabled = false;

		// If disabled after touchstart we make sure that there are no left over events
		this._unbind(MOVE_EV);
		this._unbind(END_EV);
		this._unbind(CANCEL_EV);
	},
	
	enable: function () {
		this.enabled = true;
	},
	
	stop: function () {
		if (this.options.useTransition) this._unbind(EDOMUtility.vTransitionEnd);
		else cancelFrame(this.aniTime);
		this.steps = [];
		this.moved = false;
		this.animating = false;
	},
	
	zoom: function (x, y, scale, time) {
		var that = this,
			relScale = scale / that.scale;

		if (!that.options.useTransform) return;

		that.zoomed = true;
		time = time === undefined ? 200 : time;
		x = x - that.wrapperOffsetLeft - that.x;
		y = y - that.wrapperOffsetTop - that.y;
		that.x = x - x * relScale + that.x;
		that.y = y - y * relScale + that.y;

		that.scale = scale;
		that.refresh();

		that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
		that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;
		that.scroller.style[EDOMUtility.vTransitionDuration] = time + 'ms';
		that.scroller.style[EDOMUtility.vTransform] = trnOpen + that.x + 'px,' + that.y + 'px' + trnClose; //+ ' scale(' + scale + ')';
		that.zoomed = false;
	},
	
	isReady: function () {
		return !this.moved && !this.zoomed && !this.animating;
	}
};


if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;


})();

