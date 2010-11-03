/**
 * Copyright (c) 2010 Vladimir Savenkov <iVariable@gmail.com>
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) licenses.
 * 
 * Version: 0.1
 *
 * Demo and documentation: (LINK)
 */
jQuery.fn.isInViewPort = function( options ){
	
	var options = jQuery.extend({
		vertical: true,
		horizontal: true		
	},options);
	
	return this.map(function() {
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
	
};