###*
 * #es.eDOMUtility
 * This library support normalizing event and get browser native information.
 * These information will be globally available under EDOMUtility object.
 * Thought javascript doesn't has sense of read only, 
 * overwriting these parameter could cause some error. 
 *  
 * ##Supported Variable:
 *   * es.eDOMUtility.vP: css header that needs to be placed i.e. '-webkit-"
 *   * es.eDOMUtility.hasTouch: true / false has touch feature and event or not
 *   * es.eDOMUtility.has3d: true / false  has 3d functionality or not
 *   * es.eDOMUtility.hasTransform:  true / false has transform function or not
 *   * es.eDOMUtility.vEvUserMoveStartAll: array of all the start event i.e. mousedown , touchstart
 *   * es.eDOMUtility.vEvUserMoveEndAll:: array of all the end event i.e. mouseup, touchend
 *   * es.eDOMUtility.vEvUserMoveCancelAll:array of all the move event i.e. mouseout, touchcancel
 *   * es.eDOMUtility.vEvUserMove:array of all the camel event i.e. mousemove, touchmove
 *   * es.eDOMUtility.vEvUserMoveCancel:array of all the cancel event i.e. mouseout, touchcancel
 *   * es.eDOMUtility.vEvUserScrollEnd:array of all the scroll event i.e. scroll, wheel
 *   * es.eDOMUtility.vEvMouseWheel: wheel if it exists
 *   * es.eDOMUtility.vTransitionEnd: normalized transition end event transition end
 *   * es.eDOMUtility.vTransformOrigin: normalized transition end style property
 *   * es.eDOMUtility.vTransitionProperty:null
 *   * es.eDOMUtility.vTransitionTimingFunction: normalized transition timing style property
 *   * es.eDOMUtility.vTransition: normalized transition style property
 *   * es.eDOMUtility.vTransform: normalized transform style property
 *   * es.eDOMUtility.vOrientationChange: normalized orientation change event
 *   * es.eDOMUtility.vScrollDefault:scroll event
 *   * es.eDOMUtility.ua:user agent from below type 
 *   * es.eDOMUtility.osTypes: {"IOS":"ios","ANDROID":"android","BLACKBERRY":"blackberry","WINDOWS":"windows","UNKNOWN":"unknown"}
 *   * es.eDOMUtility.osBrowserTypes:{"WEBKIT":"webkit","MOZILLA":"moz", "OPERA":"o","MS":"ms"}
###

###!
 * EachScape Copyright 2012 EachScape. All rights reserved.
 * required library : 
 *   EObject.js, nagare.js, iscroll.js
 *  
 * Revision History
 * Date    Version    CreatedBy    Description
 * ---------------------------------------------------
 * Feb 14  0.0.1      Yuri Fukuda  Created
###

class @EDOMUtility extends EObject

  # Public
  @isPropertyCheckAvailable:true
  @vP:""
  #normalizedEvent
  @browserVersion:""
  @hasTouch:false
  @has3d:false
  @hasTransform:false
  @hasSupports:false
  @vAF:null
  @vBrowserType:null
  @vEvUserMoveStartAll:[]
  @vEvUserMoveEndAll:[]
  @vEvUserMoveCancelAll:[]
  @vEvUserMove:null
  @vEvUserMoveCancel:null
  @vEvUserScrollEnd:null
  @vEvMouseWheel:null
  @vTransitionEnd:null
  @vTransformOrigin:null
  @vTransitionProperty:null
  @vTransitionDelay:"transitionDelay"
  @vTransitionTimingFunction:null
  @vTransition:null
  @vTransform:null
  @vOrientationChange:null
  @vOrientationUpdateTime:100
  @vScrollDefault:null
  @xPathLibraryFile:"frameworks/javascript-xpath-latest-cmp.0.1.12.js"
  @isContentScrollableByCSS:false
  #@xPathLibraryFile:"frameworks/javascript-xpath-latest.js"
  @ua:""
  @supportedPlatform:["ipod",'iphone', "ipad","android","blackberry","windows"]
  @osTypes:{"IOS":"ios","ANDROID":"android","BLACKBERRY":"blackberry","WINDOWS":"windows","PLAYBOOK":"hp-tablet","UNKNOWN":"unknown"}
  @browserTypes:{"WEBKIT":"webkit","MOZILLA":"moz", "OPERA":"o","IE":"ie","UNKNOWN":"unkonwn"}
  @osType:null
  @vOsType:null
  @vBrowserType:null

  @triggerClick:(elm)=>
   evt=null
   if (document.createEventObject)
     evt = document.createEventObject()
     elm.get(0).fireEvent('onclick',evt)
   else
     evt = document.createEvent("MouseEvents")
     if (evt.initMouseEvent)
       evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
       elm.get(0).dispatchEvent(evt)
     else
       ELog.error("no event object")
  
  @normalizeBroserAnimation:()->   
    @vAF =  window.requestAnimationFrame        ||
          window.webkitRequestAnimationFrame        ||
          window.mozRequestAnimationFrame                ||
          window.oRequestAnimationFrame                ||
          window.msRequestAnimationFrame                ||
          ((callback)-> window.setTimeout(callback, 1000 / 60) )
    @hasSupports = ( EDOMUtility.hasOwnProperty("CSS")  &&   EDOMUtility.hasOwnProperty("supports",window.CSS))
    @getOSType()
    @isContentScrollableByCSS  = false# EDOMUtility.vOsType == EDOMUtility.osTypes.IOS)
    supportsOrientationChange = EDOMUtility.hasOwnProperty("onorientationchange") or EDOMUtility.hasOwnProperty("orientation")
    @vOrientationChange = if supportsOrientationChange then "orientationchange" else "resize"
    @vOrientationUpdateTime = if(EDOMUtility.vOsType==EDOMUtility.osTypes.ANDROID) then 300 else 100
    @vScrollDefault=if(EDOMUtility.vOsType==EDOMUtility.osTypes.ANDROID) then 1 else 0
    #@vScrollDefault =  window.pageYOffset || document.compatMode == "CSS1Compat" && document.documentElement.scrollTop || document.body.scrollTop || 0
    if(EDOMUtility.vOsType==EDOMUtility.osTypes.IOS)
      @vOrientationChange="orientationchange"
    if(! @vEvUserMoveStartAll) then @vEvUserMoveStartAll=[]
    if(! @vEvUserMoveEndAll) then @vEvUserMoveEndAll=[]
    if(! @vEvUserMoveCancelAll) then @vEvUserMoveCancelAll=[]

    
    ### IE BUG WORK AROUND (hasOwnProperty doesn't search event per it does not inherit Object.prototype  ###
    @vEvUserMove = "touchmove" if  EDOMUtility.hasOwnProperty('ontouchmove')
    @vEvUserMove = "mousemove" if  @vEvUserMove==null && EDOMUtility.hasOwnProperty('onmousemove')
    @vEvUserMoveStartAll.push('touchstart') if (((typeof window.TouchEvent != 'undefined') && (EDOMUtility.ua.indexOf('Mobile') > -1)) || EDOMUtility.hasOwnProperty('ontouchstart'))
    @vEvUserMoveStartAll.push('mousedown') if EDOMUtility.hasOwnProperty('onmousedown')
    @vEvUserMoveEndAll.push('touchend') if (((typeof window.TouchEvent != 'undefined') && (EDOMUtility.ua.indexOf('Mobile') > -1)) || EDOMUtility.hasOwnProperty('ontouchend'))
    @vEvUserMoveEndAll.push('mouseup') if EDOMUtility.hasOwnProperty('onmouseup')

    if  EDOMUtility.hasOwnProperty('ontouchcancel')
      @vEvUserMoveCancelAll.push('touchcancel')
      @vEvUserMoveCancel='touchcancel'
    if  EDOMUtility.hasOwnProperty('onmouseout')
      @vEvUserMoveCancelAll.push('mouseout')
      @vEvUserMoveCancel='mouseout'



    
    if EDOMUtility.hasOwnProperty('onscroll')
       @vEvUserMoveEndAll.push('scroll')
       @vEvUserScrollEnd = 'scroll'
       @vEvMouseWheel='scroll'

    if EDOMUtility.hasOwnProperty('onmousewheel')
       @vEvUserMoveEndAll.push('mousewheel')
       @vEvUserScrollEnd = 'mousewheel'
       @vEvMouseWheel='mousewheel'

    if EDOMUtility.hasOwnProperty('onwheel')
       @vEvUserMoveEndAll.push('wheel')
       @vEvUserScrollEnd = 'wheel'
       @vEvMouseWheel='wheel'

    if EDOMUtility.hasOwnProperty('DOMMouseScroll')
       @vEvUserMoveEndAll.push('DOMMouseScroll')
       @vEvUserScrollEnd = 'DOMMouseScroll'
       @vEvMouseWheel='DOMMouseScroll'




    @vBrowserType = EDOMUtility.browserTypes.UNKNOWN
    if(jQuery.browser.webkit || jQuery.browser.safari)
      @vP = "-webkit-"
      @vBrowserType = EDOMUtility.browserTypes.WEBKIT
      @vTransitionDelay = "webkitTransitonDelay"
      @vTransition="webkitTransition"
      @vTransitionEnd = "webkitTransitionEnd"
      @vTransitionDuration = "webkitTransitionDuration"
      @vTransformOrigin = "webkitTransformOrigin"
      @vTransitionProperty = "webkitTransitionProperty"
      @vTransitionTimingFunction = "webkitTransitionTimingFunction"
      @vTransform="webkitTransform"
    else if (jQuery.browser.msie)
      @vP = "-ms-"
      @vBrowserType = EDOMUtility.browserTypes.IE
      @vTransitionDelay = "msTransitonDelay"
      @vTransition="msTransition"
      @vTransitionEnd = "MSTransitionEnd"
      @vTransitionDuration = "msTransitionDuration"
      @vTransformOrigin = "msTransformOrigin"
      @vTransitionProperty = "msTransitionProperty"
      @vTransitionTimingFunction = "msTransitionTimingFunction"
      @vTransform="msTransform"
    else if (jQuery.browser.mozilla)
      @vP = "-moz-"
      @vBrowserType = EDOMUtility.browserTypes.MOZILLA
      @vTransitionDelay = "transitonDelay"
      @vTransition="transition"
      @vTransitionEnd = "transitionend"
      @vTransitionDuration = "transitionDuration"
      @vTransformOrigin = "transformOrigin"
      @vTransitionProperty = "transitionProperty"
      @vTransitionTimingFunction = "transitionTimingFuntion"
      @vTransform="transform"
    else if (jQuery.browser.opera)
      @vP = "-o-"
      @vBrowserType = EDOMUtility.browserTypes.OPERA
      @vTransitionDelay = "oTransitonDelay"
      @vTransition="oTransition"
      @vTransitionEnd = "otransitionend"
      @vTransitionDuration = "OTransitionDuration"
      @vTransformOrigin = "OTransformOrigin"
      @vTransitionProperty = "OTransitionProperty"
      @vTransitionTimingFunction = "OTransitionTimingFunction"
      @vTransform="OTransform"
    tmpStyle = document.createElement('div').style
    @has3d = `'WebKitCSSMatrix' in window && 'm11' in (new WebKitCSSMatrix())`
    @hasTouch = EDOMUtility.hasOwnProperty('ontouchstart') &&  ! (/hp-tablet/gi).test(EDOMUtility.browserVersion) 
    @hasTransform = EDOMUtility.hasOwnProperty(EDOMUtility.vTransform, document.documentElement.style)


  @isXPathSupported:()->
    res=XPathResult?
    res

  @handleKeySubmit:(inputElm, updateCallBack, submitCallBack)->
    key=null
    inputElm.bind("keypress",((e)=>
      if(window.event)
        key = window.event.keyCode
      else
        key = e.which
      if(key == 13 || key == 10)
        submitCallBack(inputElm.val()) if submitCallBack
      else
        updateCallBack(inputElm.val()) if updateCallBack
      true 
      ))
    
    inputElm.focus((()=>
      inputElm.blur((()=>
        submitCallBack(inputElm.val()) if submitCallBack
        inputElm.blur(null)
      ))
    ))
  @getBroserVendorType:()->

  ###
    getCSSProperty
    returns css property 

    Example
    EDOMUtility.getCSSProperty(document.getElementById("test"),"left")
  ###
  @getCSSProperty:(elm,prop)->
    if (elm.style[prop])
      elm.style[prop]
    else if (elm.currentStyle)
      elm.currentStyle[prop]
    else if (document.defaultView && document.defaultView.getComputedStyle) 
      document.defaultView.getComputedStyle(elm,null).getPropertyValue(prop)
    else
      null
    
    
  @getOSType:()->
    if !EDOMUtility.vOsType 
      os = EDOMUtility.osTypes.UNKNOWN
      tmpString =EDOMUtility.ua.toLowerCase()
      supportedPlatform=EDOMUtility.supportedPlatform
      for platform in supportedPlatform
        if tmpString.indexOf(platform) >= 0
          os = platform
          os = EDOMUtility.osTypes[platform.toUpperCase()] if EDOMUtility.osTypes[platform.toUpperCase()]
          break
      EDOMUtility.vOsType = EDOMUtility.osType=os
      if (os=="ipod"|| os=="iphone" || os=="ipad")
        EDOMUtility.vOsType= EDOMUtility.osTypes.IOS
    EDOMUtility.vOsType 


  @loadJavaScript:(elem, location, callback, option)->
    ELog.info("###5--------------------------------   loading javascript")
    e = document.createElement('script')
    e.type = 'text/javascript'
    #jQuery(e).append(option.innerHTML) if  option?.innerHTML
    #e.innerHTML = option.innerHTML if option?.innerHTML
    if(location)
      if location.indexOf('http')>=0
        e.src = "#{document.location.protocol }#{location.replace(/^http[s]*:/g,"")}" 
      else
        e.src="#{location}"
    e.id = option.id if option?.id
    e.async = if(option?.asynch) then option.asynch else true
    e.esCallback=callback if callback
    if(callback)
      if(EDOMUtility.vOsType==EDOMUtility.osTypes.WINDOWS)
        `var esCallback = callback;`
        e.onreadystatechange = ((e)->
          if (this.readyState == 'loaded') 
            esCallback() if esCallback
          )
      else
        jQuery(e).load(()->
          callback() if callback
          )
   #   if(EDOMUtility.vOsType==EDOMUtility.osTypes.WINDOWS)
   #     tmpTextNode = document.createTextNode(option.innerHTML)
   #     e.appendChild(tmpTextNode)
   #   else
    EDOMUtility.setElementText(e, option.innerHTML) if option?.innerHTML?
    elem.appendChild(e)
  @getNetwork:()->
    retVal = "none"
    if window.navigator.onLine
      if(navigator.connection)
          retVal = "unknown" if (navigator.connection.type == navigator.connection.UNKNOWN)# we have not had this case yet
          retVal = "ethernet" if (navigator.connection.type ==navigator.connection.ETHERNET)# we have not have this case yet
          retVal = "wifi" if (navigator.connection.type == navigator.connection.WIFI)
          retVal = "cell" if (navigator.connection.type == navigator.connection.CELL_2G)
          retVal = "cell" if (navigator.connection.type == navigator.connection.CELL_3G)
        else
          retVal="UNKNOWN"
    retVal

  @setElementText:(node, text)->
    try
      node.innerText = text
    catch e
      node.text=text
    
  @initializeDOMUtility:()->
    EDOMUtility.ua = navigator.userAgent
    EDOMUtility.browserVersion= navigator.appVersion
    EDOMUtility.checkHasPropertyCheck()
    
  ###!
  ERB
  @installXPathLibrary:()->
    xpathLibPath = "#{EDOMUtility.xPathLibraryFile}"
    head = document.getElementsByTagName("head")[0]
    if EDOMUtility.vOsType==EDOMUtility.osTypes.WINDOWS
      EDOMUtility.loadJavaScript(head,null,null,{innerHTML:"window['jsxpath'] = new Object(); window['jsxpath'].exportInstaller=true;"}) 
    else
     EDOMUtility.loadJavaScript(head,null,null,{innerHTML:"window.jsxpath = { exportInstaller : true };"}) 
    EDOMUtility.loadJavaScript(head,xpathLibPath,
       (()->
          if(!window.document.evaluate) 
          #  ELog.info("installing xpath library ")
            #ESMessageDelegate.sendMsg(new InitialFileLoadMsg("xpath"))
            window.install(window)
          setTimeout((()=>
            ESMessageDelegate.sendMsg(new InitialFileLoadMsg("xpath"))
            ),0) 
       ),
       null)
    null
   
  @loadDynamicSupport:()->
    ELog.info("2.5--------------------------------   Load Xpath Library")
    if(!EDOMUtility.isXPathSupported())
      ELog.info("loading XPath Lib")
      $app.require("xpath")
      EDOMUtility.installXPathLibrary()

  
  
  @updateGesturePosition:(e)->
    if($app.coordinateSwichNeeded)
      if(e.touches.length>0)
        x=e.touches[0].pageX
        y=e.touches[0].pageY

  ###
     
  # Private

    
  @checkHasPropertyCheck:()->
    try
      test = window.hasOwnProperty('ontouchstart')
      EDOMUtility.isPropertyCheckAvailable = (test!=undefined &&  EDOMUtility.vOsType != EDOMUtility.osTypes.WINDOWS)
    catch e
      EDOMUtility.isPropertyCheckAvailable =false
    EDOMUtility.isPropertyCheckAvailable
     
    
    
  @hasOwnProperty:(name, obj)->
    obj = window if !obj
    if(EDOMUtility.isPropertyCheckAvailable && EDOMUtility.vOsType != EDOMUtility.osTypes.WINDOWS)
      # here, some IE supports prototype hasOwnProperty, but not to overkill by comparing the version. 
      # even if hasOwnProperty, if it's on the prototype scope, it could return false
      ((`name in obj`) || window.hasOwnProperty(name))
    else
      for key of obj 
        return true if key == name
      return false

  # this is mostly for the android which is not handling repaint correctly  
  @repaintAdjust:(elm)->
    original = jQuery(elm).get(0).style[EDOMUtility.vTransform]
    jQuery(elm).get(0).style.removeProperty("#{EDOMUtility.vP}transition") 
    jQuery(elm).get(0).style[EDOMUtility.vTransition] = "all"
    jQuery(elm).get(0).style[EDOMUtility.vTransitionTimingFunction] = "linear"
    jQuery(elm).get(0).style[EDOMUtility.vTransitionDuration] = "1ms"
    jQuery(elm).get(0).style[EDOMUtility.vTransform]= original ||  "scale(1.0)"
    #ELog.info( "IMG CHNAGE______________________#{original} , #{jQuery(elm).get(0).style[EDOMUtility.vTransform]}")
    null 

  @touchstartDefaultBehavior:(e)->
    ###!
    if(e.target?.tagName?.toLowerCase()=='select')
      ELog.info("prevent Nothing") 
      e.preventDefault()
    if(EDOMUtility.vOsType!=EDOMUtility.osTypes.IOS)
      e.preventDefault()
      false
    else
      true
    ###
    e.preventDefault()
    true
  @hideSystemBars:()->
    jQuery('html, body').animate({scrollTop: '1px'}, 0)
    window.scrollTo(0,EDOMUtility.vScrollDefault)

    

EDOMUtility.initializeDOMUtility()
EDOMUtility.normalizeBroserAnimation()
Array::filterOutValue = (v) -> x for x in @ when x!=v




