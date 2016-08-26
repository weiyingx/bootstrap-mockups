/*
Copyright (c) 2016, comScore Inc. All rights reserved.
version: 5.1.3
*/
COMSCORE.SiteRecruit.Broker.config = {
	version: "5.1.3",
	cddsDomains: 'microsoftstore.com|windowsphone.com|xbox.com|adnxs.com|office.com',
	cddsInProgress: 'cddsinprogress',
	domainSwitch: 'tracking3p',
	domainMatch: '([\\da-z\.-]+\.com)',
	delay: 0,
	cddsIntervalMax: 10,

	crossDomainCheck: function() {
		if (this.cddsIntervalMax > 1) {
			this.cddsIntervalMax --;

			if (COMSCORE.SiteRecruit.Utils.UserPersistence.getCookieValue(this.cddsInProgress) != false ) {
				//COMSCORE.SiteRecruit.DDKeepAlive.setDDTrackerCookie();
				setInterval(function() { COMSCORE.SiteRecruit.DDKeepAlive.setDDTrackerCookie()}, 1000);
				COMSCORE.SiteRecruit._halt = true;
				this.clearCrossDomainCheck();
			}
		}
		else {
			this.clearCrossDomainCheck();
		}
	},

	clearCrossDomainCheck: function() {
		window.clearInterval(crossDomainInterval);
	},

	isolateDomain: function(a) {
		a = a.substring(a.indexOf("//")+2,a.length);
		a = a.substring(0,a.indexOf("/"));
		return a;
	},

	testMode: false,
	addEventDelay: 1000,
	
	cookie:{
		name: 'msresearch',
		path: '/',
		domain:  '.microsoft.com' ,
		duration: 90,
		rapidDuration: 0,
		expireDate: ''
	},
	tracker:{
		std:'http://www.microsoft.com/library/svy/SiteRecruit_Tracker.htm',
		ssl:'https://www.microsoft.com/library/svy/SiteRecruit_Tracker.htm'
	},
	mobile:{
		match: 'iphone|ipad|ipod|android|opera mini|blackberry|windows (phone|ce)|iemobile|htc|nokia|bb10|mobile safari|mobile',
		kmatch: '(?:; ([^;)]+) Build\/.*)?\bSilk\/([0-9._-]+)\b(.*\bMobile Safari\b)?',
		halt: true
	},
	graceIncr:{
		name: 'graceIncr',
		initDelay: 0,
		clickDelay: 5000,
		match: 'https:\/\/(account|accounts|billing|commerce|support|login|live)\.(microsoft|live|xbox)\.(com)',
		altTag: 'class',
		htmlMatch: 'sign in'
	},
	
	prefixUrl: "",
	
		mapping:[
	// m=regex match, c=page config file (prefixed with configUrl), f=frequency
  {m: '//[\\w\\.-]+/en-(au|ca|eg|hk|in|ie|my|nz|pk|ph|sa|sg|za|gb|us)/learning/.*', c: 'inv_c_Learning-2342.js', f: 0.0, p: 0, halt:true }
  ,{m: '//[\\w\\.-]+/(en-us/default.aspx|en-us/?$|en-us?$)', c: 'inv_c_p246609455-1255.js', f: 0.18, p: 1  }
  ,{m: '//[\\w\\.-]+/(en-us/default.aspx|en-us/?$|en-us?$)', c: 'inv_c_p38796305-1255-M.js', f: 0.05, p: 2 , prereqs:{content:[],cookie:[{'name':'srMOB','value':'1'}]}}
  ,{m: '//[\\w\\.-]+/en-us/cloud-platform', c: 'inv_c_p218292485-3105.js', f: 0.4, p: 0  }  
	,{m: '//[\\w\\.-]+/en-us/download', c: 'inv_c_p246609455-1345.js', f: 0.0237, p: 1 }
	,{m: '//[\\w\\.-]+/en-us/dynamics/(?!contact-us)', c: 'inv_c_p329946460-14.js', f: 0.5, p: 0  }
	,{m: '//[\\w\\.-]+/en-us/dynamics/crm-test-drive-start\\.aspx', c: 'inv_c_p329946460-2862.js', f: 0.5, p: 1  }
	,{m: '//[\\w\\.-]+/en-us/licensing/(?!(servicecenter|licensewise/|mla/))', c: 'inv_c_Licensing-43.js', f: 0.5, p: 0  }
	,{m: '//[\\w\\.-]+/en.*/server-cloud/', c: 'inv_c_p218292485-2197.js', f: 0.5, p: 0  }
	,{m: '//[\\w\\.-]+/en.*/server-cloud/(sql-|products/sql-server)', c: 'inv_c_p218292485-2198.js', f: 0.5, p: 1  }
	,{m: '//[\\w\\.-]+/en-us/trustcenter', c: 'inv_c_p346424086.js', f: 0.5, p: 0  }
	,{m: '//[\\w\\.-]+/en-us/windowsforbusiness', c: 'inv_c_p327107524-2853.js', f: 0.2, p: 2  }
	,{m: '(//[\\w\\.-]+/sql/experience/(Default\\.aspx\\?loc=en)|(html/Default\\.aspx\\?loc=en)|(html/Events\\.aspx\\?loc=en)|(LearnSQL\\.aspx\\?h=t&loc=en)|(LearnSQL\\.aspx\\?loc=en)|(Events\\.aspx\\?loc=en)|(.*\\.wmv))|(/learning/en/us/(s|S)yndication(p|P)age\\.aspx)', c: 'inv_c_blank.js', f: 0, p: 3  ,halt: true  }
	,{m: 'powerbi.microsoft.com/en.*', c: 'inv_c_p218292485_2694.js', f: 0.5, p: 1  }
],

	//events
	Events: {
		beforeRecruit: function() {
			// ADD shortcuts
			var csbc = COMSCORE.SiteRecruit.Broker.config;
			var csuu = COMSCORE.SiteRecruit.Utils.UserPersistence;
			
			// IF TRACKING3P EXISTS, REMOVE IT
			if (csuu.getCookieValue(csbc.domainSwitch) != false) {
				csuu.createCookie(csbc.domainSwitch, '', {path:'/',domain:csbc.cookie.domain,duration:-1});
			}

			if (/windows.com/i.test(document.domain)) {
				COMSCORE.SiteRecruit.Broker.config.cookie.domain = '.windows.com';
			}

			//CDDS p246609455 - Referrer Check
      if(/(en-us\/default\.aspx|en-us?$|en-us\/?$)|(en-us\/download)|(download\/(en\/|.*?displaylang=en))/i.test(window.location.toString()) &&/windowsmediaplayer|(microsoft|microsoftbusinesshub|xbox|windowsphone|windows|skype|live|microsoftvirtualacademy|microsoftvolumelicensing|microsoftstore|office|onenote|visualstudio|outlook)\.com/i.test(document.referrer) ) { 
           COMSCORE.SiteRecruit._halt = true; 
      }

      //MAC recruitment
      if (/www\.microsoft\.com\/en-us\/windows\/10/i.test(window.location)) {
        if (navigator.appVersion.indexOf("Mac")!=-1){ 
          for(i=0; i<COMSCORE.SiteRecruit.Broker.config.mapping.length; i++){
            if(COMSCORE.SiteRecruit.Broker.config.mapping[i].c == "inv_c_p346322309-3064.js"){
              COMSCORE.SiteRecruit.Broker.config.mapping[i].f = 0.0;
              //COMSCORE.SiteRecruit.Broker.config.mapping[i].c = 'inv_c_p346322309-3064-MAC.js';
            }
          }
        }
      }
      //END MAC
			
			//Mobile
			if (/(en-us\/default\.aspx|en-us?$|en-us\/?$)/i.test(window.location)) {
        if(COMSCORE.SiteRecruit.device.type>1){
          csuu.createCookie("srMOB", "1", {path:'/',domain:csbc.cookie.domain,duration:'s'})
          COMSCORE.SiteRecruit.Broker.config.mobile.halt = false;
        }
			}
			
			COMSCORE.SiteRecruit.Broker.custom = {
				captLinks: function(u) {
					var v = csuu.getCookieValue('captLinks');
					var c = "";

					if (v == false) {
						c = escape(u) + ';';
					}
					else {
						if (c.length + v.length < 1440) {
							c = v + escape(u) + ';';
						}
					}

					if (c != "") {
						csuu.createCookie('captLinks', c, {path:'/',domain:csbc.cookie.domain,duration:'s'});
					}
				},

				allTags: function(x,x1,y,z) {
					/*
						x:  Tag type
						x1: Alt Match pattern
						y:  Match pattern
						z: 
		  	  				1 - CDDS
		  	  				2 - graceIncr
		  	  				3 - captLinks
					*/

					if (x == 'class') {
						if (/msie (8|7)/i.test(navigator.userAgent)) { return; }
						var aTags = document.getElementsByClassName(x1);
					}
					else {
						var aTags = document.getElementsByTagName(x);
					}

					var sr_r = new RegExp(y,'i');
					for (var i = 0; i < aTags.length; i++) {
				 		if ( (x == 'a' && sr_r.test(aTags[i].href)) || (x == 'class' && sr_r.test(aTags[i].innerHTML))	) {
							if (aTags[i].addEventListener) {
								this.href = aTags[i].href;
								if (z == 1) {
									aTags[i].addEventListener('click', function(event) {
										if (/go.microsoft.com/i.test(this.href) ) {
											var _clickURL = "";
											if (/LinkId\=258855/i.test(this.href)) {	_clickURL = "http://www.microsoftstore.com/store";	}
											if (/LinkId\=200036/i.test(this.href)) {	_clickURL = "http://www.xbox.com";	}
											if (/LinkId\=198372/i.test(this.href)) {	_clickURL = "http://www.windowsphone.com";	}
											if (/LinkId\=258852/i.test(this.href)) {	_clickURL = "http://products.office.com";	}

											if (_clickURL != "") {
												csuu.createCookie(csbc.domainSwitch, _clickURL, {path:'/',domain:csbc.cookie.domain,duration:'s'});
											}
										}
										else {
											if (sr_r.test(this.href)) {	csuu.createCookie(csbc.domainSwitch, this.href, {path:'/',domain:csbc.cookie.domain,duration:'s'})	}	
										}
									}, false);
								}
								else if (z == 2) {
									aTags[i].addEventListener('click',function(event){	csuu.createCookie("graceIncr", 1, {path:'/',domain:csbc.cookie.domain,duration:'s'})	},false);
								}
								else if (z == 3 && COMSCORE.isDDInProgress()) {
									aTags[i].addEventListener('click',function(event){ COMSCORE.SiteRecruit.Broker.custom.captLinks(this.href)	},false);	
								}
							}
							else if (aTags[i].attachEvent) {
								if (z == 1) {
									aTags[i].attachEvent('onclick', function(e) {
										if (/go.microsoft.com/i.test(this.href) ) {
											var _clickURL = "";
											if (/LinkId\=258855/i.test(this.href)) {	_clickURL = "http://www.microsoftstore.com/store";	}
											if (/LinkId\=200036/i.test(this.href)) {	_clickURL = "http://www.xbox.com";	}
											if (/LinkId\=198372/i.test(this.href)) {	_clickURL = "http://www.windowsphone.com";	}
											if (/LinkId\=258852/i.test(this.href)) {	_clickURL = "http://products.office.com";	}

											if (_clickURL != "") {
												csuu.createCookie(csbc.domainSwitch, _clickURL, {path:'/',domain:csbc.cookie.domain,duration:'s'});
											}
										}
										else {
											if (sr_r.test(e.srcElement)) {	csuu.createCookie(csbc.domainSwitch, e.srcElement, {path:'/',domain:csbc.cookie.domain,duration:'s'})		}
										}
									});
								}
								else if (z == 2) {
									aTags[i].attachEvent('onclick',function()	{	csuu.createCookie("graceIncr", 1, {path:'/',domain:csbc.cookie.domain,duration:'s'})	});
								}
								else if (z == 3 && COMSCORE.isDDInProgress()) {
									aTags[i].attachEvent('onclick',function()	{ 	COMSCORE.SiteRecruit.Broker.custom.captLinks(e.srcElement)	} );	
								}
							}
							else {}
						}
 					}
				},
				
				checkClickTaleData: function() {
          if(intMax > 0){
            intMax --;			
            try{
              if(ClickTaleGetPID() && ClickTaleGetSID() && ClickTaleGetUID()){
                COMSCORE.SiteRecruit.clickTaleData = ClickTaleGetPID() + "," + ClickTaleGetSID() + "," + ClickTaleGetUID();
                var c = 'sr_CT=' + COMSCORE.SiteRecruit.clickTaleData + '; path=/' + '; domain=' + COMSCORE.SiteRecruit.Broker.config.cookie.domain;
                document.cookie = c; 
                //("CT data loaded: " + COMSCORE.SiteRecruit.clickTaleData);
                COMSCORE.SiteRecruit.Broker.custom.clearClickTaleData();
              }
            }catch(err){	}
          }else{
            COMSCORE.SiteRecruit.Broker.custom.clearClickTaleData();
          }
        },
      
        clearClickTaleData: function() {
          window.clearInterval(CTDInterval);
        }

			};

      // Initialize CT data
      COMSCORE.SiteRecruit.clickTaleData = '';
      if(/en-us\/windows\/10/i.test(document.location.toString()) && document.cookie.indexOf('sr_CT') == -1 ){
        var intMax = 15;
        var CTDInterval = window.setInterval('COMSCORE.SiteRecruit.Broker.custom.checkClickTaleData()', '1000');
      }

			// Initialize graceIncr cookie
			var gIdelay = 0;
			if (COMSCORE.SiteRecruit.Utils.UserPersistence.getCookieValue("graceIncr") == 1) {	gIdelay = 5000;	}
			setTimeout(function(){COMSCORE.SiteRecruit.Utils.UserPersistence.createCookie("graceIncr", 0, {path:'/',domain:csbc.cookie.domain,duration:'s'})},gIdelay);
      setTimeout(function() { COMSCORE.SiteRecruit.Broker.custom.allTags(csbc.graceIncr.altTag,"msame_Header_name msame_TxtTrunc",csbc.graceIncr.htmlMatch,2) }, csbc.addEventDelay );

			// ADD onclick EVENTS FOR CDDS
			setTimeout(function() { COMSCORE.SiteRecruit.Broker.custom.allTags('a','',csbc.cddsDomains,1) }, csbc.addEventDelay );
			setTimeout(function() { COMSCORE.SiteRecruit.Broker.custom.allTags('a','',csbc.graceIncr.match,2) }, csbc.addEventDelay );

					}
	}
};

//CUSTOM - CHECK FOR THE CROSS-DOMAIN COOKIE. IF PRESENT, HALT RECRUITMENT AND SET DD TRACKING COOKIE
var crossDomainInterval = window.setInterval('COMSCORE.SiteRecruit.Broker.config.crossDomainCheck()', '1000');
//END CROSS_DOMAIN DEPARTURE FUNCTIONALITY

//CUSTOM - ADD 5 SECOND DELAY ON CALLING BROKER.RUN()
if (COMSCORE.SiteRecruit.Broker.delayConfig == true)  {
	COMSCORE.SiteRecruit.Broker.config.delay = 5000;
}
window.setTimeout('COMSCORE.SiteRecruit.Broker.run()', COMSCORE.SiteRecruit.Broker.config.delay);
//END CUSTOM