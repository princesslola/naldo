ACC.product = {

    _autoload: [
        "bindToAddToCartForm",
        "enableStorePickupButton",
        "enableVariantSelectors",
        "bindFacets",
        "bindProductDetailsInstallmentCalculatorEntidad",
        "bindProductDetailsInstallmentCalculatorCondicionVenta",
        "bindProductDetailsInstallmentCalculatorPrecioValorCuotaMontoFijo"
    ],


    bindFacets: function () {
        $(document).on("click", ".js-show-facets", function (e) {
            e.preventDefault();
            var selectRefinementsTitle = $(this).data("selectRefinementsTitle");
            ACC.colorbox.open(selectRefinementsTitle, {
                href: ".js-product-facet",
                inline: true,
                width: "480px",
                onComplete: function () {
                    $(document).on("click", ".js-product-facet .js-facet-name", function (e) {
                        e.preventDefault();
                        $(".js-product-facet  .js-facet").removeClass("active");
                        $(this).parents(".js-facet").addClass("active");
                        $.colorbox.resize()
                    })
                },
                onClosed: function () {
                    $(document).off("click", ".js-product-facet .js-facet-name");
                }
            });
        });
        enquire.register("screen and (min-width:" + screenSmMax + ")", function () {
            $("#cboxClose").click();
        });
    },


    enableAddToCartButton: function () {
        $('.js-enable-btn').each(function () {
            if (!($(this).hasClass('outOfStock') || $(this).hasClass('out-of-stock'))) {
                $(this).removeAttr("disabled");
            }
        });
    },

    enableVariantSelectors: function () {
        $('.variant-select').removeAttr("disabled");
    },

    bindToAddToCartForm: function () {
        var addToCartForm = $('.add_to_cart_form');
        addToCartForm.ajaxForm({
        	beforeSubmit:ACC.product.showRequest,
        	success: ACC.product.displayAddToCartPopup
         });    
        setTimeout(function(){
        	$ajaxCallEvent  = true;
         }, 2000);
     },
     showRequest: function(arr, $form, options) {  
    	 if($ajaxCallEvent)
    		{
    		 $ajaxCallEvent = false;
    		 return true;
    		}   	
    	 return false;
 
    },

    bindToAddToCartStorePickUpForm: function () {
        var addToCartStorePickUpForm = $('#colorbox #add_to_cart_storepickup_form');
        addToCartStorePickUpForm.ajaxForm({success: ACC.product.displayAddToCartPopup});
    },

    enableStorePickupButton: function () {
        $('.js-pickup-in-store-button').removeAttr("disabled");
    },

    displayAddToCartPopup: function (cartResult, statusText, xhr, formElement) {
    	$ajaxCallEvent=true;
        $('#addToCartLayer').remove();

        if (typeof ACC.minicart.updateMiniCartDisplay == 'function') {
            ACC.minicart.updateMiniCartDisplay();
        }
        var titleHeader = $('#addToCartTitle').html();

        ACC.colorbox.open(titleHeader, {
            html: cartResult.addToCartLayer,
            width: "460px"
        });

        var productCode = $('[name=productCodePost]', formElement).val();
        var quantityField = $('[name=qty]', formElement).val();

        var quantity = 1;
        if (quantityField != undefined) {
            quantity = quantityField;
        }

        var cartAnalyticsData = cartResult.cartAnalyticsData;

        var cartData = {
            "cartCode": cartAnalyticsData.cartCode,
            "productCode": productCode, "quantity": quantity,
            "productPrice": cartAnalyticsData.productPostPrice,
            "productName": cartAnalyticsData.productName
        };
        ACC.track.trackAddToCart(productCode, quantity, cartData);
    },

    bindProductDetailsInstallmentCalculatorEntidad: function () {

        $( "#comboTarjeta" ).change(function() {
            //Hacer llamada de ajax para que cargue el combo de entidad
            var paymentMethod = $( "select option:selected" ).val();


            //Reset Combo Banco/Institucion
            if($("#comboBancos option").length > 1){
                $.each( $("#comboBancos option"), function( i, val ) {
                    if(i > 0){
                        ($("#comboBancos option")[1]).remove();
                    }
                });
            }
            //Reset Combo Numero de Cuotas
            if($("#comboCuotas option").length > 1){
                $.each( $("#comboCuotas option"), function( i, val ) {
                    if(i > 0){
                        ($("#comboCuotas option")[1]).remove();
                    }
                });
            }

            if(paymentMethod == -1 || paymentMethod == 1){
                $("#precio").val('$');
                $("#valorCuota").val('$');
                $("#montoFijo").val('$');
                return;
            }

            var productCode = $("#hdnProductCode").val();

            var baseUrl = "/buscarEntidades/p/"+productCode;
            var paramUrl = "/entidad/paymentMethod/"+paymentMethod;
            var sUrl = baseUrl + paramUrl;
            $.ajax({
                async: false,
                //data: {paymentMethod: paymentMethod},
                type: 'get',
                dataType : 'json',
                url: sUrl
            })
                .done( function (responseText) {
                    // Triggered if response status code is 200 (OK)
                    //$('#message').html('Your message is: ' + responseText);
                    $.each( responseText, function( i, val ) {
                        $("#comboBancos").append('<option id="'+val.pk+'" value="'+val.pk+'">'+val.name+'</option>');
                    });

                })
                .fail( function (jqXHR, status, error) {
                    // Triggered if response status code is NOT 200 (OK)
                    alert(jqXHR.responseText);
                })
                .always( function() {
                    // Always run after .done() or .fail()
                    //alert("finished");
                    //$("#deliveryOptionsDiv").show();
                });

        });

    },
    bindProductDetailsInstallmentCalculatorCondicionVenta: function () {

        $( "#comboBancos" ).change(function() {
            //Hacer llamada de ajax para que cargue el combo condicion de ventas - cuotas
            var paymentMethod = $( "#comboTarjeta" ).val();
            var entidad = $( "#comboBancos option:selected" ).val();


            if($("#comboCuotas option").length > 1){
                $.each( $("#comboCuotas option"), function( i, val ) {
                    if(i > 0){
                        ($("#comboCuotas option")[1]).remove();
                    }
                });
            }

            if(entidad == -1){
                $("#precio").val('$');
                $("#valorCuota").val('$');
                $("#montoFijo").val('$');
                return;
            }

            var productCode = $("#hdnProductCode").val();

            var baseUrl = "/buscarCondicionVentta/p/"+productCode;
            var paramUrl = "/condicionVenta/paymentMethod/"+paymentMethod+"/entidad/"+entidad;
            var sUrl = baseUrl + paramUrl;
            $.ajax({
                async: false,
                //data: {paymentMethod: paymentMethod},
                type: 'get',
                dataType : 'json',
                url: sUrl
            })
                .done( function (responseText) {
                    // Triggered if response status code is 200 (OK)
                    //$('#message').html('Your message is: ' + responseText);
                    $.each( responseText, function( i, val ) {
                        $("#comboCuotas").append('<option id="'+val.uid+'" value="'+val.uid+'" cuotaDesde="'+val.cuotaDesde+'" cuotaHasta="'+val.cuotaHasta+'" margen="'+val.margen+'" tea="'+val.tea+'" cft="'+val.cft+'">'+val.descripcion+'</option>');
                    });

                })
                .fail( function (jqXHR, status, error) {
                    // Triggered if response status code is NOT 200 (OK)
                    alert(jqXHR.responseText);
                })
                .always( function() {
                    // Always run after .done() or .fail()
                    //alert("finished");
                    //$("#deliveryOptionsDiv").show();
                });

        });

    },
    bindProductDetailsInstallmentCalculatorPrecioValorCuotaMontoFijo: function () {

        $( "#comboCuotas" ).change(function() {
            //Hacer llamada de ajax para que cargue el combo condicion de ventas - cuotas

            var cuota = $( "#comboCuotas option:selected" ).val();

            if(cuota == -1){
                //Reset All Combos
                $("#precio").val('$');
                $("#valorCuota").val('$');
                $("#montoFijo").val('$');
                return;
            }

            var precioBase = $("#originalProductPrice").val() * 1;
            precioBase = precioBase.toFixed(2);

            var margen = $( "#comboCuotas option:selected" ).attr('margen');
            var coeficiente = 100;

            var cociente = margen/coeficiente;

            var cantCuotas = $("#comboCuotas option:selected").attr('cuotahasta');


            var montoFijo = precioBase * cociente;
            var valorCuota = montoFijo / cantCuotas;

            $("#precio").val('$'+precioBase);
            $("#valorCuota").val('$'+valorCuota.toFixed(2));
            $("#montoFijo").val('$'+montoFijo.toFixed(2));

            var tea = $( "#comboCuotas option:selected" ).attr('tea');
            var cft = $( "#comboCuotas option:selected" ).attr('cft');

            $("#tea").val(tea+'%');
            $("#cft").val(cft+'%');

        });
    }
};

$(document).ready(function () {
	$ajaxCallEvent = true;
    ACC.product.enableAddToCartButton();
});