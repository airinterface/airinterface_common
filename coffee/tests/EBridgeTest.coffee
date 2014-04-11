module('EBridgeTest')

test('EBridge Test', () ->
   window.ebridgeMessage=""
   msg = new EActionMessage({actions:[{test:"test",test2:"test2"}]})
   window.onbeforeunload = ((event)->
     window.ebridgeMessage="unloaded" 
     same( window.ebridgeMessage, "unloaded")
     delete window.ebridgeMessage
     window.onbeforeunload=""
     start()
     false
     )
   same( window.ebridgeMessage, "")
   stop()
   es.bridge.sendScript(msg)
)
