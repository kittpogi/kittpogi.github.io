<!--
      /* 
         DHTML Library Version .91
         Last Updated: October 12, 1997
         Copyright 1997 by Scott Isaacs

         This file cannot be redistributed or sold as part of any package without 
         explicit consent from Scott Isaacs - scott@insideDHTML.com
 
         For more information on this library, see http://www.insideDHTML.com

         This library is provided AS IS WITHOUT WARRANTY OF ANY KIND AND ARE PROVIDED 
         WITHOUT ANY IMPLIED WARRANTY OF FITNESS FOR PURPOSE, MERCHANTABILITY, 
         OR NON-INFRINGEMENT. 

         Due to the variable nature of the different Internet Client Object Models there are
         no guarantees this library will work AS IS in future releases of any browser.

         Unless prior arrangements are made with scotti@insideDHTML.com, this file must be
         referenced as an external script by your web-pages. See the instructions for more 
         details.
         
      */
  
      /* Registering 

         This library can be used on your web-site as long as you comply with the following requirements:
            1) The copyright notice and disclaimer must be maintained in the library file.
            2) You register your URL (or company with email address if non-public URL such as an intranet) 
               to DHTMLLibrary@insideDHTML.com. Please state if you DO NOT want your web-site or company
               listed as using this library (Your e-mail addresses will never be given out).
              

         Optional registration costs a minimum $50. Registered users get the following benefits:
           1) Advanced notice of updates 
           2) At your request, a listing on the "registered supporter" page on www.insideDHTML.com.
           3) The dhtmlPlus Library. An advanced library that adds swipe effects and greatly simplifies moving elements.
         

         Registrations can be sent to:
           Scott Isaacs
           PO Box 1652
           Issaquah, WA 98027 
 
         Questions should be send to scotti@insideDHTML.com.
         See http://www.insideDHTML.com for more information.
  
         This comment must be maintained in the document unless prior arrangements are made 
         with scotti@insideDHTML.com.
      */

      
      // Begin Library
      var sys = navigator.appName;
      var vers = navigator.appVersion.substring(0,1);

      /* The set functions abstract the different object models for assignments */

      function setColor(el, color) {
        // Change the background color of a positioned element.
        if (null==el.style) return;
        if ("Netscape"==sys) el.NSLayer.bgColor = color 
        el.style.backgroundColor = color
      }

      function setZIndex(el, zindex) {
        // Change the zindex of a positioned element.
        if (null==el.style) return;
        if ("Netscape"==sys) el.NSLayer.zIndex = zindex
        el.style.zIndex = zindex
      }


      function setVisibility(el, val) {
        // Change the visibility of a positioned element.
        if (null==el.style) return;
        el.style.visibility = val;
        if ("Netscape"==sys)        
        switch (val) {
          case "hidden":
            el.NSLayer.visibility = "hide";
            break;
          case "visible":
            el.NSLayer.visibility = "show";
            break; 
          case "inherit":
            el.NSLayer.visibility = "inherit";
            break;
          default:
            el.NSLayer.visibility = "";
        }
      }

      function doRefresh() {
        if ("Netscape"==sys) {
          document.body.scrollLeft  = window.pageXOffset
          document.body.scrollTop = window.pageYOffset
        }
      }

      function setPosition(el) {
        // Move a positioned element.
        if (null==el.style) return;
        if ("Netscape"==sys) {
          if (null!=arguments[1])
            el.NSLayer.top = parseInt(arguments[1])
          if (null!=arguments[2])
            el.NSLayer.left = parseInt(arguments[2])
          el.offsetTop = el.NSLayer.top
          el.offsetLeft = el.NSLayer.left
        }
        if (null!=arguments[1])
          el.style.pixelTop = arguments[1]
        if (null!=arguments[2])
          el.style.pixelLeft = arguments[2]
      }

      function setContent(el, content) {
        // Replace the content of a positioned element
        if (null==el.style) return;
        if ("Netscape"==sys) {
          el.NSLayer.document.open()
          el.NSLayer.document.write(content)
          el.NSLayer.document.close()
        } else
          el.innerHTML=content
      }



/* BEGIN CORE CODE TO BUILD OBJECT MODEL */


      function _extract(obj) {
        /* This creates the all collection when run in Netscape and
           promotes the nested name spaces in Netscape to the top-level collection.
           The length property is not updated for the built-in collections */
        // This function is called recursively for nested layers 
        for (var intLayer = 0; intLayer< obj.layers.length; intLayer++) {
          var el = obj.layers[intLayer] 
          el.document._type = "document" // internal variable to track state
          // Hookup event handlers to establish event bubbling. 
          el.document.captureEvents(Event.MOUSEDOWN | Event.MOUSEUP | Event.MOUSEMOVE | Event.KEYDOWN | Event.KEYPRESS | Event.KEYUP)
          el.document.onmousedown = _NSLayerBubbling;          
          el.document.onmouseup = _NSLayerBubbling;
          el.document.onmousemove = _NSLayerBubbling;
          el.document.onkeydown = _NSLayerBubbling;
          el.document.onkeypress = _NSLayerBubbling;
          el.document.onkeyup = _NSLayerBubbling;
          document.all[el.id] = new Object
          var newEl = document.all[el.id]
          el.document.parentElement = newEl
          for (var intLoop = 0; intLoop< el.document.images.length; intLoop++) {
              el.document.images[intLoop].offsetParent = newEl
              if (null!=el.document.images[intLoop].name) {
                var i = el.document.images[intLoop]
                document.images[i.name] = new Object();
                document.all[i.name] = new Object()
                document.images[el.document.images[intLoop].name] = el.document.images[intLoop]
                document.all[el.document.images[intLoop].name] = el.document.images[intLoop]
              }
          }
          for (var intLoop = 0; intLoop< el.document.anchors.length; intLoop++) {
            if (null!=el.document.anchors[intLoop].name) {
              document.anchors[el.document.anchors[intLoop].name] = el.document.anchors[intLoop]
            }
            el.document.anchors[intLoop].offsetParent = newEl
          }
          for (var intLoop = 0; intLoop< el.document.links.length; intLoop++)
            el.document.links[intLoop].offsetParent = newEl
          for (var intLoop = 0; intLoop< el.document.forms.length; intLoop++) {
            el.document.forms[intLoop].offsetParent = newEl
            if (null!=el.document.forms[intLoop].name) {
              document.forms[el.document.forms[intLoop].name] = el.document.forms[intLoop]
            }
            for (var intElements = 0; intElements < el.document.forms[intLoop].length; intElements++)
              el.document.forms[intLoop][intElements].offsetParent = newEl
          }
          el.owningElement = newEl
          newEl.id = el.id
          newEl.style = new Object
          newEl.offsetTop = parseInt(el.top)
          newEl.offsetLeft = parseInt(el.left) 
          el._type = "layer" // internal variable
          if (el.parentLayer.owningElement!=null)
            newEl.offsetParent = el.parentLayer.owningElement
          else
            newEl.offsetParent = document.body
          newEl.style.pixelTop = parseInt(el.top)
          newEl.style.pixelLeft = parseInt(el.left)
          if (null!=el.clip) {
            newEl.style.pixelWidth = el.clip.width   // estimation
            newEl.style.pixelHeight = el.clip.height
          }
          newEl.offsetWidth = newEl.style.pixelWidth  // estimation
          newEl.offsetHeight = newEl.style.pixelHeight
          switch (el.visibility) {
            case "hide":
              newEl.style.visibility = "hidden";
              break;
            case "show":
              newEl.style.visibility = "visible";
              break; 
            case "inherit":
              newEl.style.visibility = "inherit";
              break;
            default:
              newEl.style.visibility = "";
          }
          newEl.style.zIndex = el.zIndex
          newEl.style.backgroundColor = el.bgColor;
          newEl.style.backgroundImage = "url("+el.background+")";
          newEl.NSLayer = el  // internal reference back to Netscape's OM
          if (0<el.layers.length) _extract(el)  // Nested layers, go get them.
        }
      }

    function fixResize() {
      document.body.clientWidth = window.innerWidth; 
      document.body.clientHeight = window.innerHeight;
      if (null!=document.body.onresize)
        document.body.onresize; 
    }

    function _NSLayerBubbling(ev) {
      // Bubble through any positioned elements.
      this.routeEvent(ev);
      // Fire on positioned element
      if (!window.event.cancelBubble)
        if (null!=this.parentElement["on"+ev.type]) this.parentElement["on"+ev.type]()
    }

    function _NSBubbling(ev) {
      // This simulates very simple event bubbling in Netscape
      // Create the event object on the window.
      window.event = ev;
      // Initialize properties on the event object
      window.event.cancelBubble = false;
      window.event.button = ev.which 
      window.event.keyCode = ev.which
      window.event.type = ev.type
      // Get the "synthesized" element if it fired the event.
      var el = null;
      if ("document"==ev.target._type) 
        el = ev.target.parentElement.id
      else
        el = ev.target.id

      if ((el!=null) && (el!="")) {
        el = document.all[el]
        window.event.srcElement = el
      }
      else {
        if (ev.target!=null) {
          window.event.srcElement=ev.target
        }
        else
           ev.target=null
      }

      window.event.returnValue = true
      window.event.clientX = ev.pageX - window.pageXOffset
      window.event.clientY = ev.pageY - window.pageYOffset
      window.event.offsetX = ev.layerX
      window.event.offsetY = ev.layerY
      window.event.screenX = ev.screenX
      window.event.screenY = ev.screenY
      window.event.altKey = ev.modifiers & Event.ALT_MASK
      window.event.ctrlKey = ev.modifiers & Event.CONTROL_MASK
      window.event.shiftKey = ev.modifiers & Event.SHIFT_MASK
      window.event.NSEvent = ev;

      if ((ev.target._type=="layer") && ((ev.type=="mouseover") || (ev.type=="mouseout")))  {
        // Special handling to bubble over and out events on layers
        var elLoop = ev.target.document.parentElement
        while (elLoop!=null) {
          if (!window.event.cancelBubble)
            if (elLoop["on"+ev.type]!=null) elLoop["on"+ev.type]()
          elLoop = elLoop.offsetParent;
        }
      }
      // Send this event onward...

      window.routeEvent(ev);

      // Bubble but do not fire document events twice
      if ((ev.target!=window.document) && (!window.event.cancelBubble))
        if (null!=document["on"+ev.type]) document["on"+ev.type]()
      return window.event.returnValue
    }

    function _setupBubbling() {
      // Setup event bubbling from the source ot the document.
      window.captureEvents(Event.CLICK | Event.MOUSEMOVE | Event.CLICK | Event.DBLCLICK | Event.MOUSEDOWN | Event.MOUSEUP | Event.MOUSEOUT | Event.MOUSEOVER | Event.KEYDOWN | Event.KEYUP | Event.KEYPRESS | Event.FOCUS | Event.BLUR)
      window.onclick = _NSBubbling;
      window.ondblclick = _NSBubbling;
      window.onmousemove = _NSBubbling;
      window.onmouseover = _NSBubbling;
      window.onmouseout = _NSBubbling;
      window.onmousedown = _NSBubbling; 
      window.onmouseup = _NSBubbling;
      window.onkeydown = _NSBubbling;
      window.onkeypress = _NSBubbling;
      window.onkeyup = _NSBubbling;
      window.onfocus = _NSBubbling;
      window.onblur = _NSBubbling;
      window.onresize=fixResize;
    }

    /* The setup() function - This must be called in the onload event of the document */
    function setup() {  
        if (4>vers) return;  // Can't help old browsers
        if ("Netscape"==sys) {
          document.all = null;
          document.all = new Array;
          _extract(document);
          document.body = new Object;
          document.body.clientWidth = window.innerWidth; document.body.clientHeight = window.innerHeight
          document.body.scrollTop = window.pageXOffset; document.body.scrollLeft = window.pageYOffset
          _setupBubbling();
       }               
    }
     
    window.onload = setup; // Initialize when loaded

// DHTMLLib.js Copyright 1997 by Scott Isaacs
// http://www.insideDHTML.com
// -->