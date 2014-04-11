###
* ELogTest
* this function tests ELog
* Revision History
* Date    Version    CreatedBy    Description
* ---------------------------------------------------
* Apr 16  0.0.1      Yuri Fukuda  Created
* @api private
###

module('ELog')
test('ELog Test', () ->
  obj = new Object("obj1")
  ELog.info(obj,"test")
)


