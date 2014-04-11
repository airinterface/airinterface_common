###
* EDOMUtilityTest
* this function tests EDOMUtilityTest  
* Revision History
* Date    Version    CreatedBy    Description
* ---------------------------------------------------
* Apr 16  0.0.1      Yuri Fukuda  Created
###

module('EDOMUtilityTest')
test('EDOMUtilityTest Test', () ->
  res=EDOMUtility.isPropertyCheckAvailable
  same(res,true)
)


