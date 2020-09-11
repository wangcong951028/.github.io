angular.module("parts.userGroupMgr.dataPool", []).service("userGroupStore", ["$q", "$window", "mcHttp", "httpMessageTypes", "MC_SCHOOL_ID", "serverUrl",
    function (e, r, t, s, o, n) {
        function i(e) {
            return t.post("GET_USER_AUTH_GROUP", {
                data: e,
                specUrlPrefix: n.httpManager
            })
        }

        function u() {
            return t.post("GET_APP_AUTH_GROUP", {
                data: null,
                specUrlPrefix: n.httpManager
            })
        }

        function a(e) {
            return t.post("USER_GROUP_ADD_GROUP_NODE", {
                data: {
                    menu: r.angular.extend({
                        menuSchoolId: Number(o)
                    }, e)
                }
            })
        }

        function l(e) {
            return t.post("USER_GROUP_RENAME_GROUP_NODE", {
                data: {
                    menu: e
                }
            })
        }

        function c(e) {
            return t.post("USER_GROUP_REMOVE_GROUP_NODE", {
                data: {
                    menu: e
                }
            })
        }

        function d(r) {
            var s = e.defer();
            return t.post("USER_GROUP_GET_GROUP_LIST").then(function (e) {
                function t(e) {
                    return e.isExpanded && e.parent ? (e.parent.isExpanded = !0, t(e.parent)) : void 0
                }
                var o = {},
                    n = [],
                    i = "menuId",
                    u = "menuParentId",
                    a = "menuLevel",
                    l = "list";
                e = e.menuList || [], e.forEach(function (e) {
                    o[e[i]] = e, e.name = e.menuName, e.id = e.menuId, 0 === e[a] && n.push(e)
                }), e.forEach(function (e) {
                    var s;
                    0 !== Number(e[a]) && (r && -1 !== e.name.indexOf(r) && (e.isExpanded = !0), s = o[e[u]], s && (e.parent = s, e.isExpanded && t(e), s[l] = s[l] || [], s[l].push(e)))
                }), r && e.forEach(function (e) {
                    var r;
                    e.isExpanded || 0 === Number(e[a]) || (r = e.parent[l], r.splice(r.indexOf(e), 1))
                }), e.forEach(function (e) {
                    for (; 0 !== Number(e[a]) && (e = e.parent, e && (e.parent || 0 === e[a])););
                }), s.resolve(n)
            }), s.promise
        }

        function p(e) {
            return t.post("GET_USER_LIST", {
                data: e
            })
        }

        function f(e) {
            return t.post("USER_GROUP_GET_USER_LIST", {
                data: e
            })
        }

        function U(e) {
            return e = e || {}, t.post("USER_GROUP_MOVE_USER", {
                data: {
                    userIDList: e.userList,
                    targetMenuIDList: e.target
                }
            })
        }

        function m(e) {
            return t.post("USER_GROUP_ADD_USER", {
                data: e
            })
        }

        function G(e) {
            return t.post("USER_GROUP_EDIT_USER", {
                data: e
            })
        }

        function h(e) {
            return t.post("USER_GROUP_IMPORT_USER", {
                data: e,
                isFormData: !0
            })
        }

        function g(e) {
            return t.post("USER_GROUP_REMOVE_USER", {
                data: e
            })
        }

        function P(e) {
            return t.post("USER_GROUP_PASSWORD_SET", {
                data: e
            })
        }

        function S() {
            return t.post("USER_GROUP_PASSWORD_INIT")
        }
        s.USER_GROUP_GET_GROUP_LIST = "user/listManageMenu.do", s.USER_GROUP_ADD_GROUP_NODE = "user/addManageMenu.do", s.USER_GROUP_RENAME_GROUP_NODE = "user/modifyManageMenu.do", s.USER_GROUP_REMOVE_GROUP_NODE = "user/deleteManageMenu.do", s.USER_GROUP_GET_USER_LIST = "user/listUserByMenuId.do", s.USER_GROUP_MOVE_USER = "user/moveUserManageMenu.do", s.USER_GROUP_ADD_USER = "user/insertUser.do", s.USER_GROUP_EDIT_USER = "user/updateUserInfo.do", s.USER_GROUP_IMPORT_USER = "user/addUserByExcel.do", s.USER_GROUP_REMOVE_USER = "user/del.do", s.USER_GROUP_PASSWORD_SET = "user/password/setting.do", s.USER_GROUP_PASSWORD_INIT = "user/password/init.do", this.addGroup = a, this.renameGroup = l, this.delGroup = c, this.searchGroupList = d, this.queryUser = p, this.queryUserByGroup = f, this.moveUser = U, this.addUser = m, this.editUser = G, this.importUser = h, this.delUser = g, this.modifyPassword = P, this.initPassword = S, this.queryUserAuth = i, this.queryAuthGroupList = u
    }
]), angular.module("parts.userGroupMgr.list", []).controller("UserGroupUserListCtrl", ["$scope", "$window", "$timeout", "userGroupTableHeaders", "PAGINATION_CONFIG", "userGroupStore", "MC_USER_ROLE_TYPE", "userGroupMgrPickedUserServ", "userGroupMgrUserServ", "underscore",
    function (e, r, t, s, o, n, i, u, a, l) {
        function c(e) {
            O.isSearching || (O.isSearching = !0, O.queryInfo && (O.queryInfo.menuId = a.topId), $ = 1 !== O.pager.currentPage, m(e)["finally"](function () {
                O.isSearching = !1
            }))
        }

        function d(e) {
            var t;
            return $ ? void($ = !1) : void(O.isPaging || (O.isPaging = !0, t = r.angular.extend({
                offset: e
            }, O.queryInfo), m(t)["finally"](function () {
                O.isPaging = !1
            })))
        }

        function p() {
            for (var e, r, t = 0; t < O.userList.length; t++) r = {
                userId: O.userList[t].userId
            }, e = n.queryUserAuth(r), e.then(function (e) {
                for (var r = 0; r < O.userList.length; r++)
                    if (O.userList[r].userId == e.userId) {
                        O.userList[r].authGroupList = e.groupList, O.userList[r].roleListStr = "";
                        for (var t = 0; t < e.groupList.length; t++) O.userList[r].roleListStr += e.groupList[t].groupName + " ";
                        break
                    }
            })
        }

        function f() {
            var e;
            e = n.queryAuthGroupList(), e.then(function (e) {
                O.authGroupList = e.groupList
            })
        }

        function U(e) {
            O.queryInfo = {
                menuId: e
            }, O.isSearching = !0, m({
                menuId: e
            }, {
                isForce: !0
            })["finally"](function () {
                O.isSearching = !1
            })
        }

        function m(t, s) {
            var o, i;
            return s = s || {}, O._isPosting && !s.isForce ? O.latestSearchPromise : (O._isPosting = !0, e.$emit("UserGroup.toggleUserDetail", !1), i = r.angular.extend({
                xgh: "",
                realName: "",
                role: "",
                dwmc: "",
                offset: 1
            }, t), o = O.latestSearchPromise = n.queryUserByGroup(i), o.then(function (e) {
                e.userList.forEach(function (e) {
                    var r = u.has(e);
                    e.isPicked = r
                }), E(R(e.userList)), O.userList = e.userList, O.pager.totalPages = e.totalPages, O.pager.totalItems = e.totalPages * O.pager.itemsPerPage, O.pager.currentPage = e.offset
            })["finally"](function () {
                O._isPosting = !1, O.latestSearchPromise = null, p()
            }), o)
        }

        function G() {
            m(r.angular.extend({
                offset: O.pager.currentPage
            }, O.queryInfo), {
                isForce: !0
            })
        }

        function h(e) {
            e.stopPropagation()
        }

        function g(e) {
            O.isOpenMulUser ? P({}, e) : e === L ? (M(), L = null) : (v(e), L = e)
        }

        function P(r, t) {
            r.stopPropagation && r.stopPropagation(), t.isPicked ? (u.add(t), I(), R(O.userList) && E(!0)) : (E(!1), u.remove(t), u.hasLeft() || _()), e.$emit("UserGroup.hub", "UserGroup.pickedUserAction")
        }

        function S(r) {
            O.userList.forEach(function (e) {
                u[r ? "add" : "remove"](e)
            }), r ? I() : _(), e.$emit("UserGroup.hub", "UserGroup.pickedUserAction")
        }

        function v(r) {
            a.latestSelectUser = r, e.$emit("UserGroup.toggleUserDetail", !0, !1), e.$emit("UserGroup.hub", "UserGroup.showUserInfo", r)
        }

        function M() {
            e.$emit("UserGroup.toggleUserDetail", !1)
        }

        function I() {
            e.$emit("UserGroup.toggleMulUsers", !0), M()
        }

        function _() {
            var r = u.getList();
            r && 0 !== r.length || e.$emit("UserGroup.toggleMulUsers", !1)
        }

        function E(e) {
            O.isAllChecked = e
        }

        function R(e) {
            return l.every(e, function (e) {
                return u.has(e)
            })
        }
        var $, L, O = this;
        O.roleList = Object.keys(i).map(function (e) {
            return {
                name: i[e],
                role: e
            }
        }), O.tableHeads = s, O.clickUserItem = g, O.pickUser = P, O.toggleAllUser = S, O.preventClick = h, O.pager = r.angular.extend({
            totalItems: 0,
            totalPages: 0,
            currentPage: 1
        }, o), O.search = c, O.pageChanged = d, O.openMulUsers = I, f(), e.$on("UserGroup.refreshUserListByGroup", function (e, r) {
            U(r.menuId)
        }), e.$on("UserGroup.refreshList", function (e) {
            e.stopPropagation && e.stopPropagation(), G()
        }), e.$on("UserGroup.updatePickedUser", function (e, r, t) {
            var s, o = r.userId;
            s = l.find(O.userList, function (e) {
                return e.userId === o
            }), s && (s.isPicked = t), t || E(!1)
        }), e.$on("UserGroup.cleanPickedUser", function () {
            O.userList.forEach(function (e) {
                e.isPicked = !1
            }), E(!1), O.isShowOpenMulUserBtn = !1
        }), e.$on("UserGroup.pickedUserAction", function (e) {
            O.isShowOpenMulUserBtn = (u.getList() || []).length > 0
        }), e.$on("$destroy", function () {
            a.latestSelectUser = null, a.topId = null, u.clean()
        })
    }
]),
    angular.module("parts.userGroupMgr.main", ["parts.userGroupMgr.tree", "parts.userGroupMgr.list", "parts.userGroupMgr.dataPool", "utils.miscFilter"]).value("userGroupTableHeaders", [{
    name: "学工号",
    fieldName: "userName",
    fieldType: "string"
}, {
    name: "真实姓名",
    fieldName: "realName",
    fieldType: "string"
}, {
    name: "角色",
    fieldName: "roleListStr",
    fieldType: "string",
    quickSelect: "role"
}, {
    name: "性别",
    fieldName: "sex",
    fieldType: "int",
    quickSelect: "sex",
    codeReplace: [{
        codeId: "1",
        codeName: "男"
    }, {
        codeId: "2",
        codeName: "女"
    }]
}, {
    name: "单位名称",
    fieldName: "menuName",
    fieldType: "string",
    quickSelect: "college"
}]).constant("USER_GROUP_MANAGER_PAGER", {
    itemsPerPage: 10,
    maxSize: 8
}).service("userGroupMgrUserServ", ["$uibModal", "commonUtils", "mcUser", "userGroupMgrPickedUserServ", "commonAlert", "userGroupStore",
    function (e, r, t, s, o, n) {
        function i(e, t) {
            var s;
            e.$emit("UserGroup.hub", "UserGroup.holdTreeWatch", !0), s = r.openModal({
                templateUrl: "UserGroup.modalMove",
                controller: "UserGroupMoveUserCtrl",
                resolve: {
                    pickedUserList: function () {
                        return t
                    }
                }
            }), s.result.then(function () {
                e.$emit("UserGroup.hub", "UserGroup.refreshList")
            })["finally"](function () {
                s = null, e.$emit("UserGroup.hub", "UserGroup.holdTreeWatch", !1)
            })
        }

        function u(e, r) {
            var t;
            return a ? void(confirm("请确认 [删除] 已选的用户?") && (t = r ? [r.userId] : s.getList().map(function (e) {
                return e.userId
            }), n.delUser({
                userIds: t
            }).then(function () {
                o.addAlert("删除成功!", "success"), e.$emit("UserGroup.hub", "UserGroup.refreshList"), r || (e.$emit("UserGroup.hub", "UserGroup.cleanPickedUser"), e.$emit("UserGroup.toggleMulUsers", !1))
            }))) : void o.addAlert("对不起，您没有权限删除用户!", "error")
        }
        var a;
        a = t.hasAuth(0, 181), this.openModal = r.openModal, this.openMoveUsersModal = i, this.delUsers = u
    }
]).service("userGroupMgrPickedUserServ", ["underscore",
    function (e) {
        var r = [];
        this.has = function (t) {
            var s = t.userId;
            return !!e.find(r, function (e) {
                return e.userId == s
            })
        }, this.hasLeft = function (e) {
            return 0 !== r.length
        }, this.add = function (e) {
            this.has(e) || (r.push(e), e.isPicked = !0)
        }, this.remove = function (t) {
            var s, o, n = t.userId;
            o = e.find(r, function (e) {
                return e.userId === n
            }), s = r.indexOf(o), -1 !== s && (o.isPicked = t.isPicked = !1, r.splice(s, 1))
        }, this.getList = function () {
            return r
        }, this.clean = function () {
            r.forEach(function (e) {
                e.isPicked = !1
            }), r.length = 0
        }
    }
]).controller("UserGroupMgrCtrl", ["$scope", "commonUtils",
    function (e, r) {
        var t = this;
        e.$on("UserGroup.hub", function (t) {
            var s = r.slice(arguments);
            t.stopPropagation(), s.shift(), e.$broadcast.apply(e, s)
        }), e.$on("UserGroup.toggleUserDetail", function (e, r) {
            e.stopPropagation(), t.isShowUserDetail = r
        }), e.$on("UserGroup.toggleMulUsers", function (e, r) {
            e.stopPropagation(), t.isShowMulUsers = r
        })
    }
]).controller("UserGroupUserInfoCtrl", ["$window", "$scope", "userGroupMgrUserServ", "MC_USER_ROLE_TYPE", "mcUser",
    function (e, r, t, s, o) {
        function n(r) {
            d.userInfo = e.angular.extend({}, r), d.userInfoList = Object.keys(c).map(function (e) {
                return {
                    label: c[e],
                    value: r[e] || "-"
                }
            }), d.userInfo.roleStr = s[d.userInfo.role] || "-"
        }

        function i() {
            var e;
            e = t.openModal({
                templateUrl: "UserGroup.modalAddUser",
                controller: "UserGroupAddUserCtrl",
                size: "lg",
                resolve: {
                    selectUserInfo: function () {
                        return t.latestSelectUser
                    }
                }
            }), e.result.then(function () {
                r.$emit("UserGroup.hub", "UserGroup.refreshList")
            })
        }

        function u() {
            t.openModal({
                templateUrl: "UserGroup.modalPassword",
                controller: "UserGroupPassword",
                size: "md",
                resolve: {
                    userInfo: function () {
                        return t.latestSelectUser
                    }
                }
            })
        }

        function a(e) {
            t.delUsers(r, e)
        }

        function l() {
            t.openMoveUsersModal(r, [t.latestSelectUser])
        }
        var c, d = this;
        c = {
            userId: "用户ID",
            weixinId: "微信号",
            realName: "真实姓名",
            menuName: "部门",
            regMail: "注册邮箱",
            mobile: "手机号",
            weixinId: "微信号"
        }, d.canModifyPassword = o.hasAuth(0, 183), d.openEditUserModal = i, d.delUsers = a, d.openMoveUsersModal = l, d.openPasswordModal = u, n(t.latestSelectUser), r.$on("UserGroup.showUserInfo", function (e, r) {
            n(r)
        })
    }
]).controller("UserGroupPassword", ["$scope", "userInfo", "userGroupStore", "commonAlert",
    function (e, r, t, s) {
        function o() {
            t.initPassword().then(function (e) {
                u.password = e.msg, u.isInit = !0
            })
        }

        function n(o) {
            u.isPosting = !0, t.modifyPassword({
                userId: r.userId,
                pwd: o
            }).then(function () {
                s.addAlert("修改成功!"), e.$close()
            })["finally"](function () {
                u.isPosting = !1
            })
        }

        function i() {
            e.$dismiss()
        }
        var u = this;
        u.userInfo = r, u.initPassword = o, u.submit = n, u.dismissModal = i
    }
]).controller("UserGroupMulUserCtrl", ["$scope", "$uibModal", "userGroupMgrUserServ", "userGroupMgrPickedUserServ", "userGroupStore",
    function (e, r, t, s, o) {
        function n() {
            t.delUsers(e)
        }

        function i() {
            c.userList && c.userList.length > 0 && t.openMoveUsersModal(e, c.userList)
        }

        function u() {
            s.clean(), e.$emit("UserGroup.toggleMulUsers", !1), e.$emit("UserGroup.hub", "UserGroup.cleanPickedUser"), e.$emit("UserGroup.hub", "UserGroup.pickedUserAction")
        }

        function a(r) {
            e.$emit("UserGroup.hub", "UserGroup.updatePickedUser", r, !1), e.$emit("UserGroup.hub", "UserGroup.pickedUserAction"), s.remove(r), 0 === c.userList.length && l()
        }

        function l() {
            e.$emit("UserGroup.toggleMulUsers", !1)
        }
        var c = this;
        c.userList = s.getList(), c.delUsers = n, c.openMoveUsersModal = i, c.cleanPickedUsers = u, c.unPickUser = a, c.close = l
    }
]).controller("UserGroupMoveUserCtrl", ["$scope", "userGroupStore", "pickedUserList", "commonAlert",
    function (e, r, t, s) {
        function o() {
            var o = [];
            if (!a) return void alert("请先选择 节点!");
            if (confirm("请确认 [移动] 已选的用户?") && !l.isPosting) {
                for (l.isPosting = !0; a;) o.push(a.menuId), a = a.parent;
                r.moveUser({
                    userList: t.map(function (e) {
                        return e.userId
                    }),
                    target: o
                }).then(function (r) {
                    s.addAlert("操作成功!", "success"), e.$close()
                }, function () {
                    l.isPosting = !1
                })
            }
        }

        function n() {
            l.isPosting || e.$dismiss()
        }

        function i() {
            l.isFetching = !0, r.searchGroupList().then(function (e) {
                e[0].isExpanded = !0, l.groupList = e
            })["finally"](function () {
                l.isFetching = !1
            })
        }

        function u(e) {
            a = e
        }
        var a, l = this;
        i(), l.moveUser = o, l.dismissModal = n, l.clickTreeItem = u
    }
]), angular.module("parts.userGroupMgr.tree", []).service("userGroupTreeServ", [
    function () {
        function e(e) {}

        function r() {}
        this.saveState = e, this.retrieveState = r
    }
]).controller("UserGroupTreeCtrl", ["$scope", "$window", "userGroupStore", "userGroupMgrUserServ", "underscore",
    function (e, r, t, s, o) {
        function n() {
            var r;
            r = U({
                templateUrl: "UserGroup.modalAddUserMain",
                controller: "UserGroupAddUserMainCtrl",
                size: "sm",
                resolve: {
                    parent$scope: function () {
                        return e
                    }
                }
            }), r.result.then(function () {
                e.$emit("UserGroup.hub", "UserGroup.refreshList")
            })
        }

        function i(r) {
            e.$emit("UserGroup.hub", "UserGroup.refreshUserListByGroup", r)
        }

        function u(e, r) {
            m.isSearching || (m.isSearching = !0, a(e, r)["finally"](function () {
                m.isSearching = !1
            }))
        }

        function a(r, o) {
            return m.isPostingSearch ? f : (m.isPostingSearch = !0, m.stateTips = "数据加载中...", f = t.searchGroupList(r), f.then(function (r) {
                1 === r.length && (r[0].isExpanded = !0, s.topId = r[0].id, o && e.$emit("UserGroup.hub", "UserGroup.refreshUserListByGroup", r[0])), m.groupTreeList = r, r.length && r.length > 0 ? m.stateTips = "" : m.stateTips = " -- 暂没有数据 --"
            }, function () {
                m.stateTips = ""
            })["finally"](function () {
                f = null, m.isPostingSearch = !1
            }), f)
        }

        function l() {
            m.isShowSearchGroup = !1
        }

        function c(e) {
            var r;
            r = U({
                templateUrl: "UserGroup.modalAdd",
                controller: "UserGroupTreeAddNodeCtrl",
                resolve: {
                    treeData: e
                }
            }), r.result.then(function (r) {
                r.id = r.menuId, r.name = r.menuName, r.parent = e, e.list || (e.list = []), e.list.push(r)
            })
        }

        function d(e) {
            var r;
            r = U({
                templateUrl: "UserGroup.modalDel",
                controller: "UserGroupTreeDelNodeCtrl",
                resolve: {
                    treeData: e
                }
            }), r.result.then(function (r) {
                var t;
                e.parent && (t = e.parent.list, o.find(t, function (e, s) {
                    var o = e.id == r;
                    return o && t.splice(s, 1), o
                }))
            }, function () {})
        }

        function p(e) {
            var r;
            r = U({
                templateUrl: "UserGroup.modalRename",
                controller: "UserGroupTreeRenameNodeCtrl",
                resolve: {
                    treeData: e
                }
            }), r.result.then(function (r) {
                e.name = e.menuName = r.menuName
            })
        }
        var f, U, m = this;
        U = s.openModal, a("", !0), m.openAddUserModal = n, m.clickTreeItem = i, m.searchGroup = u, m.closeSearchGroup = l, m.treeMenuList = [{
            label: "添加子节点",
            action: c
        }, {
            label: "重命名",
            action: p
        }, {
            label: "删除",
            action: d
        }, {
            isDivider: !0
        }, {
            label: "ID: ",
            expr: "id"
        }], e.$on("UserGroup.holdTreeWatch", function (e, r) {
            e.stopPropagation && e.stopPropagation(), (m.groupTreeList || []).forEach(function (e) {
                e.isExpanded = !r
            })
        })
    }
]).controller("UserGroupAddUserMainCtrl", ["$scope", "$timeout", "parent$scope", "userGroupMgrUserServ",
    function (e, r, t, s) {
        function o(e) {
            "add" === e ? n() : i()
        }

        function n() {
            var o;
            return o = s.openModal({
                templateUrl: "UserGroup.modalAddUser",
                controller: "UserGroupAddUserCtrl",
                size: "lg",
                resolve: {
                    selectUserInfo: function () {
                        return !1
                    }
                }
            }), t.$emit("UserGroup.holdTreeWatch", !0), o.result.then(function () {
                e.$close()
            })["finally"](function () {
                r(function () {
                    t.$emit("UserGroup.holdTreeWatch", !1)
                }, 60)
            }), o
        }

        function i() {
            var r;
            return r = s.openModal({
                templateUrl: "UserGroup.modalImportUser",
                controller: "UserGroupImportUserCtrl",
                size: "sm"
            }), r.result.then(function () {
                e.$close()
            }), r
        }

        function u() {
            a.isPosting || e.$dismiss()
        }
        var a = this;
        a.addTypeBtn = [{
            name: "添加用户",
            type: "add"
        }, {
            name: "导入用户",
            type: "import"
        }], a.choose = o, a.dismissModal = u
    }
]).controller("UserGroupAddUserCtrl", ["$window", "$scope", "mcUser", "MC_USER_ROLE_TYPE", "userGroupMgrUserServ", "userGroupStore", "commonUtils", "commonAlert", "underscore", "selectUserInfo",
    function (e, r, t, s, o, n, i, u, a, l) {
        function c() {
            g.isEdit = h, g.roleList = Object.keys(s).map(function (e) {
                return {
                    name: s[e],
                    role: e
                }
            }), t.isAdmin() || 4 != l.role || (g.roleList = g.roleList.filter(function (e) {
                return 4 != e.role
            })), g.userInfo = h ? l : {
                userName: "",
                realName: "",
                sex: 1,
                pid: "",
                menuIdList: [],
                role: "",
                regMail: "",
                mobile: "",
                weixinId: "",
                wxflag: 2
            }, h && (g.userInfo.role = g.userInfo.role.toString())
        }

        function d(e, t) {
            !g.isPosting && p(e) && (g.isPosting = !0, t.mobile == l.mobile && (t = a.omit(t, "mobile")), t = a.pick(t, "userId", "userName", "realName", "sex", "pid", "menuIdList", "menuid", "role", "regMail", "mobile", "weixinId", "wxflag"), n[h ? "editUser" : "addUser"]({
                userInfo: t
            }).then(function () {
                u.addAlert((h ? "修改" : "添加") + "用户成功!", "success"), r.$close()
            }, function () {
                g.isPosting = !1
            }))
        }

        function p(e) {
            var r, t;
            return r = e.$valid, r || (t = i.getErrors({
                errors: e.$error,
                formLabel: {
                    userName: "学号",
                    realName: "真实姓名",
                    pid: "身份证",
                    menuIdList: "所属组织架构",
                    menuid: "单位名称",
                    role: "角色"
                },
                errorLabel: {
                    idcard: "格式错误"
                }
            }), u.addAlert(t[0], "error")), r
        }

        function f(t) {
            var s;
            r.$emit("UserGroup.hub", "UserGroup.holdTreeWatch", !0), s = o.openModal({
                templateUrl: "UserGroup.modalAddUserSelectGroup",
                controller: "UserGroupAddUserSelectGroupCtrl",
                resolve: {
                    isSelectMenu: function () {
                        return t
                    }
                }
            }), s.result.then(function (r) {
                g.userInfo = t ? e.angular.extend(g.userInfo, {
                    menuid: r.menuId,
                    menuName: r.menuName
                }) : e.angular.extend(g.userInfo, {
                    menuIdList: U(r),
                    nodeName: r.menuName
                })
            })["finally"](function () {
                r.$emit("UserGroup.hub", "UserGroup.holdTreeWatch", !1)
            })
        }

        function U(e) {
            var r = [];
            return r.push(e.menuId), r = m(r, e)
        }

        function m(e, r) {
            return r.parent ? (e.push(r.parent.menuId), m(e, r.parent), e) : e
        }

        function G() {
            g.isPosting || r.$dismiss()
        }
        var h, g = this;
        h = !!l, c(), g.sexType = [{
            val: 1,
            str: "男"
        }, {
            val: 2,
            str: "女"
        }], g.weChatSyncType = [{
            val: 1,
            str: "是"
        }, {
            val: 2,
            str: "否"
        }], g.submitForm = d, g.dismissModal = G, g.openGroupTreeModal = f
    }
]).controller("UserGroupImportUserCtrl", ["$scope", "$rootScope", "userGroupStore", "commonAlert",
    function (e, r, t, s) {
        function o() {
            i.isPosting || e.$dismiss()
        }
        var n, i = this;
        i.weChatSyncType = [{
            val: 1,
            str: "是"
        }, {
            val: 2,
            str: "否"
        }], i.wxFlag = 2, i.dismissModal = o, e.$on("$destroy", function () {
            n = null
        }), n = r.$on("UserGroup.imoprtUser", function (r, o) {
            i.isPosting || (i.isPosting = !0, t.importUser({
                file: o.file,
                wxflag: i.wxFlag.toString()
            }).then(function () {
                s.addAlert("导入用户成功!", "success"), e.$close()
            }, function () {
                i.isPosting = !1
            }))
        })
    }
]).controller("UserGroupTreeAddNodeCtrl", ["$scope", "treeData", "userGroupStore", "commonUtils",
    function (e, r, t, s) {
        function o(s, o) {
            n(s) && (u.isPosting || (u.isPosting = !0, t.addGroup({
                menuName: o,
                menuParentId: r.menuId,
                menuLevel: r.menuLevel
            }).then(function (r) {
                e.$close(r.menu)
            })["finally"](function () {
                u.isPosting = !1
            })))
        }

        function n(e) {
            var r, t;
            return r = e.$valid, r || (t = s.getErrors({
                errors: e.$error,
                formLabel: {
                    title: "节点名称"
                }
            }), alert(t[0])), r
        }

        function i() {
            u.isPosting || e.$dismiss()
        }
        var u = this;
        u.treeData = r, u.addNode = o, u.dismissModal = i
    }
]).controller("UserGroupTreeDelNodeCtrl", ["$scope", "treeData", "userGroupStore",
    function (e, r, t) {
        function s() {
            n.isPosting || (n.isPosting = !0, t.delGroup({
                menuId: r.menuId
            }).then(function (t) {
                e.$close(r.menuId)
            }, function () {
                n.isPosting = !1
            }))
        }

        function o() {
            n.isPosting || e.$dismiss()
        }
        var n = this;
        n.treeData = r, n.delNode = s, n.dismissModal = o
    }
]).controller("UserGroupTreeRenameNodeCtrl", ["$scope", "treeData", "userGroupStore", "commonUtils",
    function (e, r, t, s) {
        function o(s, o) {
            n(s) && (u.isPosting || (u.isPosting = !0, t.renameGroup({
                menuName: o,
                menuId: r.menuId
            }).then(function (r) {
                e.$close(r.menu)
            }, function () {
                u.isPosting = !1
            })))
        }

        function n(e) {
            var r, t;
            return r = e.$valid, r || (t = s.getErrors({
                errors: e.$error,
                formLabel: {
                    title: "节点名称"
                }
            }), alert(t[0])), r
        }

        function i() {
            u.isPosting || e.$dismiss()
        }
        var u = this;
        u.treeData = r, u.renameNode = o, u.dismissModal = i
    }
]).controller("UserGroupAddUserSelectGroupCtrl", ["$scope", "userGroupStore", "isSelectMenu",
    function (e, r, t) {
        function s(e) {
            u = e
        }

        function o() {
            return u ? void e.$close(u) : void alert("请先选择 节点!")
        }

        function n() {
            a.isFetching = !0, r.searchGroupList().then(function (e) {
                e[0].isExpanded = !0, a.groupList = e
            })["finally"](function () {
                a.isFetching = !1
            })
        }

        function i() {
            e.$dismiss()
        }
        var u, a = this;
        a.isSelectMenu = t, n(), a.clickTreeItem = s, a.confirmModal = o, a.dismissModal = i
    }
]);