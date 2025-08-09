// 没有的话显示12，有的话显示5

// 倒入是6， 创建是7 ，

// 交易是4。点发起交易跳转到8

# 接受Compound timelock合约的admin

接受成为Compound标准timelock合约的admin，需要前端调用钱包实现，通过该timelock合约执行acceptAdmin函数。只有当前的pending admin才能执行此操作。这是Compound timelock权限转移流程的第二步。

/api/v1/timelock/compound/{id}/accept-admin   post

#### Parameters

id： integer      Compound timelock合约的数据库ID

#### Responses

```json
{
"data": {},
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 检查当前用户对指定Compound timelock合约的管理权限

检查当前用户对指定Compound timelock合约的管理权限，返回用户是否可以设置pending admin和是否可以接受admin权限。

/api/v1/timelock/compound/{id}/admin-permissions

#### Parameters

id： integer      Compound timelock合约的数据库ID

#### Responses

```json
{
"data": {
"can_accept_admin": true,
"can_set_pending_admin": true
  },
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 为Compound标准的timelock合约设置pending admin

为Compound标准的timelock合约设置pending admin，需要前端调用钱包实现，通过该timelock合约执行setPendingAdmin函数。只有当前admin才能执行此操作。这是Compound timelock权限转移流程的第一步。

/api/v1/timelock/compound/{id}/set-pending-admin   post

#### Parameters

id： integer      Compound timelock合约的数据库ID

```json
{
"id": 0,
"new_pending_admin": "string"
}
```

#### Responses

```json
{
"data": {},
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 创建新的timelock合约记录

创建新的timelock合约记录。支持Compound和OpenZeppelin两种标准。前端需要提供合约的详细信息，包括链ID、合约地址、标准类型、创建交易哈希以及相关的治理参数。(Compound标准需要提供admin, pendingAdmin需要为空; OpenZeppelin标准需要提供proposers, executors, cancellers, admin需要为全0地址, proposers就是cancellers)

/api/v1/timelock/create-or-import   post

#### Parameters

```json
{
"admin": "string",
"cancellers": [
"string"
  ],
"chain_id": 0,
"chain_name": "string",
"contract_address": "string",
"executors": [
"string"
  ],
"min_delay": 0,
"proposers": [
"string"
  ],
"remark": "string",
"standard": "compound",
"tx_hash": "string"
}
```

#### Responses

```json
{
"data": {},
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 获取指定timelock合约的完整详细信息

获取指定timelock合约的完整详细信息，包括合约的基本信息、治理参数以及用户权限信息。只有具有相应权限的用户才能查看详细信息

/api/v1/timelock/detail/{standard}/{id}

#### Parameters

- standard： compound / openzeppelin
- id： integer      Compound timelock合约的数据库ID

#### Responses

```json
{
"data": {
"compound_data": {
"admin": "string",
"can_accept_admin": true,
"can_set_pending_admin": true,
"chain_id": 0,
"chain_name": "string",
"contract_address": "string",
"created_at": "string",
"creator_address": "string",
"emergency_mode": true,
"id": 0,
"is_imported": true,
"min_delay": 0,
"pending_admin": "string",
"remark": "string",
"status": "active",
"tx_hash": "string",
"updated_at": "string",
"user_permissions": [
"string"
      ]
    },
"openzeppelin_data": {
"cancellers": "string",
"cancellers_list": [
"string"
      ],
"chain_id": 0,
"chain_name": "string",
"contract_address": "string",
"created_at": "string",
"creator_address": "string",
"emergency_mode": true,
"executors": "string",
"executors_list": [
"string"
      ],
"id": 0,
"is_imported": true,
"min_delay": 0,
"proposers": "string",
"proposers_list": [
"string"
      ],
"remark": "string",
"status": "active",
"tx_hash": "string",
"updated_at": "string",
"user_permissions": [
"string"
      ]
    },
"standard": "compound"
  },
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 导入已在区块链上部署的timelock合约

导入已在区块链上部署的timelock合约。前端需要从区块链读取合约的创建参数(Compound标准需要提供admin, pendingAdmin有则传入, 没有则传空; OpenZeppelin标准需要提供proposers, executors, cancellers, admin需要为全0地址, proposers就是cancellers)并提供给后端，或者用户自己提供，用于精细化权限管理。

/api/v1/timelock/import  post

#### Parameters

```json
{
"admin": "string",
"cancellers": [
"string"
  ],
"chain_id": 0,
"chain_name": "string",
"contract_address": "string",
"executors": [
"string"
  ],
"min_delay": 0,
"pending_admin": "string",
"proposers": [
"string"
  ],
"remark": "string",
"standard": "compound"
}
```

#### Responses

```json
{
"data": {},
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 获取当前用户在所有链上有权限访问的timelock合约列表

获取当前用户在所有链上有权限访问的timelock合约列表。支持按合约标准和状态进行筛选。返回的列表根据用户权限进行精细控制，只显示用户作为创建者、管理员、提议者、执行者或取消者的合约。前端自行实现分页功能。

/api/v1/timelock/list

#### Parameters

- standard： compound / openzeppelin
- status: active / inactive

#### Responses

```json
{
"data": {
"compound_timelocks": [
      {
"admin": "string",
"can_accept_admin": true,
"can_set_pending_admin": true,
"chain_id": 0,
"chain_name": "string",
"contract_address": "string",
"created_at": "string",
"creator_address": "string",
"emergency_mode": true,
"id": 0,
"is_imported": true,
"min_delay": 0,
"pending_admin": "string",
"remark": "string",
"status": "active",
"tx_hash": "string",
"updated_at": "string",
"user_permissions": [
"string"
        ]
      }
    ],
"openzeppelin_timelocks": [
      {
"cancellers": "string",
"cancellers_list": [
"string"
        ],
"chain_id": 0,
"chain_name": "string",
"contract_address": "string",
"created_at": "string",
"creator_address": "string",
"emergency_mode": true,
"executors": "string",
"executors_list": [
"string"
        ],
"id": 0,
"is_imported": true,
"min_delay": 0,
"proposers": "string",
"proposers_list": [
"string"
        ],
"remark": "string",
"status": "active",
"tx_hash": "string",
"updated_at": "string",
"user_permissions": [
"string"
        ]
      }
    ],
"total": 0
  },
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 更新指定timelock合约的备注信息

更新指定timelock合约的备注信息。只有合约的创建者/导入者才能更新备注。备注信息用于帮助用户管理和识别不同的timelock合约。

/api/v1/timelock/{standard}/{id}  put

#### Parameters

- standard： compound / openzeppelin
- id: integer

```json
{
"id": 0,
"remark": "string",
"standard": "compound"
}
```

#### Responses

```json
{
"data": {},
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 删除指定的timelock合约记录

软删除指定的timelock合约记录。只有合约的创建者/导入者才能删除合约记录。删除操作是软删除，数据仍保留在数据库中但标记为已删除状态。

/api/v1/timelock/{standard}/{id}  delete

#### Parameters

- standard： compound / openzeppelin
- id: integer



#### Responses

```json
{
"data": {},
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```
