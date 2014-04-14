###
* ECSSUtilityTest
* this function tests ECSSUtilityTest  
* Revision History
* Date    Version    CreatedBy    Description
* ---------------------------------------------------
* Apr 16  0.0.1      Yuri Fukuda  Created
###

module('ECSSUtilityTest')
test('EUtil Test', () ->
  equal(ECSSUtility.canUseFlex,true, "if it's false, then it must be you can't use the flex as css") 
  equal(ECSSUtility._normalizeFlex().indexOf("es_h_flex_box") > 0 ,true, "adding es_h_flex_box styling" ) 
)


