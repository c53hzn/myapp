var app = new Vue({
	el: "#app",
	data: {
		slide_visible: true,
		curr_slide: 0,
		slides_pics: {
			0: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542542516107&di=bc507d5d579731b4afeb0f1586e5cfc4&imgtype=jpg&src=http%3A%2F%2Fimg0.imgtn.bdimg.com%2Fit%2Fu%3D3359563525%2C451028734%26fm%3D214%26gp%3D0.jpg",
			1: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542542514942&di=7a457790fd6dbef48845c9d6fb167d60&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01b2e159f1b540a801216a4be8b96d.jpg%401280w_1l_2o_100sh.jpg",
			2: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542542514939&di=681959ab3d1f6a40a415b0791a226cf0&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F038fbce55dea4370000015995570a1d.jpg",
			3: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542542514937&di=098486eea42798d3b194d126dcdb87eb&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fae51f3deb48f8c541c8cf00131292df5e0fe7f44.jpg",
			4: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542542514935&di=582ce1b4c0046da6cc25a7eef3f67133&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fdbb44aed2e738bd4e0bd340aaa8b87d6277ff969.jpg",
			5: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542542514933&di=8127b1d4e5c828f203e8f5c99ddb5997&imgtype=0&src=http%3A%2F%2Fpic40.photophoto.cn%2F20160822%2F0011024058227686_b.jpg"
		},
		slides_class: {
			0: "slide-visible",
			1: "slide-hidden",
			2: "slide-hidden",
			3: "slide-hidden",
			4: "slide-hidden",
			5: "slide-hidden"
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