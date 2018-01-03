/*
     分页组件:
     父组件需要提供的属性和方法
     totalPage:0, //分页总页数 ---分页相关---
     totalNumber:0,  //列表记录总条数 
     curPage:1      //当前页  默认第一页
     //接收分页组件传递过来的curPage
     getCurPage(curPage){
         this.curPage = curPage;
         //再次请求数据...
         //this....
     },
     //初始化totalNumber和totalPage  多接口共用的时候需要在请求数据之前重置totalNumber
     initTotalVarForPagination(totalNum){ 
         if(totalNum == 0){
            return;
         } 
         this.totalNumber = totalNum;
         this.totalPage = Math.ceil(totalNum/15);
     }
*/
var paginationTpl = '<div class="searchPageFy">'+ 
                    '<a href="javascript:;" v-if="curpage>=2" @click="goPage(1)">首页</a>'+
                    '<a href="javascript:;" v-if="curpage>=2" @click="prevPage">上一页</a>'+
                    '<a href="javascript:;" :class="{select:curpage==1}" @click="goPage(1)">1</a>'+
                    '<span v-if="curpage >= 5 && totalpage>7">...</span>'+
                    '<a href="javascript:;" v-if="totalpage>=5" v-for="item in centerPages" :class="{select:curpage==item}"  @click="goPage(item)">{{item}}</a>'+
                    '<span v-if="totalpage>7 && curpage<=totalpage-5">...</span>'+
                    '<a href="javascript:;" v-if="totalpage!=1" :class="{select:curpage==totalpage}" @click="goPage(totalpage)">{{totalpage}}</a>'+
                    '<a href="javascript:;" @click="nextPage" v-if="curpage!=totalpage">下一页</a>'+
                    '<a href="javascript:;" @click="goPage(totalpage)" v-if="curpage < totalpage">尾页</a>'+
                    '<a class="noselect" style="border: 0px; cursor: default;">共{{totalnumber}}条记录</a>'+
                    '<a class="noselect" style="border: 0px; cursor: default;">共{{totalpage}}页</a></div>';
                
//全局注册分页组件
Vue.component("pagination",{
    props:['totalpage','totalnumber','curpage'],  // totalPage 分页总页数 ,由totalNumber总记录条数计算出  resetPage重置页码标识位
    template:paginationTpl,
    data:function(){
        return{
            centerPages:[2,3,4,5]  //居中显示的页码
        }
    },
    methods:{
         //根据当前页码生成居中页码
        _getCenterNums(){
            var originArr = [],newArr = [];
            for(var i=1;i<=this.totalpage;i++){
                originArr.push(i);
            }
            // console.log('originArr',originArr);
            //掐头去尾 生成中间的页码数组
            newArr =  originArr.slice(1,this.totalpage-1);
            // console.log('newArr中间的页码数组',newArr);
            //当前页码数在5之前，不需要出现左侧的...
            if(this.curpage < 5 && this.totalpage > 5){
                // console.log('当前页码数在5之前，不需要出现左侧的...');
                this.centerPages = newArr.splice(0,4);
            //当前页码数在5之后和倒数5之前，此时左右两侧都有...
            }else if(this.curpage >= 5 && this.curpage <= this.totalpage-5){
                // console.log('当前页码数在5之后和倒数5之前，此时左右两侧都有...');
                this.centerPages = newArr.slice(parseInt(this.curpage)-2,parseInt(this.curpage)+3);
                //修剪
                this.centerPages.unshift(this.curpage-1);
                this.centerPages.unshift(this.curpage-2);
                this.centerPages.pop();
                this.centerPages.pop();
            // 当前页码数在倒数5之后，不需要出现右侧第...
            }else if(this.curpage >= this.totalpage -5){
                // console.log("当前页码数在倒数5之后，不需要出现右侧第...");
                this.centerPages = newArr.splice(newArr.indexOf(this.totalpage -4),5);
            }
        },
        //上一页
        prevPage(){
            if(this.curpage <= 1){
                this.curpage = 1;
            }else{
                this.curpage--;
            }
            this._getCenterNums();//重新获取中间的页码
            this.__commitCurPage();
        },
        //下一页
        nextPage(){
            if(this.curpage == this.totalpage){
                 this.curpage = this.totalpage;
            }else{
                this.curpage++;
            }
            this._getCenterNums();//重新获取中间的页码
            this.__commitCurPage();  ////将curPage传值给父组件
        },
        //去指定页码 
        goPage(num){
            this.curpage = num;
            this._getCenterNums();//重新获取中间的页码
            this.__commitCurPage();  //将curPage传值给父组件
        },
        //更改父组件curPage
        __commitCurPage(){
            this.$emit('commit',this.curpage);
        }
    }
});