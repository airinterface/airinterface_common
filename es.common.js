/*
    es.common.js
    EachScape
    
     Copyright 2011 EachScape. All rights reserved.

    
    Description:
    This file will have following
    1. keep common function aside from the block objects. 
    2. Create es namespace
    
    Revision History
    Date    Version    CreatedBy    Description
    ---------------------------------------------------
    Feb 14  0.0.1      Yuri Fukuda  Created
*/

var namespace = function(name){
  var ns, _ref;
  ns = (_ref = window[name]) != null ? _ref : window[name] =new ESObject();
  return ns;
};

var es = ( window["es"]!=null)?window["es"]:{};

