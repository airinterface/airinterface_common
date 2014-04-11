###*
 * #EMesageDelegate
 * this supports messaging inter components among ESObjects
 * for now all the listnable element is assumed to have @div variable
 * required library : 
 *   EObject.js
###

###!
 *  
 * Revision History
 * Date    Version    CreatedBy    Description
 * ---------------------------------------------------
 * Feb 14  0.0.1      Yuri Fukuda  Created
###
class EMessageDelegate extends EObject
  # Public
  @sendMsg:(msg)->
    jQuery(".#{msg.eventClsName}").trigger(msg.eventName,msg)
    ELog.info(ELog.dumpObj(msg)) 
  
  registerMsg:(msg, callback)->
    if(msg)
      @div.addClass(msg.eventClsName)
      @div.bind(msg.eventName, ((event, msg)=>
           callback(msg)
           ))
  unregisterMsg:(msg)->
    if(msg)
      @div.removeClass(msg.eventClsName)
      @div.unbind(msg.eventName)


  
  
  # this function will copy message delegate function into the 
  # component class that they have div object. 
  @supportMessage:(obj,div)-> 
    msgDelegate = new EMessageDelegate(if(div?) then div else obj.div)
    jQuery.extend(obj,msgDelegate,true) 
  
  #private
  constructor:(@div)->
EUtil.namespace("eMessageDelegate", window.es, EMessageDelegate )

   


class @EMessage extends EObject
  
  #Public
  eventName:null
  eventClsName:""
  constructor: (@eventName, @eventClsName) ->


# ---- communication between client - eb ---------------#
###*
* EBridgeMessage
* This is a element that generate conformed format between
* Embedded Block js and the Client. This is a private class
* which will be extended by child communication specific class.  
* @api private
###
class @EBridgeMessage extends EMessage
  
  #Public
  eventName:null
  eventClsName:""
  constructor: (data, vars)->
    super(@toString(), EUtil.toCammelCase(@toString()))
    @setData(data)
    @setVars(vars)
    

  generateRequestID:()->
    @setRequestID((new Date()).getTime())
    @getRequestID().toString()
  ###
  * serializeRequestData
  * this function will encapsulate the data that are passing
  * and conform the format that are translated to the client side.
  ###
  serializeRequestData:()->
    data= @getData()
    vars=""
    if(!data) 
      data = "" 
    else 
      data = "&argument=#{JSON.stringify(data)}" 
    vars = @getVarQuery()
    data += "&#{vars}" if vars.length > 0
    encodeURI(data)

  #Private
  getVarQuery:()->
    vars = @getVars()
    tmpString=""
    if(vars)
      tmpString=""
      tmpString += "#{key}=#{value}" for key,value of vars
    tmpString
   
EBridgeMessage.prop("triggerName", null)
EBridgeMessage.prop("methodName", null)
EBridgeMessage.prop("requestID", null)
EBridgeMessage.prop("data", null)
EBridgeMessage.prop("vars", null)

###*
* #es.actionMessage
* Used as a communication object that are used by es.bridge to 
* that handles data. It can encode / decode the data that are 
* passed around client and embedded block
*  
* ##Example:
* ` 
* data = {
*   actions:[
*     {"action":"alert","condition":"","prompt":"tap","when_value_1":"","when_value_2":""},
*     {"container":"8666","action":"container_set_block","condition":"","block":"8672","when_value_1":"","when_value_2":""}
*   ]
*   } 
* messsage  = new es.actionMessage(data)
* es.bridge.sendScript(message)`
* 
###
class @EActionMessage extends EBridgeMessage
  constructor: (@data)->
    super(@data,null)
    @setTriggerName("jc-call")
    @setMethodName("runScriptActions")
EUtil.namespace("actionMessage", window[EObject.esNameSpace], EActionMessage)

###*
* ##es.EAppEventMessage
* Used as a communication object that are used by es.bridge to 
* that handles data. It can encode / decode the data that are 
* passed around client and embedded block
*  
* Example:
* `
* vars = 
*  {
*  "var1":"var1value",
*  "var2":"var2value",
*  "var3":"var3value"
*  ]
* messsage  = new es.appEventMessage(eventType,vars)
* es.bridge.sendScript(message)
* `
* 
* @param {String} eventType type of event that are available in the block
* @param {Array}  vars list of variables. 
*
###
class @EAppEventMessage extends EBridgeMessage
  constructor: (eventType,vars)->
    super(null,vars)
    @setTriggerName("event")
    @setMethodName(eventType)
    @setVars(vars)
EUtil.namespace("appEventMessage", window[EObject.esNameSpace], EAppEventMessage)

###*
* #es.appScriptMessage
* Used as a communication object that are used by es.bridge to 
* that handles data. It can encode / decode the data that are 
* passed around client and embedded block
*  
* ##Example:
* `
* scriptName = "myCustomScrpt";
* vars = 
*  {
*  "var1":"var1value",
*  "var2":"var2value",
*  "var3":"var3value"
*  ]
* messsage  = new es.appScriptMessage(scriptName,vars)
* es.bridge.sendScript(message)
* ` 
* 
* @param {String} scriptName name of script that are available in the block
* @param {Array}  vars list of variables. 
*
###
class @EAppScriptMessage extends EBridgeMessage
  constructor: (scriptName,vars)->
    super(null,vars)
    @setTriggerName("script")
    @setMethodName(scriptName)
EUtil.namespace("appScriptMessage", window[EObject.esNameSpace], EAppScriptMessage)

