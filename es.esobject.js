/* this is used as common object to be exteded to 
   application object */
   

ESObject = function(_name,option){
  this.init(_name,option);
};
	
$.extend(ESObject.prototype, {
   // object variables
   compName: '',
   debugFlag: true,
   blockTemplate:{},
   blockMatcher:/{{\s*(\w+)\s*}}/,
   widgetScrollable: false, /* Common option */
   webAppCapable:false,
   blockOption:null, /* Specific option */
   init: function(widget_name, option) {
     // do initialization here
     this.compName = widget_name;
	 /** scrolling content **/
	 if(option!=null){
		if(option.widgetScrollable!=null){
			 this.widgetScrollable = option.widgetScrollable;
			 this.log("Scrollable Setting from Option");
		}
		if(option.webAppCapable!=null){
			 this.webAppCapable = option.webAppCapable;
			 this.log("Setting as WebApp");
		}
		if(option.blockOption!=null){
			this.blockOption=option.blockOption;
		}
	 }
	 if(this.widgetScrollable==false){
		 this.log("Making it none scrollable");
		 document.ontouchmove = function(e) { 
			   e.preventDefault(); return false; 
		 };
	 }
	 if(this.webAppCapable==true){
		this.log("Making it as WebApp");
		scrollTo(0, 1); 
	  }
	 document.documentElement.style.webkitTouchCallout = "none";
	 
	 if (("standalone" in window.navigator) && !window.navigator.standalone ){
		 this.log("this is standalone mode");
	 }else{
		 this.log("this is not stand alone mode");
	 }
   	},
   log: function(msg) {
     // an example object method
	if(this.debugFlag){
		console.log("["+this.compName + "]"+msg);
	}
   },
   	/* this function will replace the template with the actual data
	   pattern surrounded by [[ and ]] will be replaced with the data in the obj
	   @param template template String
	   @param obj pobject
	*/
   replaceTemplate:function(template,obj){
	  var matcherkey;
	  var tmpStr=template;
	  if(tmpStr!=null){
	   while(matchedKey=this.blockMatcher.exec(tmpStr)){
		tmpStr=tmpStr.replace(this.blockMatcher,obj[matchedKey[1]]);
		 this.log("replacing with "+obj[matchedKey[1]]);
		}
	  }
      return tmpStr;
	},
	/* this function will parse 
	*/
	
   isNumeric : function(num)
	{
	   return num!=null && (num - 0) == num && num.length > 0;
	},
	
	/*
	*
	* Convert a number to the format xxx,xxx,xxx.xxxx
	* Accepts integers, floating point or string
	*
	* Does not accept exponential notation, etc.
	*
	* n – the number to be formatted
	*/
	thousandSeparator: function(num) {
		
      var sep=",";
	  var decpoint = ".";
      if(num==null) return num;
	  // need a string for operations
	  num = num.toString();
	  // separate the whole number and the fraction if possible
	  var a = num.split(decpoint);
	  var x = a[0]; // decimal
	  var y = a[1]; // fraction
	  var z = "";
	
	
	  if (typeof(x) != "undefined") {
		var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');
		while(sRegExp.test(x)) {
			x = x.replace(sRegExp, '$1'+sep+'$2');
		}
	  }

	  if (typeof(y) != "undefined" && y.length > 0)
		  x += decpoint + y;
	
	  return x;
	  
	},
	/*
	* this function checks if it's singular or plural and picks the 
	* right words. 
	* param1 number : number used to check
	* singularWords String : string that are used for singular words
	* pluralWords String : string that are used for singular words 
	*/
    supportPlural: function(number,singularWords,pluralWords){
	  if(number==null||number <=1){
		 return singularWords;
	  }
	  return pluralWords;
    },
    loadData: function(reqURL, rootTag,fieldSelector, resultStatusSelector, resultContentSelector){
		$.ajax({
			url: reqURL,
			type: 'GET',
			dataType: 'xml',
			timeout: 1000,
			error: function(e){
				$('<li></li>').html(e.statusText+"<br />"+e.responseText).appendTo(resultStatusSelector);
			},
			success: function(xml,textStatus,  res){
					$('<li></li>').html(textStatus).appendTo(resultStatusSelector);
				    $(xml).find(rootTag).each(function(){
        			var item_text = $(this).find(fieldSelector).text();
					$('<li></li>').html(item_text).appendTo(resultContentSelector);

					});
				}
			}
		);	
    },
    dumpObj:function(obj, level){
      try{
      var dumped_text = "";
	  if(level==null || typeof level == 'undefined') var level = 0;
	  //The padding given at the beginning of the line.
	  var level_padding = "";
	  for(var j=1;j<level+1;j++) level_padding += "    ";	
      var startString="";
      var endString="";
      isArray = (obj!=null && (typeof(obj) == 'object') &&  (obj.constructor == Array));
      isHash  = (obj!=null && (typeof(obj) == 'object') &&  (obj.constructor != Array));
      isString =(typeof(obj) == 'string');
      if(isArray){
        startString="[\n";
        endString="]\n";
      }
      if(isHash){
        startString="{\n";
        endString="}\n";
      }
      if(isString){
        startString="\"";
        endString="\"";
      }
	  if(typeof(obj) == 'object') { //Array/Hashes/Objects 
          dumped_text += "\n"+level_padding + startString;
          var arr = obj;
          var count=0;
          var size = 0;
          for(var item in arr) size++;
	      for(var item in arr) {
            count++;
            var value = arr[item];
			dumped_text += level_padding +"\"" +item +"\"" + ":" + this.dumpObj(value,level+1);
		    if(count!=size) dumped_text += ",\n";
          }
          dumped_text += "\n"+level_padding + endString;
	  }else{//Stings/Chars/Numbers etc.
        tmpText = (obj!=null)?obj:"null";
        if(obj.length==0 && startString.length==0 ) tmpText = "null";
        if(startString=="\"") tmpText=tmpText.replace(/\"/g, "\\\"");
        dumped_text += startString+tmpText+endString;
	  }
	  return dumped_text;
      }catch(e){
        alert(e);
      }

    }
    
	
});



