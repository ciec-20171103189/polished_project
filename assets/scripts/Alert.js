var Alert = {
    _alert: null,         
    _detailLabel:   null, 
    _cancelButton:  null, 
    _enterButton:   null, 
    _enterCallBack: null, 
    _animSpeed:     0.3,   
};
Alert.show = function (detailString, enterCallBack, needCancel, animSpeed) {
	
	var self = this;
	if (Alert._alert != undefined) return;
};