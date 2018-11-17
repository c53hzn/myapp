var app = new Vue({
	el: "#app",
	data: {
		slide_visible: true,
		curr_slide: 0,
		slides_class: {
			0: "slide-visible",
			1: "slide-hidden",
			2: "slide-hidden",
			3: "slide-hidden"
		},
		slide_auto_play_status: true,
		slide_play_time: 2000,
		slide_timer: null
	},
	mounted: function () {
		this.slide_auto_play();
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
		},
		slide_resume_play: function (){
			var that = this;
			that.slide_timer = setTimeout(that.slide_auto_play, that.slide_play_time + 500);
		}
	}
})