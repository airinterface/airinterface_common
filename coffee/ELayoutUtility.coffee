###*
*  es.eLayoutUtility
* These classes supports layouting item in the place
*
##############################

###
 * # es.eLayoutUtility
 * 
 * These classes supports layouting item in the place
 * @api private
 *  
 *   
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

class @ELayoutUtility extends EObject
  #Public
  @currentConfig:null
  @getOrientationDegree:()->
    if(window.orientation) then return window.orientation 
    else return null

  @isPortrait:()->
    if (EDOMUtility.osType != EDOMUtility.osTypes.UNKNOWN && ELayoutUtility.getOrientationDegree()!=null) then (((ELayoutUtility.getOrientationDegree() % 180) == 0)) else 
    if(window.innerWidth < window.innerHeight) then 1 else 0
  
  ###*
  * this function returns object that contains available area information
  * 
  * ##Example
  *  `currentConfig = es.eLayoutUtility.getViewportConfig()` 
  * will return 
  * 
  *  * currentConfig.visibleWidth: avaiable block width after scaling
  *  * currentConfig.visibleHeight: avaiable block Height after scaling
  *  * currentConfig.viewportWidth: viewport width
  *  * currentConfig.viewportHeight: viewport height
  *  * currentConfig.pageOffsetLeft: page offset left
  *  * currentConfig.pageOffsetTop: page offset right
  *  * currentConfig.windowScreenWidth: device screen width
  *  * currentConfig.windowScreenHeight: device screen height
  *
  ###
  @getViewportConfig:()->
    currentConfig = new EPositionConfig()
    currentConfig.visibleWidth = (if(window.innerWidth!=undefined) then window.innerWidth else
                                  (if (document.documentElement!=undefined && document.documentElement.clientWidth!=undefined) then document.documentElement.clientWidth else (document.body.clientWidth)))
    currentConfig.visibleHeight =(if(window.innerHeight!=undefined)then window.innerHeight else
                                  (if (document.documentElement!=undefined && document.documentElement.clientHeight!=undefined) then document.documentElement.clientHeight else (document.body.clientHeight)))
    currentConfig.viewportWidth=window.innerWidth
    currentConfig.viewportHeight=window.innerHeight
    currentConfig.pageOffsetLeft = window.self.pageXOffset*-1
    currentConfig.pageOffsetTop = window.self.pageYOffset*-1
    currentConfig.windowScreenWidth=window.screen.width
    currentConfig.windowScreenHeight=window.screen.height
    #if(currentConfig.visibleWidth < currentConfig.visibleHeight &&  EDOMUtility.vOsType==EDOMUtility.osTypes.ANDROID)
      #ESLog.info("currentConfig.visibleHeight+=52 = "+(currentConfig.visibleHeight+52)+"window.outerHeight:#{window.outerHeight} window.outerHeight:#{window.outerHeight}")
      #currentConfig.visibleHeight+=52

    if(currentConfig.visibleWidth > currentConfig.visibleHeight &&  EDOMUtility.vOsType=="ios")
      currentConfig.visibleHeight=screen.height
    if(EDOMUtility.vOsType==EDOMUtility.osTypes.BLACKBERRY)
      currentConfig.windowScreenWidth=currentConfig.visibleWidth
      currentConfig.windowScreenHeight=currentConfig.visibleHeight
    if(EDOMUtility.vOsType==EDOMUtility.osTypes.UNKNOWN)
      width= Math.min(currentConfig.visibleWidth, currentConfig.visibleHeight)
      height= Math.max(currentConfig.visibleWidth, currentConfig.visibleHeight)
      currentConfig.windowScreenWidth=width
      currentConfig.windowScreenHeight=height
      
    ELayoutUtility.currentConfig=currentConfig
    tmp="osType:#{EDOMUtility.vOsType}"
    tmp+="\nwindow.innerWidth:"+window.innerWidth
    tmp+="\n window.innerHeight:"+window.innerHeight
    tmp+="\n window.visibleHeight:"+currentConfig.visibleHeight
    tmp+="\n viewportWidth:"+currentConfig.viewportWidth
    tmp+="\n viewportHeight:"+currentConfig.viewportHeight
    tmp+="\n windowScreenWidth:"+currentConfig.windowScreenWidth
    tmp+="\n windowScreenHeight:"+currentConfig.windowScreenHeight
    tmp+="\n browser ua:"+EDOMUtility.ua
    #ELog.info("ELayoutUtility.getViewportConfig:"+tmp)
    currentConfig
  
  @getElmLayoutFromConfig:(config)->
    div = jQuery("<div></div>")
    
    ###!
    x,y,z,top,left,right,top
          "rotateZ": "",
          "edgeConstraintsRight": "",
          "edgeConstraintsLeft": "0",
          "id": "b.13739.1",
          "block": "13738",
          "perspectiveDepth": "1000",
          "edgeConstraintsTop": "0",
          "edgeConstraintsBottom": "",
          "rotateX": "-8",
          "rotateY": "20"
    ### 
  
  
  #Private 
  constructor: () ->
    super()

class @EPositionConfig extends EObject
  #Public
  scale:0
  viewportWidth:0 # size in pixel that is visible to the user
  viewportHeight:0
  visibleWidth:0  # size in pixel that is stylable in the content
  visibleHeight:0
  pageOffsetLeft:0
  pageOffsetTop:0
  windowScreenWidth:0
  windowScreenHeight:0
  #for area config
  top:null
  bottom:null
  left:null
  right:null
  zIndex:null
  width:0
  height:0


  #Private 
  constructor: () ->
    super()
  @createAvailableRectPosFromElm:(div)->
    pscfg = jQuery.extend({},ELayoutUtility.currentConfig,false)
    pscfg.width = div.innerWidth()
    pscfg.height= div.innerHeight()
    pscfg.top   = div.position()?.top | 0
    pscfg.bottom= div.position()?.bottom | 0
    pscfg.left  = div.position()?.left | 0
    pscfg.right = div.position()?.right | 0
    pscfg.zIndex= div.css("z-index") | 1
    pscfg

