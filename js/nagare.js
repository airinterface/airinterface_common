/* this function wrapps scrolling function 
   if it's possible, it will use iScroll, if not, 
   it will listen to touch event to find out most 
   info and execute call back if its necessary
   this is an windows mobile version that will enables 
   scroller. 
   required js :  iScroll v4.1.9 
*/ 
(function(){
  this.Nagare = (function() {
    function Nagare(el,option,document){
      this.element=el;
   		this.scroller = this.element.children[0];
      if(option.snap!=null)this.options.snap = option.snap;  
      if(option.hScrollbar!=null)this.hScrollbar = option.hScrollbar;
      if(option.vScrollbar!=null)this.vScrollbar = option.vScrollbar; 
      if(option.momentum!=null)this.momentum = option.momentum; 
      if(option.onDestroy!=null)this.onDestroy = option.onDestroy;
      if(option.onPullUp!=null)this.onPullUp = option.onPullUp; 
      if(option.onScrollStart!=null)this.onScrollStart = option.onScrollStart;
      if(option.onScrollMove!=null)this.onScrollMove = option.onScrollMove; 
      if(option.onScrollEnd!=null)this.onScrollEnd = option.onScrollEnd; 
      if(option.onAnimationEnd!=null)this.onScrollEnd = option.onAnimationEnd; 
      if(option.onTouchEnd!=null)this.onTouchEnd = option.onTouchEnd; 
      if(option.pullToRefresh!=null)this.pullToRefresh = option.pullToRefresh;
      if(option.checkDOMChanges!=null)this.checkDOMChanges = option.checkDOMChanges;
      if(option.pullToRefresh!=null)this.pullToRefresh = option.pullToRefresh;
      this.initialize();
    }
    Nagare.STATUS = {IDLE:"nagareIdle",MOVING:"nagareMoving"};
    Nagare.clsName = "nagare";
    Nagare.prototype={
      debugFlag:false,
      element:null,
      uiEvent:null,
      scroller:null,
      x:0,
      y:0,
      currPageX:0,
      currPageY:0,
      onDestroy:null,
      onPullUp:null,
      onAnimationEnd:null,
      onScrollEnd:null,
      onScrollMove:null,
      onScrollStart:null,
      onTouchEnd:null,
      options:[],
      scrollerWidth:0,
      scrollerHeight:0,
      wrapperWidth:0,
      wrapperHeight:0,
      pagesX:null,
      pagesY:null,
      initialize:function(){
        var that = this;
        option={};
        if((EDOMUtility.vOsType == EDOMUtility.osTypes.WINDOWS  ) && (EDOMUtility.ua.indexOf('Mobile') > -1)){
          option.moveEndMonitorCheckEndDuration=100;
        }
        that.element.style.overflow="scroll";
        jQuery(that.element).addClass(Nagare.clsName);
        that.uiEvent = new UiEvent(this.element,option,document);
        that.uiEvent.debugFlag=true;
        //#TODO if(this.hScrollbar == true)
        //#TODO if(this.vScrollbar == true)
        //#TODO if(this.momentum == true)
        //#TODO if(this.pullToRefresh == true)
        //#TODO if(this.checkDOMChanges == true)
        jQuery(that.element).bind(UiEvent.MovedEvent, function(e, data){  
          that.end(data);
        });
        this.initialized=true;
      },
      destroy:function(){
        var that=this;
        //#TODO
    		// clear scrollbar
        jQuery(that.element).removeClass(Nagare.clsName);
	     	that.hScrollbar = false;
		    that.vScrollbar = false;
		    that.updateScrollbar('h');
		    that.updateScrollbar('v');
        this.uiEvent._unregisterAll();
    		if (that.onDestroy) that.onDestroy.call(that);
      },
      log:function(msg) {
        if(this.debugFlag || window.debugFlag){
          if ((typeof console != "undefined" && console !== null) && console[name]) {
            console['log'](msg);
          }
        }
      },
      refresh:function(){
        //calculatePages
        if(this.scroller!=null && this.options.snap!=null){
          this.scrollerWidth = jQuery(this.scroller).innerWidth();
          this.wrapperWidth = jQuery(this.element).innerWidth();
          this.scrollerHeight = jQuery(this.scroller).innerHeight();
          this.wrapperHeight = jQuery(this.element).innerHeight();
          this.pagesX = [];
          this.pagesY = [];
          var items=null;
          if(typeof this.options.snap  == 'string'){
            items = this.scroller.querySelectorAll(this.options.snap);
            for( var k=0; k < items.length; k++){
              var position=jQuery(items[k]).position();
              var left = jQuery(items[k]).position().left;
              var top = jQuery(items[k]).position().top;
              if(k==0)
              { 
                this.pagesX.push(left);
                this.pagesY.push(top);
              }else if( this.pagesX[k-1]!=left){
                this.pagesX.push(left);
              }else if( this.pagesY[k-1]!=top){
                this.pagesY.push(top);
              } 
            }
            this.currPageX=0;
            this.currPageY=0;
          }else if(this.options.snap){
            for(var k=0; k <=this.wrapperWidth; k+=this.scrollerWidth){
              this.pagesX.push(k);
            }
            for(var k=0; k <=this.wrapperHeight; k+=this.scrollerHeight){
              this.pagesY.push(k);
            }
          }
        }

        //#TODO
      },

      rebindEvent:function(){
        this.uiEvent._unregisterAll();
        this.uiEvent._registerEventForStart();
      },
      scrollTo: function (x, y, time, relative){
        try{
		      this.stop();
          //jQuery(this.scroller).offset({top:y,left:x});
          this.element.scrollTop=-1*y;
          this.element.scrollLeft=-1*x;
        }catch(e){
          alert(e);
        }
      },
      scrollToPage:function(pageX, pageY, time, afterScrollStart){
        //#TODO
      },
      _snap:function(x, y, dirX, dirY){
    		var that = this, i, page, snapX,snapY;
		    // Check page X
        var startPos = 0; 
        var page=that.pagesX.length - 1; 
        try{
        i=0;
        startPos=x;
        sizeMax =  x + that.scrollerWidth;
		    while (startPos < 0 && i < (that.pagesX.length-2) ) {
          i++;
          startPos = x +that.pagesX[i];
		    }
        page=i;
		    if (page > 0 && dirX < 0){
          page--;
        }
		    snapX = that.pagesX[page]*-1;
		    that.currPageX = page;
		    // Check page Y
		    page = that.pagesY.length -1;
        i=0;
        startPos=y;
        sizeMax =  y + that.scrollerHeight;
		    while (startPos < 0 && i < (that.pagesY.length-2) ) {
          i++;
          startPos = y+ that.pagesY[i];
		    }
		    if (page > 0 && dirY < 0){
           page--;
        }
		    snapY = that.pagesY[page]*-1;
		    that.currPageY = page;
        }catch(e){alert(e);}
		    return { x:snapX, y: snapY, time: 200 };
      },

      stop:function(){
        
        //#TODO
      },
      _start:function(e){
        data={};
        data.originalEvent=e;
        data.currentStatus=this.uiEvent;
        this.start(data);
      },
      start:function(data){ //TODO
        var that = this;
        if(that.onScrollStart) that.onScrollStart.call(that, data.originalEvent);
      },
      moving:function(data){
        var that = this;
        if(that.onScrollMove) that.onScrollMove.call(that, data.originalEvent);
      },
      end:function(data){
        var that = this;
        try{

        if(this.options.snap){
          var snap = this._snap(
                jQuery(this.scroller).offset().left,
                jQuery(this.scroller).offset().top,
                data.currentStatus.dirX,
                data.currentStatus.dirY);
          jQuery(this.scroller).offset({top:snap.y,left:snap.x});
        } 
				this.x = window.getComputedStyle(this.scroller, null).left.replace(/[^0-9-]/g, '') * 1;
        this.y = window.getComputedStyle(this.scroller, null).top.replace(/[^0-9-]/g, '') * 1;
        if(that.onScrollEnd) that.onScrollEnd.call(that, data.originalEvent);
        if(that.onAnimationEnd){
            setTimeout(function(){
            that.onAnimationEnd.call(that, data.originalEvent);
            },100);
        }
        }catch(e){alert(e);}

        
      },
      updateScrollbar:function(direction){
        //#TODO
      },
      _unbind:function(e){
        this.uiEvent._unbind(e);
      },
      _bind:function(e){
        this.uiEvent._bind(e);
      }
      

    };
    return Nagare;
  })();
  this.NagareScrollerFactory=(function(){
    function NagareScrollerFactory(){
    }
    NagareScrollerFactory.applyScroller=function(el,option,_document){
      var scroller = null;
      var that = this;
      doc=(_document!=null)?_document:document;
		  wrapper = typeof el == 'object' ? el : doc.getElementById(el);
      if((EDOMUtility.vOsType == EDOMUtility.osTypes.WINDOWS  ) && (EDOMUtility.ua.indexOf('Mobile') > -1)){
        scroller = new Nagare(wrapper,option,doc); 
      }else{
        scroller = new iScroll(wrapper,option,doc);
        setTimeout(function(){scroller.refresh();},100);
      }
      return scroller; 
    };
    return NagareScrollerFactory;
  })();
}).call(this);




