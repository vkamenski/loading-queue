;(function ($) {
	
	var pluginName = 'loadingQueue';
	
	var queue = new Array();
	
	var loading = false;
	
	var dequeue = function () {
		
		var item = queue.shift();
		
		if(item) {
			
			loading = true;
			
			var src = item.image.data('src');
			
			item.image
				.on('load', function() {
					
					item.def.resolve(item.image);
					dequeue();
				})
				.on('error', function() {
					
					item.def.reject(item.image);
					dequeue();
				})
				.attr('src', src);
			
		} else {
			loading = false;
		}
	};
		
	var enqueue = function(image) {
		
		var def = $.Deferred();
		
		queue.push({
			def: def,
			image: $(image)
		});
				
		return def.promise();
	};
		
	$.fn[pluginName] = function (options) {
		
		var def = enqueue($(this));
		
		if(!loading) {
			dequeue();
		}
		
		return def;
	};
	
})(jQuery);
