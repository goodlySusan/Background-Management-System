import request from '@/utils/request'

const api_name = '/admin/acl/user'

/*
登陆
*/
function login({
  username,
  password
}) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

/*
获取用户信息(根据token)
*/
function getInfo() {
  return request({
    url: '/admin/acl/index/info',
    method: 'get'
  })
}

/*
登出
*/
function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}



/* 
获取当前用户的菜单权限列表
*/
function getMenu() {
  return request('/admin/acl/index/menu')
}


/* 
获取后台用户分页列表(带搜索)
*/
function getPageList(page, limit, searchObj) {
  return request({
    url: `${api_name}/${page}/${limit}`,
    method: 'get',
    params: searchObj
  })
}

/* 
根据ID获取某个后台用户
*/
function getById(id) {
  return request({
    url: `${api_name}/get/${id}`,
    method: 'get'
  })
}

/* 
保存一个新的后台用户
*/
function add(user) {
  return request({
    url: `${api_name}/save`,
    method: 'post',
    data: user
  })
}

/* 
更新一个后台用户
*/
function update(user) {
  return request({
    url: `${api_name}/update`,
    method: 'put',
    data: user
  })
}

/* 
获取某个用户的所有角色
*/
function getRoles(userId) {
  return request({
    url: `${api_name}/toAssign/${userId}`,
    method: 'get'
  })
}

/* 
给某个用户分配角色
roleId的结构: 字符串, 'rId1,rId2,rId3'
*/
function assignRoles(userId, roleId) {
  return request({
    url: `${api_name}/doAssign`,
    method: 'post',
    params: {
      userId,
      roleId
    }
  })
}

/* 
删除某个用户
*/
function removeById(id) {
  return request({
    url: `${api_name}/remove/${id}`,
    method: 'delete'
  })
}

/* 
idList的结构: idList是包含n个id的数组
*/
function removeUsers(idList) {
  return request({
    url: `${api_name}/batchRemove`,
    method: 'post',
    data: idList
  })
}

export default{
    login,
    getInfo,
    logout,
    getMenu,
    getPageList,
    getById,
    add,
    update,
    getRoles,
    assignRoles,
    removeById,
    removeUsers
}