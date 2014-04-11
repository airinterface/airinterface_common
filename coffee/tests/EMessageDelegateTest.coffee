# EMessageDelegaTest

module('EMessageDelegaTest')
test('EMessageDelegaTest Test', () ->
  msgdata=""
  evtName="testEvent"

  obj = new EObject()
  obj2 = new EObject()
  elm = jQuery("<div></div>").appendTo("body")
  elm2 = jQuery("<div></div>").appendTo("body")
  obj.div = elm
  obj2.div = elm2
  es.eMessageDelegate.supportMessage(obj)
  es.eMessageDelegate.supportMessage(obj2)
  emsg = new EMessage(evtName,evtName) 
  obj.registerMsg(emsg,(msg)->
    msgdata+=msg.eventName
  )
  obj2.registerMsg(emsg,(msg)->
    msgdata+=msg.eventName
  )
  same(msgdata,"")
  es.eMessageDelegate.sendMsg(emsg)
  same(msgdata,"#{evtName}#{evtName}")
  jQuery(elm).remove()
  jQuery(elm2).remove()
)

module('EBridgeMessage')
test('EBridgeMessage Test', () ->
  msg = new es.actionMessage({actions:[{test:"test",test2:"test2"}]})
  ret = msg.serializeRequestData()
  same(true,ret.indexOf("actions%22")>0)
  msg = new es.appEventMessage({actions:[{test:"test",test2:"test2"}]})
  ret = msg.serializeRequestData()
  same(true,ret.indexOf("actions%22")>0)
)


