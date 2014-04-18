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

class @ECSSUtility
  @canUseFlex:false
  @CSS_FLEX_H:"e_h_flex_box"
  @CSS_FLEX_V:"e_v_flex_box"
  @CSS_CONTENT_ALIGN_CENTER:"e_flex_box_align_center" #cross access
  @CSS_CONTENT_ALIGN_TOP:"e_flex_box_align_top" #cross access
  @CSS_CONTENT_LOCATE_CENTER:"e_flex_box_locate_center" #locate aligned item

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
    vendorSpecificFlex = false
    if EDOMUtility.hasSupports
      @canUseFlex = window.CSS.supports("display","flex")
      vendorSpecificFlex = CSS.supports("display","#{EDOMUtility.vP}flex")
    if vendorSpecificFlex
      css += ".#{@CSS_FLEX_H},.#{@CSS_FLEX_V} { 
                display: #{EDOMUtility.vP}flex;
                }
              .#{@CSS_CONTENT_ALIGN_CENTER}{
                  #{EDOMUtility.vP}align-items:center;
                }
              .#{@CSS_FLEX_H}.#{@CSS_CONTENT_ALIGN_CENTER}{
                  #{EDOMUtility.vP}justify-content:center;
                }
              .#{@CSS_CONTENT_LOCATE_CENTER}{
                  #{EDOMUtility.vP}align-content:center;
                  #{EDOMUtility.vP}justify-content:center;
                }
              .#{@CSS_FLEX_H}{ #{EDOMUtility.vP}flex-direction: row }
              .#{@CSS_FLEX_V}{ #{EDOMUtility.vP}flex-direction: column }
             "
    else if @canUseFlex
      css += ".#{@CSS_FLEX_H},.#{@CSS_FLEX_V} { 
                display: flex;
                }
              .#{@CSS_CONTENT_ALIGN_CENTER}{
                  align-items:center;
                }
              .#{@CSS_FLEX_H}.#{@CSS_CONTENT_ALIGN_CENTER}{
                  justify-content:center;
                }
              .#{@CSS_CONTENT_LOCATE_CENTER}{
                  align-content:center;
                  justify-content:center;
                }
              .#{@CSS_FLEX_H}{ flex-direction: row }
              .#{@CSS_FLEX_V}{ flex-direction: column }
             "
    else if EDOMUtility.hasOwnProperty("#{EDOMUtility.vBrowserType}BoxFlex",document.createElement("div").style) #ignoring flexbox
      css += ".#{@CSS_FLEX_H},.#{@CSS_FLEX_V} { 
                display: #{EDOMUtility.vP}box;
               }
              .#{@CSS_CONTENT_ALIGN_CENTER}{
                #{EDOMUtility.vP}box-align:center;
                box-align:center;
               }
              .#{@CSS_FLEX_H}.#{@CSS_CONTENT_ALIGN_CENTER}{
                  #{EDOMUtility.vP}box-pack:center;
                  box-pack:center
                }
              .#{@CSS_CONTENT_LOCATE_CENTER}{
                flex-align-pack:center;
                #{EDOMUtility.vP}box-pack:center;
                box-pack:center;
                }
              .#{@CSS_FLEX_H}{ #{EDOMUtility.vP}box-orient: horizontal; box-orient:horizontal;} 
              .#{@CSS_FLEX_V}{ #{EDOMUtility.vP}box-orient: vertical; box-orient:vertical; }  
              "
    else
      #Internet Explorer 10
      css += ".#{@CSS_FLEX_H},.#{@CSS_FLEX_V} { 
                display: #{EDOMUtility.vP}box-flex;
                }
              .#{@CSS_CONTENT_ALIGN_CENTER}{
                #{EDOMUtility.vP}flex-pack: center;
                }
              .#{@CSS_FLEX_H}.#{@CSS_CONTENT_ALIGN_CENTER}{
                  #{EDOMUtility.vP}box-pack:center;
                  box-pack:center
                }
              .#{@CSS_CONTENT_LOCATE_CENTER}{
                flex-align-pack:center;
                #{EDOMUtility.vP}box-pack:center;
                box-pack:center;
                }
              .#{@CSS_FLEX_H}{ #{EDOMUtility.vP}flex-direction: row } 
              .#{@CSS_FLEX_V}{ #{EDOMUtility.vP}flex-direction: column }  
              "
    css
    
ECSSUtility.normalizeCSS()







