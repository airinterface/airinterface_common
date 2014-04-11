###
* EUtil
* this function supplies set of utility functionality
* EachScape Copyright 2011 EachScape. All rights reserved.
* Description:
* This component handle all the embeded block common operation.
* 1. initialize communication.
* 2. Initialize scroll feature.
*  
* required library : 
*   EObject.js, nagare.js, iscroll.js
*  
* Revision History
* Date    Version    CreatedBy    Description
* ---------------------------------------------------
* Apr 16  0.0.1      Yuri Fukuda  Created
###


class @EUtil 
  # Public
  ###
  * toCammelCase(message)
  * this returns cammel case of the string
  *
  * Examples
  * ESUtil.toCamelCase(InnerWidth)
  * will return "innerWidth" 
  * 
  * @param {String} string to apply cammel case
  * @return {String} escaped html
  * @api public
  ###
  @toCammelCase:(origString)->
    res=null
    if(origString?.length > 0)
      res="#{origString[0].toLowerCase()}#{origString[1...]}"
    res


  ###    
  * namespace
  * Description:
  * This file will have following
  * 1. keep common function aside from the block objects. 
  * 2. Create es namespace
  * 
  * Example:
  * ESUtil.namespace("es.im") will result generating the object
  * window.es.im
  * 
  * @param {String} namespace if there is any level to the namespace, 
  *   it will be separeated by "." 
  * @param {object} parent object which create namespace to
  * @param {object} object that will be assigned to the name space
  * @return {String} escaped html
  * @api public
  * 
  ###
  @namespace = (name,parent,assignedObject)->
    res= null
    _parent=parent
    if(parent==null)
      _parent=window
    if(name.length>0 &&  typeof name == 'string') 
      names=name.split(".")
      ns = null 
      if (EDOMUtility.hasOwnProperty(names[0],_parent)) 
        ns = _parent[names[0]] 
      else if( names.length ==  1 )
        _parent[names[0]]= if(assignedObject==null) then {} else assignedObject 
      else if(names.length > 1)
        _parent[names[0]] = {}
        EUtil.namespace(names[1...].join("."),_parent[names[0]])
    else 
      null

EUtil.namespace("#{EObject.esNameSpace}.eutil", null, EUtil)
EUtil.namespace("#{EObject.esNameSpace}.eDOMUtility", null, EDOMUtility)

    

