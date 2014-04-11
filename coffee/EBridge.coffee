###
 * #es.ESBridge
 * 
 * this module supports sending communication between client - javascript
 * this will do followings.  
 * If you expect some callback, it will be better to use the MesssageManager, 
 * However, even that is the case, under neath, this component is used. 
 * 
 *  * embed hidden trigger click. 
 *  * Call client with message. 
 *  * Receive message from client  
 *  * synchronize response and execute call back function with caller.
 *  
 * ##Example: 
 * `es.ESBridge.call(argument, callback) 
 * es.ESBridge.register(event)`
 * This is a private call and for the public, each composed action has
 * unique function call. 
 * 
 * @api private
 *  
 *   
### 

###!
 * EachScape Copyright 2012 EachScape. All rights reserved.
 * required library : 
 *   EObject.js, 
 *  
 * Revision History
 * Date    Version    CreatedBy    Description
 * ---------------------------------------------------
 * Feb 14  0.0.1      Yuri Fukuda  Created
###

class @EBridge extends EObject

  @initialize:()->
    @setupTrigger()
    EUtil.namespace("bridge", window[EObject.esNameSpace], this)
    EMessageDelegate.supportMessage(this)

   
  @setupTrigger:()->
    EBridge.div=jQuery("<div id=\"#{EBridge.triggerID}\" style=\"position:absolute;left:-100px;top:-100px;width:0px;height:0px;\"></div>").append("body")
    windows.scriptDone=es.im.cScriptDone

  @cScriptDone:( responseId )->
    jQuery("body").prepend("#{responseId} this is to be deleted")

  ###
  * es.bridge.sendScript
  * this function will take message object and passes to client. 
  * current message available is documented in the descendent of the
  * EBridgeMessage. 
  *
  * Example:
  * <code>
  * data = {
  *   actions:[
  *     {"action":"alert","condition":"","prompt":"tap","when_value_1":"","when_value_2":""},
  *     {"container":"8666","action":"container_set_block","condition":"","block":"8672","when_value_1":"","when_value_2":""}
  *   ]
  *   } 
  * messsage  = new es.actionMessage(data)
  * es.bridge.sendScript(message)
  * </code>
  *
  * @param {EBridgeMessage} data data should be descendent of EBridgeMessage
  * @api public
  ###
  @sendScript:(msg)->
    tmpString="#{msg.getTriggerName()}:#{msg.getMethodName()}?requestID=#{msg.generateRequestID()}#{msg.serializeRequestData()}"
    ELog.log(toString(),tmpString)
    window.location.href=tmpString
  
  #Private
  @triggerID:"bridgeTrigger"
  @div:null
