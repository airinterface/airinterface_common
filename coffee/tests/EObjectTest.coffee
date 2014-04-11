module('EObjectTest')

test('Object Test', () ->
  obj = new EObject()
  obj.set("test", "test1")
  res = obj.get("test")  
  same(res,null)
  obj.test=""
  obj.set("test", "test1")
  res = obj.get("test")  
  same(res,"test1")
  obj.setName("test")
  res= obj.getName()
  same(res,"test")
)
test('Object Logging Test', () ->
  obj = new EObject()
  oldConsole = window.console
  window.console={}
  window.console.log=(msg)->
    window.messagedata=msg
  window.messagedata=""
  same(window.messagedata,"")
  obj.log("[EObject] test3")
  same(window.messagedata,"")
  obj.debugFlag=true
  obj.log("test3")
  same(window.messagedata,"[EObject] test3")
  obj.debugFlag=false
  obj.log("test4")
  same(window.messagedata,"[EObject] test3")
  window.debugFlag=true
  obj.log("test4")
  same(window.messagedata,"[Global] test4")
  messagedata=oldConsole
  delete window.messagedata
)
