###*
 * #EBlock
 *  This component handle all the embedded block common operation.
 *  1. initialize communication.
 *  2. Initialize scroll feature.
 *  EBlock is a list of component. 
 *  Make sure 'ONLY' One instance ( or extension of that instance ) 
 *  exists in the Embedded HTML Block.
 *  To the user ( API user ) point of view, EBlock is the access point. 
 *  For the developer’s point of view, all the asynchronous calls that 
 * 
 * ##Example:
 * 
 *  The way you initialize, 
 *  is to call with the block ID. 
 *  i.e you have YourBlock extends EBlock. 
 *  `class YourBlock extends EObject
 *   ... do your implementation ...`
 *  The way you initialize will be
 *  `YourBlock.initialize("test", "9999", option)`
 *  after this function, global object
 *  es.block will contain instance of you object. 
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

class @EBlock extends EObject
  
  # Public
  toString:()->
    @constructor.name
  ###
  * this initializes EBlock 
  *
  * ##Example
  * `EBlock.initialize( "test", "9999",option)`
  * 
  * @param {String} block type type of the block ( component ) 
  * @param {String} blockID id of the block ID retrieved via Master block
  * @param {Object} option block specific option 
  * @api public
  ###
  @initialize:( name,blockID,option )->
    if(im.block) 
      alert("there is more than one block")
      return
    tmp = "new #{@prototype.toString()}(name,blockID,option);"
    obj = eval(tmp)
    EUtil.namespace("block",window[EObject.esNameSpace],obj)
    windows.scriptDone =  EBlock.esScriptDone
    obj
  
  @esScriptDone:(requestId)->
    

  constructor:( name,blockID,option )->
    @setName(name)
    @setBlockID(blockID)
    @setOption(option)
    EBridge.initialize()
    @setMessageMgr(new EMessageManager())
    css={
      position:"absolute"
      left:"-100px"
      top:"-100px"
      width:"0px"
      height:"0px"
      visisiblity:"hidden"
    }
    rootElm = jQuery("<div id=\"#{EBlock.blockIDPrefix}#{blockID}\"></div>")
                    .css(css)
                    .appendTo("body")
    @setRootElm(rootElm)

  #Private
  @blockIDPrefix:"blockRoot"
EBlock.prop("blockID",0)
EBlock.prop("option",null)
EBlock.prop("rootElm",null)
EBlock.prop("messageMgr",null)

