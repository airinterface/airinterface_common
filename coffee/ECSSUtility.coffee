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
  @canUseFlex:false
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
  justify-content: center; /*centers items on the line (the x-axis by default)
  align-items: center; /*centers items on the cross-axis (y by default)
  align-content:center; /* only multi align - default 
  ### 

  @normalizeCSS:()->
    css = ""
    css += @_normalizeFlex()
    @addCSS(css)

  @addCSS:(css)->
    document.write("<style>#{css}</style>")
    ###
    e = document.createElement('style')
    e.type = 'text/css'
    if e.styleSheet
      e.styleSheet.cssText = css
    else
      e.appendChild(document.createTextNode(css))
    head.appendChild(e)
    ###
    
  @_normalizeFlex:()->
    #reference: http://stackoverflow.com/questions/16280040/css3-flexbox-display-box-vs-flexbox-vs-flex
    css = ""
    if EDOMUtility.hasSupports
      @canUseFlex = window.CSS.supports("display","flex")
    if @canUseFlex
      css += ".es_h_flex_box,.es_v_flex_box { display: flex;}
              .es_h_flex_box{ flex-direction: row }
              .es_v_flex_box{ flex-direction: column }
             "
    else if EDOMUtility.hasOwnProperty("#{EDOMUtility.vBrowserType}BoxFlex",document.createElement("div").style) #ignoring flexbox
      css += ".es_h_flex_box,.es_v_flex_box { display: #{EDOMUtility.vP}box;}
              .es_h_flex_box{ #{EDOMUtility.vP}box-orient: horizontal; box-orient:horizontal;} 
              .es_v_flex_box{ #{EDOMUtility.vP}box-orient: vertical; box-orient:vertical; }  
              "
    else
      #Internet Explorer 10
      css += ".es_h_flex_box,.es_v_flex_box { display: #{EDOMUtility.vP}box-flex;}
              .es_h_flex_box{ #{EDOMUtility.vP}flex-direction: row } 
              .es_v_flex_box{ #{EDOMUtility.vP}flex-direction: column }  
              "
    css
    
ECSSUtility.normalizeCSS()



