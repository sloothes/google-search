//  helpers.js

    var introPinBtn = $("#pinbtn")[0];
    var leftSidePinBtn = $("#left-side-pinbtn")[0];
    var rightSidePinBtn = $("#right-side-pinbtn")[0];

    if (!!rightSidePinBtn) {
        rightSidePinBtn.pinned = false;
        rightSidePinBtn.onclick = function(){ 
            this.pinned = !this.pinned; 
            this.classList.toggle( "pinned", this.pinned );
            this.parentElement.classList.toggle( "pinned", this.pinned );
        };
    }

    if (!!leftSidePinBtn) {
        leftSidePinBtn.pinned = false;
        leftSidePinBtn.onclick = function(){ 
            this.pinned = !this.pinned; 
            this.classList.toggle( "pinned", this.pinned );
            this.parentElement.classList.toggle( "pinned", this.pinned );
        };
    }

    if (!!introPinBtn) {
        rightSidePinBtn.pinned = false;
        introPinBtn.onclick = function(){ 
            rightSidePinBtn.pinned = !rightSidePinBtn.pinned; 
            rightSidePinBtn.classList.toggle( "pinned", rightSidePinBtn.pinned );
            rightSidePinBtn.parentElement.classList.toggle( "pinned", rightSidePinBtn.pinned );
        };
    }

    function focusDomElement(domId){ 
        document.getElementById(domId).focus(); 
    }

    function crosshairCursor(domId) { 
        document.getElementById(domId).style.cursor = "crosshair"; 
    }

    function removeTabindex(){
        var HtmlCollection = document.all;
        for (var i=0; i < HtmlCollection.length; i++) {
            HtmlCollection[i].tabindex = -1;
        }
    }

    function setDisplayToNone( domId ){ 
        document.getElementById(domId).style.display = "none"; 
    }

    function hidePanel( domId ){
        document.getElementById(domId).style.display = "none";
    }

    function showPanel( domId ){
        document.getElementById(domId).style.display = "";
    }

    function serialNumber(){
        //  Time from "Sun Jul 31 2016 23:20:00 GMT+0200 
        //    (GTB Standard Time)" in milliseconds.   //
        return Date.now() - 1470000000000;
    }

    function getNodeListAsArray(element, selector){
        if ( !element ) return undefined;
        return Array.prototype.slice.call(element.querySelectorAll(selector));
    }

    function resultsCapacity(){
        googleCapacity = Number(capacityinput.value);
        debugMode && console.log("googleCapacity:", googleCapacity);
    }
