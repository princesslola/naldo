/*
 * [y] hybris Platform
 *
 * Copyright (c) 2017 SAP SE or an SAP affiliate company.  All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

ACC.pspMercadoPago = {
    installmentsMessage : "Seleccione una Cuota",
    initFormMercadoPago : function () {
        const publicApiKey = $("#tokenRequest_publicRequestKey").val();

        Mercadopago.setPublishableKey(publicApiKey);
    },
    errorParams : {
        card_number : "Número de Tarjeta",
        card_holder_name : "Titular de la Tarjeta",
        expiry_date : "Fecha de Vencimiento",
        security_code: "Código de Seguridad"
    },
    createErrorMessage : function (m) {
        return "<div id='mercadoPago-payment-error-message' class='global-alerts' tabindex='-1'>"
             + "    <div class='alert alert-danger alert-dismissable'>"
             + "        <button class='close' aria-hidden='true' data-dismiss='alert' type='button'>x</button>"
             + "        <ul>"
             + "            <li>"+m+"</li>"
             + "        </ul>"
             + "    </div>"
             + "</div>";
    },
    removeErrorMessage : function () {
        $("div#mercadoPago-payment-error-message").remove();

        $("form#mercadoPagoForm").find("div.form-group").removeClass("has-error").find("div.help-block span").empty();
    },
    addErrorMessage : function (m) {
        $("div.row.checkout").before(ACC.pspMercadoPago.createErrorMessage(m));
    },
    formatErrorMessage : function (errors) {
        var m = "Verifique los datos ingresados";
        for (var i = 0, f = true; errors != null && i < errors.length; i++) {
            if (ACC.pspMercadoPago.errorParams.hasOwnProperty(errors[i])) {
                m += f ? ":" : ",";
                m += " " + ACC.pspMercadoPago.errorParams[errors[i]];
                f = false;
            }
        }
        return m;
    },
    formFields : {
        cardNumber : "Por favor ingrese su número de tarjeta",
        cardExpiryMonth : "Por favor ingrese la fecha de vencimiento de la tarjeta",
        cardExpiryYear : "Por favor ingrese la fecha de vencimiento de la tarjeta",
        nameOnCard : "Por favor ingrese el titular de su tarjeta",
        issueNumber : "Por favor ingrese el código de seguridad de la tarjeta",
        installments : "Por favor seleccione una cuota"
    },
    validateForm : function (errors) {
        for (var field in ACC.pspMercadoPago.formFields) {
            //if (ACC.pspMercadoPago.formFields.hasOwnProperty(field) && !$("#card\\."+field).val()) { errors.push(field); }
        }
        return errors;
    },
    addInvalidMessages : function (errors) {
        for (var i=0; i<errors.length; i++) {
            var field = errors[i];
            //$("#card\\."+field).closest(".form-group").addClass("has-error").find("div.help-block span").html(ACC.pspMercadoPago.formFields[field]);
        }
    },
    sdkResponseHandler : function (status, response) {
        if (status != 200 && status != 201) {
            console.log(JSON.stringify(response));

            var errors = [];
            for (var i=0; i<response.cause.length; i++) {
                var error_code = response.cause[i].code;
                var error_name = null;

                /*  Codigos de Error de MP
                    205     parameter cardNumber can not be null/empty
                    208     parameter cardExpirationMonth can not be null/empty
                    209     parameter cardExpirationYear can not be null/empty
                    212     parameter docType can not be null/empty
                    213     parameter cardholder.document.subtype can not be null/empty
                    214     parameter docNumber can not be null/empty
                    220     parameter cardIssuerId can not be null/empty
                    221     parameter cardholderName can not be null/empty
                    224     parameter securityCode can not be null/empty
                    E301	invalid parameter cardNumber
                    E302	invalid parameter securityCode
                    316     invalid parameter cardholderName
                    322     invalid parameter docType
                    323     invalid parameter cardholder.document.subtype
                    324     invalid parameter docNumber
                    325     invalid parameter cardExpirationMonth
                    326     invalid parameter cardExpirationYear
                */

                if (error_code == "205" || error_code == "E301")
                    error_name = "card_number";
                if (error_code == "221" || error_code == "316")
                    error_name = "card_holder_name";
                if (error_code == "208" || error_code == "209" || error_code == "325" || error_code == "326")
                    error_name = "expiry_date";
                if (error_code == "224" || error_code == "E302")
                    error_name = "security_code";

                if (error_name && !errors.includes(error_name))
                    errors.push(error_name);
            }

            ACC.pspMercadoPago.addErrorMessage(ACC.pspMercadoPago.formatErrorMessage(errors));

            $("div#mercadoPago-payment-error-message").focus();
        } else {
            console.log(JSON.stringify(response));

            $(document).off("submit", "#mercadoPagoForm");

            $("#tokenResponse_id").val(response.id);
            $("#tokenResponse_status").val(response.status);
            $("#tokenResponse_bin").val(response.first_six_digits);
            $("#tokenResponse_lastFourDigits").val(response.last_four_digits);
            $("#tokenResponse_cardHolderName").val(response.cardholder.name);

            $("#mercadoPagoForm").submit();
        }
    },
    addValidationNumber : function () {
        $("#mercadoPagoForm")
            .find("input.number[id^='card']")
            .bind("blur", function() { NumberInput.convertValueToNumber(this); })
            .bind("drop", function() { NumberInput.convertValueToNumber(this); })
            .bind("paste", function() { NumberInput.convertValueToNumber(this); });
    },
    sendFormMercadoPago : function () {
        $(document).on("submit", "#mercadoPagoForm", function(event) {
            event.preventDefault();

            ACC.pspMercadoPago.removeErrorMessage();
            var errors = ACC.pspMercadoPago.validateForm([]);
            if (errors.length) {
                ACC.pspMercadoPago.addInvalidMessages(errors);
                return false;
            }

            ACC.pspMercadoPago.getToken(document.querySelector("#mercadoPagoForm"));
        });
    },
    getToken : function (form) {
        Mercadopago.createToken(form, ACC.pspMercadoPago.sdkResponseHandler);

        return false;
    },
    initInstallments : function () {
        $("#tokenResponse_issuer").val("");
        $("#tokenResponse_installments").val("");
        $("#card\\.installments").html("<option value='' disabled selected>"+ACC.pspMercadoPago.installmentsMessage+"</option>");
    },
    selectInstallments : function () {
        $("#tokenResponse_installments").val($("#card\\.installments").val());
    },
    guessingPaymentMethod : function () {
        var bin = document.querySelector("input[data-checkout='cardNumber']").value.slice(0, 6);
        var amount = document.querySelector("#tokenRequest_amount").value;

        setTimeout(function() {
            ACC.pspMercadoPago.initInstallments();

            if (bin.length < 6) return;

            Mercadopago.getPaymentMethod({ "bin" : bin }, function (status, response) {
                document.querySelector("input[name=tokenResponse_paymentMethod]").value = status == 200 ? response[0].id : "";
            });
            Mercadopago.getInstallments({ "bin" : bin, "amount" : amount }, function (status, response) {
                if (status == 200 || status == 201) {
                    var issuer = response[0].issuer.id;
                    var installments = response[0].payer_costs;
                    var options = "";

                    $("#tokenResponse_issuer").val(issuer);

                    function Cuota(cantidadDeCuotas, montoCuota, montoTotal, descripcion, idDeCuota){
                        this.cantidadDeCuotas = cantidadDeCuotas;
                        this.montoCuota = montoCuota;
                        this.montoTotal = montoTotal;
                        this.descripcion = descripcion;
                        this.idDeCuota = idDeCuota;
                    }

                    var cuotas = new Array();
                    for (var i=0; i<installments.length; i++) {
                        options += "<option value='"+installments[i].installments+"'>"+installments[i].recommended_message+"</option>";
                        cuotas[i] = new Cuota(installments[i].installments, installments[i].installment_amount,
                            installments[i].total_amount, installments[i].recommended_message, installments[i].idDeCuota );
                    }

                    $("#card\\.installments").append(options);

                    // $("#card\\.installments > option").each(function() {
                    //     console.log(this.text + ' ' + this.value);
                    // });


                    $.ajax({
                        url:"/checkout/multi/payment-method/saveInstallments",
                        type:"POST",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(cuotas), //Stringified Json Object
                        async: false,    //Cross-domain requests and dataType: "jsonp" requests do not support synchronous operation
                        cache: false,    //This will force requested pages not to be cached by the browser
                        processData:false, //To avoid making query String instead of JSON
                        success: function(resposeJsonObject){
                        }
                    });
                }
            });
        }, 100);
    }
};

$(document).ready(function () {
   ACC.pspMercadoPago.addValidationNumber();
   ACC.pspMercadoPago.sendFormMercadoPago();
});
