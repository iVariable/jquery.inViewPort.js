/**
 * Copyright (c) 2010 Vladimir Savenkov <iVariable@gmail.com>
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 * 
 * Version: 0.2
 *
 * Demo and documentation: (LINK)
 */
(function( $ ){
	 var methods = {
		determine : function( options ) { 
		
			var options = jQuery.extend({
				vertical: true,
				horizontal: true,
				returnArrayOnOneElement: false		
			},options);
			
			var mReturn = this.map(function() {
				var bResult = false;
				
				offset = jQuery(this).offset();		
				if( offset == null ) return false;
				
				viewTop = $(document).scrollTop();
				viewBottom = viewTop + $(window).height();
				
				viewLeft = $(document).scrollLeft();
				viewRight = viewLeft + $(window).width();
				
				options.vertical = !!options.vertical;
				options.horizontal = !!options.horizontal;
				
				if( options.vertical ){
					bResult = ( offset.top > viewTop && offset.top < viewBottom );
				}
				
				if( options.horizontal ){
					bResultH = ( offset.left > viewLeft && offset.left < viewRight );
					if( options.vertical ){
						bResult = bResult && bResultH;
					}else{
						bResult = bResultH;
					}
				}
		
				return bResult;
			});
			
			if( !options.returnArrayOnOneElement && (mReturn.length == 1) ){
				mReturn = mReturn.get(0);
			}
			return mReturn;
			
		},
		
		getDetector: function( options ){
			return jQuery( this ).map(function() {		
				
				element = jQuery( this );
				
				var detector = element.data( 'detector_inViewPort' );		
				if (detector !== null) {
					if( arguments.length !=0 ) detector.setOptions(options);
					return detector;
				}
				
				detector = new helpers.detector( element, options );		
				element.data( 'detector_inViewPort', detector );
				
				return detector;
				
			});
		},
		
		enter : function( options ) {
			if( typeof options === 'function' ) options = { callback: options };
			var options = jQuery.extend({
				enabledEnter: true,				
				callback: function(){
					alert('Callback must be defined!');
				}		
			},options);
			
			options.enter = options.callback;			
			this.inViewPort( 'getDetector', options );	
			jQuery(  this.inViewPort( 'getDetector') ).map(function(){ this.options.inViewPort = null; this.trigger()})		
			return this;
		},
		leave : function( options ) {
			if( typeof options === 'function' ) options = { callback: options };
			var options = jQuery.extend({
				enabledLeave: true,				
				callback: function(){
					alert('Callback must be defined!');
				}		
			},options);			
			
			options.leave = options.callback;			
			this.inViewPort( 'getDetector', options );
			jQuery(  this.inViewPort( 'getDetector') ).map(function(){ this.options.inViewPort = null; this.trigger()})			
			return this;
		}
		
	};

	var helpers = {
		detector: function ( element, options ){	
	
			this.options = {
				scroll4Element: element,
				
				enabledEnter: true,
				enabledLeave: true,
				
				inViewPort: null,
				
				stopEnterEventAfterFirstTrigger: true,
				stopLeaveEventAfterFirstTrigger: true,
				
				stopAfterFirstTrigger: false,
				
				enter: function( detector ){},
				leave: function( detector ){}
			}	
		
			this.setOptions = function (options){
				this.options = jQuery.extend(this.options,options);	
			}
			
			this.trigger = function(){	
							
				if( this.options.enabledEnter && ( jQuery( this.getLinkedElement() ).inViewPort() && ( this.options.inViewPort === null || !this.options.inViewPort ) ) ){										
					this.enter();
				}		
				
				if( this.options.enabledLeave && ( !jQuery( this.getLinkedElement() ).inViewPort() && ( this.options.inViewPort ===null || this.options.inViewPort )) ){					
					this.leave();
				}				
				this.options.inViewPort = jQuery( this.getLinkedElement() ).inViewPort();
			}
			
			
			this.enter = function(){
				if( this.options.stopEnterEventAfterFirstTrigger ) this.stop( 'enter' );
				if( this.options.stopAfterFirstTrigger ) this.stop();								
				this.options.enter( this );	
				return this;	
			}
			
			this.leave = function(){
				if( this.options.stopLeaveEventAfterFirstTrigger ) this.stop( 'leave' );
				if( this.options.stopAfterFirstTrigger ) this.stop();												
				this.options.leave( this );	
				return this;
			}
			
			this.stop = function(){
				var action = 'all';
				if( arguments.length == 1 ){
					action = arguments[0];
				}				
				switch( action ){
					
					case 'enter':
						this.options.enabledEnter = false;
					break;
					
					case 'leave':					
						this.options.enabledLeave = false;
					break;
					
					default:					
						this.options.enabledEnter = false;
						this.options.enabledLeave = false;
					break;					
				}
				return this;
			}
			
			this.start = function(){
				var action = 'all';
				if( arguments.length == 1 ){
					action = arguments[0];
				}
				switch( action ){
					
					case 'enter':
						this.options.enabledEnter = true;
					break;
					
					case 'leave':
						this.options.enabledLeave = true;
					break;
					
					default:
						this.options.enabledEnter = true;
						this.options.enabledLeave = true;
					break;					
				}				
				this.options.inViewPort = null;
				this.trigger();				
				return this;
			}			
			
			this.getLinkedElement = function(){
				return this.options.scroll4Element;
			}
			
			
			//===INIT===//
			this.setOptions(options);
			var detector = this;	
			
			jQuery( element ).mouseover( function(){ detector.trigger() } ).click( function(){ detector.trigger() } );
			
						
			jQuery(window).scroll(function(){
				detector.trigger();				
			});			
			
			detector.trigger();
		}
	}
	
	$.fn.inViewPort = function( method ) {  
		if( methods[method] ){
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}else if( typeof method === 'object' || ! method ) {
			return methods.determine.apply( this, arguments );
		}else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}
	};
})( jQuery );