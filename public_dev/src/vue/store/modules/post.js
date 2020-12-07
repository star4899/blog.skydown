export default {
    namespaced : true,
    state : {
        data : {}
    },
    getters : {
        getPost : (state) => () => {
            return state.data.post ? state.data.post : null;
        },
        getData : state => () => {
            return state.data.post ? state.data : null;
        }
    },
    mutations : {
        setData(state, responseData){
            return state.data = responseData;
        },
        setLogin(state, responseData){
            if(responseData.csrfToken !== undefined){
                this._vm.$set(state.data, "csrfToken", responseData.csrfToken);
            };
            this._vm.$set(state.data, "loginState", responseData.loginState);
        },
        appendReply(state, data){
            const replyArray = state.data.post.find(val => val._id === data._id).reply;
            if(data.reply.parentIdx){
                return replyArray.find(val => val.idx === data.reply.parentIdx).slave.push(data.reply);
            }else{
                return replyArray.push(data.reply);
            };
        },
        modifyReply(state, data){
            const postIndex = state.data.post.findIndex(val => val._id === data._id),
                replyIndex = state.data.post[postIndex].reply.findIndex(val => val.idx === data.reply.parentIdx);
            if(data.reply.slaveIdx){
                const slaveIndex = state.data.post[postIndex].reply[replyIndex].slave.findIndex(val => val.idx === data.reply.slaveIdx);
                return this._vm.$set(state.data.post[postIndex].reply[replyIndex].slave[slaveIndex], "content", data.reply.content);
            }else{
                return this._vm.$set(state.data.post[postIndex].reply[replyIndex], "content", data.reply.content);
            };
        },
        delReply(state, data){
            const postIndex = state.data.post.findIndex(val => val._id === data._id),
                replyIndex = state.data.post[postIndex].reply.findIndex(val => val.idx === data.reply.parentIdx);
            if(data.reply.slaveIdx){
                const slaveIndex = state.data.post[postIndex].reply[replyIndex].slave.findIndex(val => val.idx === data.reply.slaveIdx);
                return this._vm.$set(state.data.post[postIndex].reply[replyIndex].slave[slaveIndex], "view", false);
            }else{
                return this._vm.$set(state.data.post[postIndex].reply[replyIndex], "view", false);
            };

        }
    },
};