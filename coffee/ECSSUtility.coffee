###*
 * ECSSUtility
 *  
###

###!
 * AirInteraface
 * required library : 
 *   EObject.js, EDOMUtility
 *  
 * Revision History
 * Date        Version    CreatedBy    Description
 * ---------------------------------------------------
 * Apr 14 2014  0.0.1      Yuri Fukuda  Created
 * 
 * dynamically added css style
 * ---------------------------------------------
 * 
###

class @ECSSUtility extends EObject
  ### 
  display: flex;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: box;
	-webkit-box-align: stretch;
	-moz-box-align: stretch;
  box-align: stretch;
  justify-content: center; /*centers items on the line (the x-axis by default)*/
  align-items: center; /*centers items on the cross-axis (y by default)*/
  align-content:center; /* only multi align - default */
  ### 
  @hasSupport:null

  @normalizeCSS:()->
    @_normalizeFlex()

  @vSupport:(param)->
    if @hasSupport == null 
      @hasSupport = ( EDOMUtility.hasOwnProperty(window, "CSS")  &&   EDOMUtility.hasOwnProperty(window.CSS, "support")

    
  @_normalizeFlex:()->
    #res = {display:"flex"}
    #if( EDOMUtility.hasOwnProperty(window, "CSS")  &&   EDOMUtility.hasOwnProperty(window.CSS, "support")



