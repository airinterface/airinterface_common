###
 * #ELog
 * Supports logging globally. 
 * Log could be suppressed by class entity level. or 
 * in global level
###

###!
 * EachScape Copyright 2012 EachScape. All rights reserved.
 * required library : 
 *   EObject.js
 *  
 * Revision History
 * Date    Version    CreatedBy    Description
 * ---------------------------------------------------
 * Feb 14  0.0.1      Yuri Fukuda  Created
###

class @ELog extends EObject
  @debugFlag:false
  # Public
  ###
  * log thisfunction will execute logging depending on the debug setting. 
  * Debug setting will be turned off and on globally with
  * windows.debugFlag or this.debugFlag
  *
  * ##Examples:
  *  `ELog.info(obj, 'testint')`
  * 
  * @param {Object} Object that extends EObject
  * @param {String} message log message to be display at the console 
  * @api public
  ###
  @initialize:()->
    if ELog.debugFlag  || (if (debugFlag?) then debugFlag else false)
      window.onerror=(e, url, lineNumber)->
        alert("#{e}url:#{url}lineNumber:#{lineNumber}")
  @log: (obj,args...) ->
    @call(obj, 'log', args)
  
  @debug: (obj,args...) ->
    @call(obj, 'debug', args)
    
  @info: (obj,args...) ->
    @call(obj, 'log', args)
    
  @warn: (obj,args...) ->
    @call(obj, 'warn', args)
    
  @error: (obj,args...) ->
    # TODO Causes a real error in Firebug?
    @call(obj, 'warn', args)
  
  @call: (obj,name, args) ->
    #console[name].apply(console, args) if console? && console[name]
    console[name]("[#{ if(obj) then obj?.toString() else 'Global'}] #{args[0]}") if console? && console[name]

  @dumpObj:(obj, level) ->
    dumped_text = ""
    try
      level_padding=""
      if(level==null || typeof level == 'undefined')
        level = 0
      for j in [0...level+1]
        level_padding += "    "
      startString=""
      endString=""
      isArray = (obj!=null && (typeof(obj) == 'object') &&  (obj.constructor == Array))
      isHash  = (obj!=null && (typeof(obj) == 'object') &&  (obj.constructor != Array))
      isString =(typeof(obj) == 'string')
      if(isArray)
        startString="[\n"
        endString="]\n"
      if(isHash)
        startString="{\n"
        endString="}\n"
      if(isString)
        startString="\""
        endString="\""
      #Array/Hashes/Objects 
      if(typeof obj == 'object')
        dumped_text += "\n"+level_padding + startString
        arr = obj
        count=0
        size =0
        for key, i of arr
          size++
        for key, item of arr
          count++
          value = arr[key]
          dumped_text += "#{level_padding}\"#{key}\":#{ELog.dumpObj(value,level+1)}"
          if(count!=size) then dumped_text+=",\n"
        dumped_text+="#{level_padding}#{endString}"
      else if (typeof obj != 'function')
        #//Stings/Chars/Numbers etc.
        tmpText = if (obj!=null) then obj else "null"
        if(obj.length==0 && startString.length==0 ) then tmpText = "null"
        if(startString=="\"") then tmpText=tmpText.replace(/\"/g, "\\\"")
        dumped_text += startString+tmpText+endString
    catch e
      alert(e)
    dumped_text

ELog.initialize()
