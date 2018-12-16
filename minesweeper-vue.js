function toGetRandomNum(min, max, num) {
	//生成指定范围，指定数量的随机数
	var arr = [];
	var tempObj = {};
	var index = -1;

	function toGenerateNth() {
		if (arr.length < num) {
			index = parseInt(Math.random() * max, 10) + min;
			if (!tempObj[index]) {
				tempObj[index] = true;
				arr.push(index);
				toGenerateNth();
			} else {
				toGenerateNth();
			}
		}
	}
	toGenerateNth();
	return arr;
}

function minesweeper(matrix) {
	var num_col = {
		"💥": "black",
		0: "transparent",
		1: "blue",
		2: "green",
		3: "red",
		4: "darkblue",
		5: "darkred",
		6: "#2d6d5d",
		7: "black",
		8: "rgb(128, 128, 128)"
	}
	//给雷区加上边界
	function toExpand(arr) {
		var line = [];
		var newArr = [];
		var obj = {
			"mine": false,
			"num": -1,
			"crossed": false,
			"flagged": false,
			"exposed": false,
			"color": "transparent"
		};
		for (var i = 0; i < arr[0].length + 2; i++) {
			line.push(obj);
		}
		newArr.push(line);
		for (var j = 0; j < arr.length; j++) {
			arr[j].unshift(obj);
			arr[j].push(obj);
			newArr.push(arr[j]);
		}
		newArr.push(line);
		return newArr;
	}
	//给每一个方格计算数字
	function toBlur(arr) {
		var sum = 0;
		for (var i = 0; i < arr.length; i++) {
			for (var j = 0; j < arr[i].length; j++) {
				//9宫格正中间的不参与计算，第二个的index是1不是222！！！
				if (arr[i][j].mine && !(i == 1 && j == 1)) {
					sum++;
				}
			}
		}
		if (arr[1][1].mine) {
			arr[1][1].num = "💥";
		} else {
			arr[1][1].num = sum;
		}
		arr[1][1].color = num_col[arr[1][1].num];
		return arr[1][1];
	}
	var expanded = toExpand(matrix); //加了边界的雷区
	var newMatrix = []; //用来存放标记了数字的雷区
	for (let i = 0; i < expanded.length - 2; i++) {
		var newLine = [];
		for (let j = 0; j < expanded[i].length - 2; j++) {
			var line = [];
			line.push(expanded[i].slice(j, j + 3)); //从第j个到第j+3前面的那个: j, j+1, j+2
			line.push(expanded[i + 1].slice(j, j + 3));
			line.push(expanded[i + 2].slice(j, j + 3));
			newLine.push(toBlur(line));
		}
		newMatrix.push(newLine);
	}
	return newMatrix;
}

function makeMatrix(a, b, c) { //a是row，b是col, c是雷数
	console.log("a = " + a + ", b = " + b)
	if (c > (a-1) * (b-1) - 1) {
		alert("雷区太小，地雷太多，没法玩啦");
		return;
	}
	var matrix = [];
	for (let j = 0; j < a; j++) {
		var line = [];
		for (let i = 0; i < b; i++) {
			var obj = {
				"mine": false,
				"num": -1,
				"crossed": false,
				"flagged": false,
				"exposed": false,
				"color": "transparent"
			};
			line.push(obj);
		}
		matrix.push(line);
	}
	var nthMine = toGetRandomNum(0, a * b - 1, c);
	for (let n = 0; n < nthMine.length; n++) {
		matrix[Math.floor(nthMine[n] / b)][nthMine[n] % b].mine = true;
	}
	//返回的object矩阵里的雷已经设置好了，但是数字还是-1
	var matrix_with_mine = minesweeper(matrix);
	//现在数字都齐全了
	return matrix_with_mine;
}


var app = new Vue({
	el: "#app",
	data: {
		minefield: [],
		game_on: true,
		gear_class: "untouched",
		face_class: "untouched",
		flag_btn_class: "untouched",
		flag_btn_status: "off",
		line_width: 0,
		mine_row: 0,
		mine_col: 0,
		num_of_mine: 0,
		num_of_mine_left: 0,
		time_start: "",
		timer: null,
		time_spent: 0,
		block_touched: [],
		last_touchend: "",
		slide_visible: false,
		curr_slide: 0,
		slides_class: {
			0: "slide-visible",
			1: "slide-hidden",
			2: "slide-hidden",
			3: "slide-hidden"
		},
		mine_max: 0,
		mine_input: 0,
		best_5_score: [],
		liHTML: "<li>无</li><li>无</li><li>无</li><li>无</li><li>无</li>",
		notWinning: true
	},
	mounted: function () {
		let w = window.innerWidth;
		let h = window.innerHeight;

		console.log("w = " + w + "px, h = " + h + "px")
		var mine_row, mine_col, num_of_mine, mine_max, mine_input;
		if (w < 768) {
			mine_row = Math.floor(h / 32) - 2;
			mine_col = Math.floor(w / 32);
			num_of_mine = 10;
			mine_input = 10;
			mine_max = 20;
		} else {
			mine_row = Math.floor(h / 32) - 3;
			mine_col = Math.floor(w / 32) - 4;
			num_of_mine = 20;
			mine_input = 20;
			mine_max = 99;
		}
		this.line_width = mine_col * 32;
		this.mine_row = mine_row;
		this.mine_col = mine_col;
		this.num_of_mine = num_of_mine;
		this.mine_input = mine_input;
		this.num_of_mine_left = num_of_mine;
		this.mine_max = mine_max;
		var mine_matrix = makeMatrix(mine_row, mine_col, num_of_mine);
		this.minefield = mine_matrix;
	},
	methods: {
		add_drop_flag: function (block) {
			var that = this;
			if (that.game_on) {
				if (block.flagged) {
					block.flagged = false;
					that.num_of_mine_left++;
				} else {
					if (!block.exposed) {
						block.flagged = true;
						that.num_of_mine_left--;
					}
				}
				if (!that.time_start) {
					that.timer_func();
				}
			}
		},
		expose_block: function (block, row, col) {
			var that = this;
			var minefield = that.minefield;
			var row_len = minefield.length;
			var col_len = minefield[0].length;
			if (that.game_on && that.flag_btn_status == "off") {
				if (!block.flagged) { //没有旗标
					//翻开方块
					block.exposed = true;
					if (block.mine) { //踩雷了
						that.game_on = false; //游戏结束
						that.mine_exploded();
					} else {
						//不是雷，判断数字是否为0
						if (block.num == 0) {
							that.expose_other(minefield[row][col], row, col);
						}
						that.test_clearance();
					}
				}
			} else if (that.game_on && that.flag_btn_status == "on") {
				that.add_drop_flag(block);
			}
			if (that.game_on && !that.time_start) {
				that.timer_func();
			}
		},
		expose_other: function (block, row, col) {
			if (block.exposed) {
				var that = this;
				var minefield = that.minefield;
				var row_len = minefield.length;
				var col_len = minefield[0].length;
				var block_arr = that.get_other_blocks(minefield, row, col);
				var coordinates = that.get_other_coordinates(row, col);
				for (let i = 0; i < 8; i++) {
					if (block_arr[i]) {
						if (!block_arr[i].flagged) { //没有旗标
							if (!block_arr[i].mine && !block_arr[i].exposed) { //没有地雷
								//那就翻开方块
								block_arr[i].exposed = true;
								let new_row = coordinates[i][0];
								let new_col = coordinates[i][1];
								if (block_arr[i].num == 0) {
									that.expose_other(minefield[new_row][new_col], new_row, new_col);
								}
							}
						}
					}
				}
				that.test_clearance();
			}
		},
		dblclick_expose: function (block, row, col) {
			var that = this;
			if (that.flag_btn_status == "off") {
				var minefield = that.minefield;
				var block_arr = that.get_other_blocks(minefield, row, col);
				var blk_flagged = 0;
				var wrong_flagged = 0;
				for (let i = 0; i < 8; i++) {
					if (block_arr[i]) {
						if (block_arr[i].flagged) {
							blk_flagged++;
							if (!block_arr[i].mine) {
								wrong_flagged++;
							}
						}
					}
				}
				if (wrong_flagged) {
					that.mine_exploded();
				} else {
					if (blk_flagged == block.num) {
						that.expose_other(minefield[row][col], row, col);
					}
				}
			}
		},
		mine_exploded: function () {
			var that = this;
			var minefield = that.minefield;
			var row_len = minefield.length;
			var col_len = minefield[0].length;
			for (let i = 0; i < row_len; i++) {
				for (let j = 0; j < col_len; j++) {
					if (minefield[i][j].mine && !minefield[i][j].flagged) {
						that.minefield[i][j].exposed = true;
					} else if (!minefield[i][j].mine && minefield[i][j].flagged) {
						that.minefield[i][j].crossed = true;
					}
				}
			}
			that.clear_timeout();
		},
		get_other_blocks: function (matrix, row, col) {
			var row_len = matrix.length;
			var col_len = matrix[0].length;
			var block_arr = [];
			if (row - 1 == -1 || col - 1 == -1) {
				block_arr.push(undefined);
			} else {
				block_arr.push(matrix[row - 1][col - 1]);
			}
			if (row - 1 == -1) {
				block_arr.push(undefined);
			} else {
				block_arr.push(matrix[row - 1][col]);
			}
			if (row - 1 == -1 || col + 1 == col_len) {
				block_arr.push(undefined);
			} else {
				block_arr.push(matrix[row - 1][col + 1]);
			}
			if (col - 1 == -1) {
				block_arr.push(undefined);
			} else {
				block_arr.push(matrix[row][col - 1]);
			}
			if (col + 1 == col_len) {
				block_arr.push(undefined);
			} else {
				block_arr.push(matrix[row][col + 1]);
			}
			if (row + 1 == row_len || col - 1 == -1) {
				block_arr.push(undefined);
			} else {
				block_arr.push(matrix[row + 1][col - 1]);
			}
			if (row + 1 == row_len) {
				block_arr.push(undefined);
			} else {
				block_arr.push(matrix[row + 1][col]);
			}
			if (row + 1 == row_len || col + 1 == col_len) {
				block_arr.push(undefined);
			} else {
				block_arr.push(matrix[row + 1][col + 1]);
			}
			return block_arr;
		},
		get_other_coordinates: function (row, col) {
			var coordinates = [];
			coordinates.push([row - 1, col - 1]);
			coordinates.push([row - 1, col]);
			coordinates.push([row - 1, col + 1]);
			coordinates.push([row, col - 1]);
			coordinates.push([row, col + 1]);
			coordinates.push([row + 1, col - 1]);
			coordinates.push([row + 1, col]);
			coordinates.push([row + 1, col + 1]);
			return coordinates;
		},
		btn_down: function (btn) {
			var that = this;
			if (btn == "face" && that.face_class == "untouched") {
				that.face_class = "cleared";
			} else if (btn == "flag_btn" && that.flag_btn_class == "untouched" && that.game_on) {
				that.flag_btn_class = "cleared";
			} else if (btn == "gear_btn" && that.gear_class == "untouched") {
				that.gear_class = "cleared";
			}
		},
		btn_up: function (btn) {
			var that = this;
			var mine_row = that.mine_row;
			var mine_col = that.mine_col;
			if (btn == "face" && that.face_class == "cleared") {
				that.face_class = "untouched";
				var mine_matrix = makeMatrix(mine_row, mine_col, that.num_of_mine);
				that.minefield = mine_matrix;
				that.num_of_mine_left = that.num_of_mine;
				that.clear_timeout();
				that.game_on = true;
				that.time_spent = 0;
				that.notWinning = true;
			} else if (btn == "flag_btn" && that.flag_btn_status == "off" && that.game_on) {
				that.flag_btn_status = "on";
			} else if (btn == "flag_btn" && that.flag_btn_status == "on" && that.game_on) {
				that.flag_btn_class = "untouched";
				that.flag_btn_status = "off";
			} else if (btn == "gear_btn" && that.gear_class == "cleared") {
				that.gear_class = "untouched";
				if (that.curr_slide != 0) {
					that.slides_class[that.curr_slide] = "slide-hidden";
					that.slides_class[0] = "slide-visible";
					that.curr_slide = 0;
				}
				that.slide_visible = true;
			}
		},
		test_clearance: function () {
			var that = this;
			var minefield = that.minefield;
			var row_len = minefield.length;
			var col_len = minefield[0].length;
			var blk_remained = 0;
			var coordinates = [];
			for (let i = 0; i < row_len; i++) {
				for (let j = 0; j < col_len; j++) {
					if (!minefield[i][j].exposed) {
						blk_remained++;
						coordinates.push([i, j]);
					}
				}
			}
			if (blk_remained == that.num_of_mine) {
				if (that.game_on) {
					/*扫雷英雄榜*/
					/*
					*由于翻开一大片的时候
					*每翻开一个都会检测一下
					*此时如果已经赢了
					*会产生冗余的成绩
					*所以限制一下
					*/
					that.best_5_score.push(that.time_spent);

					function sortNumber(a, b) {
						return a - b
					}
					that.best_5_score.sort(sortNumber);
					if (that.best_5_score.length == 6) {
						that.best_5_score.pop();
					}
					var liStr = "";
					for (let m = 0; m < 5; m++) {
						if (that.best_5_score[m] === 0 || that.best_5_score[m] > 0) {
							liStr = liStr + "<li>" + that.best_5_score[m] + " 秒</li>";
						} else {
							liStr += "<li>无</li>";
						}
					}
					that.liHTML = liStr;
					/*扫雷英雄榜*/
					console.log("you win")
				}
				that.game_on = false;
				that.notWinning = false;
				for (let k = 0; k < coordinates.length; k++) {
					that.minefield[coordinates[k][0]][coordinates[k][1]].flagged = true;
				}
				that.num_of_mine_left = 0;
				that.clear_timeout();
			}
		},
		timer_func: function () {
			var that = this;
			if (!that.time_start) {
				that.time_start = new Date();
			} else {
				if (that.time_spent == 999 || !that.game_on) {
					return;
				} else {
					that.time_spent++;
				}
			}
			that.timer = setTimeout(that.timer_func, 1000);
		},
		clear_timeout: function () {
			var that = this;
			clearTimeout(that.timer);
			that.game_on = false;
			that.timer = null;
			that.time_start = "";
		},
		touchend_func: function (block, row, col) {
			var that = this;
			if (!that.last_touchend) {
				that.block_touched = [row, col];
				that.last_touchend = new Date();
			} else {
				var time_now = new Date();
				var time_passed = time_now - that.last_touchend;
				if (time_passed < 500 && that.block_touched[0] == row && that.block_touched[1] == col) {
					that.dblclick_expose(block, row, col);
				}
				that.block_touched = [row, col];
				that.last_touchend = time_now;
			}
		},
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
		set_close: function () {
			var that = this;
			that.slide_visible = false;
		},
		get_mine_input: function (mine_input) {
			var that = this;
			if (mine_input === "") {
				return;
			} else if (mine_input < 1) {
				that.mine_input = 1;
			} else if (mine_input > that.mine_max) {
				that.mine_input = that.mine_max;
			} else {
				that.mine_input = mine_input;
			}
		},
		set_mine: function (mine_input) {
			var that = this;
			that.num_of_mine = mine_input;
			var mine_row = that.mine_row;
			var mine_col = that.mine_col;
			var mine_matrix = makeMatrix(mine_row, mine_col, that.num_of_mine);
			that.minefield = mine_matrix;
			that.num_of_mine_left = that.num_of_mine;
			that.clear_timeout();
			that.game_on = true;
			that.time_spent = 0;
			that.set_close();
			that.notWinning = true;
		},
		reset_score: function (){
			var that = this;
			that.liHTML = "<li>无</li><li>无</li><li>无</li><li>无</li><li>无</li>";
			that.best_5_score = [];
		}
	}
})