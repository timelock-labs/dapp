# 获取用户的邮件通知配置列表

/api/v1/email-notifications

#### Parameters

page: integer

page_size: integer

#### Responses

```json
{
"data": {
"items": [
      {
"created_at": "string",
"email": "string",
"email_remark": "string",
"id": 0,
"is_active": true,
"is_verified": true,
"timelock_contracts": [
"string"
        ],
"updated_at": "string"
      }
    ],
"page": 0,
"page_size": 0,
"total": 0,
"total_pages": 0
  },
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 为用户添加邮件通知配置

/api/v1/email-notifications

#### Parameters

```json
{
"email": "string",
"email_remark": "string",
"timelock_contracts": [
"string"
  ]
}
```

#### Responses

```json
{
"data": {
"created_at": "string",
"email": "string",
"email_remark": "string",
"id": 0,
"is_active": true,
"is_verified": true,
"timelock_contracts": [
"string"
    ],
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

# 处理应急邮件的回复确认

/api/v1/email-notifications    post

#### Parameters

token: string

#### Responses

```json
{
"data": {
"message": "string",
"replied_at": "string",
"success": true
  },
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 获取用户相关的邮件发送记录

/api/v1/email-notifications/logs

#### Parameters

page: integer

page_size: integer

#### Responses

```json
{
"data": [
    {
"created_at": "string",
"email": "string",
"event_type": "string",
"id": 0,
"is_emergency": true,
"is_replied": true,
"replied_at": "string",
"send_status": "string",
"sent_at": "string",
"subject": "string",
"timelock_address": "string",
"transaction_hash": "string"
    }
  ],
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 重新发送邮箱验证码

/api/v1/email-notifications/resend-code post

#### Parameters

```json
{
"email": "string"
}
```

#### Responses

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

# 获取用户的已验证邮箱列表

/api/v1/email-notifications/verified-emails

#### Responses

```json
{
"data": [
    {
"created_at": "string",
"email": "string",
"email_remark": "string",
"id": 0,
"is_active": true,
"is_verified": true,
"timelock_contracts": [
"string"
      ],
"updated_at": "string"
    }
  ],
"error": {
"code": "string",
"details": "string",
"message": "string"
  },
"success": true
}
```

# 使用验证码验证邮箱地址

/api/v1/email-notifications/verify   post

#### Parameters

```json
{
"email": "string",
"verification_code": "string"
}
```

#### Responses

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

# 根据邮箱地址获取特定的邮件通知配置详情

/api/v1/email-notifications/{email}

#### Parameters

- email: string

#### Responses

```json
{
"data": {
"created_at": "string",
"email": "string",
"email_remark": "string",
"id": 0,
"is_active": true,
"is_verified": true,
"timelock_contracts": [
"string"
    ],
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

# 更新邮件通知配置

/api/v1/email-notifications/{email}    put

#### Parameters

- email: string

```json
{
"email_remark": "string",
"timelock_contracts": [
"string"
  ]
}
```

#### Responses

```json
{
"data": {
"created_at": "string",
"email": "string",
"email_remark": "string",
"id": 0,
"is_active": true,
"is_verified": true,
"timelock_contracts": [
"string"
    ],
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

# 邮件通知配置 删除 

/api/v1/email-notifications/{email}    delete

#### Parameters

- email: string

#### Responses

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
