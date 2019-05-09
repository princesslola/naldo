/**
 * Created by lravanal on 31/01/2018.
 */

// Funciones asociadas a los campos numericos
var NumberInput = {
    convertValueToNumber : function (o) {
        setTimeout(function(){o.value=o.value.replace(/[^\d]+/g,'');},100);
    }
};
