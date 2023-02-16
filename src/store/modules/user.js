//引入登录/退出登录/获取用户信息的接口函数
import {
	login,
	logout,
	getInfo
} from '@/api/user'
//获取token/设置token/删除token的函数
import {
	getToken,
	setToken,
	removeToken
} from '@/utils/auth'
//路由模块
import {
	resetRouter,
	asyncRoutes,
	constantRoutes,
	anyRoutes
} from '@/router'
import router from "@/router/index";

const getDefaultState = () => {
	return {
		token: getToken(),
		name: "", //用户名
		avatar: "", //用户头像
		roles: [], //用户角色
		routes: [], //用户具有的路由权限
		buttons: [], //用户按钮权限
		contrastRoutes: [], //筛选过后用户能访问的异步路由
		finallyRoutes: [], //合并后用户能访问的所有路由
	}
}

const state = getDefaultState()

const mutations = {
	RESET_STATE: (state) => {
		Object.assign(state, getDefaultState())
	},
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_NAME: (state, name) => {
		state.name = name
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	},
	SET_ROLES: (state, roles) => {
		state.roles = roles;
	},
	SET_ROUTES: (state, routes) => {
		state.routes = routes;
	},
	SET_BUTTONS: (state, buttons) => {
		state.buttons = buttons;
	},
	SET_CONTRASTROUTES: (state, contrastRoutes) => {
		state.contrastRoutes = contrastRoutes;
	},
	SET_FINALLYROUTES: (state) => {
		// 合并所有用户能够访问的路由
		state.finallyRoutes = constantRoutes.concat(
			state.contrastRoutes,
			anyRoutes
		);
		// 给路由添加新的路由
		router.addRoutes(state.finallyRoutes);
	},
}
// 对比路由中的异步路由和该登录用户的权限，将该用户的权限从异步路由中筛选出来
const contrastRoutes = (asyncRoutes, routes) => {
	return asyncRoutes.filter((item) => {
		if (routes.indexOf(item.name) != -1) {
			if (item.children && item.children.length) {
				item.children = contrastRoutes(item.children, routes);
			}
			return true;
		}
	});
};

const actions = {
	// user login
	login({
		commit
	}, userInfo) {
		const {
			username,
			password
		} = userInfo;
		return new Promise((resolve, reject) => {
			login({
					username: username.trim(),
					password: password,
				})
				.then((response) => {
					const {
						data
					} = response;
					commit("SET_TOKEN", data.token);
					setToken(data.token);
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	// get user info
	getInfo({
		commit,
		state
	}) {
		return new Promise((resolve, reject) => {
			getInfo(state.token)
				.then((response) => {
					const {
						data
					} = response;
					if (!data) {
						return reject("Verification failed, please Login again.");
					}
					const {
						name,
						avatar,
						roles,
						routes,
						buttons
					} = data;

					commit("SET_NAME", name);
					commit("SET_AVATAR", avatar);
					commit("SET_ROLES", roles);
					commit("SET_ROUTES", routes);
					commit("SET_BUTTONS", buttons);
					// 筛选用户权限与异步路由
					commit("SET_CONTRASTROUTES", contrastRoutes(asyncRoutes, routes));
					// 合并用户的所有路由权限
					commit("SET_FINALLYROUTES");
					resolve(data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	// user logout
	logout({
		commit,
		state
	}) {
		return new Promise((resolve, reject) => {
			logout(state.token)
				.then(() => {
					removeToken(); // must remove  token  first
					resetRouter();
					commit("RESET_STATE");
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	// remove token
	resetToken({
		commit
	}) {
		return new Promise((resolve) => {
			removeToken(); // must remove  token  first
			commit("RESET_STATE");
			resolve();
		});
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
