###*
 * #EObject
 *  This component is a set of common functionality for 
 *  all instance of eachscape library component.
 * 
 * ##Example:
 *  `yourClass extends EObject
 *     .. place yoru implementation here ... 
 *  ` 
 *
###

###!
 * EachScape Copyright 2012 EachScape. All rights reserved.
 * required library : 
 * Revision History
 * Date    Version    CreatedBy    Description
 * ---------------------------------------------------
 * Feb 14  0.0.1      Yuri Fukuda  Created
###

class @EObject
  # Private 

  ###!
  * this function is called to define the setter and getter in the 
  * prototype 
  ### 
  @esNameSpace="es"
  confVal:{}

  ###
  * prop is global function which is used right after 
  * the declaration of the each class. 
  * by setting prop name, default value, it will create 
  * a property if it doesn't exists, and create
  * auxiliary function of it's property 
  *
  * ##Examples:
  *  `class @YourClass extends EObject
  *    .... 
  *   @YourClass.prop("yourName","test",null)
  *   obj = new YourClass()
  *   alert(obj.getYourName() 
  *   ->returns 'test'
  *   obj.setYourName("test2")
  *   alert(obj.getYourName() 
  *   -> returns 'test2'
  *   ` 
  * @param {String} name name of the property
  * @param {EObject} defaultVal default value to initialized with 
  * @api public
  ###
  @prop:(name,defaultVal,confObj)->
    name=name
    EObject.prototype[name]=defaultVal
    if(name==null) then return
    funcName = "#{name[0].toUpperCase()}#{(if name.length>1 then name[1...] else '')}"
    EObject.prototype["set#{funcName}"] =(val)->
      @set(name,val)
    EObject.prototype["get#{funcName}"]=()->
      @get(name)
    null
  # Public
  debugFlag:false
  toString: () ->
    @constructor.name

  ###
  * log thisfunction will execute logging dependingon thedebug setting. 
  * Debug setting will be turned off and on globally with
  * windows.debugFlag or this.debugFlag
  * EObject is inherited to all the ESObject. so the instance of that 
  * could call log function. 
  *
  * ##Examples:
  *  `this.log('testint')`
  * 
  * @param {String} message log message to be display at the console 
  * @param {EObject} object the object that implements EObject 
  * @api public
  ###
  log:(msg,obj)->
	  if(@debugFlag)
      ELog.log(this,msg)
    if(obj?.debugFlag)
      ELog.log(obj,msg)
    if(window.debugFlag?)
      ELog.log(null, msg)

  
  get:(name)->
    if(`name in this`) then return this[name]
    return null

  set:(name,value)->
    if(`name in this`) then this[name]=value
    null
@EObject.prop("name","",null)
  
  
    

  
