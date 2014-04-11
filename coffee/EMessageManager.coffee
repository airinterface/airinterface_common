###
 * #EMessageManager
 * This function supports queueing events and synchronizing it. 
 * each request each set of request is queued.
 * assumption
 * this will be static function keeping track of all the request
 * per instance of EObject. 
 * This guarantees that any type of message could be streamlined
 * and call back is getting called when all the request is done. 
 * 
###

###!
 * Revision History
 * Date    Version    CreatedBy    Description
 * ---------------------------------------------------
 * Feb 14  0.0.1      Yuri Fukuda  Created
###
class @EMessageManager extends EObject
  #private
  constructor:()->
    
   
class @EQueueMessageItem extends EObject


class @EQueueConnectorObj extends EObject
  


