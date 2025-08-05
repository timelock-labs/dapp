用户创建新的智能合约ABI

/api/v1/abi post

#### Parameters

创建ABI请求体

```json
{
  "abi_content": "string",
  "description": "string",
  "name": "string"
}
```

#### Responses

| ``ABI创建成功 |
| ------------- |

```json
{
  "data": {
    "abi_content": "string",
    "created_at": "string",
    "description": "string",
    "id": 0,
    "is_shared": true,
    "name": "string",
    "owner": "string",
    "updated_at": "string"
  },
  "error": {
    "code": "string",
    "details": "string",
    "message": "string"
  },
  "success": true
}
```

获取用户可访问的ABI列表

/api/v1/abi/list get

#### Responses

```json
{
  "data": {
    "shared_abis": [
      {
        "abi_content": "string",
        "created_at": "string",
        "description": "string",
        "id": 0,
        "is_shared": true,
        "name": "string",
        "owner": "string",
        "updated_at": "string"
      }
    ],
    "user_abis": [
      {
        "abi_content": "string",
        "created_at": "string",
        "description": "string",
        "id": 0,
        "is_shared": true,
        "name": "string",
        "owner": "string",
        "updated_at": "string"
      }
    ]
  },
  "error": {
    "code": "string",
    "details": "string",
    "message": "string"
  },
  "success": true
}
```

验证智能合约ABI的格式正确性

/api/v1/abi/validate

#### Parameters

```json
{
  "abi_content": "string"
}
```

#### Responses

```json
{
  "data": {
    "error_message": "string",
    "event_count": 0,
    "function_count": 0,
    "is_valid": true,
    "warnings": ["string"]
  },
  "error": {
    "code": "string",
    "details": "string",
    "message": "string"
  },
  "success": true
}
```

根据ABI ID获取详细信息

/api/v1/abi/{id} get

#### Responses

```json
{
  "data": {
    "abi_content": "string",
    "created_at": "string",
    "description": "string",
    "id": 0,
    "is_shared": true,
    "name": "string",
    "owner": "string",
    "updated_at": "string"
  },
  "error": {
    "code": "string",
    "details": "string",
    "message": "string"
  },
  "success": true
}
```

更新用户创建的ABI

/api/v1/abi/{id} put

request

```json
{
  "abi_content": "string",
  "description": "string",
  "name": "string"
}
```

#### Responses

```json
{
  "data": {
    "abi_content": "string",
    "created_at": "string",
    "description": "string",
    "id": 0,
    "is_shared": true,
    "name": "string",
    "owner": "string",
    "updated_at": "string"
  },
  "error": {
    "code": "string",
    "details": "string",
    "message": "string"
  },
  "success": true
}
```

删除用户创建的ABI

/api/v1/abi/{id} delete

Responses

```json
{
  "data": "string",
  "error": {
    "code": "string",
    "details": "string",
    "message": "string"
  },
  "success": true
}
```
