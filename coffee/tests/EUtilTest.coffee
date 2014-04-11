###
* EUtilTest
* this function tests EUtil  
* Revision History
* Date    Version    CreatedBy    Description
* ---------------------------------------------------
* Apr 16  0.0.1      Yuri Fukuda  Created
###

module('EUtil')
test('EUtil Test', () ->
  ret = EUtil.toCammelCase("TestThis")
  same(ret,"testThis")
)
test('EUtil Namespace', () ->
  ret = window[EObject.esNameSpace]!=null
  same(ret,true,"Orignail #{EObject.esNameSpace} namespace")
  ret = window[EObject.esNameSpace].eutil !=null
  same(ret,true,"component #{EObject.esNameSpace}.eutil namespace")
)


