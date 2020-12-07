import error from "@/views/error.vue";
import list from "@/views/list.vue";
import view from "@/views/view.vue";
import writeModify from "@/views/write.vue";
import login from "@/views/login.vue";

export default [
    {
        name : "list",
        path : "/",
        component : list
    },
    {
        name : "login",
        path : "/login",
        component : login
    },
    {
        name : "write",
        path : "/:category(write)",
        component : writeModify,
        meta : {
            requiresAuth : true
        }
    },
    {
        name : "modify",
        path : "/:category(modify)/:idx([\\d]+)",
        component : writeModify,
        meta : {
            requiresAuth : true
        }
    },
    {
        name : "search",
        path : "/:category(search)/:keyword(.+)",
        component : list
    },
    {
        name : "listCategory",
        path : "/:category([a-zA-Z\-]+)/:subCategory([a-zA-Z\-]+)?",
        component : list
    },
    {
        name : "view",
        path : "/:category([a-zA-Z\-]+)/:subCategory([a-zA-Z\-]+)?/:idx([\\d]+)",
        component : view
    },
    {
        name : "error",
        path : "*",
        component : error
    }
];