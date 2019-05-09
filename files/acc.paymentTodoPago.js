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

ACC.pspTodoPago = {
    errors : [],
    errorCodes : {
        numeroTarjetaTxt : "card_number",
        codigoSeguridadTxt : "security_code",
        "Fecha de vencimiento" : "expiry_date",
        nombreTxt : "card_holder_name",
        nroDocTxt : "card_holder_doc",
        emailTxt : "email"
    },
    errorParams : {
        card_number : "Número de Tarjeta",
        security_code : "Código de Seguridad",
        expiry_date : "Fecha de Vencimiento",
        card_holder_name : "Titular de la Tarjeta",
        card_holder_doc : "Documento del Titular",
        email : "Email del Titular"
    },
    errorMessages : {
        generic : "No se pudo concretar la compra, intente nuevamente por favor",
        rejected : "El pago ha sido rechazado, verifique la información por favor"
    },
    clearErrors : function () {
        ACC.pspTodoPago.errors = [];
    },
    createErrorMessage : function (m) {
        return "<div id='todopago-payment-error-message' class='global-alerts' tabindex='-1'>"
             + "    <div class='alert alert-danger alert-dismissable'>"
             + "        <button class='close' aria-hidden='true' data-dismiss='alert' type='button'>x</button>"
             + "        <ul>"
             + "            <li>"+m+"</li>"
             + "        </ul>"
             + "    </div>"
             + "</div>";
    },
    removeErrorMessage : function () {
        $("div#todopago-payment-error-message").remove();
    },
    addErrorMessage : function (m) {
        $("div.row.checkout").before(ACC.pspTodoPago.createErrorMessage(m));
    },
    focusErrorMessage : function () {
        $("div#todopago-payment-error-message").focus();
    },
    completeErrorMessage : function (m) {
        ACC.pspTodoPago.removeErrorMessage();
        ACC.pspTodoPago.addErrorMessage(m);
        ACC.pspTodoPago.focusErrorMessage();
    },
    formatErrorMessage : function (errors) {
        var m = "Verifique los datos ingresados";
        for (var i = 0, f = true; errors != null && i < errors.length; i++) {
            if (ACC.pspTodoPago.errorParams.hasOwnProperty(errors[i])) {
                m += f ? ":" : ",";
                m += " " + ACC.pspTodoPago.errorParams[errors[i]];
                f = false;
            }
        }
        return m;
    },
    btnConfirmPayment : {
        text : { count : 0, interval : null },
        state : { count : 0, interval : null },

    },
    initFormTodoPago : function (hideButtom) {
        window.TPFORMAPI.hybridForm.initForm({
            callbackValidationErrorFunction: "ACC.pspTodoPago.validationCollector",
            callbackBilleteraFunction: "ACC.pspTodoPago.billeteraPaymentResponse",
            callbackCustomSuccessFunction: "ACC.pspTodoPago.sdkResponseSuccessHandler",
            callbackCustomErrorFunction: "ACC.pspTodoPago.sdkResponseErrorHandler",
            botonPagarId: "btnTodoPagoPagarId",
            botonPagarConBilleteraId: "btnConfirmWalletPayment",
            modalCssClass: "modal-class",
            modalContentCssClass: "modal-content",
            beforeRequest: "ACC.pspTodoPago.initLoading",
            afterRequest: "ACC.pspTodoPago.stopLoading"
        });

        window.TPFORMAPI.hybridForm.setItem({
            defaultNombreApellido: $("#card\\.name").val(),
            defaultTipoDoc: $("#card\\.holderDocType").val(),
            defaultNumeroDoc: $("#card\\.holderDocNumber").val(),
            defaultMail: $("#card\\.email").val(),
            publicKey: $("#tokenRequest_publicRequestKey").val()
        });

        $(document).on("submit", "#todoPagoForm", function(event) {
            event.preventDefault();

            if (ACC.pspTodoPago.errors && ACC.pspTodoPago.errors.length) {
                ACC.pspTodoPago.completeErrorMessage(ACC.pspTodoPago.formatErrorMessage(ACC.pspTodoPago.errors));
                ACC.pspTodoPago.clearErrors();
            }

            return false;
        });

        ACC.pspTodoPago.updateFormState();
        ACC.pspTodoPago.refreshTextButton(hideButtom);
        ACC.pspTodoPago.checkSession();
    },
    checkSession : function () {
        if (ACC.pspTodoPago.internalSession.hasError()) {
            ACC.pspTodoPago.internalSession.removeError();

            ACC.pspTodoPago.completeErrorMessage(ACC.pspTodoPago.errorMessages.generic);
        }
    },
    validationCollector : function (parametro) {
        if (!ACC.pspTodoPago.errors.includes(ACC.pspTodoPago.errorCodes[parametro.field])) {
            ACC.pspTodoPago.errors.push(ACC.pspTodoPago.errorCodes[parametro.field]);
        }
    },
    billeteraPaymentResponse : function (response) {
        console.log(response.ResultCode + " -> " +response.ResultMessage);
    },
    sdkResponseSuccessHandler : function (response) {
        console.log("Success: " + JSON.stringify(response));

        if (response != null && response.ResultCode == "-1") {
            $(document).off("submit", "#todoPagoForm");

            $("#tokenResponse_status").val("APROBADA" == response.ResultMessage ? "approved" : "rejected");
            $("#tokenResponse_publicAuthorizationKey").val(response.AuthorizationKey);

            // Datos del monto total y cantidad de cuotas para guardar en la orden
            $("#tokenResponse_installments").val($('#promosCbx').find(":selected").attr("installments"));
            $("#totalAmount").val($('#promosCbx').find(":selected").attr("newamount"));

            $("#todoPagoForm").submit();
        } else {
            ACC.pspTodoPago.sdkResponseErrorHandler();
        }
    },
    sdkResponseErrorHandler : function (response) {
        console.log("Error: " + JSON.stringify(response));

        ACC.pspTodoPago.internalSession.setError();

        location.reload(true);
    },
    initLoading : function () {
        $("body").addClass("loading");
    },
    stopLoading : function () {
        $("body").removeClass("loading");
    },
    updateFormState : function () {
        ACC.pspTodoPago.clearErrors();
        ACC.pspTodoPago.removeErrorMessage();
        ACC.pspTodoPago.refreshStateButton();
        ACC.pspTodoPago.updateNroTarjeta();
    },
    updateNroTarjeta : function () {
        var nroTarjeta = $("#nroTarjeta").val();
        nroTarjeta = nroTarjeta.substr(nroTarjeta.length - 4)
        $("#tokenResponse_lastFourDigits").val(nroTarjeta);
    },
    updateTipoTarjeta : function () {
        var tipoTarjeta = $("#medioPagoCbx option:selected").text();
        $("#tokenResponse_paymentMethod").val(tipoTarjeta);

    },
    refreshTextButton : function (hideButtom) {
         ACC.pspTodoPago.internalRefresh(ACC.pspTodoPago.btnConfirmPayment.text, 100, function () {
             $("#btnConfirmPayment").html("Confirmar");
             $("#btnConfirmPayment").prop('disabled', false);
             if(hideButtom){
                 $("#btnConfirmPayment").hide();
             }
         });
    },
    refreshStateButton : function () {
        ACC.pspTodoPago.internalRefresh(ACC.pspTodoPago.btnConfirmPayment.state, 10, function () {
            $("#btnConfirmPaymentSupport").prop("disabled", $("#btnConfirmPayment").prop("disabled"));
            $("#btnTodoPagoPagarId").hide();
        });
    },
    internalSession : {
        error : "error",
        setError : function () {
            sessionStorage.setItem(this.error, this.error);
        },
        hasError : function () {
            return sessionStorage.getItem(this.error);
        },
        removeError : function () {
            sessionStorage.removeItem(this.error);
        }
    },
    internalRefresh : function (o, t, c) {
        if (o.interval != null) {
            return;
        }

        o.count = 0;
        o.interval = setInterval(function() {
            o.count++;

            c();

            if (o.count > t) {
                clearInterval(o.interval);

                o.count = 0;
                o.interval = null;
            }
        }, 100);
    },
    bindBtnConfirmPayment: function ()
    {
        $('#btnConfirmPayment').on("click", function (e)
        {
            if($('#cardTypeCode').val() == 'TP'){
                // En caso que el medio de pago sea TODOPAGO validamos el stock antes de hacer el submit porque
                // para TP la transaccion se inicia por js antes de hacer la llamada al controller
                var sUrl = "/checkout/multi/summary/validateCartStock";

                $.ajax({
                    async: false,
                    type: 'GET',
                    dataType : 'json',
                    url: sUrl
                })
                    .done( function (responseText) {
                        $("#btnTodoPagoPagarId").removeAttr("disabled");
                        $("#btnTodoPagoPagarId").trigger("click");
                        return true;
                    })
                    .fail( function (jqXHR, status, error) {
                        // Triggered if response status code is NOT 200 (OK)
                        ACC.pspTodoPago.addErrorMessage(jqXHR.responseJSON);
                        return false;
                    })
                    .always( function() {
                        // Always run after .done() or .fail()
                        //alert("finished");
                        //$("#deliveryOptionsDiv").show();
                    });
            }
        })
    },


}
$(document).ready(function ()
{
    with (ACC.pspTodoPago)
    {
        bindBtnConfirmPayment();
    }
});
