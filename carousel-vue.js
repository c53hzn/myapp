var app = new Vue({
	el: "#app",
	data: {
		slide_visible: true,
		curr_slide: 0,
		slides_pics: {
			0: "https://images.pexels.com/photos/733475/pexels-photo-733475.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
			1: "https://images.pexels.com/photos/258112/pexels-photo-258112.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
			2: "https://images.pexels.com/photos/239107/pexels-photo-239107.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
			3: "https://images.pexels.com/photos/166422/pexels-photo-166422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
			4: "https://images.pexels.com/photos/316010/pexels-photo-316010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
			5: "https://images.pexels.com/photos/424176/pexels-photo-424176.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
		},
		slides_class: {},
		slide_auto_play_status: true,
		slide_play_time: 2000,
		slide_timer: null
	},
	mounted: function () {
		var that = this;
		var pics = that.slides_pics;
		var num_of_pics = 0;
		var slides_class = {};
		for (var key in pics) {
			num_of_pics++;
			if (num_of_pics == 1) {
				slides_class[0] = "slide-visible";
			} else {
				slides_class[num_of_pics - 1] = "slide-hidden";
			}
		}
		that.slides_class = slides_class;
		that.slide_auto_play();
	},
	methods: {
		slide_to_left: function (curr_slide) {
			var that = this;
			var class_len = 0;
			for (let key in that.slides_class) {
				class_len++;
			}
			if (curr_slide == 0) {
				that.curr_slide = class_len - 1;
				that.slides_class[class_len - 1] = "slide-visible";
				that.slides_class[curr_slide] = "slide-hidden";
			} else {
				that.curr_slide--;
				that.slides_class[that.curr_slide] = "slide-visible";
				that.slides_class[curr_slide] = "slide-hidden";
			}
		},
		slide_to_right: function (curr_slide) {
			var that = this;
			var class_len = 0;
			for (let key in that.slides_class) {
				class_len++;
			}
			if (curr_slide == class_len - 1) {
				that.curr_slide = 0;
				that.slides_class[0] = "slide-visible";
				that.slides_class[curr_slide] = "slide-hidden";
			} else {
				that.curr_slide++;
				that.slides_class[that.curr_slide] = "slide-visible";
				that.slides_class[curr_slide] = "slide-hidden";
			}
		},
		slide_auto_play: function () {
			var that = this;
			if (that.slide_auto_play_status && that.slide_timer) {
				that.slide_to_right(that.curr_slide);
				that.slide_timer = setTimeout(that.slide_auto_play, that.slide_play_time + 500);
			} else if (that.slide_auto_play_status && !that.slide_timer) {
				that.slide_timer = setTimeout(that.slide_auto_play, that.slide_play_time + 500);
			}
		},
		slide_clear_play: function () {
			clearTimeout(this.slide_timer);
			this.slide_timer = null;
		},
		slide_resume_play: function (){
			var that = this;
			if (that.slide_auto_play_status) {
				that.slide_timer = setTimeout(that.slide_auto_play, that.slide_play_time + 500);
			}
		}
	}
})
