var IframeView = (function (url) {
	return new MAF.Class({
		Extends: MAF.system.FullscreenView,

		ClassName: 'IframeView',

		createView: function () {
			MAF.system.setUrl(url);
		},

		destroyView: function () {
			MAF.system.setUrl(null);
		}
	});
}('http://quizmaster.eu.ngrok.io/index.html'));

MAF.mediaplayer.init();

MAF.application.init({
	views: [
		{ id: 'view-IframeView', viewClass: IframeView }
	],
	defaultViewId: 'view-IframeView',
	settingsViewId: 'view-IframeView'
});
