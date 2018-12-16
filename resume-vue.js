window.onload = function(){
    var vm = new Vue({
        el:'#app',
        data: {
            msg:'Hello World!',
            my_resume: {}
        },
        created: function() {
            var that = this;
            that.get("https://www.houzhenni.com/myapp/my_resume.json");
        },
        methods: {
            get: function(url) {
                //发送get请求
                this.$http.get(url).then(function(res) {
                    console.log(res.body)
                },
                function() {
                    console.log('请求失败处理');
                });
            }
        }
    });
}