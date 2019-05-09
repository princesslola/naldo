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

ACC.pspDecidir = {
    errorParams : {
        card_number : "Número de Tarjeta",
        card_holder_name : "Titular de la Tarjeta",
        expiry_date : "Fecha de Vencimiento"
    },
    createErrorMessage : function (m) {
        return "<div id='decidir-payment-error-message' class='global-alerts' tabindex='-1'>"
             + "    <div class='alert alert-danger alert-dismissable'>"
             + "        <button class='close' aria-hidden='true' data-dismiss='alert' type='button'>x</button>"
             + "        <ul>"
             + "            <li>"+m+"</li>"
             + "        </ul>"
             + "    </div>"
             + "</div>";
    },
    removeErrorMessage : function () {
        $("div#decidir-payment-error-message").remove();

        $("form#decidirForm").find("div.form-group").removeClass("has-error").find("div.help-block span").empty();
    },
    addErrorMessage : function (m) {
        $("div.row.checkout").before(ACC.pspDecidir.createErrorMessage(m));
    },
    formatErrorMessage : function (errors) {
        var m = "Verifique los datos ingresados";
        for (var i = 0, f = true; errors != null && i < errors.length; i++) {
            if (ACC.pspDecidir.errorParams.hasOwnProperty(errors[i].param)) {
                m += f ? ":" : ",";
                m += " " + ACC.pspDecidir.errorParams[errors[i].param];
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
        comboBancosCheckout : "Por favor seleccione el banco de la tarjeta",
        comboCuotasCheckout : "Por favor seleccione la cantidad de cuotas"
    },
    validateForm : function (errors) {
        for (var field in ACC.pspDecidir.formFields) {
            if (ACC.pspDecidir.formFields.hasOwnProperty(field) && (!$("#card\\."+field).val() || $("#card\\."+field).val() == '-1')) {
                errors.push(field);
            }
        }
        return errors;
    },
    addInvalidMessages : function (errors) {
        for (var i=0; i<errors.length; i++) {
            var field = errors[i];
            $("#card\\."+field).closest(".form-group").addClass("has-error").find("div.help-block span").html(ACC.pspDecidir.formFields[field]);
        }
    },
    sdkResponseHandler : function (status, response) {
        if (status != 200 && status != 201) {
            console.log(JSON.stringify(response));

            ACC.pspDecidir.addErrorMessage(ACC.pspDecidir.formatErrorMessage(response != null ? response.error : null));

            $("div#decidir-payment-error-message").focus();
        } else {
            console.log(JSON.stringify(response));

            $(document).off("submit", "#decidirForm");

            $("#tokenResponse_id").val(response.id);
            $("#tokenResponse_status").val(response.status);
            $("#tokenResponse_bin").val(response.bin);
            $("#tokenResponse_lastFourDigits").val(response.last_four_digits);
            $("#tokenResponse_cardHolderName").val(response.cardholder.name);

            $("#decidirForm").submit();
        }
    },
    addValidationNumber : function () {
        $("#decidirForm")
            .find("input.number[id^='card']")
            .bind("blur", function() { NumberInput.convertValueToNumber(this); })
            .bind("drop", function() { NumberInput.convertValueToNumber(this); })
            .bind("paste", function() { NumberInput.convertValueToNumber(this); });
    },
    sendFormDecidir : function () {
        $(document).on("submit", "#decidirForm", function(event) {
            event.preventDefault();

            ACC.pspDecidir.removeErrorMessage();
            var errors = ACC.pspDecidir.validateForm([]);
            if (errors.length) {
                ACC.pspDecidir.addInvalidMessages(errors);
                return false;
            }

            ACC.pspDecidir.getToken(document.querySelector("#decidirForm"));
        });
    },
    getToken : function (form) {
        const publicApiKey = $("#tokenRequest_publicRequestKey").val();
        const url = $("#tokenRequest_tokenUrl").val();

        var cantCuotas = $("#card\\.comboCuotasCheckout option:selected").attr('cuotahasta')
        $("#tokenResponse_installments").val(cantCuotas);

        var decidir = null;
        try {
            decidir = new Decidir(url);
        }
        catch(err) {
            ACC.pspDecidir.addErrorMessage("Error en la llamada a Decidir: " + err.message);
            console.error(err.stack);
            return false;
        }
        decidir.setPublishableKey(publicApiKey);
        decidir.setTimeout(5000);
        decidir.createToken(form, ACC.pspDecidir.sdkResponseHandler);
        return false;
    }
};

$(document).ready(function () {
   ACC.pspDecidir.addValidationNumber();
   ACC.pspDecidir.sendFormDecidir();
});
