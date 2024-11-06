/*jshint esversion: 6 */
var notificationsjs = (function(){
  "use strict";

  var mainContainer,
      notificationContainer,
      notificationsDismiss,
			notificationsCss,
			initialised = false,
			$;

	init();

  return {
		showDanger: showDanger,
		showInfo: showInfo,
		showSuccess: showSuccess,
		showWarning: showWarning
  };

  function init(){
		if(!initialised){
			$ = jQuery;
			injectCss();
	    buildContainer();
			initialised = true;
		}
  }

  function buildContainer(){
    mainContainer = $(`<div id="notification-container">
      <div>
        <div id="notifications-list">
        </div>
      </div>
      <div id="notifications-dismiss">
        <div>
          <button type="button" role="button">&times; dismiss all notifications</button>
        </div>
      </div>
    </div>`);

    notificationContainer = mainContainer.find("#notifications-list");
    notificationsDismiss = mainContainer.find("#notifications-dismiss");

		notificationContainer.on('notifications.alert.closed', onNotificationDismiss);

    notificationsDismiss.click(function(){
      dismissAllNotifications();
    });

    $(document.body).append(mainContainer);
  }

	function showDanger(message, undoCallback){
		return showNotification(message, "danger", 0, undoCallback);
	}

	function showWarning(message, undoCallback){
		return showNotification(message, "warning", 0, undoCallback);
	}

	function showInfo(message, autoHideDelay, undoCallback){
    autoHideDelay = typeof autoHideDelay !== 'undefined' ? autoHideDelay : 5000;

		return showNotification(message, "info", autoHideDelay, undoCallback);
	}

	function showSuccess(message, autoHideDelay, undoCallback){
    autoHideDelay = typeof autoHideDelay !== 'undefined' ? autoHideDelay : 2000;

		return showNotification(message, "success",  autoHideDelay, undoCallback);
	}

	function showNotification(message, severity, autoHideDelay, undoCallback){
		var notification = $("<div class='alert fade in' role='alert'></div>");

		notification.addClass("alert-" + severity);

		notification.addClass("alert-dismissible");

		var closeBtn = $("<button class='close' type='button' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
		closeBtn.click(function() {
			dismissNotification(notification);
		});
		notification.append(closeBtn);

		if(autoHideDelay > 0){
			window.setTimeout(function() {
				dismissNotification(notification);
			}, autoHideDelay);
		}

		notification.prepend(message);

		if(typeof undoCallback === "function"){
			var undoLnk = $(`<a class="undo-link">undo</a>`);
			undoLnk.click(function(){
				$(this).remove();
			});
			undoLnk.click(undoCallback.bind(notification));

			notification.append("&nbsp;&nbsp;");
			notification.append(undoLnk);
		}

		notificationContainer.append(notification);

		if(notificationContainer.find(".alert").length > 1){
			notificationsDismiss.show();
		}

		return notification;
	}

  function dismissNotification(notification){
    if(!notification.hasClass("alert")){
      return false;
    }

    notification.fadeTo(500, 0).slideUp(500, function(){
			notification.off();
			notification.remove();
      notificationContainer.trigger('notifications.alert.closed');
    });

    return true;
  }

  function dismissAllNotifications(){
    var notifications = notificationContainer.find(".alert");

    notifications.each(function(){
      dismissNotification($(this));
    });

    notificationsDismiss.hide();
  }

  function onNotificationDismiss(){
    if(notificationContainer.find(".alert").length <= 1){
      notificationsDismiss.hide();
    }
  }

	function injectCss(){
		$(document.head).append($(`<style>
				#notification-container{
					display: block;
					position: fixed;
					bottom: 0;
					right: 0;
					z-index: 999999;
			    padding-right: 15px;
			    padding-left: 15px;
			    margin-right: auto;
			    margin-left: auto;
					font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
				}

				#notification-container .alert {
					padding: 5px 15px;
					margin-bottom: 10px;
					border: 1px solid transparent;
					border-radius: 4px;
				}

        #notification-container .alert-dismissable, #notification-container .alert-dismissible {
          padding-right: 35px;
				}

				#notification-container .alert-success {
					color:#3c763d;
					background-color:#dff0d8;
					border-color:#d6e9c6
				}
				#notification-container .alert-success hr {
					border-top-color:#c9e2b3
				}
				#notification-container .alert-success .alert-link {
					color:#2b542c
				}
				#notification-container .alert-info {
					color:#31708f;
					background-color:#d9edf7;
					border-color:#bce8f1
				}
				#notification-container .alert-info hr {
					border-top-color:#a6e1ec
				}
				#notification-container .alert-info .alert-link {
					color:#245269
				}
				#notification-container .alert-warning {
					color:#8a6d3b;
					background-color:#fcf8e3;
					border-color:#faebcc
				}
				#notification-container .alert-warning hr {
					border-top-color:#f7e1b5
				}
				#notification-container .alert-warning .alert-link {
					color:#66512c
				}
				#notification-container .alert-danger {
					color:#a94442;
					background-color:#f2dede;
					border-color:#ebccd1
				}
				#notification-container .alert-danger hr {
					border-top-color:#e4b9c0
				}
				#notification-container .alert-danger .alert-link {
					color:#843534
				}

				#notification-container .alert-dismissable .close, #notification-container .alert-dismissible .close {
			    position: relative;
			    top: -2px;
			    right: -21px;
			    color: inherit;
				}
				#notification-container button.close {
			    -webkit-appearance: none;
			    padding: 0;
			    cursor: pointer;
			    background: 0 0;
			    border: 0;
				}
				#notification-container .close {
			    float: right;
			    font-size: 21px;
			    font-weight: 700;
			    line-height: 1;
			    color: #000;
			    text-shadow: 0 1px 0 #fff;
			    filter: alpha(opacity=20);
			    opacity: .2;
				}

				#notifications-dismiss{
					display: none;
				}

				#notifications-dismiss button{
					cursor: pointer;
					background-image: none;
					border: 1px solid transparent;
					white-space: nowrap;
					display: inline-block;
					margin-bottom: 0;
					font-weight: normal;
					text-align: center;
					vertical-align: middle;
					padding: 1px 5px;
					font-size: 12px;
					line-height: 1.5;
					border-radius: 3px;

					color: #333;
					background-color: #fff;
					border-color: #ccc;
				}
			</style>`));
	}
})();
