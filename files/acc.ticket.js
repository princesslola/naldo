ACC.ticket = {

    _autoload: [
        "bindToAddTicketForm",
        "bindToUpdateTicket",
        "bindToViewTicket"
    ],


    bindToAddTicketForm: function () {
        var addTicketForm = $('.add_ticket_form');
        addTicketForm.ajaxForm({
            beforeSubmit:ACC.ticket.showRequest,
            success: ACC.ticket.displayAddTicketPopup
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

    displayAddTicketPopup: function (result, statusText, xhr, formElement) {
        $ajaxCallEvent=true;

        var titleHeader = $('#addTicketTitle').html();

        ACC.colorbox.open(titleHeader, {
            html: result,
            width: "700px"
        });

        $("#btnCloseTicketPopup").click(function() {
            $("#cboxClose").click();
        });

        ACC.ticket.registerSubmitValidation();
    },

    bindToUpdateTicket: function () {
        $(".updateTicket").click(function() {
            var ticketId = $(this).attr("id");
            ACC.ticket.displayTicketPopup("update", ticketId);
            return false;
        });
    },

    displayTicketPopup: function (action, ticketId) {
        var baseUrl = "/my-account/ticket/";
        var paramUrl = ticketId;

        var sUrl = baseUrl + action + "/" + paramUrl;

        $.ajax({
            async: false,
            type: 'GET',
            url: sUrl
        })
            .done( function (result) {
                var titleHeader = (action == "update") ? $('#updateTicketTitle').html() : $('#viewTicketTitle').html();

                ACC.colorbox.open(titleHeader, {
                    html: result,
                    width: "1000px"
                });

                $("#btnCloseTicketPopup").click(function() {
                    $("#cboxClose").click();
                });

                ACC.ticket.registerSubmitValidation();
            })
            .fail( function (jqXHR, status, error) {
                // Triggered if response status code is NOT 200 (OK)
                // alert(jqXHR.responseText);
            })
            .always( function() {
                // Always run after .done() or .fail()
                // alert("finished");
                //$("#deliveryOptionsDiv").show();
            });

    },

    bindToViewTicket: function () {
        $(".viewTicket").click(function() {
            var ticketId = $(this).attr("id");
            ACC.ticket.displayTicketPopup("view", ticketId);
            return false;
        });
    },

    createErrorMessage : function (m) {
        return "<div id='ticket-submit-error-message' class='global-alerts' tabindex='-1'>"
            + "    <div class='alert alert-danger alert-dismissable'>"
            + "        <button class='close' aria-hidden='true' data-dismiss='alert' type='button'>x</button>"
            + "        <ul>"
            + "            <li>"+m+"</li>"
            + "        </ul>"
            + "    </div>"
            + "</div>";
    },

    removeErrorMessage : function () {
        $("div#ticket-submit-error-message").remove();
    },

    registerSubmitValidation : function() {
        $("#ticket_form").submit(function(event) {
            ACC.ticket.removeErrorMessage();
            /*
            Hacemos esta validacion en el frontend porque como el submit del ticket esta en un
            popup si usamos las validaciones de springmvc una vez que hacemos el submit nos salimos
            del popup y en caso que falle nos redirige a una pantalla
            */
            if (! $("#ticket\\.subject").val() ||
                ! $("#ticket\\.category").val() ||
                ! $("#ticket\\.message").val()) {
                $("div#popup_ticket_post").before(ACC.ticket.createErrorMessage("Complete los campos obligatorios."));
                $("div#ticket-submit-error-message").focus();

                return false;
            }

            return true;
        });
    }
};

$(document).ready(function () {
    $ajaxCallEvent = true;
});