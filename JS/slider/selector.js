function get(selectors, obj) {
    if (arguments.length <= 2 && typeof selectors == 'string') {
        var lastElements = [obj || document],   
            selectorArray = [],
            currentSelector,
            tempElements,
            currentElements = [];

        var reg1 = new RegExp('\\s+', 'g'),                                                 
            reg2 = new RegExp('^\\s+', 'g'),
            reg3 = new RegExp('\ \s+$', 'g');

        selectors = selectors.replace(reg1, ' ')                                            
                             .replace(reg2, '')                                             
                             .replace(reg3, '');                                            

        selectorArray = selectors.split(' ');

        for (var i = 0; i < selectorArray.length; i++) {
            if (selectorArray[i].indexOf('#') == 0) {                                       
                currentSelector = selectorArray[i].slice(1);
                for (var j = 0; j < lastElements.length; j++) {
                    tempElements = lastElements[j].getElementById(currentSelector);
                    if (tempElements) {
                        currentElements.push(tempElements);
                        break;
                    }
                }
            } else if (selectorArray[i].indexOf('.') == 0) {                                
                currentSelector = selectorArray[i].slice(1);
                for (var j = 0; j < lastElements.length; j++) {
                    tempElements = getByClass(currentSelector, lastElements[j]);
                    if (tempElements instanceof Array) {
                            currentElements = currentElements.concat(tempElements);
                    } else {
                        for (var k = 0; k < tempElements.length; k++) {                     
                            currentElements.push(tempElements[k]);
                        }
                    }
                }
            } else {                                                                        
                currentSelector = selectorArray[i];
                for (var j = 0; j < lastElements.length; j++) {
                    tempElements = lastElements[j].getElementsByTagName(currentSelector);   
                    if (tempElements.length > 0) {
                        for (var k = 0; k < tempElements.length; k++) {
                            currentElements.push(tempElements[k]);
                        }
                    }
                }
            }
            lastElements = currentElements;
            currentElements = [];
            if(!lastElements.length) break;
        }

        if (lastElements.length) {
            if (selectorArray[selectorArray.length-1].indexOf('#') == 0) {                  
                return lastElements[0];
            } else {
                return lastElements;
            }
        } 
    }

    function getByClass (className, obj) {                                                  
        if (obj.getElementsByClassName) {
            return obj.getElementsByClassName(className);
        } else {
            var children = obj.getElementsByTagName('*');
            var elements = [];
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var classNames = child.className.split(' ');
                for (var j = 0; j < classNames.length; j++) {
                    if (classNames[j] == className) {
                        elements.push(child);
                        break;
                    }
                }
            }
            return elements;
        }
    }
}