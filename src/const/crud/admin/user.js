/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */
import {getDetails} from '@/api/admin/user'


var validateUsername = (rule, value, callback) => {
  let flag = new RegExp(/^([a-z\u4e00-\u9fa5\d]+?)$/).test(value)
  if (!flag) {
    callback(new Error('用户名支持小写英文、数字、中文'))
  }

  getDetails(value).then(response => {
    if (window.boxType === 'edit') callback()
    const result = response.data.data
    if (result !== null) {
      callback(new Error('用户名已经存在'))
    } else {
      callback()
    }
  })
}
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  viewBtn: true,
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  column: [{
    fixed: true,
    label: 'id',
    prop: 'userId',
    span: 24,
    hide: true,
    editDisabled: true,
    addDisplay: false
  }, {
    fixed: true,
    label: '用户名',
    prop: 'username',
    editDisabled: true,
    slot: true,
    search: true,
    span: 24,
    rules: [{
      required: true,
      message: '请输入用户名'
    },
      {
        min: 3,
        max: 20,
        message: '长度在 3 到 20 个字符',
        trigger: 'blur'
      },
      {validator: validateUsername, trigger: 'blur'}
    ]
  }, {
    label: '密码',
    prop: 'password',
    type: 'password',
    hide: true,
    span: 24,
    rules: [{
      min: 6,
      max: 20,
      required: true,
      message: '长度在 6 到 20 个字符',
      trigger: 'blur'
    }]
  }, {
    label: '姓名',
    prop: 'name',
    value: '',
    span: 24,
    rules: [{
      min: 2,
      max: 64,
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    }]
  }, {
    label: '手机号',
    prop: 'phone',
    value: '',
    span: 24,
    rules: [{
      min: 11,
      max: 11,
      required: true,
      message: '长度在 11 个字符',
      trigger: 'blur'
    }]
  }, {
    label: '所属部门',
    prop: 'deptId',
    formslot: true,
    slot: true,
    span: 24,
    hide: true,
    dataType: "number",
    rules: [{
      required: true,
      message: '请选择部门',
      trigger: 'change'
    }]
  },
    {
      label: '岗位',
      prop: 'post',
      width: 168,
      overHidden: true,
      formslot: true,
      slot: true,
      span: 24,
      rules: [{
        required: true,
        message: '请选择岗位',
        trigger: 'blur'
      }]
    }, {
      label: '角色',
      prop: 'role',
      formslot: true,
      slot: true,
      overHidden: true,
      span: 24,
      rules: [{
        required: true,
        message: '请选择角色',
        trigger: 'blur'
      }]
    }, {
      label: '状态',
      prop: 'lockFlag',
      type: 'radio',
      slot: true,
      border: true,
      span: 24,
      rules: [{
        required: true,
        message: '请选择状态',
        trigger: 'blur'
      }],
      dicData: [{
        label: '有效',
        value: '0'
      }, {
        label: '锁定',
        value: '9'
      }]
    },
    {
      hide: true,
      label: '昵称',
      prop: 'nickname',
      value: '',
      span: 24,
      rules: [{
        min: 1,
        max: 64,
        message: '请输入昵称',
        trigger: 'blur'
      }]
    },
    {
      hide: true,
      label: '邮箱',
      prop: 'email',
      value: '',
      span: 24,
      rules: [{
        min: 4,
        max: 128,
        message: '请输入邮箱',
        trigger: 'blur'
      }]
    }, {
      width: 120,
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      editDisabled: true,
      addDisplay: false,
      span: 24
    }]
}
