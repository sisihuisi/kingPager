/*
*  kingPager 根据kkpager分页插件修改来的
* ===============================================
*  kkpager V1.3
*  https://github.com/pgkk/kkpager
*  
*/
;(function($,window,undefind){
    //默认参数
    var default_config = {
        pagerid             : 'kingPager', //divID
        mode                : 'link', //模式(link 或者 click)
        pno                 : 1, //当前页码
        total               : 1, //总页码
        totalRecords        : 0, //总数据条数
        isShowFirstPageBtn  : true, //是否显示首页按钮
        isShowLastPageBtn   : true, //是否显示尾页按钮
        isShowPrePageBtn    : true, //是否显示上一页按钮
        isShowNextPageBtn   : true, //是否显示下一页按钮
        isShowCurrPage		: true, //是否显示当前页
        isShowTotalPage     : true, //是否显示总页数
        isShowTotalRecords  : true, //是否显示总记录数
        isGoPage            : true, //是否显示页码跳转输入框
        isWrapedPageBtns	: true,	//是否用span包裹住页码按钮
		isWrapedInfoTextAndGoPageBtn : true, //是否用span包裹住分页信息和跳转按钮
        hrefFormer          : 'kingPager', //链接前部
        hrefLatter          : '.html', //链接尾部
        gopageWrapClass     : 'gopageWrap',
        gopageButtonClass   : 'gopageBtn',
        gopageTextClass     : 'gopageText',
        lang                : {
            firstPageText           : '首页',
            firstPageTipText        : '首页',
            lastPageText            : '尾页',
            lastPageTipText         : '尾页',
            prePageText             : '上一页',
            prePageTipText          : '上一页',
            nextPageText            : '下一页',
            nextPageTipText         : '下一页',
            totalPageBeforeText     : '共',
            totalPageAfterText      : '页',
            currPageBeforeText		: '当前第',
			currPageAfterText		: '页',
			totalInfoSplitStr		: '/',
			totalRecordsBeforeText	: '共',
            totalRecordsAfterText   : '条数据',
            gopageBeforeText        : '转到',
            gopageButtonOkText      : '确定',
            gopageAfterText         : '页',
            buttonTipBeforeText     : '第',
            buttonTipAfterText      : '页'
        },
        //页码单击事件处理函数（当处于click模式）,参数n为页码
        click : function(n){
            //这里自己实现
            //这里可以用this访问
            this.selectPage(n);
            return false;
        },
        //获取href的值（当处于click模式）,参数n为页码
        getHref : function(n){
            //默认返回'#'+n
            return ('#'+n);
        },
        //链接算法（当处于link模式）,参数n为页码
        getLink:function(n){
            //这里的算法适用于比如：
            //hrefFormer=http://www.xx.com/news/20131212
            //hrefLatter=.html
            //那么首页（第1页）就是http://www.xx.com/news/20131212.html
            //第2页就是http://www.xx.com/news/20131212_2.html
            //第n页就是http://www.xx.com/news/20131212_n.html
            if(n == 1){
                return this.hrefFormer + this.hrefLatter;
            }
            return this.hrefFormer + '_' + n + this.hrefLatter;
        }
    };
    function kingPager(element,config){
        this.userOptions = config;
        this.defaultOptions = default_config;
        this.options = $.extend(true,{},this.defaultOptions,this.userOptions);
        this.element = element || $("#"+this.options.pagerid);
        this.paintPagingHtml(this.options);
    }
    kingPager.prototype = {
        init:function(config){//初始化配置参数
            this.options.pno = isNaN(config.pno) ? 1 : parseInt(config.pno);
            this.options.total = isNaN(config.total) ? 1 : parseInt(config.total);
            this.options.totalRecords = isNaN(config.totalRecords) ? 0 : parseInt(config.totalRecords);
            if(!this._config){ this._config = config; }
			if(config.pagerid){this.options.pagerid = config.pagerid;}
			if(config.mode){this.options.mode = config.mode;}
			if(config.gopageWrapClass){this.options.gopageWrapClass = config.gopageWrapClass;}
			if(config.gopageButtonClass){this.options.gopageButtonClass = config.gopageButtonClass;}
			if(config.gopageTextboxId){this.options.gopageTextboxId = config.gopageTextboxId;}
			if(config.isShowFirstPageBtn != undefined){this.options.isShowFirstPageBtn=config.isShowFirstPageBtn;}
			if(config.isShowLastPageBtn != undefined){this.options.isShowLastPageBtn=config.isShowLastPageBtn;}
			if(config.isShowPrePageBtn != undefined){this.options.isShowPrePageBtn=config.isShowPrePageBtn;}
			if(config.isShowNextPageBtn != undefined){this.options.isShowNextPageBtn=config.isShowNextPageBtn;}
			if(config.isShowTotalPage != undefined){this.options.isShowTotalPage=config.isShowTotalPage;}
			if(config.isShowCurrPage != undefined){this.options.isShowCurrPage=config.isShowCurrPage;}
			if(config.isShowTotalRecords != undefined){this.options.isShowTotalRecords=config.isShowTotalRecords;}
			if(config.isWrapedPageBtns){this.options.isWrapedPageBtns=config.isWrapedPageBtns;}
			if(config.isWrapedInfoTextAndGoPageBtn){this.options.isWrapedInfoTextAndGoPageBtn=config.isWrapedInfoTextAndGoPageBtn;}
			if(config.isGoPage != undefined){this.options.isGoPage=config.isGoPage;}
			if(config.lang){ for(var key in config.lang){ this.options.lang[key] = config.lang[key]; } }
			this.options.hrefFormer = config.hrefFormer || '';
			this.options.hrefLatter = config.hrefLatter || '';
			if(config.getLink && typeof(config.getLink) == 'function'){this.options.getLink = config.getLink;}
			if(config.click && typeof(config.click) == 'function'){this.options.click = config.click;}
			if(config.getHref && typeof(config.getHref) == 'function'){this.options.getHref = config.getHref;}
            
            //validate
            if(this.options.pno < 1) this.options.pno = 1;
            this.options.total = (this.options.total <= 1) ? 1: this.options.total;
            if(this.options.pno > this.options.total) this.options.pno = this.options.total;
            this.options.prv = (this.options.pno<=2) ? 1 : (this.options.pno-1);
            this.options.next = (this.options.pno >= this.options.total-1) ? this.options.total : (this.options.pno + 1);
            this.options.hasPrv = (this.options.pno > 1);
            this.options.hasNext = (this.options.pno < this.options.total);
            this.inited = true;
        },
        selectPage : function(n){//不刷新页面直接手动调用选中某一页码
            this._config['pno'] = n;
            this.paintPagingHtml(this._config,true);
        },
        paintPagingHtml:function(config,enforceInit){//生成控件代码
            if(enforceInit || !this.inited){
                this.init(config);
            }
            var str_first='',str_prv='',str_paging = '',str_next='',str_last='',str_total_info='',str_gopage_info='';
            var dot = '<span class="spanDot">...</span>',str_all ='';
            //显示首页
            if(this.options.isShowFirstPageBtn){
                if(this.options.hasPrv){
                    str_first = '<a '+this._getHandlerStr(1)+' title="'
                        +(this.options.lang.firstPageTipText || this.options.lang.firstPageText)+'">'+this.options.lang.firstPageText+'</a>';
                }else{
                    str_first = '<span class="disabled">'+this.options.lang.firstPageText+'</span>';
                }
            }
            //显示上一页
            if(this.options.isShowPrePageBtn){
                if(this.options.hasPrv){
                    str_prv = '<a '+this._getHandlerStr(this.options.prv)+' title="'
                        +(this.options.lang.prePageTipText || this.options.lang.prePageText)+'">'+this.options.lang.prePageText+'</a>';
                }else{
                    str_prv = '<span class="disabled">'+this.options.lang.prePageText+'</span>';
                }
            }
            //显示下一页
            if(this.options.isShowNextPageBtn){
                if(this.options.hasNext){
                    str_next = '<a '+this._getHandlerStr(this.options.next)+' title="'
                        +(this.options.lang.nextPageTipText || this.options.lang.nextPageText)+'">'+this.options.lang.nextPageText+'</a>';
                }else{
                    str_next = '<span class="disabled">'+this.options.lang.nextPageText+'</span>';
                }
            }
            //显示尾页
            if(this.options.isShowLastPageBtn){
                if(this.options.hasNext){
                    str_last = '<a '+this._getHandlerStr(this.options.total)+' title="'
                        +(this.options.lang.lastPageTipText || this.options.lang.lastPageText)+'">'+this.options.lang.lastPageText+'</a>';
                }else{
                    str_last = '<span class="disabled">'+this.options.lang.lastPageText+'</span>';
                }
            }
            
            var str = '';
			var dot = '<span class="spanDot">...</span>';
			var total_info='<span class="totalText">';
			var total_info_splitstr = '<span class="totalInfoSplitStr">'+this.options.lang.totalInfoSplitStr+'</span>';
			if(this.options.isShowCurrPage){
				total_info += this.options.lang.currPageBeforeText + '<span class="currPageNum">' + this.options.pno + '</span>' + this.options.lang.currPageAfterText;
				if(this.options.isShowTotalPage){
					total_info += total_info_splitstr;
					total_info += this.options.lang.totalPageBeforeText + '<span class="totalPageNum">'+this.options.total + '</span>' + this.options.lang.totalPageAfterText;
				}else if(this.options.isShowTotalRecords){
					total_info += total_info_splitstr;
					total_info += this.options.lang.totalRecordsBeforeText + '<span class="totalRecordNum">'+this.options.totalRecords + '</span>' + this.options.lang.totalRecordsAfterText;
				}
			}else if(this.options.isShowTotalPage){
				total_info += this.options.lang.totalPageBeforeText + '<span class="totalPageNum">'+this.options.total + '</span>' + this.options.lang.totalPageAfterText;;
				if(this.options.isShowTotalRecords){
					total_info += total_info_splitstr;
					total_info += this.options.lang.totalRecordsBeforeText + '<span class="totalRecordNum">'+this.options.totalRecords + '</span>' + this.options.lang.totalRecordsAfterText;
				}
			}else if(this.options.isShowTotalRecords){
				total_info += this.options.lang.totalRecordsBeforeText + '<span class="totalRecordNum">'+this.options.totalRecords + '</span>' + this.options.lang.totalRecordsAfterText;
			}
			total_info += '</span>';
            
            
            //分页处理
            if(this.options.total <= 8){
                for(var i=1;i<=this.options.total;i++){
                    if(this.options.pno == i){
                        str += '<span class="curr">'+i+'</span>';
                    }else{
                        str += '<a '+this._getHandlerStr(i)+' title="'
                            +this.options.lang.buttonTipBeforeText + i + this.options.lang.buttonTipAfterText+'">'+i+'</a>';
                    }
                }
            }else{
                if(this.options.pno <= 5){
                    for(var i=1;i<=8;i++){
                        if(this.options.pno == i){
                            str += '<span class="curr">'+i+'</span>';
                        }else{
                            str += '<a '+this._getHandlerStr(i)+' title="'+
                                this.options.lang.buttonTipBeforeText + i + this.options.lang.buttonTipAfterText+'">'+i+'</a>';
                        }
                    }
                }else{
                    str += '<a '+this._getHandlerStr(1)+' title="'
                        +this.options.lang.buttonTipBeforeText + '1' + this.options.lang.buttonTipAfterText+'">1</a>';
                    /*      str += '<a '+this._getHandlerStr(2)+' title="'
                     +this.lang.buttonTipBeforeText + '2' + this.lang.buttonTipAfterText +'">2</a>';*/
                    str += dot;
 
                    var begin = this.options.pno - 2;
                    var end = this.options.pno + 2;
                    if(end > this.options.total){
                        end = this.options.total;
                        begin = end - 4;
                        if(this.options.pno - begin < 2){
                            begin = begin-1;
                        }
                    }else if(end + 1 == this.options.total){
                        end = this.options.total;
                    }
                    for(var i=begin;i<=end;i++){
                        if(this.options.pno == i){
                            str += '<span class="curr">'+i+'</span>';
                        }else{
                            str += '<a '+this._getHandlerStr(i)+' title="'
                                +this.options.lang.buttonTipBeforeText + i + this.options.lang.buttonTipAfterText+'">'+i+'</a>';
                        }
                    }
                    if(end != this.options.total){
                        str += dot;
                        //add
                        str+='<a '+this._getHandlerStr(this.options.total)+' title="'
                            +this.options.lang.buttonTipBeforeText + this.options.total + this.options.lang.buttonTipAfterText+'">'+this.options.total+'</a>';
                    }
                }
            }
            
            //显示跳转
            if(this.options.isGoPage){
                str_gopage_info = '&nbsp;'+this.options.lang.gopageBeforeText+'<span class="'+this.options.gopageWrapClass+'">'+
                    '<input type="button" class="'+this.options.gopageButtonClass+'" value="'+this.options.lang.gopageButtonOkText+'" />'+
                    '<input type="text" class="'+this.options.gopageTextClass+'" value="'+this.options.next+'" /></span>'
                    +this.options.lang.gopageAfterText;
            }
 
            //分页处理
			var pagerHtml = '';
			if(this.options.isWrapedPageBtns){
				pagerHtml += '<span class="pageBtnWrap">' + str_first + str_prv + str + str_next + str_last + '</span>'
			}else{
				pagerHtml += str_first + str_prv + str + str_next + str_last;
			}
			if(this.options.isWrapedInfoTextAndGoPageBtn){
				pagerHtml += '<span class="infoTextAndGoPageBtnWrap">' + total_info + str_gopage_info + '</span>';
			}else{
				pagerHtml += total_info + str_gopage_info;
			}
			this.element.html(pagerHtml);
            
            if(this.options.mode == "click"){
                this._bindEventPaging();
            }
            this.options.isGoPage && this._bindEventGoPage();
        },
        _bindEventPaging:function(){//绑定事件-分页
            var me = this;
            this.element.find("a").off("click").on("click",function(){//分页
                var pno = $(this).attr("href").slice(1);
                    me._clickHandler.call(me,pno);
            })
        },
        _bindEventGoPage:function(){
            var me = this;
            this.element.find('.'+this.options.gopageTextClass).off("focus blur keypress").on("focus blur keypress",function(event){//text
                if(event.type =="focus"){
                    me.focus_gopage();
                }else if(event.type =="blur"){
                    me.blur_gopage();
                }else if(event.type =="keypress"){
                    me.keypress_gopage();
                }
 
            })
            this.element.find('.'+this.options.gopageButtonClass).off("focus blur keypress").on("focus blur keypress",function(event){//btn
                me.gopage()
            })
        },
        //跳转框得到输入焦点时
        focus_gopage :function (){
            var $btnGo =  this.element.find('.'+this.options.gopageButtonClass);
            var $txtGo = this.element.find('.'+this.options.gopageTextClass);
            var $wrapGo = this.element.find('.'+this.options.gopageWrapClass);
            $txtGo.attr('hideFocus',true);
            $btnGo.css({'left':'0px'}).show().animate({left: '+=40'}, 50);
        },
        //跳转框失去输入焦点时
        blur_gopage : function(){
            var $btnGo =  this.element.find('.'+this.options.gopageButtonClass);
            var $wrapGo = this.element.find('.'+this.options.gopageWrapClass);
            this.setTimeOutID && clearTimeout(this.setTimeOutID);
            this.setTimeOutID = setTimeout(function(){
                $btnGo.animate({left: '-=40'}, 100, function(){
                    $btnGo.css({ "left":"0px"}).hide();
                });
            },400);
        },
        //跳转输入框按键操作
        keypress_gopage : function(){
            var event = arguments[0] || window.event;
            var code = event.keyCode || event.charCode;
            //delete key
           // if(code == 8) return true;
            //enter key
            if(code == 13){
                this.gopage();
                return false;
            }
            //copy and paste
            if(event.ctrlKey && (code == 99 || code == 118)) return true;
            //only number key
            if(code<48 || code>57)return false;
            return true;
        },
        //跳转框页面跳转
        gopage : function(){
            var $txtGo = this.element.find('.'+this.options.gopageTextClass);
            var str_page = $txtGo.val();
            if(isNaN(str_page)){
                $txtGo.val(this.options.next);
                return;
            }
            var n = parseInt(str_page);
            if(n < 1) n = 1;
            if(n > this.options.total) n = this.options.total;
            if(this.options.mode == 'click'){
                this._clickHandler(n);
            }else{
                window.location = this.options.getLink.call(this.options,n);
            }
        },
        _getHandlerStr:function(n){
            if(this.options.mode == 'click'){
                return 'href="'+this.options.getHref(n)+'""';
            }
            //link模式，也是默认的
            // 注意改变了this指向
            return 'href="'+this.options.getLink.call(this.options,n)+'"';
        },
        _clickHandler:function(n){
            var res = false;
            if(this.options.click && typeof this.options.click == 'function'){
                res = this.options.click.call(this,n) || false;
            }
            return res;
        }
    };
 
    window.kingPager = kingPager;
    $.fn.kingPager = function(options) {
        return this.each(function() {
            if (!$(this).data('kingPager')) {
                $(this).data('kingPager', new kingPager($(this), options));
            }
        });
    };
    
})(jQuery,window);