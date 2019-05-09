ACC.checkout = {

    _autoload: [
        "bindCheckO",
        "bindForms",
        "bindSavedPayments",
        "bindCheckoutInstallments"
    ],


    bindForms:function(){

        $(document).on("click","#addressSubmit",function(e){
            e.preventDefault();
            $('#addressForm').submit();
        })

        $(document).on("click","#deliveryMethodSubmit",function(e){
            e.preventDefault();
            $('#selectDeliveryMethodForm').submit();
        })

    },

    bindSavedPayments:function(){
        $(document).on("click",".js-saved-payments",function(e){
            e.preventDefault();

            var title = $("#savedpaymentstitle").html();

            $.colorbox({
                href: "#savedpaymentsbody",
                inline:true,
                maxWidth:"100%",
                opacity:0.7,
                //width:"320px",
                title: title,
                close:'<span class="glyphicon glyphicon-remove"></span>',
                onComplete: function(){
                }
            });
        })
    },

    bindCheckO: function ()
    {
        var cartEntriesError = false;

        // Alternative checkout flows options
        $('.doFlowSelectedChange').change(function ()
        {
            if ('multistep-pci' == $('#selectAltCheckoutFlow').val())
            {
                $('#selectPciOption').show();
            }
            else
            {
                $('#selectPciOption').hide();

            }
        });



        $('.js-continue-shopping-button').click(function ()
        {
            var checkoutUrl = $(this).data("continueShoppingUrl");
            window.location = checkoutUrl;
        });


        $('.expressCheckoutButton').click(function()
        {
            document.getElementById("expressCheckoutCheckbox").checked = true;
        });

        $(document).on("input",".confirmGuestEmail,.guestEmail",function(){

            var orginalEmail = $(".guestEmail").val();
            var confirmationEmail = $(".confirmGuestEmail").val();

            if(orginalEmail === confirmationEmail){
                $(".guestCheckoutBtn").removeAttr("disabled");
            }else{
                $(".guestCheckoutBtn").attr("disabled","disabled");
            }
        });

        $('.js-continue-checkout-button').click(function ()
        {
            var checkoutUrl = $(this).data("checkoutUrl");

            cartEntriesError = ACC.pickupinstore.validatePickupinStoreCartEntires();
            if (!cartEntriesError)
            {
                var expressCheckoutObject = $('.express-checkout-checkbox');
                if(expressCheckoutObject.is(":checked"))
                {
                    window.location = expressCheckoutObject.data("expressCheckoutUrl");
                }
                else
                {
                    var flow = $('#selectAltCheckoutFlow').val();
                    if ( flow == undefined || flow == '' || flow == 'select-checkout')
                    {
                        // No alternate flow specified, fallback to default behaviour
                        window.location = checkoutUrl;
                    }
                    else
                    {
                        // Fix multistep-pci flow
                        if ('multistep-pci' == flow)
                        {
                            flow = 'multistep';
                        }
                        var pci = $('#selectPciOption').val();

                        // Build up the redirect URL
                        var redirectUrl = checkoutUrl + '/select-flow?flow=' + flow + '&pci=' + pci;
                        window.location = redirectUrl;
                    }
                }
            }
            return false;
        });

    },

    bindCheckoutInstallments: function () {

        $( "#card\\.comboBancosCheckout" ).change(function() {
            //Hacer llamada de ajax para que cargue el combo condicion de ventas - cuotas
            var paymentMethod = $( "#hdnTarjetaCode" ).val();
            var entidad = $( "#card\\.comboBancosCheckout option:selected" ).val();

            if($("#card\\.comboCuotasCheckout option").length > 1){
                $.each( $("#card\\.comboCuotasCheckout option"), function( i, val ) {
                    if(i > 0){
                        ($("#card\\.comboCuotasCheckout option")[1]).remove();
                    }
                });
            }

            var baseUrl = "/checkout/multi/summary";
            var paramUrl = "/condicionVenta/paymentMethod/"+paymentMethod+"/entidad/"+entidad;
            var sUrl = baseUrl + paramUrl;
            $.ajax({
                async: true,
                //data: {paymentMethod: paymentMethod},
                type: 'get',
                dataType : 'json',
                url: sUrl
            })
                .done( function (responseText) {

                    var precioBase = $("#hdnCheckoutTotal").val();
                    // Triggered if response status code is 200 (OK)
                    //$('#message').html('Your message is: ' + responseText);
                    $.each( responseText, function( i, val ) {

                        var margen = val.margen;
                        var coeficiente = 100;

                        var cociente = margen/coeficiente;

                        var cantCuotas = val.cuotaHasta;

                        var montoFijo = precioBase * cociente;
                        var valorCuota = montoFijo / cantCuotas;

                        $("#card\\.comboCuotasCheckout").append('<option id="'+val.uid+'" value="'+val.uid+'" cuotaDesde="'+val.cuotaDesde+'" cuotaHasta="'+val.cuotaHasta+'" margen="'+val.margen+'" tea="'+val.tea+'" cft="'+val.cft+'">'+val.descripcion+' x $'+valorCuota.toFixed(2)+' ($'+montoFijo.toFixed(2)+')'+'</option>');
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

        // DECIDIR COMBO CUOTAS - CONDICIONES DE VENTA
        $( "#card\\.comboCuotasCheckout" ).change(function() {
            var total = 0;
            total = $( "#card\\.comboCuotasCheckout option:selected" ).text();
            total = total.match(/\(([^)]+)\)/)[1].substring(1);
            total = parseFloat(total);

            var checkoutTotal = $("#hdnCheckoutTotal").val();
            checkoutTotal = parseFloat(checkoutTotal);

            var costoFinanciacion = total.toFixed(2) - checkoutTotal;
            costoFinanciacion = costoFinanciacion.toFixed(2);
            costoFinanciacion = addCommas(costoFinanciacion);

            $("#costo_financiacion").html("$" + costoFinanciacion);
            $("#basket-Total").html("$" + addCommas(total.toFixed(2)));

            var selectedOption = $( "#card\\.comboCuotasCheckout option:selected" );
            var selectedCuota = selectedOption.attr("cuotadesde");
            var selectedTea = selectedOption.attr("tea");
            var selectedCft = selectedOption.attr("cft");
            if (selectedCuota != 1) {
                var installmentsDetails = selectedOption.html().match(/[^(]+/)[0].trim();
                installmentsDetails = installmentsDetails + '<br> TEA: ' + selectedTea + '% | CFT: ' + selectedCft + '%';
                $("#installments-details-value").html(installmentsDetails);
                $("#installments_details").show();
                $("#costo_financiacion_detail").show();
            } else {
                $("#installments-details-value").html("");
                $("#installments_details").hide();
                $("#costo_financiacion_detail").hide();
            }
        });

        // MERCADOPAGO COMBO CUOTAS - CONDICIONES DE VENTA
        $("#card\\.installments").change(function() {
            var total = 0;
            total = $("#card\\.installments option:selected").text();
            total = total.match(/\(([^)]+)\)/)[1].substring(1);
            var values = total.split(",");
            total = values[0].replace(".","") + "." + values[1].replace(",",".");
            total = parseFloat(total);

            var checkoutTotal = $("#hdnCheckoutTotal").val();
            checkoutTotal = parseFloat(checkoutTotal);

            var costoFinanciacion = total - checkoutTotal;
            costoFinanciacion = costoFinanciacion.toFixed(2);
            costoFinanciacion = addCommas(costoFinanciacion);

            $("#costo_financiacion").html("$" + costoFinanciacion);
            $("#basket-Total").html("$" + addCommas(total));

            var selectedOption = $( "#card\\.installments option:selected" );
            var selectedVal = selectedOption.val();
            if (selectedVal != 1) {
                var installmentsDetails = selectedOption.html().match(/[^(]+/)[0].trim();
                $("#installments-details-value").html(installmentsDetails);
                $("#installments_details").show();
                $("#costo_financiacion_detail").show();
            } else {
                $("#installments-details-value").html("");
                $("#installments_details").hide();
                $("#costo_financiacion_detail").hide();
            }
        });

        // TODOPAGO COMBO CUOTAS - CONDICIONES DE VENTA
        $("#promosCbx" ).change(function() {
            var total = 0;
            total = $("#promosCbx option:selected").text();
            total = total.match(/\(([^)]+)\)/)[1].substring(1);
            total = parseFloat(total);

            var checkoutTotal = $("#hdnCheckoutTotal").val();
            checkoutTotal = parseFloat(checkoutTotal);

            var costoFinanciacion = total.toFixed(2) - checkoutTotal;
            costoFinanciacion = costoFinanciacion.toFixed(2);
            costoFinanciacion = addCommas(costoFinanciacion);

            $("#costo_financiacion").html("$" + costoFinanciacion);
            $("#basket-Total").html("$" + addCommas(total.toFixed(2)));

            var selectedOption = $( "#promosCbx option:selected" );
            var selectedTea = selectedOption.attr("tea");
            var selectedCft = selectedOption.attr("cft");
            var selectedInstallments = selectedOption.attr("installments");
            if (selectedInstallments != 1) {
                var installmentsDetails = selectedOption.html().match(/[^-]+/)[0].trim();
                installmentsDetails = installmentsDetails + '<br> TEA: ' + selectedTea + '% | CFT: ' + selectedCft + '%';
                $("#installments-details-value").html(installmentsDetails);
                $("#installments_details").show();
                $("#costo_financiacion_detail").show();
            } else {
                $("#installments-details-value").html("");
                $("#installments_details").hide();
                $("#costo_financiacion_detail").hide();
            }
        });

        function addCommas(nStr)
        {
            nStr += '';
            x = nStr.split('.');
            x1 = x[0];
            x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1.replace(",",".") + x2.replace(".",",");
        }

    }

};
